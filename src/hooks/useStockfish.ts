import { useRef, useState, useCallback, useEffect } from 'react';

interface StockfishHook {
    isReady: boolean;
    getBestMove: (fen: string, level: number) => Promise<string>;
    stop: () => void;
}

// Map our level 1-6 to Stockfish Skill Level (0-20) and depth
const LEVEL_CONFIG: Record<number, { skill: number; depth: number }> = {
    1: { skill: 0, depth: 1 },
    2: { skill: 3, depth: 3 },
    3: { skill: 6, depth: 5 },
    4: { skill: 10, depth: 8 },
    5: { skill: 15, depth: 10 },
    6: { skill: 20, depth: 12 },
};

export function useStockfish(): StockfishHook {
    const workerRef = useRef<Worker | null>(null);
    const [isReady, setIsReady] = useState(false);
    const resolveRef = useRef<((move: string) => void) | null>(null);

    useEffect(() => {
        let cancelled = false;

        const initEngine = () => {
            try {
                // Load Stockfish from the public directory (copied during build)
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

            // Set skill level and then issue position + go
            worker.postMessage('ucinewgame');
            worker.postMessage(`setoption name Skill Level value ${config.skill}`);
            worker.postMessage(`position fen ${fen}`);
            worker.postMessage(`go depth ${config.depth}`);

            // Timeout after 15s
            setTimeout(() => {
                if (resolveRef.current === resolve) {
                    worker.postMessage('stop'); // Force engine to return best move found so far
                }
            }, 15000);
        });
    }, []);

    const stop = useCallback(() => {
        workerRef.current?.postMessage('stop');
    }, []);

    return { isReady, getBestMove, stop };
}
