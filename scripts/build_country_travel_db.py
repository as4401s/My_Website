import json
import os
import re
import ssl
import tempfile
import time
import urllib.parse
import urllib.error
import urllib.request
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[1]
SEED_PATH = ROOT / "src" / "data" / "countriesData.json"
OUTPUT_PATH = ROOT / "public" / "data" / "country-travel-db.json"

USER_AGENT = "Mozilla/5.0 (compatible; TravelDBBuilder/1.0)"
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


def fetch_mledoze_countries() -> list[dict[str, Any]]:
    url = "https://raw.githubusercontent.com/mledoze/countries/master/countries.json"
    data = fetch_json(url, timeout=30)
    if not isinstance(data, list):
        raise RuntimeError("Unexpected country feed payload")
    return data


def fetch_restcountries_lookup() -> dict[str, dict[str, Any]]:
    url = (
        "https://restcountries.com/v3.1/all"
        "?fields=cca3,timezones,car,capitalInfo,capital,idd"
    )
    data = fetch_json(url, timeout=30)
    if not isinstance(data, list):
        raise RuntimeError("Unexpected restcountries payload")
    return {
        item["cca3"]: item
        for item in data
        if isinstance(item, dict) and item.get("cca3")
    }


def load_seed_data() -> dict[str, dict[str, Any]]:
    if not SEED_PATH.exists():
        return {}
    return json.loads(SEED_PATH.read_text(encoding="utf-8"))


def unique_strings(values: list[str]) -> list[str]:
    seen: set[str] = set()
    result: list[str] = []
    for value in values:
        normalized = value.strip()
        if not normalized or normalized in seen:
            continue
        seen.add(normalized)
        result.append(normalized)
    return result


def join_sentence(values: list[str], empty: str = "Not available") -> str:
    clean = [value for value in values if value]
    return ", ".join(clean) if clean else empty


def build_currency_labels(currencies: dict[str, Any]) -> list[str]:
    labels: list[str] = []
    for code, payload in (currencies or {}).items():
        if not isinstance(payload, dict):
            labels.append(code)
            continue
        name = payload.get("name") or code
        symbol = payload.get("symbol")
        labels.append(f"{name} ({symbol})" if symbol else name)
    return labels


def build_calling_codes(idd: dict[str, Any]) -> list[str]:
    root = (idd or {}).get("root")
    suffixes = (idd or {}).get("suffixes") or []
    if not root:
        return []
    return [f"{root}{suffix}" for suffix in suffixes] or [root]


def summarize_population(value: Any) -> str:
    if not isinstance(value, (int, float)):
        return "Population data is not available."
    return f"Population is about {int(value):,}."


def derive_best_time_to_visit(lat: float | None, region: str, subregion: str) -> str:
    if lat is None:
        return f"Seasonality varies across {subregion or region}; check local weather patterns before booking."

    latitude = abs(lat)
    location_label = subregion or region
    if latitude < 15:
        return f"{location_label} is warm most of the year, so dry-season timing usually makes logistics easier."
    if latitude < 30:
        if lat >= 0:
            return "Spring and autumn usually give the best balance of weather, crowds, and outdoor sightseeing."
        return "September to November and March to May are usually the easiest shoulder seasons for general travel."
    if lat >= 0:
        return "Late spring through early autumn is usually the most flexible window for city trips and outdoor travel."
    return "October through April is usually the easiest window for milder weather and broader sightseeing."


def derive_transport_tip(area_km2: float | None, border_count: int, island_like: bool, landlocked: bool) -> str:
    if island_like:
        return "Domestic flights and ferries matter more than land borders, so build inter-island connections into the itinerary."
    if area_km2 and area_km2 > 1_000_000:
        return "Distances are large, so domestic flights or long-distance rail and coach links save time between regions."
    if border_count >= 5 and not landlocked:
        return "This country works well in a wider overland itinerary, though major cities can still be far apart."
    if border_count >= 3:
        return "Regional buses, rail, and short overland hops are practical if you are combining neighboring countries."
    return "Most trips center on the capital and a few regional hubs, so point-to-point road, rail, or coach planning works best."


def clean_extract(text: str) -> str:
    return re.sub(r"\s+", " ", (text or "")).strip()


def search_mediawiki_title(host: str, query: str) -> str | None:
    try:
        url = (
            f"https://{host}/w/api.php?action=query&list=search&format=json&srlimit=1&srsearch="
            f"{urllib.parse.quote(query)}"
        )
        data = fetch_json(url)
        hits = data.get("query", {}).get("search", [])
        if not hits:
            return None
        return hits[0].get("title")
    except Exception:
        return None


def fetch_wikipedia_summary(candidates: list[str], search_query: str) -> dict[str, str]:
    for candidate in unique_strings(candidates):
        try:
            encoded = urllib.parse.quote(candidate, safe="")
            url = f"https://en.wikipedia.org/api/rest_v1/page/summary/{encoded}"
            data = fetch_json(url)
            extract = clean_extract(data.get("extract", ""))
            if extract:
                thumbnail = ""
                if isinstance(data.get("originalimage"), dict):
                    thumbnail = data["originalimage"].get("source", "")
                elif isinstance(data.get("thumbnail"), dict):
                    thumbnail = data["thumbnail"].get("source", "")
                return {
                    "title": data.get("title", candidate),
                    "summary": extract,
                    "image": thumbnail,
                    "url": data.get("content_urls", {}).get("desktop", {}).get("page", ""),
                }
        except Exception:
            continue

    fallback_title = search_mediawiki_title("en.wikipedia.org", search_query)
    if fallback_title:
        return fetch_wikipedia_summary([fallback_title], search_query="")
    return {"title": "", "summary": "", "image": "", "url": ""}


def fetch_wikivoyage_intro(candidates: list[str], search_query: str) -> dict[str, str]:
    for candidate in unique_strings(candidates):
        try:
            url = (
                "https://en.wikivoyage.org/w/api.php?action=query&prop=extracts|pageimages"
                f"&format=json&redirects=1&exintro=1&explaintext=1&piprop=original&pithumbsize=1200&titles={urllib.parse.quote(candidate)}"
            )
            data = fetch_json(url)
            pages = data.get("query", {}).get("pages", {})
            for page in pages.values():
                extract = clean_extract(page.get("extract", ""))
                if extract:
                    image = ""
                    if isinstance(page.get("original"), dict):
                        image = page["original"].get("source", "")
                    return {
                        "title": page.get("title", candidate),
                        "extract": extract,
                        "image": image,
                        "url": f"https://en.wikivoyage.org/wiki/{urllib.parse.quote(page.get('title', candidate).replace(' ', '_'))}",
                    }
        except Exception:
            continue

    fallback_title = search_mediawiki_title("en.wikivoyage.org", search_query)
    if fallback_title:
        return fetch_wikivoyage_intro([fallback_title], search_query="")
    return {"title": "", "extract": "", "image": "", "url": ""}


def build_search_tokens(country: dict[str, Any], capital: str, official_name: str) -> list[str]:
    names = [
        country.get("name", {}).get("common", ""),
        official_name,
        capital,
        country.get("cca2", ""),
        country.get("cca3", ""),
        *(country.get("altSpellings") or []),
    ]
    return unique_strings([value for value in names if isinstance(value, str)])


def build_record(
    country: dict[str, Any],
    seed_data: dict[str, dict[str, Any]],
    restcountries_lookup: dict[str, dict[str, Any]],
) -> dict[str, Any] | None:
    ccn3 = country.get("ccn3")
    if not ccn3:
        return None

    record_id = str(ccn3).zfill(3)
    supplement = restcountries_lookup.get(country.get("cca3", ""), {})
    common_name = country.get("name", {}).get("common", "Unknown")
    official_name = country.get("name", {}).get("official", common_name)
    capital = ((country.get("capital") or [])[:1] or ["Unknown"])[0]
    currencies = build_currency_labels(country.get("currencies") or {})
    languages = list((country.get("languages") or {}).values())
    timezones = supplement.get("timezones") or country.get("timezones") or []
    calling_codes = build_calling_codes(country.get("idd") or {})
    latlng = country.get("latlng") or []
    capital_latlng = supplement.get("capitalInfo", {}).get("latlng") or []
    lat = latlng[0] if len(latlng) > 0 else (capital_latlng[0] if len(capital_latlng) > 0 else None)
    lng = latlng[1] if len(latlng) > 1 else (capital_latlng[1] if len(capital_latlng) > 1 else None)
    region = country.get("region", "")
    subregion = country.get("subregion", "")
    border_codes = country.get("borders") or []
    area_km2 = country.get("area")
    landlocked = bool(country.get("landlocked"))
    is_island_like = (not border_codes and not landlocked) or region == "Oceania"
    seed = seed_data.get(record_id, {})
    seed_places = unique_strings(seed.get("places") or [])
    seed_cities = unique_strings(seed.get("cities") or [])
    wiki_candidates = [
        common_name,
        official_name,
        *(country.get("altSpellings") or [])[:3],
    ]

    wiki_summary = fetch_wikipedia_summary(wiki_candidates, f"{common_name} country")
    travel_intro = fetch_wikivoyage_intro(wiki_candidates, f"{common_name} travel guide")

    overview = wiki_summary.get("summary") or f"{common_name} is in {subregion or region}."
    travel_guide = travel_intro.get("extract") or (
        f"{common_name} uses {join_sentence(currencies)} and centers travel around {capital}."
    )
    image_url = seed.get("imageUrl") or travel_intro.get("image") or wiki_summary.get("image") or ""

    capital_line = f"The capital is {capital}." if capital and capital != "Unknown" else ""
    language_line = (
        f"Commonly used language{'s are' if len(languages) != 1 else ' is'} {join_sentence(languages)}."
        if languages else ""
    )
    currency_line = f"Currency: {join_sentence(currencies)}." if currencies else ""
    snapshot = clean_extract(" ".join([
        f"{common_name} is in {subregion or region}.",
        capital_line,
        currency_line,
        language_line,
        summarize_population(country.get('population')),
    ]))

    return {
        "id": record_id,
        "iso2": country.get("cca2", ""),
        "iso3": country.get("cca3", ""),
        "name": common_name,
        "officialName": official_name,
        "capital": capital,
        "region": region,
        "subregion": subregion,
        "currency": currencies[0] if currencies else "Not available",
        "currencies": currencies,
        "languages": languages,
        "timezones": timezones,
        "callingCodes": calling_codes,
        "population": country.get("population"),
        "areaKm2": area_km2,
        "demonym": (
            country.get("demonyms", {}).get("eng", {}).get("m")
            or country.get("demonym")
            or ""
        ),
        "drivingSide": supplement.get("car", {}).get("side") or country.get("car", {}).get("side", ""),
        "weekStartsOn": country.get("startOfWeek", ""),
        "independent": bool(country.get("independent")),
        "landlocked": landlocked,
        "flagEmoji": country.get("flag", ""),
        "flagAlt": country.get("flags", {}).get("alt", ""),
        "lat": lat,
        "lng": lng,
        "cities": unique_strings([capital, *seed_cities]),
        "places": seed_places,
        "overview": overview,
        "travelGuide": travel_guide,
        "travelSnapshot": snapshot,
        "bestTimeToVisit": derive_best_time_to_visit(lat, region, subregion),
        "transportTips": derive_transport_tip(area_km2, len(border_codes), is_island_like, landlocked),
        "borderCodes": border_codes,
        "borderCountries": [],
        "maps": {
            "googleMaps": country.get("maps", {}).get("googleMaps", ""),
            "openStreetMaps": country.get("maps", {}).get("openStreetMaps", ""),
            "wikipedia": wiki_summary.get("url", ""),
            "wikivoyage": travel_intro.get("url", ""),
        },
        "imageUrl": image_url,
        "isCurated": bool(seed_places or seed.get("imageUrl")),
        "searchTokens": build_search_tokens(country, capital, official_name),
    }


def finalize_borders(records: dict[str, dict[str, Any]]) -> None:
    by_iso3 = {record["iso3"]: record for record in records.values() if record.get("iso3")}
    for record in records.values():
        border_names: list[str] = []
        for code in record.get("borderCodes", []):
            border_record = by_iso3.get(code)
            if border_record:
                border_names.append(border_record["name"])
        record["borderCountries"] = border_names


def write_output(records: dict[str, dict[str, Any]]) -> None:
    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    ordered = dict(sorted(records.items(), key=lambda item: item[1]["name"]))
    payload = json.dumps(ordered, indent=2, ensure_ascii=False)
    with tempfile.NamedTemporaryFile("w", encoding="utf-8", delete=False, dir=OUTPUT_PATH.parent) as tmp:
        tmp.write(payload)
        tmp_path = tmp.name
    os.replace(tmp_path, OUTPUT_PATH)


def main() -> None:
    seed_data = load_seed_data()
    countries = fetch_mledoze_countries()
    restcountries_lookup = fetch_restcountries_lookup()
    if len(countries) < 200:
        raise RuntimeError(f"Refusing to build from incomplete feed: {len(countries)} countries")

    records: dict[str, dict[str, Any]] = {}
    with ThreadPoolExecutor(max_workers=4) as executor:
        for record in executor.map(
            lambda country: build_record(country, seed_data, restcountries_lookup),
            countries,
        ):
            if record:
                records[record["id"]] = record

    if len(records) < 200:
        raise RuntimeError(f"Refusing to write incomplete travel database: {len(records)} countries")

    finalize_borders(records)
    write_output(records)
    print(f"Saved {len(records)} countries to {OUTPUT_PATH}")


if __name__ == "__main__":
    main()
