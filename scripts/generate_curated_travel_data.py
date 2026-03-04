import json
import urllib.request
import urllib.parse
import ssl
from concurrent.futures import ThreadPoolExecutor

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

# Highly curated travel data for over 40 top destinations
CURATED_DATA = {
    "IND": {"landmark": "Taj_Mahal", "fact": "India is incredibly diverse, boasting 40 UNESCO World Heritage Sites and over 19,500 spoken languages or dialects."},
    "FRA": {"landmark": "Eiffel_Tower", "fact": "France is the most visited country in the world, renowned for its gastronomy, art, and diverse landscapes."},
    "JPN": {"landmark": "Mount_Fuji", "fact": "Japan blends ancient traditions with futuristic technology, featuring over 10,000 torii gates at the Fushimi Inari Shrine."},
    "ITA": {"landmark": "Colosseum", "fact": "Italy has more UNESCO World Heritage Sites than any other country, with 58 locations reflecting its rich history."},
    "USA": {"landmark": "Statue_of_Liberty", "fact": "The United States is home to the world's first national park, Yellowstone, established in 1872."},
    "GBR": {"landmark": "Big_Ben", "fact": "London's transport system is so vast that the London Underground has been running since 1863."},
    "CHN": {"landmark": "Great_Wall_of_China", "fact": "The Great Wall of China is a series of fortifications that stretches over 13,000 miles across northern China."},
    "BRA": {"landmark": "Christ_the_Redeemer_(statue)", "fact": "Brazil is home to 60% of the Amazon Rainforest, the most biodiverse region on Earth."},
    "AUS": {"landmark": "Sydney_Opera_House", "fact": "Australia's Great Barrier Reef is the largest coral reef system in the world and can be seen from space."},
    "CAN": {"landmark": "Banff_National_Park", "fact": "Canada has more lakes than the rest of the world's lakes combined, making it a paradise for nature lovers."},
    "ESP": {"landmark": "Sagrada_Família", "fact": "Spain is home to the only desert in Europe (Tabernas) and the world's oldest existing lighthouse (Tower of Hercules)."},
    "MEX": {"landmark": "Chichen_Itza", "fact": "Mexico City is built over the ruins of a great Aztec city, Tenochtitlán, and is slowly sinking."},
    "DEU": {"landmark": "Neuschwanstein_Castle", "fact": "Germany boasts over 20,000 castles and has more zoos than any other country in the world."},
    "THA": {"landmark": "Grand_Palace", "fact": "Bangkok is the world's most visited city, famous for its ornate shrines and vibrant street life."},
    "TUR": {"landmark": "Hagia_Sophia", "fact": "Istanbul is the only city in the world that stretches across two continents: Europe and Asia."},
    "EGY": {"landmark": "Giza_pyramid_complex", "fact": "The Great Pyramid of Giza is the oldest of the Seven Wonders of the Ancient World and the only one to remain largely intact."},
    "ZAF": {"landmark": "Table_Mountain", "fact": "South Africa is the only country in the world to host three capital cities, each serving a different branch of government."},
    "PER": {"landmark": "Machu_Picchu", "fact": "Peru's mysterious Nazca Lines are enormous geoglyphs carved into the desert that are best viewed from the air."},
    "GRC": {"landmark": "Acropolis_of_Athens", "fact": "Greece has the longest coastline in Europe and features thousands of islands, though only 227 are inhabited."},
    "NZL": {"landmark": "Milford_Sound", "fact": "New Zealand was the last major landmass to be settled by humans, and there are about 9 sheep for every person there."},
    "CHE": {"landmark": "Matterhorn", "fact": "Switzerland has 7000 lakes and over 1,500 of them are located in the Alps, offering pristine glacial waters."},
    "NLD": {"landmark": "Keukenhof", "fact": "There are more bicycles in the Netherlands than residents, making it the most bike-friendly nation globally."},
    "ARE": {"landmark": "Burj_Khalifa", "fact": "Dubai's Burj Khalifa is so tall that you can watch the sunset from the base, take the elevator, and watch it set again from the top."},
    "SGP": {"landmark": "Marina_Bay_Sands", "fact": "Singapore is one of only three surviving city-states in the world, alongside Monaco and Vatican City."},
    "VNM": {"landmark": "Ha_Long_Bay", "fact": "Vietnam is home to Sơn Đoòng Cave, the largest natural cave in the world, which has its own localized weather system."},
    "IDN": {"landmark": "Borobudur", "fact": "Indonesia is the world's largest island country, comprising over 17,000 islands along the equator."},
    "PRT": {"landmark": "Belém_Tower", "fact": "Portugal is the world's largest producer of cork, responsible for over 50% of the global supply."},
    "IRL": {"landmark": "Cliffs_of_Moher", "fact": "Ireland is entirely free of wild snakes, a phenomenon supposedly attributed to Saint Patrick."},
    "ARG": {"landmark": "Iguazu_Falls", "fact": "Argentina is home to the highest point in the Southern and Western Hemispheres, Mount Aconcagua."},
    "KOR": {"landmark": "Gyeongbokgung", "fact": "South Korea boasts the world's fastest average internet connection speed and incredible high-tech infrastructure."},
    "MYS": {"landmark": "Petronas_Towers", "fact": "Malaysia's Gunung Mulu National Park features an underground cave chamber large enough to fit 40 Boeing 747s."},
    "MAR": {"landmark": "Chefchaouen", "fact": "Morocco is famous for Chefchaouen, the 'Blue Pearl' city where almost all buildings are painted entirely in shades of blue."},
    "ISL": {"landmark": "Blue_Lagoon_(geothermal_spa)", "fact": "Because of its geothermal activity, Iceland technically generates 100% of its electricity from renewable resources."},
    "HRV": {"landmark": "Plitvice_Lakes_National_Park", "fact": "Croatia's spectacular Dalmatian Coast features over 1,200 islands surrounded by crystal-clear Adriatic waters."},
    "NOR": {"landmark": "Geirangerfjord", "fact": "Norway's Laerdal Tunnel is the world's longest road tunnel, stretching for 15 miles with colorful lighting inside."},
    "SWE": {"landmark": "Vasa_Museum", "fact": "Sweden's Icehotel in Jukkasjärvi is the world's first hotel made entirely of ice, rebuilt every single winter."},
    "DNK": {"landmark": "Nyhavn", "fact": "Denmark consistently ranks as one of the happiest countries, famous for the concept of 'Hygge' (comfy coziness)."},
    "AUT": {"landmark": "Schönbrunn_Palace", "fact": "Austria has the oldest zoo in the world, Tiergarten Schönbrunn in Vienna, which opened in 1752."},
    "CZE": {"landmark": "Charles_Bridge", "fact": "The Czech Republic has the highest beer consumption per capita in the world and invented the Pilsner."},
    "COL": {"landmark": "Castillo_San_Felipe_de_Barajas", "fact": "Colombia is the second most biodiverse country in the world, hosting almost 20% of the planet's bird species."},
    "PHL": {"landmark": "Chocolate_Hills", "fact": "The Philippines is a breathtaking archipelago comprising 7,641 individual islands."},
}

def get_mledoze_countries():
    print("Fetching mledoze countries data...")
    req = urllib.request.Request("https://raw.githubusercontent.com/mledoze/countries/master/countries.json", headers={'User-Agent': 'Mozilla/5.0'})
    try:
        with urllib.request.urlopen(req, context=ctx) as response:
            return json.loads(response.read().decode())
    except Exception as e:
        print(f"Error fetching countries: {e}")
        return []

def fetch_wikipedia_image(article_title):
    try:
        # Ask for the main image of the specific article
        path = urllib.parse.quote(article_title)
        url = f"https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&format=json&piprop=original&titles={path}"
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, context=ctx, timeout=5) as response:
            data = json.loads(response.read().decode('utf-8'))
            pages = data.get('query', {}).get('pages', {})
            for pid, pdata in pages.items():
                if 'original' in pdata:
                    return pdata['original']['source']
    except Exception as e:
        print(f"Error fetching image for {article_title}: {e}")
    return ""

def process_country(country):
    try:
        ccn3 = country.get('ccn3')
        cca3 = country.get('cca3')
        if not ccn3: return None
        
        name = country.get('name', {}).get('common', 'Unknown')
        
        # Capital
        capitals = country.get('capital', [])
        capital = capitals[0] if capitals else "Unknown"
        
        # Currency
        currencies = country.get('currencies', {})
        currency_str = "N/A"
        if currencies and isinstance(currencies, dict):
            curr_code = list(currencies.keys())[0]
            curr_data = currencies[curr_code]
            curr_name = curr_data.get('name', curr_code)
            curr_sym = curr_data.get('symbol', '')
            currency_str = f"{curr_name} ({curr_sym})"
            
        curated = CURATED_DATA.get(cca3, {})
        
        # Fun fact
        if curated.get('fact'):
            fact = curated['fact']
        else:
            region = country.get('subregion', country.get('region', 'Unknown'))
            fact = f"Located in {region}, {name} is waiting to be explored."
            if capital != "Unknown":
                fact = f"The capital of {name} is {capital}, a fascinating cultural hub in {region}."
                
        # Image
        image_url = ""
        if curated.get('landmark'):
            image_url = fetch_wikipedia_image(curated['landmark'])
            
        return {
            "id": ccn3,
            "data": {
                "name": name,
                "capital": capital,
                "currency": currency_str,
                "cities": [capital] if capital != "Unknown" else [],
                "places": [curated.get('landmark').replace('_', ' ')] if curated.get('landmark') else [],
                "funFact": fact,
                "imageUrl": image_url
            }
        }
    except Exception as e:
        print(f"Error processing {country.get('name', {}).get('common')}: {e}")
        return None

def main():
    countries = get_mledoze_countries()
    result_dict = {}
    
    print(f"Processing {len(countries)} countries and fetching accurate Wikipedia landmarks...")
    with ThreadPoolExecutor(max_workers=10) as executor:
        results = list(executor.map(process_country, countries))
        
    for res in results:
        if res:
            result_dict[res['id']] = res['data']
            
    # Output to JSON
    output_path = "/Users/arjunsarkar/my-website/src/data/countriesData.json"
    with open(output_path, "w") as f:
        json.dump(result_dict, f, indent=2, ensure_ascii=False)
        
    print(f"Successfully saved {len(result_dict)} countries to {output_path}")

if __name__ == "__main__":
    main()
