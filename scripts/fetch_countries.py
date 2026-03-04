import json
import urllib.request
import time
import ssl
from concurrent.futures import ThreadPoolExecutor

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

def get_all_countries():
    print("Fetching mledoze countries data...")
    req = urllib.request.Request("https://raw.githubusercontent.com/mledoze/countries/master/countries.json", headers={'User-Agent': 'Mozilla/5.0'})
    try:
        with urllib.request.urlopen(req, context=ctx) as response:
            data = json.loads(response.read().decode())
            return data
    except Exception as e:
        print(f"Error fetching countries: {e}")
        return []

def search_image(country_name):
    """Fetch an image from Wikipedia, specifically avoiding flags, emblems, and locator maps."""
    def try_query(query):
        search_query = urllib.parse.quote(query)
        url = f"https://en.wikipedia.org/w/api.php?action=query&format=json&prop=pageimages&generator=search&gsrsearch={search_query}&gsrlimit=3&pithumbsize=800"
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        try:
            with urllib.request.urlopen(req, context=ctx, timeout=5) as response:
                data = json.loads(response.read().decode('utf-8'))
                pages = data.get('query', {}).get('pages', {})
                for page_id, page_info in pages.items():
                    if 'thumbnail' in page_info:
                        src = page_info['thumbnail']['source']
                        src_lower = src.lower()
                        # Avoid flags, standard maps, SVG drawings, etc.
                        if 'flag' not in src_lower and 'locator' not in src_lower and 'emblem' not in src_lower and 'coat_of_arms' not in src_lower and not src_lower.endswith('.svg.png') and 'map' not in src_lower:
                            return src
        except:
            pass
        return None

    # Strategy 1: Search for country + landmark
    img = try_query(f"{country_name} landmark")
    if img: return img
    
    # Strategy 2: Search for country + tourism
    img = try_query(f"{country_name} tourism")
    if img: return img
    
    # Strategy 3: Just the country
    return try_query(country_name)

def process_country(country):
    try:
        ccn3 = country.get('ccn3')
        if not ccn3:
            return None
            
        name = country.get('name', {}).get('common', 'Unknown')
        
        # Capital
        capitals = country.get('capital', [])
        capital = capitals[0] if capitals else "Unknown"
        
        # Currency (mledoze format: dict of {code: {name, symbol}})
        currencies = country.get('currencies', {})
        currency_str = "N/A"
        if currencies and isinstance(currencies, dict):
            curr_code = list(currencies.keys())[0]
            curr_data = currencies[curr_code]
            curr_name = curr_data.get('name', curr_code)
            curr_sym = curr_data.get('symbol', '')
            currency_str = f"{curr_name} ({curr_sym})"
            
        # Fun fact 
        region = country.get('subregion', country.get('region', 'Unknown'))
        fact = f"Located in {region}, {name} represents a unique blend of local culture and history."
        if capital != "Unknown":
            fact = f"The capital of {name} is {capital}, acting as the heart of {region}."
            
        # Attempt to find an image
        image_url = search_image(name)
            
        return {
            "id": ccn3,
            "data": {
                "name": name,
                "capital": capital,
                "currency": currency_str,
                "cities": [capital] if capital != "Unknown" else [],
                "places": [],
                "funFact": fact,
                "imageUrl": image_url or ""
            }
        }
    except Exception as e:
        print(f"Error processing {country.get('name', {}).get('common')}: {e}")
        return None

def main():
    countries = get_all_countries()
    print(f"Found {len(countries)} countries.")
    
    result_dict = {}
    
    print("Processing countries and fetching images... This may take a minute.")
    with ThreadPoolExecutor(max_workers=10) as executor:
        results = list(executor.map(process_country, countries))
        
    for res in results:
        if res:
            result_dict[res['id']] = res['data']
            
    # Try to load existing data and merge to keep curated places and fun facts
    try:
        from existing_data import countryMetadata
        for cid, data in countryMetadata.items():
            if cid in result_dict:
                # Merge curated properties
                if data.get('places'):
                    result_dict[cid]['places'] = data['places']
                if data.get('cities'):
                    result_dict[cid]['cities'] = data['cities']
                if data.get('funFact'):
                    result_dict[cid]['funFact'] = data['funFact']
    except Exception as e:
        print("Note: Could not merge existing curated data.", e)
    
    print(f"Successfully processed {len(result_dict)} countries.")
    
    output_path = "/Users/arjunsarkar/my-website/src/data/countriesData.json"
    with open(output_path, "w") as f:
        json.dump(result_dict, f, indent=2, ensure_ascii=False)
        
    print(f"Data saved to {output_path}")

if __name__ == "__main__":
    main()
