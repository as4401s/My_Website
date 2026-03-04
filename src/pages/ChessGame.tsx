import { useState, useCallback, useRef, useEffect } from 'react';
import { Chess, type Square, type Move } from 'chess.js';
import ChessBoard2D from '../components/chess/ChessBoard2D';
import GameTimer from '../components/chess/GameTimer';
import { useStockfish } from '../hooks/useStockfish';
import { Link } from 'react-router-dom';
import { ArrowLeft, RotateCcw, Flag, Zap, Clock, Crown, Cpu } from 'lucide-react';

const TIME_CONTROLS = [
    { label: '3 min', seconds: 180 },
    { label: '5 min', seconds: 300 },
    { label: '10 min', seconds: 600 },
    { label: '15 min', seconds: 900 },
    { label: '30 min', seconds: 1800 },
];

const STOCKFISH_LEVELS = [
    { level: 1, label: 'Beginner', elo: '~800' },
    { level: 2, label: 'Casual', elo: '~1100' },
    { level: 3, label: 'Intermediate', elo: '~1400' },
    { level: 4, label: 'Advanced', elo: '~1700' },
    { level: 5, label: 'Expert', elo: '~2000' },
    { level: 6, label: 'Master', elo: '~2300' },
];

type GameState = 'lobby' | 'playing' | 'gameover';

export default function ChessGame() {
    // Lobby settings
    const [selectedTime, setSelectedTime] = useState(300);
    const [selectedLevel, setSelectedLevel] = useState(3);

    // Game state
    const [gameState, setGameState] = useState<GameState>('lobby');
    const gameRef = useRef(new Chess());
    const [fen, setFen] = useState(gameRef.current.fen());
    const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
    const [legalMoves, setLegalMoves] = useState<string[]>([]);
    const [lastMove, setLastMove] = useState<{ from: string; to: string } | null>(null);
    const [result, setResult] = useState<string>('');
    const [moveHistory, setMoveHistory] = useState<string[]>([]);
    const [isThinking, setIsThinking] = useState(false);

    const { isReady: engineReady, getBestMove } = useStockfish();

    const isWhiteTurn = gameRef.current.turn() === 'w';
    const isInCheck = gameRef.current.isCheck();

    // Find king square for check highlight
    const getCheckSquare = (): string | null => {
        if (!isInCheck) return null;
        const board = gameRef.current.board();
        const kingColor = gameRef.current.turn();
        for (let r = 0; r < 8; r++) {
            for (let f = 0; f < 8; f++) {
                const p = board[r][f];
                if (p && p.type === 'k' && p.color === kingColor) {
                    return `${String.fromCharCode(97 + f)}${8 - r}`;
                }
            }
        }
        return null;
    };

    // Handle end-of-game detection
    const checkGameEnd = useCallback(() => {
        const g = gameRef.current;
        if (g.isCheckmate()) {
            const winner = g.turn() === 'w' ? 'Black' : 'White';
            setResult(`Checkmate! ${winner} wins.`);
            setGameState('gameover');
            return true;
        }
        if (g.isStalemate()) {
            setResult('Stalemate — Draw.');
            setGameState('gameover');
            return true;
        }
        if (g.isDraw()) {
            setResult('Draw.');
            setGameState('gameover');
            return true;
        }
        if (g.isThreefoldRepetition()) {
            setResult('Draw by repetition.');
            setGameState('gameover');
            return true;
        }
        return false;
    }, []);

    // Make Stockfish play
    const makeStockfishMove = useCallback(async () => {
        if (gameState !== 'playing') return;
        setIsThinking(true);
        try {
            const bestMove = await getBestMove(gameRef.current.fen(), selectedLevel);
            if (bestMove && bestMove !== '(none)' && gameState === 'playing') {
                const from = bestMove.substring(0, 2);
                const to = bestMove.substring(2, 4);
                const promotion = bestMove.length > 4 ? bestMove[4] : undefined;

                const move = gameRef.current.move({ from, to, promotion });
                if (move) {
                    setFen(gameRef.current.fen());
                    setLastMove({ from, to });
                    setMoveHistory(prev => [...prev, move.san]);
                    checkGameEnd();
                }
            }
        } catch (e) {
            console.error('Stockfish error:', e);
        }
        setIsThinking(false);
    }, [gameState, getBestMove, selectedLevel, checkGameEnd]);

    // Handle square clicks on the board
    const handleSquareClick = useCallback((square: string) => {
        if (gameState !== 'playing' || !isWhiteTurn || isThinking) return;

        const game = gameRef.current;

        // If nothing selected, try to select a white piece
        if (!selectedSquare) {
            const piece = game.get(square as Square);
            if (piece && piece.color === 'w') {
                setSelectedSquare(square);
                const moves = game.moves({ square: square as Square, verbose: true }) as Move[];
                setLegalMoves(moves.map(m => m.to));
            }
            return;
        }

        // Clicking same square deselects
        if (selectedSquare === square) {
            setSelectedSquare(null);
            setLegalMoves([]);
            return;
        }

        // Clicking another white piece swaps selection
        const targetPiece = game.get(square as Square);
        if (targetPiece && targetPiece.color === 'w') {
            setSelectedSquare(square);
            const moves = game.moves({ square: square as Square, verbose: true }) as Move[];
            setLegalMoves(moves.map(m => m.to));
            return;
        }

        // Try making the move
        if (legalMoves.includes(square)) {
            try {
                const move = game.move({
                    from: selectedSquare,
                    to: square,
                    promotion: 'q', // Auto-promote to queen
                });
                if (move) {
                    setFen(game.fen());
                    setSelectedSquare(null);
                    setLegalMoves([]);
                    setLastMove({ from: selectedSquare, to: square });
                    setMoveHistory(prev => [...prev, move.san]);

                    if (!checkGameEnd()) {
                        // Trigger Stockfish after a brief delay
                        setTimeout(() => makeStockfishMove(), 300);
                    }
                }
            } catch {
                setSelectedSquare(null);
                setLegalMoves([]);
            }
        } else {
            setSelectedSquare(null);
            setLegalMoves([]);
        }
    }, [gameState, isWhiteTurn, isThinking, selectedSquare, legalMoves, checkGameEnd, makeStockfishMove]);

    // Start a new game
    const startGame = () => {
        gameRef.current = new Chess();
        setFen(gameRef.current.fen());
        setSelectedSquare(null);
        setLegalMoves([]);
        setLastMove(null);
        setMoveHistory([]);
        setResult('');
        setIsThinking(false);
        setGameState('playing');
    };

    // Resign
    const resign = () => {
        setResult('You resigned. Black wins.');
        setGameState('gameover');
    };

    // Handle timeout
    const handleTimeout = useCallback((color: 'white' | 'black') => {
        setResult(`${color === 'white' ? 'White' : 'Black'} ran out of time. ${color === 'white' ? 'Black' : 'White'} wins!`);
        setGameState('gameover');
    }, []);

    // Scroll to top on mount
    useEffect(() => { window.scrollTo(0, 0); }, []);

    // --- LOBBY VIEW ---
    if (gameState === 'lobby') {
        return (
            <div className="min-h-screen bg-brand-dark flex flex-col items-center justify-start text-white relative overflow-hidden pt-24 pb-12">
                <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
                    <div className="absolute inset-0 bg-gradient-mesh animate-gradient-shift opacity-30" />
                    <div className="absolute inset-0 bg-grid opacity-[0.1]" />
                </div>
                <div className="relative z-10 w-full max-w-2xl px-4">
                    <Link to="/" className="flex items-center gap-2 text-gray-400 hover:text-brand-accent transition-colors mb-12">
                        <ArrowLeft className="w-5 h-5" />
                        <span className="font-medium">Back to Portfolio</span>
                    </Link>

                    <div className="text-center mb-12">
                        <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
                            Play <span className="text-gradient">Chess</span>
                        </h1>
                        <p className="text-gray-400">Challenge the Stockfish engine. Choose your settings below.</p>
                    </div>

                    {/* Time Control */}
                    <div className="glass-card p-6 rounded-2xl mb-6 border-brand-accent/10">
                        <div className="flex items-center gap-2 mb-4">
                            <Clock className="w-5 h-5 text-brand-accent" />
                            <h3 className="text-lg font-semibold">Time Control</h3>
                        </div>
                        <div className="grid grid-cols-5 gap-2">
                            {TIME_CONTROLS.map(tc => (
                                <button
                                    key={tc.seconds}
                                    onClick={() => setSelectedTime(tc.seconds)}
                                    className={`py-3 rounded-xl text-sm font-bold transition-all duration-200 ${selectedTime === tc.seconds
                                            ? 'bg-brand-accent text-brand-dark shadow-lg shadow-brand-accent/20'
                                            : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10'
                                        }`}
                                >
                                    {tc.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Engine Level */}
                    <div className="glass-card p-6 rounded-2xl mb-8 border-brand-accent/10">
                        <div className="flex items-center gap-2 mb-4">
                            <Cpu className="w-5 h-5 text-brand-accent" />
                            <h3 className="text-lg font-semibold">Stockfish Level</h3>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                            {STOCKFISH_LEVELS.map(sl => (
                                <button
                                    key={sl.level}
                                    onClick={() => setSelectedLevel(sl.level)}
                                    className={`py-3 px-2 rounded-xl text-sm transition-all duration-200 flex flex-col items-center gap-1 ${selectedLevel === sl.level
                                            ? 'bg-brand-accent text-brand-dark shadow-lg shadow-brand-accent/20'
                                            : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10'
                                        }`}
                                >
                                    <span className="font-bold">Lv.{sl.level}</span>
                                    <span className="text-[10px] opacity-75">{sl.label} ({sl.elo})</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Start Button */}
                    <button
                        onClick={startGame}
                        className="w-full py-4 rounded-2xl bg-brand-accent text-brand-dark font-bold text-lg hover:bg-cyan-300 transition-all duration-200 shadow-xl shadow-brand-accent/20 flex items-center justify-center gap-3"
                    >
                        <Zap className="w-6 h-6" />
                        Start Game
                    </button>

                    {!engineReady && (
                        <p className="text-center text-gray-500 text-sm mt-4 animate-pulse">Loading Stockfish engine...</p>
                    )}
                </div>
            </div>
        );
    }

    // --- GAME VIEW ---
    return (
        <div className="min-h-screen bg-brand-dark flex flex-col items-center justify-start text-white relative overflow-hidden pt-20 pb-8">
            <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute inset-0 bg-gradient-mesh animate-gradient-shift opacity-20" />
            </div>

            <div className="relative z-10 w-full max-w-6xl px-4">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <Link to="/" className="flex items-center gap-2 text-gray-400 hover:text-brand-accent transition-colors text-sm">
                        <ArrowLeft className="w-4 h-4" />
                        <span>Portfolio</span>
                    </Link>
                    <div className="flex items-center gap-2">
                        {isThinking && (
                            <span className="text-sm text-brand-accent animate-pulse flex items-center gap-1">
                                <Cpu className="w-4 h-4" /> Thinking...
                            </span>
                        )}
                        <span className="text-xs text-gray-500 font-mono">
                            Lv.{selectedLevel} • {TIME_CONTROLS.find(t => t.seconds === selectedTime)?.label}
                        </span>
                    </div>
                </div>

                {/* Main Layout */}
                <div className="flex flex-col lg:flex-row gap-6 items-start justify-center">
                    {/* Board */}
                    <div className="flex-shrink-0 w-full lg:w-auto">
                        <ChessBoard2D
                            fen={fen}
                            selectedSquare={selectedSquare}
                            legalMoves={legalMoves}
                            lastMove={lastMove}
                            onSquareClick={handleSquareClick}
                            isCheck={isInCheck}
                            checkSquare={getCheckSquare()}
                        />
                    </div>

                    {/* Sidebar */}
                    <div className="w-full lg:w-64 flex flex-col gap-4">
                        <GameTimer
                            initialTime={selectedTime}
                            isWhiteTurn={isWhiteTurn}
                            isGameActive={gameState === 'playing'}
                            onTimeout={handleTimeout}
                        />

                        {/* Game Over Banner */}
                        {gameState === 'gameover' && (
                            <div className="glass-card p-5 rounded-xl border-brand-accent/30 text-center">
                                <Crown className="w-8 h-8 text-amber-400 mx-auto mb-2" />
                                <p className="text-white font-bold text-lg mb-4">{result}</p>
                                <button
                                    onClick={() => { setGameState('lobby'); }}
                                    className="w-full py-3 rounded-xl bg-brand-accent text-brand-dark font-bold hover:bg-cyan-300 transition-colors"
                                >
                                    New Game
                                </button>
                            </div>
                        )}

                        {/* Controls */}
                        {gameState === 'playing' && (
                            <div className="flex gap-2">
                                <button
                                    onClick={resign}
                                    className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-rose-500/20 text-gray-300 hover:text-rose-400 font-medium transition-all border border-white/10 flex items-center justify-center gap-2 text-sm"
                                >
                                    <Flag className="w-4 h-4" /> Resign
                                </button>
                                <button
                                    onClick={() => { setGameState('lobby'); }}
                                    className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 font-medium transition-all border border-white/10 flex items-center justify-center gap-2 text-sm"
                                >
                                    <RotateCcw className="w-4 h-4" /> New
                                </button>
                            </div>
                        )}

                        {/* Move History */}
                        <div className="glass-card rounded-xl border-gray-700/30 overflow-hidden">
                            <div className="px-4 py-2.5 border-b border-gray-700/30 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                Moves
                            </div>
                            <div className="p-3 max-h-48 overflow-y-auto text-sm font-mono">
                                {moveHistory.length === 0 ? (
                                    <p className="text-gray-600 text-center py-4 text-xs">No moves yet</p>
                                ) : (
                                    <div className="flex flex-wrap gap-x-1 gap-y-0.5">
                                        {moveHistory.map((move, i) => (
                                            <span key={i} className="text-gray-300">
                                                {i % 2 === 0 && <span className="text-gray-500 mr-1">{Math.floor(i / 2) + 1}.</span>}
                                                {move}{' '}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
