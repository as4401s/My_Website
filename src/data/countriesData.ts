export interface CountryData {
    name: string;
    capital: string;
    currency: string;
    cities: string[];
    places: string[];
    funFact: string;
}

export const countryMetadata: Record<string, CountryData> = {
    // ISO Numeric Codes for TopoJSON matching
    "840": {
        name: "United States",
        capital: "Washington, D.C.",
        currency: "US Dollar ($)",
        cities: ["New York City", "Los Angeles", "Chicago", "San Francisco"],
        places: ["Statue of Liberty", "Grand Canyon", "Yellowstone National Park", "Times Square"],
        funFact: "The US has no official language at the federal level, though English is the primary language used."
    },
    "356": {
        name: "India",
        capital: "New Delhi",
        currency: "Indian Rupee (₹)",
        cities: ["Mumbai", "Bangalore", "Kolkata", "Chennai", "Hyderabad"],
        places: ["Taj Mahal", "Varanasi Ganges", "Jaipur Hawa Mahal", "Kerala Backwaters"],
        funFact: "India has the world's largest postal network, including a floating post office in Dal Lake, Srinagar."
    },
    "250": {
        name: "France",
        capital: "Paris",
        currency: "Euro (€)",
        cities: ["Lyon", "Marseille", "Bordeaux", "Nice"],
        places: ["Eiffel Tower", "Louvre Museum", "Mont Saint-Michel", "French Riviera"],
        funFact: "France is the most visited country in the world and has 12 different time zones, more than any other nation."
    },
    "392": {
        name: "Japan",
        capital: "Tokyo",
        currency: "Japanese Yen (¥)",
        cities: ["Osaka", "Kyoto", "Nagoya", "Yokohama"],
        places: ["Mount Fuji", "Kyoto Temples", "Shibuya Crossing", "Itsukushima Shrine"],
        funFact: "Japan has more than 5 million vending machines—roughly one for every 23 people."
    },
    "826": {
        name: "United Kingdom",
        capital: "London",
        currency: "Pound Sterling (£)",
        cities: ["Manchester", "Edinburgh", "Birmingham", "Glasgow"],
        places: ["Big Ben", "Stonehenge", "Edinburgh Castle", "The Roman Baths"],
        funFact: "The UK is the only country in the world where the stamp doesn't have its name on it—just the image of the reigning monarch."
    },
    "124": {
        name: "Canada",
        capital: "Ottawa",
        currency: "Canadian Dollar ($)",
        cities: ["Toronto", "Vancouver", "Montreal", "Calgary"],
        places: ["Niagara Falls", "Banff National Park", "CN Tower", "Old Quebec"],
        funFact: "Canada has more lakes than the rest of the world's lakes combined."
    },
    "036": {
        name: "Australia",
        capital: "Canberra",
        currency: "Australian Dollar ($)",
        cities: ["Sydney", "Melbourne", "Brisbane", "Perth"],
        places: ["Great Barrier Reef", "Sydney Opera House", "Uluru", "Bondi Beach"],
        funFact: "Australia is home to 10 of the world's 15 most poisonous snakes."
    },
    "276": {
        name: "Germany",
        capital: "Berlin",
        currency: "Euro (€)",
        cities: ["Munich", "Hamburg", "Frankfurt", "Cologne"],
        places: ["Neuschwanstein Castle", "Brandenburg Gate", "Cologne Cathedral", "Black Forest"],
        funFact: "Germany was the first country in the world to adopt Daylight Saving Time in 1916."
    },
    "156": {
        name: "China",
        capital: "Beijing",
        currency: "Renminbi (¥)",
        cities: ["Shanghai", "Guangzhou", "Shenzhen", "Chengdu"],
        places: ["Great Wall of China", "Terracotta Army", "Forbidden City", "Potala Palace"],
        funFact: "All giant pandas in zoos around the world are on loan from China."
    },
    "076": {
        name: "Brazil",
        capital: "Brasília",
        currency: "Brazilian Real (R$)",
        cities: ["São Paulo", "Rio de Janeiro", "Salvador", "Belo Horizonte"],
        places: ["Christ the Redeemer", "Amazon Rainforest", "Iguazu Falls", "Copacabana Beach"],
        funFact: "Brazil has been the world's largest producer of coffee for over 150 years."
    },
    "380": {
        name: "Italy",
        capital: "Rome",
        currency: "Euro (€)",
        cities: ["Milan", "Florence", "Venice", "Naples"],
        places: ["Colosseum", "Leaning Tower of Pisa", "Florence Duomo", "Amalfi Coast"],
        funFact: "Italy has the most UNESCO World Heritage Sites of any country in the world."
    },
    "724": {
        name: "Spain",
        capital: "Madrid",
        currency: "Euro (€)",
        cities: ["Barcelona", "Valencia", "Seville", "Bilbao"],
        places: ["Sagrada Família", "Alhambra", "Park Güell", "Ibiza"],
        funFact: "Spain is the world's largest producer of olive oil, accounting for nearly 45% of global production."
    },
    "410": {
        name: "South Korea",
        capital: "Seoul",
        currency: "South Korean Won (₩)",
        cities: ["Busan", "Incheon", "Daegu", "Gwangju"],
        places: ["Gyeongbokgung Palace", "N Seoul Tower", "Jeju Island", "Bukchon Hanok Village"],
        funFact: "In South Korea, babies are considered one year old at birth."
    },
    "764": {
        name: "Thailand",
        capital: "Bangkok",
        currency: "Thai Baht (฿)",
        cities: ["Chiang Mai", "Phuket", "Pattaya", "Ayutthaya"],
        places: ["Grand Palace", "Wat Arun", "Phi Phi Islands", "Railay Beach"],
        funFact: "It is illegal to leave your house without wearing underwear in Thailand."
    },
    "702": {
        name: "Singapore",
        capital: "Singapore",
        currency: "Singapore Dollar ($)",
        cities: ["Singapore"],
        places: ["Gardens by the Bay", "Marina Bay Sands", "Sentosa Island", "Merlion Park"],
        funFact: "Singapore is one of only three city-states in the world (the others being Monaco and Vatican City)."
    },
    "752": {
        name: "Sweden",
        capital: "Stockholm",
        currency: "Swedish Krona (kr)",
        cities: ["Gothenburg", "Malmö", "Uppsala"],
        places: ["Vasa Museum", "Gamla Stan", "Abisko National Park", "Icehotel"],
        funFact: "Sweden has more islands than any other country in the world (over 267,000)."
    },
    "756": {
        name: "Switzerland",
        capital: "Bern",
        currency: "Swiss Franc (CHF)",
        cities: ["Zurich", "Geneva", "Basel", "Lausanne"],
        places: ["The Matterhorn", "Jungfraujoch", "Lucerne Chapel Bridge", "Chillon Castle"],
        funFact: "Switzerland has the world's highest chocolate consumption per capita (nearly 9kg per year)."
    },
    "554": {
        name: "New Zealand",
        capital: "Wellington",
        currency: "New Zealand Dollar ($)",
        cities: ["Auckland", "Christchurch", "Queenstown"],
        places: ["Milford Sound", "Hobbiton Movie Set", "Waitomo Caves", "Lake Tekapo"],
        funFact: "There are no snakes in New Zealand."
    },
    "528": {
        name: "Netherlands",
        capital: "Amsterdam",
        currency: "Euro (€)",
        cities: ["Rotterdam", "The Hague", "Utrecht"],
        places: ["Rijksmuseum", "Anne Frank House", "Keukenhof Gardens", "Kinderdijk Windmills"],
        funFact: "The Netherlands is the most bicycle-friendly country in the world, with more bikes than people."
    },
    "203": {
        name: "Czech Republic",
        capital: "Prague",
        currency: "Czech Koruna (Kč)",
        cities: ["Brno", "Ostrava", "Plzeň"],
        places: ["Prague Castle", "Charles Bridge", "Old Town Square", "Cesky Krumlov"],
        funFact: "The Czech Republic has the highest beer consumption per capita in the world."
    },
    "484": {
        name: "Mexico",
        capital: "Mexico City",
        currency: "Mexican Peso ($)",
        cities: ["Cancun", "Guadalajara", "Monterrey", "Puebla"],
        places: ["Chichen Itza", "Tulum", "Chapultepec Castle", "Teotihuacan Pyramids"],
        funFact: "Mexico City is sinking by about 10 inches per year because it was built on a lake."
    },
    "032": {
        name: "Argentina",
        capital: "Buenos Aires",
        currency: "Argentine Peso ($)",
        cities: ["Cordoba", "Rosario", "Mendoza"],
        places: ["Iguazu Falls", "Perito Moreno Glacier", "La Boca", "Mount Fitz Roy"],
        funFact: "Argentina was the first country in the world to use fingerprinting as a method of identification in 1892."
    },
    "818": {
        name: "Egypt",
        capital: "Cairo",
        currency: "Egyptian Pound (EGP)",
        cities: ["Alexandria", "Giza", "Luxor", "Sharm El Sheikh"],
        places: ["Great Pyramids of Giza", "Valley of the Kings", "Karnak Temple", "The Nile"],
        funFact: "The ancient Egyptians invented the 365-day calendar."
    },
    "710": {
        name: "South Africa",
        capital: "Pretoria / Cape Town",
        currency: "South African Rand (R)",
        cities: ["Johannesburg", "Durban", "Port Elizabeth"],
        places: ["Table Mountain", "Kruger National Park", "Robben Island", "Cape of Good Hope"],
        funFact: "South Africa is the only country in the world to have three capital cities."
    },
    "792": {
        name: "Turkey",
        capital: "Ankara",
        currency: "Turkish Lira (₺)",
        cities: ["Istanbul", "Antalya", "Izmir", "Bursa"],
        places: ["Hagia Sophia", "Cappadocia", "Blue Mosque", "Pamukkale"],
        funFact: "Istanbul is the only city in the world that sits on two continents: Europe and Asia."
    },
    "300": {
        name: "Greece",
        capital: "Athens",
        currency: "Euro (€)",
        cities: ["Thessaloniki", "Patras", "Heraklion"],
        places: ["Acropolis", "Santorini", "Mykonos", "Meteora"],
        funFact: "Greece is considered the birthplace of democracy, Western philosophy, and the Olympic Games."
    },
    "620": {
        name: "Portugal",
        capital: "Lisbon",
        currency: "Euro (€)",
        cities: ["Porto", "Braga", "Coimbra"],
        places: ["Belem Tower", "Sintra", "Algarve Beaches", "Douro Valley"],
        funFact: "Portugal and England have the oldest diplomatic alliance in the world, signed in 1373."
    },
    "372": {
        name: "Ireland",
        capital: "Dublin",
        currency: "Euro (€)",
        cities: ["Cork", "Limerick", "Galway"],
        places: ["Cliffs of Moher", "Guinness Storehouse", "Ring of Kerry", "Trinity College"],
        funFact: "Ireland is the only country in the world where the national symbol is a musical instrument: the Celtic Harp."
    },
    "784": {
        name: "United Arab Emirates",
        capital: "Abu Dhabi",
        currency: "UAE Dirham (AED)",
        cities: ["Dubai", "Sharjah", "Ajman"],
        places: ["Burj Khalifa", "Sheikh Zayed Mosque", "Palm Jumeirah", "Louvre Abu Dhabi"],
        funFact: "The UAE has a special government ministry called the Ministry of State for Happiness."
    },
    "704": {
        name: "Vietnam",
        capital: "Hanoi",
        currency: "Vietnamese Dong (₫)",
        cities: ["Ho Chi Minh City", "Da Nang", "Hue", "Hoi An"],
        places: ["Ha Long Bay", "Phong Nha Caves", "Cu Chi Tunnels", "Golden Bridge"],
        funFact: "Vietnam is the world's largest exporter of cashews."
    },
    "360": {
        name: "Indonesia",
        capital: "Jakarta",
        currency: "Indonesian Rupiah (Rp)",
        cities: ["Surabaya", "Bandung", "Medan", "Bali"],
        places: ["Borobudur Temple", "Komodo National Park", "Uluwatu Temple", "Mount Bromo"],
        funFact: "Indonesia is composed of over 17,000 islands."
    },
    "608": {
        name: "Philippines",
        capital: "Manila",
        currency: "Philippine Peso (₱)",
        cities: ["Quezon City", "Cebu City", "Davao City"],
        places: ["Chocolate Hills", "Palawan / El Nido", "Boracay", "Banaue Rice Terraces"],
        funFact: "The Philippines is home to the world's longest underground river."
    },
    "458": {
        name: "Malaysia",
        capital: "Kuala Lumpur",
        currency: "Malaysian Ringgit (RM)",
        cities: ["Penang", "Johor Bahru", "Kota Kinabalu"],
        places: ["Petronas Twin Towers", "Batu Caves", "Mount Kinabalu", "Langkawi"],
        funFact: "Malaysia has a unique rotating monarchy system among nine Malay rulers."
    },
    "040": {
        name: "Austria",
        capital: "Vienna",
        currency: "Euro (€)",
        cities: ["Salzburg", "Innsbruck", "Graz"],
        places: ["Schönbrunn Palace", "Hallstatt", "The Hofburg", "St. Stephen's Cathedral"],
        funFact: "Austria's flag is one of the oldest in the world, dating back to 1191."
    },
    "578": {
        name: "Norway",
        capital: "Oslo",
        currency: "Norwegian Krone (kr)",
        cities: ["Bergen", "Trondheim", "Stavanger"],
        places: ["Geirangerfjord", "Lofoten Islands", "The Northern Lights", "Preikestolen"],
        funFact: "Norway introduced salmon sushi to Japan in the 1980s."
    },
    "208": {
        name: "Denmark",
        capital: "Copenhagen",
        currency: "Danish Krone (kr)",
        cities: ["Aarhus", "Odense", "Aalborg"],
        places: ["Tivoli Gardens", "The Little Mermaid", "Nyhavn", "Legoland Billund"],
        funFact: "Denmark has been frequently ranked as the happiest country in the world."
    },
    "246": {
        name: "Finland",
        capital: "Helsinki",
        currency: "Euro (€)",
        cities: ["Espoo", "Tampere", "Vantaa"],
        places: ["Northern Lights", "Santa Claus Village", "Suomenlinna", "Lake Saimaa"],
        funFact: "Finland has more saunas than it has cars (roughly 3.3 million saunas for 5.5 million people)."
    },
    "352": {
        name: "Iceland",
        capital: "Reykjavik",
        currency: "Icelandic Króna (kr)",
        cities: ["Akureyri", "Keflavik"],
        places: ["Blue Lagoon", "Golden Circle", "Skógafoss", "Black Sand Beach"],
        funFact: "Iceland has no mosquitoes at all."
    },
    "604": {
        name: "Peru",
        capital: "Lima",
        currency: "Sol (S/.)",
        cities: ["Cusco", "Arequipa", "Trujillo"],
        places: ["Machu Picchu", "Rainbow Mountain", "Nazca Lines", "Lake Titicaca"],
        funFact: "The potato is originally from Peru, and there are over 3,000 varieties grown there."
    },
    "152": {
        name: "Chile",
        capital: "Santiago",
        currency: "Chilean Peso ($)",
        cities: ["Valparaiso", "Concepcion", "La Serena"],
        places: ["Easter Island", "Torres del Paine", "Atacama Desert", "Valle de la Luna"],
        funFact: "The Atacama Desert in Chile is the driest place on Earth."
    }
};

export const getCountryData = (id?: string | number): CountryData | undefined => {
    if (!id) return undefined;
    return countryMetadata[String(id).padStart(3, '0')];
};
