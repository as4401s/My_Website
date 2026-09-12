import { useRef, useState, useCallback, useEffect } from 'react';

interface StockfishHook {
    isReady: boolean;
    error: string | null;
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
    const [error, setError] = useState<string | null>(null);
    const pendingRef = useRef<{ resolve: (move: string) => void; reject: (error: Error) => void; timer: ReturnType<typeof setTimeout> } | null>(null);
    const queueRef = useRef<Promise<unknown>>(Promise.resolve());

    useEffect(() => {
        let worker: Worker | null = null;
        const fail = () => {
            setIsReady(false);
            setError('Could not load the chess engine. Reload this page to try again.');
            if (pendingRef.current) {
                clearTimeout(pendingRef.current.timer);
                pendingRef.current.reject(new Error('Engine unavailable'));
                pendingRef.current = null;
            }
            worker?.terminate();
            workerRef.current = null;
        };
        const initTimeout = setTimeout(fail, 30000);
        try {
            worker = new Worker('/stockfish.js');
            workerRef.current = worker;
            worker.onmessage = (event: MessageEvent) => {
                const line = typeof event.data === 'string' ? event.data : '';
                if (line === 'readyok') {
                    clearTimeout(initTimeout);
                    setIsReady(true);
                }
                if (line.startsWith('bestmove ') && pendingRef.current) {
                    const pending = pendingRef.current;
                    pendingRef.current = null;
                    clearTimeout(pending.timer);
                    pending.resolve(line.split(' ')[1]);
                }
            };
            worker.onerror = fail;
            worker.postMessage('uci');
            worker.postMessage('isready');
        } catch { fail(); }
        return () => {
            clearTimeout(initTimeout);
            worker?.terminate();
            workerRef.current = null;
            if (pendingRef.current) {
                clearTimeout(pendingRef.current.timer);
                pendingRef.current.reject(new Error('Engine closed'));
                pendingRef.current = null;
            }
        };
    }, []);

    const getBestMove = useCallback((fen: string, level: number): Promise<string> => {
        // UCI responses carry no request ID, so searches must be serialized.
        const request = queueRef.current.then(() => new Promise<string>((resolve, reject) => {
            const worker = workerRef.current;
            if (!worker) { reject(new Error('Engine unavailable')); return; }
            const config = LEVEL_CONFIG[level] || LEVEL_CONFIG[3];
            const timer = setTimeout(() => {
                pendingRef.current = null;
                worker.terminate();
                workerRef.current = null;
                setIsReady(false);
                setError('The chess engine timed out. Reload this page to try again.');
                reject(new Error('Engine timed out'));
            }, 20000);
            pendingRef.current = { resolve, reject, timer };
            worker.postMessage('ucinewgame');
            worker.postMessage('setoption name UCI_LimitStrength value true');
            worker.postMessage(`setoption name UCI_Elo value ${config.elo}`);
            worker.postMessage(`position fen ${fen}`);
            worker.postMessage(`go depth ${config.depth} movetime ${config.moveTimeMs}`);
        }));
        queueRef.current = request.catch(() => undefined);
        return request;
    }, []);

    const stop = useCallback(() => { workerRef.current?.postMessage('stop'); }, []);
    return { isReady, error, getBestMove, stop };
}
