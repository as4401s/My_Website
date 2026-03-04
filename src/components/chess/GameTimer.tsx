import { useState, useEffect, useRef } from 'react';

interface GameTimerProps {
    initialTime: number; // seconds
    isWhiteTurn: boolean;
    isGameActive: boolean;
    onTimeout: (color: 'white' | 'black') => void;
}

export default function GameTimer({ initialTime, isWhiteTurn, isGameActive, onTimeout }: GameTimerProps) {
    const [whiteTime, setWhiteTime] = useState(initialTime);
    const [blackTime, setBlackTime] = useState(initialTime);
    const lastTickRef = useRef<number>(Date.now());
    const rafRef = useRef<ReturnType<typeof setInterval> | null>(null);

    // Reset timers when initialTime changes (new game)
    useEffect(() => {
        setWhiteTime(initialTime);
        setBlackTime(initialTime);
    }, [initialTime]);

    // High-precision timer using Date.now() delta tracking
    useEffect(() => {
        if (rafRef.current) {
            clearInterval(rafRef.current);
            rafRef.current = null;
        }

        if (!isGameActive) return;

        // Reset the last-tick reference each time the active turn switches
        lastTickRef.current = Date.now();

        rafRef.current = setInterval(() => {
            const now = Date.now();
            const elapsed = (now - lastTickRef.current) / 1000;
            lastTickRef.current = now;

            if (isWhiteTurn) {
                setWhiteTime(prev => {
                    const next = prev - elapsed;
                    if (next <= 0) {
                        clearInterval(rafRef.current!);
                        onTimeout('white');
                        return 0;
                    }
                    return next;
                });
            } else {
                setBlackTime(prev => {
                    const next = prev - elapsed;
                    if (next <= 0) {
                        clearInterval(rafRef.current!);
                        onTimeout('black');
                        return 0;
                    }
                    return next;
                });
            }
        }, 100); // Tick every 100ms for precise tracking

        return () => {
            if (rafRef.current) clearInterval(rafRef.current);
        };
    }, [isWhiteTurn, isGameActive, onTimeout]);

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = Math.floor(seconds % 60);
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    return (
        <div className="flex flex-col gap-3 w-full">
            {/* Black timer (top) */}
            <div className={`flex items-center justify-between px-5 py-3 rounded-xl transition-all duration-300 ${!isWhiteTurn && isGameActive
                    ? 'bg-gray-800 border-2 border-rose-500/60 shadow-lg shadow-rose-500/10'
                    : 'bg-gray-800/50 border border-gray-700/50'
                }`}>
                <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full bg-gray-900 border-2 border-gray-600" />
                    <span className="text-sm font-medium text-gray-300">Stockfish</span>
                </div>
                <span className={`font-mono text-xl font-bold tabular-nums ${!isWhiteTurn && isGameActive ? 'text-white' : 'text-gray-400'
                    }`}>
                    {formatTime(blackTime)}
                </span>
            </div>

            {/* White timer (bottom) */}
            <div className={`flex items-center justify-between px-5 py-3 rounded-xl transition-all duration-300 ${isWhiteTurn && isGameActive
                    ? 'bg-gray-100 border-2 border-brand-accent/60 shadow-lg shadow-brand-accent/10'
                    : 'bg-gray-200/10 border border-gray-600/50'
                }`}>
                <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full bg-gray-100 border-2 border-gray-300" />
                    <span className={`text-sm font-medium ${isWhiteTurn && isGameActive ? 'text-gray-800' : 'text-gray-400'}`}>You</span>
                </div>
                <span className={`font-mono text-xl font-bold tabular-nums ${isWhiteTurn && isGameActive ? 'text-gray-900' : 'text-gray-400'
                    }`}>
                    {formatTime(whiteTime)}
                </span>
            </div>
        </div>
    );
}
