import json
import os
import ssl
import tempfile
import time
import urllib.error
import urllib.request
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[1]
INPUT_PATH = ROOT / "public" / "data" / "country-travel-db.json"
OUTPUT_PATH = ROOT / "public" / "data" / "country-travel-db-full.json"
USER_AGENT = "Mozilla/5.0 (compatible; TravelDBMerge/1.0)"
SSL_CONTEXT = ssl.create_default_context()
SSL_CONTEXT.check_hostname = False
SSL_CONTEXT.verify_mode = ssl.CERT_NONE


def fetch_json(url: str, timeout: int = 20, retries: int = 3) -> Any:
    request = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    for attempt in range(retries):
        try:
            with urllib.request.urlopen(request, context=SSL_CONTEXT, timeout=timeout) as response:
                return json.loads(response.read().decode("utf-8"))
        except urllib.error.HTTPError as error:
            if error.code == 429 and attempt < retries - 1:
                time.sleep(1.5 * (attempt + 1))
                continue
            raise
        except Exception:
            if attempt < retries - 1:
                time.sleep(0.75 * (attempt + 1))
                continue
            raise


def build_calling_codes(idd: dict[str, Any]) -> list[str]:
    root = (idd or {}).get("root")
    suffixes = (idd or {}).get("suffixes") or []
    if not root:
        return []
    return [f"{root}{suffix}" for suffix in suffixes] or [root]


def main() -> None:
    if not INPUT_PATH.exists():
        raise RuntimeError(f"Missing input database: {INPUT_PATH}")

    records = json.loads(INPUT_PATH.read_text(encoding="utf-8"))
    restcountries = fetch_json(
        "https://restcountries.com/v3.1/all?fields=cca3,timezones,car,idd"
    )

    lookup = {
        item["cca3"]: item
        for item in restcountries
        if isinstance(item, dict) and item.get("cca3")
    }

    for record in records.values():
        supplement = lookup.get(record.get("iso3", ""), {})
        if not record.get("timezones"):
            record["timezones"] = supplement.get("timezones") or []
        if not record.get("drivingSide"):
            record["drivingSide"] = supplement.get("car", {}).get("side", "")
        if not record.get("callingCodes"):
            record["callingCodes"] = build_calling_codes(supplement.get("idd") or {})

    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    payload = json.dumps(records, indent=2, ensure_ascii=False)
    with tempfile.NamedTemporaryFile("w", encoding="utf-8", delete=False, dir=OUTPUT_PATH.parent) as tmp:
        tmp.write(payload)
        tmp_path = tmp.name
    os.replace(tmp_path, OUTPUT_PATH)
    print(f"Saved enriched database to {OUTPUT_PATH}")


if __name__ == "__main__":
    main()
