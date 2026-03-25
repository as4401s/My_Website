import { useDeferredValue, useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ExternalLink,
  Globe,
  Languages,
  MapPin,
  Navigation,
  Search,
  Users,
  X,
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  loadCountryTravelRecords,
  type CountryTravelRecord,
} from '../data/countryTravelDatabase';

const customIcon = new L.DivIcon({
  className: 'custom-pin',
  html: `<div style="width: 12px; height: 12px; background-color: #22d3ee; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 10px #22d3ee;"></div>`,
  iconSize: [12, 12],
  iconAnchor: [6, 6],
});

const numberFormatter = new Intl.NumberFormat('en-US');
const compactNumberFormatter = new Intl.NumberFormat('en-US', {
  notation: 'compact',
  maximumFractionDigits: 1,
});

const formatPopulation = (population: number | null) => {
  if (!population) return 'Not available';
  return `${compactNumberFormatter.format(population)} people`;
};

const formatArea = (areaKm2: number | null) => {
  if (!areaKm2) return 'Not available';
  return `${numberFormatter.format(Math.round(areaKm2))} km²`;
};

const MapController = ({
  center,
  zoom,
  selectedCountry,
}: {
  center: [number, number];
  zoom: number;
  selectedCountry: CountryTravelRecord | null;
}) => {
  const map = useMap();

  useEffect(() => {
    map.flyTo(center, zoom, { duration: 1.5 });
  }, [center, zoom, map]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      map.invalidateSize();
    }, 300);
    return () => clearTimeout(timeout);
  }, [selectedCountry, map]);

  return null;
};

export default function TravelMap() {
  const navigate = useNavigate();
  const [allCountries, setAllCountries] = useState<CountryTravelRecord[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<CountryTravelRecord | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isDatabaseLoading, setIsDatabaseLoading] = useState(true);
  const [databaseError, setDatabaseError] = useState<string | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>([20, 0]);
  const [mapZoom, setMapZoom] = useState(2);
  const deferredSearchQuery = useDeferredValue(searchQuery);

  useEffect(() => {
    let isActive = true;

    setIsDatabaseLoading(true);
    loadCountryTravelRecords()
      .then((records) => {
        if (!isActive) return;
        setAllCountries(records);
        setDatabaseError(null);
      })
      .catch((error) => {
        if (!isActive) return;
        setDatabaseError(error instanceof Error ? error.message : 'Failed to load travel data.');
      })
      .finally(() => {
        if (isActive) {
          setIsDatabaseLoading(false);
        }
      });

    return () => {
      isActive = false;
    };
  }, []);

  const curatedCountries = useMemo(
    () =>
      allCountries.filter(
        (country) =>
          country.lat !== undefined &&
          country.lng !== undefined &&
          (country.isCurated || country.places.length > 0)
      ),
    [allCountries]
  );

  const matchingCountries = useMemo(() => {
    const normalizedQuery = deferredSearchQuery.trim().toLowerCase();
    if (!normalizedQuery) return [];

    return allCountries
      .filter((country) =>
        country.searchTokens.some((token) => token.toLowerCase().includes(normalizedQuery))
      )
      .slice(0, 8);
  }, [allCountries, deferredSearchQuery]);

  const handleCountrySelect = (country: CountryTravelRecord) => {
    setSelectedCountry(country);
    setSearchQuery('');
    setIsSearching(false);

    if (country.lat !== undefined && country.lng !== undefined) {
      setMapCenter([country.lat, country.lng]);
      setMapZoom(5);
    }
  };

  const handleClosePanel = () => {
    setSelectedCountry(null);
    setMapCenter([20, 0]);
    setMapZoom(2);
  };

  const selectedCountryHasMarker =
    selectedCountry && curatedCountries.some((country) => country.id === selectedCountry.id);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative flex h-screen w-full flex-col overflow-hidden bg-slate-950 font-sans"
    >
      <div className="pointer-events-none absolute left-0 right-0 top-0 z-[1000] flex items-start justify-between p-6">
        <button
          onClick={() => navigate('/')}
          className="pointer-events-auto flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900/80 px-4 py-2 text-white shadow-lg backdrop-blur-md transition-all hover:bg-slate-800"
        >
          <ArrowLeft size={16} />
          <span className="text-sm font-medium">Portfolio</span>
        </button>

        <div className="pointer-events-auto relative">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder={isDatabaseLoading ? 'Loading country database...' : 'Search country...'}
              value={searchQuery}
              onChange={(event) => {
                setSearchQuery(event.target.value);
                setIsSearching(true);
              }}
              onFocus={() => setIsSearching(true)}
              className="w-64 rounded-full border border-slate-700 bg-slate-900/80 px-11 py-2.5 text-white shadow-lg backdrop-blur-md transition-all focus:outline-none focus:ring-2 focus:ring-cyan-500/50 md:w-80"
              disabled={isDatabaseLoading}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {isSearching && searchQuery.trim() && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute left-0 right-0 top-full z-[1000] mt-2 overflow-hidden rounded-2xl border border-slate-700 bg-slate-900/95 shadow-2xl backdrop-blur-xl"
            >
              {matchingCountries.length > 0 ? (
                matchingCountries.map((country) => (
                  <button
                    key={country.id}
                    onClick={() => handleCountrySelect(country)}
                    className="group flex w-full items-center justify-between border-b border-slate-800/50 px-4 py-3 text-left transition-colors last:border-0 hover:bg-slate-800"
                  >
                    <div>
                      <div className="font-medium text-white">
                        {country.flagEmoji ? `${country.flagEmoji} ` : ''}
                        {country.name}
                      </div>
                      <div className="text-xs text-slate-400">
                        {country.capital} • {country.subregion || country.region}
                      </div>
                    </div>
                    <Navigation
                      size={14}
                      className="text-slate-600 transition-colors group-hover:text-cyan-400"
                    />
                  </button>
                ))
              ) : (
                <div className="px-4 py-4 text-sm text-slate-400">
                  {isDatabaseLoading ? 'Loading travel records...' : 'No matching country found.'}
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>

      <div className="relative z-0 h-full w-full flex-1">
        <MapContainer
          center={[20, 0]}
          zoom={2}
          minZoom={2}
          zoomControl={false}
          className="h-full w-full bg-[#0f172a]"
          worldCopyJump
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          />

          <MapController center={mapCenter} zoom={mapZoom} selectedCountry={selectedCountry} />

          {curatedCountries.map((country) => (
            <Marker
              key={`marker-${country.id}`}
              position={[country.lat!, country.lng!]}
              icon={customIcon}
              eventHandlers={{ click: () => handleCountrySelect(country) }}
            >
              <Popup className="dark-popup">
                <div className="text-sm font-semibold text-slate-900">{country.name}</div>
                <div className="text-xs text-slate-600">
                  {country.capital} • {country.subregion || country.region}
                </div>
              </Popup>
            </Marker>
          ))}

          {selectedCountry &&
            !selectedCountryHasMarker &&
            selectedCountry.lat !== undefined &&
            selectedCountry.lng !== undefined && (
              <Marker
                position={[selectedCountry.lat, selectedCountry.lng]}
                icon={customIcon}
              />
            )}
        </MapContainer>

        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.18),transparent_30%),radial-gradient(circle_at_20%_80%,rgba(56,189,248,0.14),transparent_32%),radial-gradient(circle_at_80%_20%,rgba(251,191,36,0.10),transparent_28%),linear-gradient(180deg,rgba(15,23,42,0.16),rgba(15,23,42,0.34))]" />

        {isDatabaseLoading && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-slate-950/35 backdrop-blur-[2px]">
            <div className="rounded-2xl border border-white/10 bg-slate-900/80 px-6 py-4 text-sm text-slate-200 shadow-2xl">
              Loading global travel database...
            </div>
          </div>
        )}

        {databaseError && (
          <div className="absolute bottom-6 left-6 z-[1000] max-w-sm rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-100 shadow-xl backdrop-blur-xl">
            {databaseError}
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedCountry && (
          <motion.div
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="absolute bottom-0 right-0 top-0 z-[1050] flex w-full flex-col border-l border-white/5 bg-slate-900/40 shadow-2xl backdrop-blur-2xl md:w-[480px]"
          >
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-cyan-500/5 to-transparent" />

            <button
              onClick={handleClosePanel}
              className="absolute right-6 top-6 z-10 rounded-full bg-slate-800/50 p-2 text-slate-300 transition-colors hover:bg-slate-700 hover:text-white"
            >
              <X size={20} />
            </button>

            <div className="flex-1 space-y-8 overflow-y-auto px-8 pb-14 pt-16 md:px-10">
              {selectedCountry.imageUrl && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 }}
                  className="relative h-56 w-full overflow-hidden rounded-2xl border border-white/10 shadow-2xl"
                >
                  <img
                    src={selectedCountry.imageUrl}
                    alt={`Travel view of ${selectedCountry.name}`}
                    className="h-full w-full object-cover transition-transform duration-700 hover:scale-110"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
                </motion.div>
              )}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className={!selectedCountry.imageUrl ? 'mt-6' : ''}
              >
                <div className="mb-3 flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-cyan-400">
                  <span>{selectedCountry.region}</span>
                  {selectedCountry.subregion && <span>• {selectedCountry.subregion}</span>}
                </div>
                <h2 className="mb-2 text-4xl font-black tracking-tight text-white md:text-5xl">
                  {selectedCountry.flagEmoji ? `${selectedCountry.flagEmoji} ` : ''}
                  {selectedCountry.name}
                </h2>
                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex w-fit items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-sm font-semibold text-cyan-400">
                    <MapPin size={14} />
                    <span>{selectedCountry.capital}</span>
                  </div>
                  {selectedCountry.demonym && (
                    <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-slate-300">
                      {selectedCountry.demonym}
                    </div>
                  )}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="rounded-2xl border border-slate-700/50 bg-slate-800/40 p-5"
              >
                <div className="mb-3 text-xs font-bold uppercase tracking-widest text-slate-500">
                  Travel Snapshot
                </div>
                <p className="leading-relaxed text-slate-200">{selectedCountry.travelSnapshot}</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="grid grid-cols-1 gap-4 sm:grid-cols-2"
              >
                <div className="rounded-2xl border border-slate-700/50 bg-slate-800/40 p-5">
                  <div className="mb-1 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500">
                    <Globe size={14} className="text-cyan-400" />
                    Currency
                  </div>
                  <div className="text-base font-medium text-slate-100">
                    {selectedCountry.currencies.join(', ') || selectedCountry.currency}
                  </div>
                </div>
                <div className="rounded-2xl border border-slate-700/50 bg-slate-800/40 p-5">
                  <div className="mb-1 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500">
                    <Languages size={14} className="text-emerald-400" />
                    Languages
                  </div>
                  <div className="text-base font-medium text-slate-100">
                    {selectedCountry.languages.join(', ') || 'Not available'}
                  </div>
                </div>
                <div className="rounded-2xl border border-slate-700/50 bg-slate-800/40 p-5">
                  <div className="mb-1 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500">
                    <Users size={14} className="text-purple-400" />
                    Population
                  </div>
                  <div className="text-base font-medium text-slate-100">
                    {formatPopulation(selectedCountry.population)}
                  </div>
                </div>
                <div className="rounded-2xl border border-slate-700/50 bg-slate-800/40 p-5">
                  <div className="mb-1 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500">
                    <MapPin size={14} className="text-amber-400" />
                    Area
                  </div>
                  <div className="text-base font-medium text-slate-100">
                    {formatArea(selectedCountry.areaKm2)}
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="space-y-4"
              >
                <div className="rounded-2xl border border-slate-700/50 bg-slate-800/40 p-5">
                  <div className="mb-2 text-xs font-bold uppercase tracking-widest text-slate-500">
                    Overview
                  </div>
                  <p className="leading-relaxed text-slate-300">{selectedCountry.overview}</p>
                </div>
                <div className="rounded-2xl border border-slate-700/50 bg-slate-800/40 p-5">
                  <div className="mb-2 text-xs font-bold uppercase tracking-widest text-slate-500">
                    Travel Guide Intro
                  </div>
                  <p className="leading-relaxed text-slate-300">{selectedCountry.travelGuide}</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="grid grid-cols-1 gap-4"
              >
                <div className="rounded-2xl border border-slate-700/50 bg-slate-800/40 p-5">
                  <div className="mb-2 text-xs font-bold uppercase tracking-widest text-slate-500">
                    Best Time To Visit
                  </div>
                  <p className="leading-relaxed text-slate-300">
                    {selectedCountry.bestTimeToVisit}
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-700/50 bg-slate-800/40 p-5">
                  <div className="mb-2 text-xs font-bold uppercase tracking-widest text-slate-500">
                    Getting Around
                  </div>
                  <p className="leading-relaxed text-slate-300">
                    {selectedCountry.transportTips}
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 }}
                className="grid grid-cols-1 gap-4 sm:grid-cols-2"
              >
                <div className="rounded-2xl border border-slate-700/50 bg-slate-800/40 p-5">
                  <div className="mb-2 text-xs font-bold uppercase tracking-widest text-slate-500">
                    Time Zones
                  </div>
                  <div className="text-sm leading-relaxed text-slate-300">
                    {selectedCountry.timezones.join(', ') || 'Not available'}
                  </div>
                </div>
                <div className="rounded-2xl border border-slate-700/50 bg-slate-800/40 p-5">
                  <div className="mb-2 text-xs font-bold uppercase tracking-widest text-slate-500">
                    Calling Codes
                  </div>
                  <div className="text-sm leading-relaxed text-slate-300">
                    {selectedCountry.callingCodes.join(', ') || 'Not available'}
                  </div>
                </div>
                <div className="rounded-2xl border border-slate-700/50 bg-slate-800/40 p-5">
                  <div className="mb-2 text-xs font-bold uppercase tracking-widest text-slate-500">
                    Driving Side
                  </div>
                  <div className="text-sm leading-relaxed text-slate-300 capitalize">
                    {selectedCountry.drivingSide || 'Not available'}
                  </div>
                </div>
                <div className="rounded-2xl border border-slate-700/50 bg-slate-800/40 p-5">
                  <div className="mb-2 text-xs font-bold uppercase tracking-widest text-slate-500">
                    Week Starts On
                  </div>
                  <div className="text-sm leading-relaxed text-slate-300 capitalize">
                    {selectedCountry.weekStartsOn || 'Not available'}
                  </div>
                </div>
              </motion.div>

              {selectedCountry.places.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="rounded-2xl border border-slate-700/50 bg-slate-800/40 p-5"
                >
                  <div className="mb-3 text-xs font-bold uppercase tracking-widest text-slate-500">
                    Top Destinations
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedCountry.places.map((place) => (
                      <span
                        key={place}
                        className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-sm text-slate-300"
                      >
                        {place}
                      </span>
                    ))}
                  </div>
                </motion.div>
              )}

              {selectedCountry.cities.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.55 }}
                  className="rounded-2xl border border-slate-700/50 bg-slate-800/40 p-5"
                >
                  <div className="mb-3 text-xs font-bold uppercase tracking-widest text-slate-500">
                    Cities To Base From
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedCountry.cities.map((city) => (
                      <span
                        key={city}
                        className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-sm text-slate-300"
                      >
                        {city}
                      </span>
                    ))}
                  </div>
                </motion.div>
              )}

              {selectedCountry.borderCountries.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="rounded-2xl border border-slate-700/50 bg-slate-800/40 p-5"
                >
                  <div className="mb-3 text-xs font-bold uppercase tracking-widest text-slate-500">
                    Neighboring Countries
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedCountry.borderCountries.map((border) => (
                      <span
                        key={border}
                        className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-sm text-slate-300"
                      >
                        {border}
                      </span>
                    ))}
                  </div>
                </motion.div>
              )}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.65 }}
                className="rounded-2xl border border-slate-700/50 bg-slate-800/40 p-5"
              >
                <div className="mb-3 text-xs font-bold uppercase tracking-widest text-slate-500">
                  Open Data Links
                </div>
                <div className="flex flex-wrap gap-3">
                  {selectedCountry.maps.googleMaps && (
                    <a
                      href={selectedCountry.maps.googleMaps}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm font-medium text-cyan-300 transition-colors hover:bg-cyan-400/15"
                    >
                      Google Maps
                      <ExternalLink size={14} />
                    </a>
                  )}
                  {selectedCountry.maps.openStreetMaps && (
                    <a
                      href={selectedCountry.maps.openStreetMaps}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-200 transition-colors hover:bg-white/10"
                    >
                      OpenStreetMap
                      <ExternalLink size={14} />
                    </a>
                  )}
                  {selectedCountry.maps.wikipedia && (
                    <a
                      href={selectedCountry.maps.wikipedia}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-200 transition-colors hover:bg-white/10"
                    >
                      Wikipedia
                      <ExternalLink size={14} />
                    </a>
                  )}
                  {selectedCountry.maps.wikivoyage && (
                    <a
                      href={selectedCountry.maps.wikivoyage}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-200 transition-colors hover:bg-white/10"
                    >
                      Wikivoyage
                      <ExternalLink size={14} />
                    </a>
                  )}
                </div>
              </motion.div>
            </div>

            <div className="mt-auto border-t border-slate-800/50 p-6 text-center">
              <p className="text-xs font-medium uppercase tracking-widest text-slate-500">
                Open-source travel database • Dr. Arjun Sarkar
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
