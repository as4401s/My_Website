import { useState, useCallback, useMemo } from 'react';
import {
    ComposableMap,
    Geographies,
    Geography,
    ZoomableGroup,
} from 'react-simple-maps';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Info, X, MapPin, Landmark, Coins, Sparkles, Search } from 'lucide-react';
import type { CountryData } from '../data/countriesData';
import { getCountryData, countryMetadata } from '../data/countriesData';

const geoUrl = "/world-110m.json";

export default function TravelMap() {
    const navigate = useNavigate();
    const [selectedCountry, setSelectedCountry] = useState<CountryData | null>(null);
    const [hoveredCountryName, setHoveredCountryName] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [position, setPosition] = useState({ coordinates: [0, 0] as [number, number], zoom: 1 });

    const handleCountryClick = useCallback((geo: any) => {
        const id = geo.id || geo.properties.iso_n3;
        const data = getCountryData(id);
        if (data) {
            setSelectedCountry(data);
        } else {
            setSelectedCountry({
                name: geo.properties.name || "Unknown",
                capital: "Consulting maps...",
                currency: "N/A",
                cities: [],
                places: [],
                funFact: "Currently expanding our travel database for this region! Check back soon for more curated insights."
            });
        }
    }, []);

    const filteredCountries = useMemo(() => {
        if (!searchQuery.trim()) return [];
        return Object.values(countryMetadata).filter(c =>
            c.name.toLowerCase().includes(searchQuery.toLowerCase())
        ).slice(0, 5);
    }, [searchQuery]);

    const handleSearchSelect = (country: CountryData) => {
        setSelectedCountry(country);
        setSearchQuery("");
        // Find numeric ID to zoom? (Simplified for now)
    };

    const handleMoveEnd = (position: { coordinates: [number, number], zoom: number }) => {
        setPosition(position);
    };

    return (
        <div className="min-h-screen bg-[#020617] text-slate-200 relative overflow-hidden font-sans">
            {/* Navigation Header */}
            <header className="absolute top-0 left-0 right-0 z-50 p-6 flex items-center justify-between pointer-events-none">
                <button
                    onClick={() => navigate('/')}
                    className="pointer-events-auto flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/80 border border-slate-700 text-slate-200 hover:bg-slate-700 transition-all duration-300 shadow-lg backdrop-blur-md"
                >
                    <ArrowLeft size={18} />
                    <span className="font-medium">Portfolio</span>
                </button>

                <div className="pointer-events-auto relative group flex flex-col items-end">
                    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/80 border border-slate-700 shadow-lg backdrop-blur-md">
                        <Search size={18} className="text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search country..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-transparent border-none focus:outline-none text-sm w-32 sm:w-64 text-white"
                        />
                    </div>

                    {/* Search Dropdown */}
                    <AnimatePresence>
                        {filteredCountries.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="absolute top-12 right-0 w-64 bg-slate-800 border border-slate-700 rounded-xl mt-2 overflow-hidden shadow-2xl z-50"
                            >
                                {filteredCountries.map((c, i) => (
                                    <button
                                        key={i}
                                        onClick={() => handleSearchSelect(c)}
                                        className="w-full text-left px-4 py-3 hover:bg-slate-700 text-sm transition-colors flex items-center gap-3 border-b border-slate-700/50 last:border-none"
                                    >
                                        <MapPin size={14} className="text-cyan-400" />
                                        {c.name}
                                    </button>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </header>

            {/* Map Container */}
            <main className="w-full h-screen">
                <ComposableMap
                    projectionConfig={{ scale: 140 }}
                    style={{ width: "100%", height: "100%" }}
                >
                    <ZoomableGroup
                        center={position.coordinates}
                        zoom={position.zoom}
                        onMoveEnd={handleMoveEnd}
                    >
                        <Geographies geography={geoUrl}>
                            {({ geographies }: { geographies: any[] }) =>
                                geographies.map((geo: any) => {
                                    const id = geo.id || geo.properties.iso_n3;
                                    const isCurated = !!getCountryData(id);
                                    const isSelected = selectedCountry?.name === (geo.properties.name || geo.properties.NAME);

                                    return (
                                        <Geography
                                            key={geo.rsmKey}
                                            geography={geo}
                                            onMouseEnter={() => setHoveredCountryName(geo.properties.name || geo.properties.NAME)}
                                            onMouseLeave={() => setHoveredCountryName(null)}
                                            onClick={() => handleCountryClick(geo)}
                                            style={{
                                                default: {
                                                    fill: isSelected ? "#22d3ee" : (isCurated ? "#1e293b" : "#0f172a"),
                                                    stroke: "#334155",
                                                    strokeWidth: 0.5,
                                                    outline: "none",
                                                },
                                                hover: {
                                                    fill: "#22d3ee",
                                                    stroke: "#22d3ee",
                                                    strokeWidth: 0.75,
                                                    outline: "none",
                                                    cursor: "pointer",
                                                },
                                                pressed: {
                                                    fill: "#0891b2",
                                                    stroke: "#0891b2",
                                                    outline: "none",
                                                },
                                            }}
                                            className="transition-all duration-300"
                                        />
                                    );
                                })
                            }
                        </Geographies>
                    </ZoomableGroup>
                </ComposableMap>

                {/* Floating Tooltip */}
                {hoveredCountryName && !selectedCountry && (
                    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 px-6 py-2 bg-slate-800/90 border border-slate-700 rounded-full shadow-2xl backdrop-blur-md text-cyan-400 font-bold pointer-events-none animate-in fade-in slide-in-from-bottom-2">
                        {hoveredCountryName}
                    </div>
                )}
            </main>

            {/* Detail Overlay */}
            <AnimatePresence mode="wait">
                {selectedCountry && (
                    <motion.div
                        initial={{ opacity: 0, x: 100 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 100 }}
                        className="absolute top-0 right-0 w-full sm:w-[450px] h-full bg-slate-900/95 backdrop-blur-2xl border-l border-white/10 z-[100] shadow-2xl flex flex-col pt-24"
                    >
                        <button
                            onClick={() => setSelectedCountry(null)}
                            className="absolute top-8 right-8 p-3 rounded-full bg-slate-800 text-white hover:bg-slate-700 transition-all border border-slate-700 active:scale-95"
                        >
                            <X size={20} />
                        </button>

                        <div className="flex-1 overflow-y-auto px-10 pb-16 space-y-10 scrollbar-hide">
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                                <h2 className="text-5xl font-display font-black text-white mb-2 tracking-tight">
                                    {selectedCountry.name}
                                </h2>
                                <div className="flex items-center gap-2 text-cyan-400 font-semibold bg-cyan-400/10 w-fit px-3 py-1 rounded-full text-sm">
                                    <MapPin size={14} />
                                    <span>{selectedCountry.capital}</span>
                                </div>
                            </motion.div>

                            <div className="space-y-6">
                                <div className="group p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-cyan-500/50 transition-colors">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-2.5 rounded-xl bg-orange-500/20 text-orange-400">
                                            <Coins size={22} />
                                        </div>
                                        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500">Currency</h3>
                                    </div>
                                    <p className="text-xl font-bold text-slate-100">{selectedCountry.currency}</p>
                                </div>

                                <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-emerald-500/50 transition-colors">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400">
                                            <Sparkles size={22} />
                                        </div>
                                        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500">Fun Fact</h3>
                                    </div>
                                    <p className="text-lg text-slate-300 leading-relaxed font-medium italic">
                                        "{selectedCountry.funFact}"
                                    </p>
                                </div>
                            </div>

                            {selectedCountry.places.length > 0 && (
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 text-white font-bold border-b border-white/10 pb-3">
                                        <Landmark size={20} className="text-cyan-400" />
                                        <span>Top Destinations</span>
                                    </div>
                                    <div className="grid grid-cols-1 gap-2">
                                        {selectedCountry.places.map((place, i) => (
                                            <motion.div
                                                key={i}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.3 + i * 0.1 }}
                                                className="px-4 py-3 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-200 text-sm font-medium hover:bg-slate-700 transition-colors cursor-default"
                                            >
                                                {place}
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {selectedCountry.cities.length > 0 && (
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 text-white font-bold border-b border-white/10 pb-3">
                                        <Info size={20} className="text-cyan-400" />
                                        <span>Notable Cities</span>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedCountry.cities.map((city, i) => (
                                            <span key={i} className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-400 text-xs">
                                                {city}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="p-10 border-t border-white/5 bg-black/20">
                            <p className="text-[10px] text-slate-600 uppercase tracking-widest font-bold">
                                Curated Wanderlust Experience • Arjun Sarkar
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[150px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-purple-600/10 rounded-full blur-[150px] pointer-events-none" />
        </div>
    );
}
