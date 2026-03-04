import { useMemo, useState, useEffect } from 'react';
import { Chess, type Square } from 'chess.js';
import * as THREE from 'three';
import { useThree } from '@react-three/fiber';
import { Pawn, Rook, Knight, Bishop, Queen, King } from './ChessPieces';

interface ChessBoard3DProps {
    currentFen: string;
    onMoveAttempt: (from: string, to: string) => boolean;
}

// Convert algebraic coordinate 'a1'-'h8' to 3D grid space
const getSquarePosition = (square: string): [number, number, number] => {
    const file = square.charCodeAt(0) - 'a'.charCodeAt(0);
    const rank = parseInt(square.charAt(1)) - 1;
    // Center board at [0,0,0], tile width = 1
    return [file - 3.5, 0, rank - 3.5];
};

export default function ChessBoard3D({ currentFen, onMoveAttempt }: ChessBoard3DProps) {
    useThree();
    const [game, setGame] = useState(new Chess(currentFen));
    const [selectedSquare, setSelectedSquare] = useState<string | null>(null);

    // Sync internal engine when props FEN alters (puzzle changes)
    useEffect(() => {
        try {
            setGame(new Chess(currentFen));
            setSelectedSquare(null); // Reset selection
        } catch (e) { /* Catch bad FEN during hot reloads */ }
    }, [currentFen]);

    const board = game.board();

    // Procedural Materials
    const materials = useMemo(() => {
        return {
            lightSquare: new THREE.MeshStandardMaterial({
                color: '#2a2a35',
                roughness: 0.8,
                metalness: 0.2,
            }),
            darkSquare: new THREE.MeshStandardMaterial({
                color: '#13131a',
                roughness: 0.6,
                metalness: 0.4,
            }),
            highlight: new THREE.MeshStandardMaterial({
                color: '#22d3ee', // Brand accent cyan
                emissive: '#22d3ee',
                emissiveIntensity: 0.5,
                transparent: true,
                opacity: 0.5,
            }),
            edgeFrame: new THREE.MeshPhysicalMaterial({
                color: '#0d0d12',
                metalness: 0.9,
                roughness: 0.1,
                clearcoat: 1.0,
            }),
        };
    }, []);

    const handleSquareClick = (algebraic: string) => {
        // If we've selected nothing, try grabbing a piece
        if (!selectedSquare) {
            const piece = game.get(algebraic as Square);
            // Puzzles are explicitly White-only interactions
            if (piece && piece.color === 'w') {
                setSelectedSquare(algebraic);
            }
            return;
        }

        // Try moving if clicking again
        if (selectedSquare === algebraic) {
            // Deselect if clicking same square again
            setSelectedSquare(null);
        } else {
            const attemptSuccess = onMoveAttempt(selectedSquare, algebraic);
            if (!attemptSuccess) {
                // If move failed but the square clicked has another White piece, swap selection natively
                const targetPiece = game.get(algebraic as Square);
                if (targetPiece && targetPiece.color === 'w') {
                    setSelectedSquare(algebraic);
                } else {
                    setSelectedSquare(null);
                }
            } else {
                // Legal move pushed through callback cleanly
                setSelectedSquare(null);
                // Re-sync local virtual board to new prop state
                setGame(new Chess(game.fen()));
            }
        }
    };

    const renderPiece = (piece: any, indexKey: string, pos: [number, number, number]) => {
        const isWhite = piece.color === 'w';
        const props = { key: indexKey, isWhite, position: pos };

        switch (piece.type) {
            case 'p': return <Pawn {...props} />;
            case 'r': return <Rook {...props} />;
            case 'n': return <Knight {...props} />;
            case 'b': return <Bishop {...props} />;
            case 'q': return <Queen {...props} />;
            case 'k': return <King {...props} />;
            default: return null;
        }
    };

    return (
        <group>
            {/* 8x8 Tile Loop */}
            {board.map((row, rankIndex) => {
                // board mapping returns rank from 8 down to 1
                const realRank = 8 - rankIndex;
                return row.map((piece, fileIndex) => {
                    const fileChar = String.fromCharCode('a'.charCodeAt(0) + fileIndex);
                    const algebraic = `${fileChar}${realRank}`;
                    const isDark = (rankIndex + fileIndex) % 2 === 1;
                    const pos = getSquarePosition(algebraic);
                    const isSelected = selectedSquare === algebraic;

                    return (
                        <group key={algebraic} position={pos}>
                            {/* Tile Base */}
                            <mesh
                                position={[0, -0.25, 0]}
                                receiveShadow
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleSquareClick(algebraic);
                                }}
                                material={isSelected ? materials.highlight : (isDark ? materials.darkSquare : materials.lightSquare)}
                            >
                                <boxGeometry args={[1, 0.5, 1]} />
                            </mesh>

                            {/* Spawn Piece if exists */}
                            {piece && renderPiece(piece, `piece-${algebraic}`, [0, 0, 0])}

                        </group>
                    );
                });
            })}

            {/* Decorative Outer Metal Frame Border */}
            <mesh position={[0, -0.3, 0]} receiveShadow material={materials.edgeFrame}>
                <boxGeometry args={[8.4, 0.6, 8.4]} />
            </mesh>
        </group>
    );
}
