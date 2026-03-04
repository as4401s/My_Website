import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Search, X, Navigation } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { countryMetadata } from '../data/countriesData';
import type { CountryData } from '../data/countriesData';

const customIcon = new L.DivIcon({
    className: 'custom-pin',
    html: `<div style="width: 12px; height: 12px; background-color: #22d3ee; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 10px #22d3ee;"></div>`,
    iconSize: [12, 12],
    iconAnchor: [6, 6]
});

// A component to handle map flying
const MapController = ({
    center,
    zoom,
    selectedCountry
}: {
    center: [number, number],
    zoom: number,
    selectedCountry: (CountryData & { id: string }) | null
}) => {
    const map = useMap();

    useEffect(() => {
        map.flyTo(center, zoom, {
            duration: 1.5,
        });
    }, [center, zoom, map]);

    // Force resize calculation if sidebar opens/closes
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
    const [selectedCountry, setSelectedCountry] = useState<(CountryData & { id: string }) | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);

    const [mapCenter, setMapCenter] = useState<[number, number]>([20, 0]);
    const [mapZoom, setMapZoom] = useState(2);

    // Convert the dictionary to an array for searching and mapping
    const allParsedCountries = useMemo(() => {
        return Object.entries(countryMetadata).map(([id, data]) => ({
            id,
            ...data
        })).filter(c => c.lat !== undefined && c.lng !== undefined);
    }, []);

    // Curated countries have images and facts, these get pins on the map
    const curatedCountries = useMemo(() => {
        return allParsedCountries.filter(c => c.imageUrl && c.places.length > 0);
    }, [allParsedCountries]);

    const matchingCountries = useMemo(() => {
        if (!searchQuery.trim()) return [];
        return allParsedCountries.filter(c =>
            c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.capital.toLowerCase().includes(searchQuery.toLowerCase())
        ).slice(0, 5);
    }, [searchQuery, allParsedCountries]);

    const handleCountrySelect = (country: CountryData & { id: string }) => {
        setSelectedCountry(country);
        setSearchQuery("");
        setIsSearching(false);
        if (country.lat !== undefined && country.lng !== undefined) {
            // Shift center slightly to left so sidebar doesn't cover if on desktop
            setMapCenter([country.lat, country.lng]);
            setMapZoom(5);
        }
    };

    const handleClosePanel = () => {
        setSelectedCountry(null);
        setMapZoom(2);
        setMapCenter([20, 0]);
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full h-screen bg-slate-950 flex flex-col relative overflow-hidden font-sans"
        >
            {/* Header controls over map */}
            <div className="absolute top-0 left-0 right-0 z-[1000] p-6 flex justify-between items-start pointer-events-none">
                <button
                    onClick={() => navigate('/')}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-900/80 hover:bg-slate-800 text-white rounded-full backdrop-blur-md transition-all border border-slate-700 pointer-events-auto shadow-lg"
                >
                    <ArrowLeft size={16} />
                    <span className="text-sm font-medium">Portfolio</span>
                </button>

                <div className="relative pointer-events-auto">
                    <div className="relative">
                        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search country..."
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                setIsSearching(true);
                            }}
                            onFocus={() => setIsSearching(true)}
                            className="bg-slate-900/80 border border-slate-700 text-white px-11 py-2.5 rounded-full w-64 md:w-80 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 backdrop-blur-md shadow-lg transition-all"
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

                    {isSearching && matchingCountries.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="absolute top-full mt-2 left-0 right-0 bg-slate-900/95 border border-slate-700 rounded-2xl overflow-hidden backdrop-blur-xl shadow-2xl z-[1000]"
                        >
                            {matchingCountries.map((c) => (
                                <button
                                    key={c.id}
                                    onClick={() => handleCountrySelect(c)}
                                    className="w-full text-left px-4 py-3 hover:bg-slate-800 flex items-center justify-between group transition-colors border-b border-slate-800/50 last:border-0"
                                >
                                    <div>
                                        <div className="text-white font-medium">{c.name}</div>
                                        <div className="text-slate-400 text-xs">{c.capital}</div>
                                    </div>
                                    <Navigation size={14} className="text-slate-600 group-hover:text-cyan-400 transition-colors" />
                                </button>
                            ))}
                        </motion.div>
                    )}
                </div>
            </div>

            {/* Map Container */}
            <div className="flex-1 w-full h-full relative z-0">
                <MapContainer
                    center={[20, 0]}
                    zoom={2}
                    minZoom={2}
                    zoomControl={false}
                    className="w-full h-full bg-[#0f172a]"
                    worldCopyJump={true}
                >
                    {/* CartoDB Dark Matter tiles - beautifully detailed and high contrast */}
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    />

                    <MapController center={mapCenter} zoom={mapZoom} selectedCountry={selectedCountry} />

                    {/* Highly curated markers */}
                    {curatedCountries.map((country) => (
                        <Marker
                            key={`marker-${country.id}`}
                            position={[country.lat!, country.lng!]}
                            icon={customIcon}
                            eventHandlers={{
                                click: () => handleCountrySelect(country),
                            }}
                        >
                            <Popup className="dark-popup">
                                <div className="text-sm font-semibold text-slate-900">{country.name}</div>
                                <div className="text-xs text-slate-600">{country.capital}</div>
                            </Popup>
                        </Marker>
                    ))}

                    {/* Selected marker fallback (if they search for a country that isn't heavily curated) */}
                    {selectedCountry && !curatedCountries.find(c => c.id === selectedCountry.id) && selectedCountry.lat && selectedCountry.lng && (
                        <Marker
                            position={[selectedCountry.lat, selectedCountry.lng]}
                            icon={customIcon}
                        />
                    )}

                </MapContainer>
            </div>

            {/* Sidebar Details */}
            <AnimatePresence>
                {selectedCountry && (
                    <motion.div
                        initial={{ x: '100%', opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: '100%', opacity: 0 }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="absolute right-0 top-0 bottom-0 w-full md:w-[450px] bg-slate-900/40 backdrop-blur-2xl border-l border-white/5 shadow-2xl z-[1050] flex flex-col"
                    >
                        {/* Glassmorphism gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 to-transparent pointer-events-none" />

                        <button
                            onClick={handleClosePanel}
                            className="absolute top-6 right-6 p-2 rounded-full bg-slate-800/50 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors z-10"
                        >
                            <X size={20} />
                        </button>

                        <div className="flex-1 overflow-y-auto px-10 pb-16 space-y-8 scrollbar-hide pt-16">
                            {selectedCountry.imageUrl && selectedCountry.imageUrl.trim() !== "" && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.1 }}
                                    className="w-full h-56 rounded-2xl overflow-hidden border border-white/10 shadow-2xl relative"
                                >
                                    <img
                                        src={selectedCountry.imageUrl}
                                        alt={`Landmark in ${selectedCountry.name}`}
                                        className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent pointer-events-none" />
                                </motion.div>
                            )}

                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className={!selectedCountry.imageUrl ? "mt-6" : ""}>
                                <h2 className="text-5xl font-display font-black text-white mb-2 tracking-tight">
                                    {selectedCountry.name}
                                </h2>
                                <div className="flex items-center gap-2 text-cyan-400 font-semibold bg-cyan-400/10 w-fit px-3 py-1 rounded-full text-sm border border-cyan-400/20">
                                    <MapPin size={14} />
                                    <span>{selectedCountry.capital}</span>
                                </div>
                            </motion.div>

                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="space-y-6">
                                <div className="p-5 rounded-2xl bg-slate-800/40 border border-slate-700/50 hover:bg-slate-800/60 transition-colors">
                                    <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1 flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
                                        Currency
                                    </div>
                                    <div className="text-lg font-medium text-slate-200">
                                        {selectedCountry.currency}
                                    </div>
                                </div>

                                <div className="p-5 rounded-2xl bg-slate-800/40 border border-slate-700/50 hover:bg-slate-800/60 transition-colors relative overflow-hidden">
                                    <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                                        Fun Fact
                                    </div>
                                    <p className="text-slate-300 leading-relaxed relative z-10 italic">
                                        "{selectedCountry.funFact}"
                                    </p>
                                </div>

                                {selectedCountry.places.length > 0 && (
                                    <div className="p-5 rounded-2xl bg-slate-800/40 border border-slate-700/50">
                                        <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                            Top Destination
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedCountry.places.map((place, i) => (
                                                <span key={i} className="px-3 py-1.5 bg-slate-900 text-slate-300 rounded-lg text-sm border border-slate-700">
                                                    {place}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        </div>

                        <div className="mt-auto p-6 border-t border-slate-800/50 text-center">
                            <p className="text-xs text-slate-500 font-medium uppercase tracking-widest">
                                Curated Wanderlust Experience • Arjun Sarkar
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
