import { useRef, useState, useCallback, useEffect } from 'react';

interface StockfishHook {
    isReady: boolean;
    getBestMove: (fen: string, level: number) => Promise<string>;
    stop: () => void;
}

// Use UCI_LimitStrength + UCI_Elo for accurate level simulation
// Also use movetime to give natural "thinking" pauses
const LEVEL_CONFIG: Record<number, { elo: number; depth: number; moveTimeMs: number }> = {
    1: { elo: 600, depth: 1, moveTimeMs: 200 },
    2: { elo: 900, depth: 3, moveTimeMs: 400 },
    3: { elo: 1200, depth: 5, moveTimeMs: 600 },
    4: { elo: 1500, depth: 8, moveTimeMs: 1000 },
    5: { elo: 1800, depth: 12, moveTimeMs: 1500 },
    6: { elo: 2200, depth: 16, moveTimeMs: 2000 },
};

export function useStockfish(): StockfishHook {
    const workerRef = useRef<Worker | null>(null);
    const [isReady, setIsReady] = useState(false);
    const resolveRef = useRef<((move: string) => void) | null>(null);

    useEffect(() => {
        let cancelled = false;

        const initEngine = () => {
            try {
                const worker = new Worker('/stockfish.js');
                workerRef.current = worker;

                worker.onmessage = (e: MessageEvent) => {
                    const line = typeof e.data === 'string' ? e.data : '';

                    if (line.includes('readyok') && !cancelled) {
                        setIsReady(true);
                    }

                    if (line.startsWith('bestmove')) {
                        const move = line.split(' ')[1];
                        if (move && resolveRef.current) {
                            resolveRef.current(move);
                            resolveRef.current = null;
                        }
                    }
                };

                worker.onerror = (err) => {
                    console.warn('Stockfish worker error, trying CDN fallback...', err);
                    worker.terminate();
                    initCDNFallback();
                };

                worker.postMessage('uci');
                worker.postMessage('isready');
            } catch (err) {
                console.warn('Local Stockfish failed, trying CDN...', err);
                initCDNFallback();
            }
        };

        const initCDNFallback = () => {
            try {
                const blob = new Blob(
                    [`importScripts('https://cdn.jsdelivr.net/npm/stockfish@16.0.0/src/stockfish-nnue-16-single.js');`],
                    { type: 'application/javascript' }
                );
                const worker = new Worker(URL.createObjectURL(blob));
                workerRef.current = worker;

                worker.onmessage = (e: MessageEvent) => {
                    const line = typeof e.data === 'string' ? e.data : '';
                    if (line.includes('readyok') && !cancelled) setIsReady(true);
                    if (line.startsWith('bestmove')) {
                        const move = line.split(' ')[1];
                        if (move && resolveRef.current) {
                            resolveRef.current(move);
                            resolveRef.current = null;
                        }
                    }
                };

                worker.postMessage('uci');
                worker.postMessage('isready');
            } catch (err2) {
                console.error('All Stockfish init methods failed:', err2);
            }
        };

        initEngine();

        return () => {
            cancelled = true;
            workerRef.current?.terminate();
            workerRef.current = null;
        };
    }, []);

    const getBestMove = useCallback((fen: string, level: number): Promise<string> => {
        return new Promise((resolve, reject) => {
            const worker = workerRef.current;
            if (!worker) {
                reject(new Error('Engine not initialized'));
                return;
            }

            const config = LEVEL_CONFIG[level] || LEVEL_CONFIG[3];
            resolveRef.current = resolve;

            // Configure engine strength
            worker.postMessage('ucinewgame');
            worker.postMessage(`setoption name UCI_LimitStrength value true`);
            worker.postMessage(`setoption name UCI_Elo value ${config.elo}`);
            worker.postMessage(`position fen ${fen}`);

            // Use movetime for a natural thinking pause, capped by depth
            worker.postMessage(`go depth ${config.depth} movetime ${config.moveTimeMs}`);

            // Safety timeout after 20s — force engine to return whatever it has
            setTimeout(() => {
                if (resolveRef.current === resolve) {
                    worker.postMessage('stop');
                }
            }, 20000);
        });
    }, []);

    const stop = useCallback(() => {
        workerRef.current?.postMessage('stop');
    }, []);

    return { isReady, getBestMove, stop };
}
