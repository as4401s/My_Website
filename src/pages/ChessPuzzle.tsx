import { useState, useCallback, useRef, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import { Chess, type Square } from 'chess.js';
import { CHESS_PUZZLES } from '../data/puzzles';
import ChessBoard3D from '../components/chess/ChessBoard3D';
import { Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, RefreshCcw, Crown, AlertTriangle } from 'lucide-react';

export default function ChessPuzzle() {
    const [currentPuzzleIndex, setCurrentPuzzleIndex] = useState(0);
    const [moveIndex, setMoveIndex] = useState(0);
    const [isSolved, setIsSolved] = useState(false);
    const [wrongMove, setWrongMove] = useState(false);
    const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
    const gameRef = useRef(new Chess(CHESS_PUZZLES[0].fen));
    const [boardState, setBoardState] = useState(gameRef.current.board());

    const puzzle = CHESS_PUZZLES[currentPuzzleIndex];
    const isGrandmaster = puzzle.difficulty === 'Grandmaster';

    // Sync board state from the game ref
    const syncBoard = useCallback(() => {
        setBoardState(gameRef.current.board());
    }, []);

    // Handle a square being clicked on the 3D board
    const handleSquareClick = useCallback((algebraic: string) => {
        if (isSolved) return;
        setWrongMove(false);

        // If nothing is selected, try to select a white piece
        if (!selectedSquare) {
            const piece = gameRef.current.get(algebraic as Square);
            if (piece && piece.color === 'w') {
                setSelectedSquare(algebraic);
            }
            return;
        }

        // Clicking the same square deselects
        if (selectedSquare === algebraic) {
            setSelectedSquare(null);
            return;
        }

        // Clicking another white piece swaps selection
        const targetPiece = gameRef.current.get(algebraic as Square);
        if (targetPiece && targetPiece.color === 'w') {
            setSelectedSquare(algebraic);
            return;
        }

        // Attempt the move
        const requiredMove = puzzle.solution[moveIndex];
        const attemptedMove = `${selectedSquare}${algebraic}`;

        if (attemptedMove === requiredMove || `${attemptedMove}q` === requiredMove) {
            // Correct move!
            try {
                gameRef.current.move({ from: selectedSquare, to: algebraic, promotion: 'q' });
                syncBoard();
                setSelectedSquare(null);

                const nextIdx = moveIndex + 1;

                if (nextIdx >= puzzle.solution.length) {
                    // Puzzle complete!
                    setIsSolved(true);
                    setMoveIndex(nextIdx);
                    return;
                }

                // Play opponent's response after a short delay
                const opponentMove = puzzle.solution[nextIdx];
                setTimeout(() => {
                    try {
                        gameRef.current.move({
                            from: opponentMove.substring(0, 2),
                            to: opponentMove.substring(2, 4),
                            promotion: 'q',
                        });
                        syncBoard();
                        const afterOpponentIdx = nextIdx + 1;
                        setMoveIndex(afterOpponentIdx);

                        // Check if puzzle is done after opponent's move
                        if (afterOpponentIdx >= puzzle.solution.length) {
                            setIsSolved(true);
                        }
                    } catch {
                        // Opponent move failed - bad puzzle data, skip
                    }
                }, 500);
            } catch {
                // Move was illegal
                setWrongMove(true);
                setSelectedSquare(null);
            }
        } else {
            // Wrong move
            setWrongMove(true);
            setSelectedSquare(null);
        }
    }, [selectedSquare, isSolved, moveIndex, puzzle, syncBoard]);

    const loadNextPuzzle = () => {
        if (currentPuzzleIndex < CHESS_PUZZLES.length - 1) {
            const nextIndex = currentPuzzleIndex + 1;
            gameRef.current = new Chess(CHESS_PUZZLES[nextIndex].fen);
            setCurrentPuzzleIndex(nextIndex);
            setBoardState(gameRef.current.board());
            setMoveIndex(0);
            setIsSolved(false);
            setWrongMove(false);
            setSelectedSquare(null);
        }
    };

    const restartPuzzle = () => {
        gameRef.current = new Chess(puzzle.fen);
        setBoardState(gameRef.current.board());
        setMoveIndex(0);
        setIsSolved(false);
        setWrongMove(false);
        setSelectedSquare(null);
    };

    return (
        <div className="min-h-screen bg-brand-dark flex flex-col items-center justify-start text-white relative overflow-hidden pt-24 pb-12">
            {/* Background */}
            <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute inset-0 bg-gradient-mesh animate-gradient-shift opacity-30" />
                <div className="absolute inset-0 bg-grid opacity-[0.1]" />
            </div>

            <div className="relative z-10 w-full max-w-7xl px-4 flex flex-col items-center">
                {/* Header */}
                <div className="w-full flex justify-between items-center mb-10">
                    <Link to="/" className="flex items-center gap-2 text-gray-400 hover:text-brand-accent transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                        <span className="font-medium">Back to Portfolio</span>
                    </Link>
                    <div className="text-right">
                        <div className={`text-xs font-mono font-bold tracking-widest uppercase mb-1 ${isGrandmaster ? 'text-amber-400' : 'text-brand-accent'}`}>
                            Puzzle {puzzle.id} / {CHESS_PUZZLES.length}
                        </div>
                        <div className="flex items-center justify-end gap-2 text-sm text-gray-400">
                            {isGrandmaster && <Crown className="w-4 h-4 text-amber-400" />}
                            {puzzle.difficulty}
                        </div>
                    </div>
                </div>

                {/* Status Bar */}
                <div className="w-full max-w-4xl glass-card p-6 rounded-2xl mb-8 flex flex-col md:flex-row items-center justify-between gap-6 border-brand-accent/20">
                    <div>
                        <h2 className="text-2xl font-display font-bold text-white mb-2">
                            {isSolved ? (
                                <span className="text-green-400 flex items-center gap-2">
                                    <CheckCircle2 className="w-6 h-6" /> Brilliant Move!
                                </span>
                            ) : wrongMove ? (
                                <span className="text-rose-400 flex items-center gap-2">
                                    <AlertTriangle className="w-6 h-6" /> Wrong move — try again
                                </span>
                            ) : (
                                "White to Move"
                            )}
                        </h2>
                        <p className="text-gray-400">{puzzle.description}</p>
                    </div>

                    <div className="flex gap-4 w-full md:w-auto">
                        <button
                            onClick={restartPuzzle}
                            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-white/5 hover:bg-white/10 text-white font-medium transition-colors border border-white/10"
                        >
                            <RefreshCcw className="w-4 h-4" /> Restart
                        </button>
                        {isSolved && currentPuzzleIndex < CHESS_PUZZLES.length - 1 && (
                            <button
                                onClick={loadNextPuzzle}
                                className="flex-1 md:flex-none px-8 py-3 rounded-full bg-brand-accent text-brand-dark font-bold hover:bg-cyan-300 transition-colors shadow-lg shadow-brand-accent/20"
                            >
                                Next Puzzle →
                            </button>
                        )}
                    </div>
                </div>

                {/* Instruction hint */}
                {!isSolved && !wrongMove && (
                    <p className="text-gray-500 text-sm mb-4">Click a white piece to select it, then click a target square. Orbit with drag.</p>
                )}

                {/* 3D Canvas */}
                <div className="w-full max-w-4xl aspect-[4/3] rounded-3xl overflow-hidden glass-card border-brand-accent/20 shadow-2xl relative">
                    <Suspense fallback={
                        <div className="absolute inset-0 flex items-center justify-center text-brand-accent font-mono animate-pulse">
                            Initializing 3D Engine...
                        </div>
                    }>
                        <Canvas camera={{ position: [0, 10, 7], fov: 40 }} shadows>
                            <color attach="background" args={['#060609']} />
                            <fog attach="fog" args={['#060609', 12, 28]} />

                            <ambientLight intensity={0.5} />
                            <directionalLight position={[8, 12, 6]} intensity={1.8} castShadow shadow-mapSize={1024} />
                            <pointLight position={[-5, 8, -5]} color="#22d3ee" intensity={1.5} />
                            <pointLight position={[5, 4, 5]} color="#f97316" intensity={0.8} />

                            <ChessBoard3D
                                board={boardState}
                                selectedSquare={selectedSquare}
                                onSquareClick={handleSquareClick}
                            />

                            <ContactShadows position={[0, -0.75, 0]} opacity={0.3} scale={15} blur={2.5} far={8} />

                            <OrbitControls
                                enablePan={false}
                                minPolarAngle={Math.PI / 8}
                                maxPolarAngle={Math.PI / 2.4}
                                minDistance={8}
                                maxDistance={18}
                                target={[0, 0, 0]}
                            />
                            <Environment preset="city" />
                        </Canvas>
                    </Suspense>
                </div>
            </div>
        </div>
    );
}
