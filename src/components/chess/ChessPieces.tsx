import { useMemo } from 'react';
import * as THREE from 'three';
import { Color } from 'three';

// --- SHARED MATERIALS ---
export const useChessMaterials = (isWhite: boolean) => {
    return useMemo(() => {
        const baseColor = isWhite ? new Color('#ffffff') : new Color('#1a1a2e');
        const emissiveColor = isWhite ? new Color('#22d3ee') : new Color('#f97316');

        return {
            glass: new THREE.MeshPhysicalMaterial({
                color: baseColor,
                metalness: 0.2,
                roughness: 0.1,
                transmission: 0.9,
                thickness: 0.5,
                clearcoat: 1,
                clearcoatRoughness: 0.1,
            }),
            neon: new THREE.MeshStandardMaterial({
                color: emissiveColor,
                emissive: emissiveColor,
                emissiveIntensity: 2,
                toneMapped: false,
            }),
            solid: new THREE.MeshStandardMaterial({
                color: baseColor,
                metalness: 0.8,
                roughness: 0.2,
            })
        };
    }, [isWhite]);
};

// --- BASE COMPONENT PROPS ---
export interface PieceProps {
    isWhite: boolean;
    position?: [number, number, number];
}

// --- PAWN ---
export function Pawn({ isWhite, position = [0, 0, 0] }: PieceProps) {
    const materials = useChessMaterials(isWhite);
    return (
        <group position={position}>
            {/* Base */}
            <mesh position={[0, 0.1, 0]} material={materials.glass} castShadow>
                <cylinderGeometry args={[0.3, 0.4, 0.2, 32]} />
            </mesh>
            {/* Body */}
            <mesh position={[0, 0.6, 0]} material={materials.glass} castShadow>
                <cylinderGeometry args={[0.15, 0.25, 0.8, 32]} />
            </mesh>
            {/* Neon Core Ring */}
            <mesh position={[0, 0.5, 0]} material={materials.neon}>
                <torusGeometry args={[0.2, 0.02, 16, 32]} />
            </mesh>
            {/* Head */}
            <mesh position={[0, 1.1, 0]} material={materials.solid} castShadow>
                <sphereGeometry args={[0.25, 32, 32]} />
            </mesh>
        </group>
    );
}

// --- ROOK ---
export function Rook({ isWhite, position = [0, 0, 0] }: PieceProps) {
    const materials = useChessMaterials(isWhite);
    return (
        <group position={position}>
            <mesh position={[0, 0.15, 0]} material={materials.glass} castShadow>
                <cylinderGeometry args={[0.4, 0.45, 0.3, 32]} />
            </mesh>
            <mesh position={[0, 0.8, 0]} material={materials.glass} castShadow>
                <cylinderGeometry args={[0.3, 0.35, 1, 32]} />
            </mesh>
            {/* Tower Crown */}
            <mesh position={[0, 1.4, 0]} material={materials.solid} castShadow>
                <cylinderGeometry args={[0.35, 0.35, 0.2, 6]} />
            </mesh>
            {/* Twin Neon Rings */}
            <mesh position={[0, 0.5, 0]} material={materials.neon}>
                <torusGeometry args={[0.32, 0.02, 16, 32]} />
            </mesh>
            <mesh position={[0, 1.1, 0]} material={materials.neon}>
                <torusGeometry args={[0.32, 0.02, 16, 32]} />
            </mesh>
        </group>
    );
}

// --- KNIGHT ---
export function Knight({ isWhite, position = [0, 0, 0] }: PieceProps) {
    const materials = useChessMaterials(isWhite);
    return (
        <group position={position}>
            <mesh position={[0, 0.15, 0]} material={materials.glass} castShadow>
                <cylinderGeometry args={[0.35, 0.4, 0.3, 32]} />
            </mesh>
            {/* Abstract Head/Body Curve */}
            <mesh position={[0.1, 0.8, 0]} rotation={[0, 0, 0.2]} material={materials.glass} castShadow>
                <boxGeometry args={[0.4, 1.2, 0.3]} />
            </mesh>
            {/* Snout */}
            <mesh position={[-0.15, 1.2, 0]} rotation={[0, 0, 0.5]} material={materials.solid} castShadow>
                <cylinderGeometry args={[0.15, 0.2, 0.5, 32]} />
            </mesh>
            {/* Neon Eye/Core */}
            <mesh position={[-0.1, 1.3, 0.16]} material={materials.neon}>
                <circleGeometry args={[0.05, 16]} />
            </mesh>
            <mesh position={[-0.1, 1.3, -0.16]} rotation={[0, Math.PI, 0]} material={materials.neon}>
                <circleGeometry args={[0.05, 16]} />
            </mesh>
        </group>
    );
}

// --- BISHOP ---
export function Bishop({ isWhite, position = [0, 0, 0] }: PieceProps) {
    const materials = useChessMaterials(isWhite);
    return (
        <group position={position}>
            <mesh position={[0, 0.1, 0]} material={materials.glass} castShadow>
                <cylinderGeometry args={[0.3, 0.35, 0.2, 32]} />
            </mesh>
            <mesh position={[0, 0.8, 0]} material={materials.glass} castShadow>
                <cylinderGeometry args={[0.15, 0.25, 1.2, 32]} />
            </mesh>
            <mesh position={[0, 1.5, 0]} material={materials.neon}>
                <octahedronGeometry args={[0.2]} />
            </mesh>
            <mesh position={[0, 1.7, 0]} material={materials.solid} castShadow>
                <sphereGeometry args={[0.05, 16, 16]} />
            </mesh>
        </group>
    );
}

// --- QUEEN ---
export function Queen({ isWhite, position = [0, 0, 0] }: PieceProps) {
    const materials = useChessMaterials(isWhite);
    return (
        <group position={position}>
            <mesh position={[0, 0.15, 0]} material={materials.glass} castShadow>
                <cylinderGeometry args={[0.4, 0.5, 0.3, 32]} />
            </mesh>
            <mesh position={[0, 1.0, 0]} material={materials.glass} castShadow>
                <cylinderGeometry args={[0.15, 0.35, 1.6, 32]} />
            </mesh>
            {/* Elegant Crown */}
            <mesh position={[0, 1.9, 0]} material={materials.solid} castShadow>
                <cylinderGeometry args={[0.3, 0.1, 0.3, 12]} />
            </mesh>
            {/* Floating Neon Halo */}
            <mesh position={[0, 2.2, 0]} rotation={[Math.PI / 2, 0, 0]} material={materials.neon}>
                <torusGeometry args={[0.25, 0.03, 16, 32]} />
            </mesh>
            {/* Body rings */}
            <mesh position={[0, 0.7, 0]} material={materials.neon}>
                <torusGeometry args={[0.28, 0.02, 16, 32]} />
            </mesh>
            <mesh position={[0, 1.4, 0]} material={materials.neon}>
                <torusGeometry args={[0.2, 0.02, 16, 32]} />
            </mesh>
        </group>
    );
}

// --- KING ---
export function King({ isWhite, position = [0, 0, 0] }: PieceProps) {
    const materials = useChessMaterials(isWhite);
    return (
        <group position={position}>
            <mesh position={[0, 0.15, 0]} material={materials.glass} castShadow>
                <cylinderGeometry args={[0.4, 0.5, 0.3, 32]} />
            </mesh>
            <mesh position={[0, 1.0, 0]} material={materials.glass} castShadow>
                <cylinderGeometry args={[0.2, 0.35, 1.6, 32]} />
            </mesh>
            {/* Sharp Crown */}
            <mesh position={[0, 2.0, 0]} material={materials.solid} castShadow>
                <cylinderGeometry args={[0.35, 0.2, 0.4, 8]} />
            </mesh>
            {/* The Cross */}
            <group position={[0, 2.4, 0]}>
                <mesh material={materials.neon}>
                    <boxGeometry args={[0.1, 0.3, 0.1]} />
                </mesh>
                <mesh position={[0, 0.05, 0]} material={materials.neon}>
                    <boxGeometry args={[0.3, 0.1, 0.1]} />
                </mesh>
            </group>
            {/* Core rings */}
            <mesh position={[0, 0.8, 0]} material={materials.neon}>
                <torusGeometry args={[0.3, 0.03, 16, 32]} />
            </mesh>
        </group>
    );
}
