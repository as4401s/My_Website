import countriesDataRaw from './countriesData.json';

export interface CountryData {
    name: string;
    capital: string;
    currency: string;
    cities: string[];
    places: string[];
    funFact: string;
    imageUrl?: string;
}

export const countryMetadata: Record<string, CountryData> = countriesDataRaw as Record<string, CountryData>;

export const getCountryData = (id?: string | number): CountryData | undefined => {
    if (!id) return undefined;
    return countryMetadata[String(id).padStart(3, '0')];
};
