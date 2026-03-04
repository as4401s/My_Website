import { useMemo } from 'react';
import * as THREE from 'three';
import { Pawn, Rook, Knight, Bishop, Queen, King } from './ChessPieces';

interface PieceData {
    type: string;
    color: string;
}

interface ChessBoard3DProps {
    board: (PieceData | null)[][];
    selectedSquare: string | null;
    onSquareClick: (algebraic: string) => void;
}

export default function ChessBoard3D({ board, selectedSquare, onSquareClick }: ChessBoard3DProps) {
    const materials = useMemo(() => ({
        lightSquare: new THREE.MeshStandardMaterial({
            color: '#d4a76a',
            roughness: 0.65,
            metalness: 0.05,
        }),
        darkSquare: new THREE.MeshStandardMaterial({
            color: '#8b5e3c',
            roughness: 0.55,
            metalness: 0.08,
        }),
        selected: new THREE.MeshStandardMaterial({
            color: '#4ade80',
            emissive: '#22c55e',
            emissiveIntensity: 0.4,
            roughness: 0.5,
        }),
        frame: new THREE.MeshStandardMaterial({
            color: '#2a1a0e',
            metalness: 0.3,
            roughness: 0.4,
        }),
    }), []);

    const renderPiece = (piece: PieceData, square: string) => {
        const isWhite = piece.color === 'w';
        const props = { key: `p-${square}`, isWhite, position: [0, 0, 0] as [number, number, number] };

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
            {/* Frame base (sits below the tiles) */}
            <mesh position={[0, -0.55, 0]} receiveShadow material={materials.frame}>
                <boxGeometry args={[9, 0.3, 9]} />
            </mesh>

            {/* 8x8 Board */}
            {board.map((row, rankIdx) => {
                // chess.js board(): rankIdx 0 = rank 8, rankIdx 7 = rank 1
                // We want rank 1 (White) closest to camera (positive Z)
                const rank = 8 - rankIdx; // rank 8..1
                return row.map((piece, fileIdx) => {
                    const fileChar = String.fromCharCode(97 + fileIdx); // a..h
                    const algebraic = `${fileChar}${rank}`;
                    const isDark = (rankIdx + fileIdx) % 2 === 1;
                    const isSelected = selectedSquare === algebraic;

                    // Position: file a=0..h=7 mapped to x, rank 8..1 mapped to z
                    // Center the board so origin is in the middle
                    const x = fileIdx - 3.5;
                    const z = rankIdx - 3.5; // rank 8 at z=-3.5 (back), rank 1 at z=3.5 (front/camera)

                    return (
                        <group key={algebraic} position={[x, 0, z]}>
                            {/* Tile */}
                            <mesh
                                position={[0, -0.25, 0]}
                                receiveShadow
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onSquareClick(algebraic);
                                }}
                                material={isSelected ? materials.selected : (isDark ? materials.darkSquare : materials.lightSquare)}
                            >
                                <boxGeometry args={[0.95, 0.15, 0.95]} />
                            </mesh>

                            {/* Piece */}
                            {piece && renderPiece(piece, algebraic)}
                        </group>
                    );
                });
            })}
        </group>
    );
}
