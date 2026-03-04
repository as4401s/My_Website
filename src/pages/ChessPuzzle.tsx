import { useState, useCallback, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import { Chess } from 'chess.js';
import { CHESS_PUZZLES } from '../data/puzzles';
import ChessBoard3D from '../components/chess/ChessBoard3D';
import { Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, RefreshCcw, Crown } from 'lucide-react';

export default function ChessPuzzle() {
    const [currentPuzzleIndex, setCurrentPuzzleIndex] = useState(0);
    const [moveIndex, setMoveIndex] = useState(0);
    const [isSolved, setIsSolved] = useState(false);
    const [game, setGame] = useState(new Chess(CHESS_PUZZLES[0].fen));

    const puzzle = CHESS_PUZZLES[currentPuzzleIndex];
    const isGrandmaster = puzzle.difficulty === 'Grandmaster';

    // Handle player attempting a move on the 3D board
    const handleMoveAttempt = useCallback((from: string, to: string) => {
        if (isSolved) return false;

        // Check if move matches the exact required solution move
        const requiredMove = puzzle.solution[moveIndex];
        if (`${from}${to}` === requiredMove || `${from}${to}q` === requiredMove) { // Added basic promotion handling
            try {
                const move = game.move({ from, to, promotion: 'q' });
                if (move) {
                    // Player's move was successful!
                    const nextMoveIndex = moveIndex + 1;

                    if (nextMoveIndex >= puzzle.solution.length) {
                        setIsSolved(true);
                        return true;
                    }

                    // Automatically play the opponent's required response (Black)
                    const opponentMoveString = puzzle.solution[nextMoveIndex];
                    setTimeout(() => {
                        const newGame = new Chess(game.fen());
                        newGame.move({
                            from: opponentMoveString.substring(0, 2),
                            to: opponentMoveString.substring(2, 4),
                            promotion: 'q'
                        });
                        setGame(newGame);
                        setMoveIndex(nextMoveIndex + 1); // Advance tracker past opponent's move
                    }, 600); // Small artificial delay for realism

                    return true; // The player's initial move was legal and correct
                }
            } catch (e) {
                return false; // Illegal move according to engine
            }
        }

        // Move was legal but wrong puzzle path, OR totally illegal
        return false;
    }, [game, isSolved, moveIndex, puzzle]);

    // Transitions to the next puzzle in the array
    const loadNextPuzzle = () => {
        if (currentPuzzleIndex < CHESS_PUZZLES.length - 1) {
            const nextIndex = currentPuzzleIndex + 1;
            setCurrentPuzzleIndex(nextIndex);
            setGame(new Chess(CHESS_PUZZLES[nextIndex].fen));
            setMoveIndex(0);
            setIsSolved(false);
        }
    };

    const restartPuzzle = () => {
        setGame(new Chess(puzzle.fen));
        setMoveIndex(0);
        setIsSolved(false);
    };

    return (
        <div className="min-h-screen bg-brand-dark flex flex-col items-center justify-start text-white relative overflow-hidden pt-24 pb-12">
            {/* Background Mesh */}
            <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute inset-0 bg-gradient-mesh animate-gradient-shift opacity-30" />
                <div className="absolute inset-0 bg-grid opacity-[0.1]" />
                <div className="absolute inset-0 bg-grain opacity-[0.15]" />
            </div>

            <div className="relative z-10 w-full max-w-7xl px-4 flex flex-col items-center">
                {/* Header Navigation */}
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

                {/* Puzzle Status Bar */}
                <div className="w-full max-w-4xl glass-card p-6 rounded-2xl mb-8 flex flex-col md:flex-row items-center justify-between gap-6 border-brand-accent/20">
                    <div>
                        <h2 className="text-2xl font-display font-bold text-white mb-2">
                            {isSolved ? (
                                <span className="text-green-400 flex items-center gap-2">
                                    <CheckCircle2 className="w-6 h-6" /> Brilliant Move!
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
                                className="flex-1 md:flex-none px-8 py-3 rounded-full bg-brand-accent text-brand-dark font-bold hover:bg-cyan-300 transition-colors shadow-lg shadow-brand-accent/20 animate-in slide-in-from-right-4 duration-300"
                            >
                                Next Puzzle
                            </button>
                        )}
                    </div>
                </div>

                {/* 3D Render Canvas */}
                <div className="w-full max-w-4xl aspect-[4/3] md:aspect-video rounded-3xl overflow-hidden glass-card border-brand-accent/20 shadow-2xl relative">
                    <Suspense fallback={
                        <div className="absolute inset-0 flex items-center justify-center text-brand-accent font-mono animate-pulse">
                            Initializing WebGL Engine...
                        </div>
                    }>
                        <Canvas camera={{ position: [0, 8, 8], fov: 45 }}>
                            <color attach="background" args={['#050508']} />
                            <fog attach="fog" args={['#050508', 10, 25]} />

                            <ambientLight intensity={0.4} />
                            <directionalLight position={[10, 10, 5]} intensity={1.5} castShadow />
                            <pointLight position={[-10, 5, -10]} color="#22d3ee" intensity={2} />

                            {/* The Chess Board Scene */}
                            <group position={[0, 0, 0]}>
                                <ChessBoard3D
                                    currentFen={game.fen()}
                                    onMoveAttempt={handleMoveAttempt}
                                />
                            </group>

                            {/* Floor Reflections */}
                            <ContactShadows position={[0, -0.6, 0]} opacity={0.4} scale={20} blur={2} far={10} />

                            <OrbitControls
                                enablePan={false}
                                minPolarAngle={Math.PI / 6}
                                maxPolarAngle={Math.PI / 2.5}
                                minDistance={8}
                                maxDistance={15}
                            />
                            <Environment preset="city" />
                        </Canvas>
                    </Suspense>
                </div>
            </div>
        </div>
    );
}
