export interface CountryTravelRecord {
  id: string;
  iso2: string;
  iso3: string;
  name: string;
  officialName: string;
  capital: string;
  region: string;
  subregion: string;
  currency: string;
  currencies: string[];
  languages: string[];
  timezones: string[];
  callingCodes: string[];
  population: number | null;
  areaKm2: number | null;
  demonym: string;
  drivingSide: string;
  weekStartsOn: string;
  independent: boolean;
  landlocked: boolean;
  flagEmoji: string;
  flagAlt: string;
  lat?: number;
  lng?: number;
  cities: string[];
  places: string[];
  overview: string;
  travelGuide: string;
  travelSnapshot: string;
  bestTimeToVisit: string;
  transportTips: string;
  borderCodes: string[];
  borderCountries: string[];
  maps: {
    googleMaps: string;
    openStreetMaps: string;
    wikipedia: string;
    wikivoyage: string;
  };
  imageUrl: string;
  isCurated: boolean;
  searchTokens: string[];
}

export type CountryTravelDatabase = Record<string, CountryTravelRecord>;

let databasePromise: Promise<CountryTravelDatabase> | null = null;

export async function loadCountryTravelDatabase(): Promise<CountryTravelDatabase> {
  if (!databasePromise) {
    databasePromise = fetch('/data/country-travel-db-full.json').then(async (response) => {
      if (!response.ok) {
        throw new Error(`Failed to load travel database: ${response.status}`);
      }

      return response.json() as Promise<CountryTravelDatabase>;
    });
  }

  return databasePromise;
}

export async function loadCountryTravelRecords(): Promise<CountryTravelRecord[]> {
  const database = await loadCountryTravelDatabase();
  return Object.values(database).sort((a, b) => a.name.localeCompare(b.name));
}
