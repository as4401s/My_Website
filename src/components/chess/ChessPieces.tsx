import { useMemo } from 'react';
import * as THREE from 'three';

// --- SHARED MATERIALS ---
const useWoodMaterials = (isWhite: boolean) => {
    return useMemo(() => {
        const base = isWhite
            ? new THREE.MeshStandardMaterial({ color: '#f5e6c8', roughness: 0.6, metalness: 0.05 })
            : new THREE.MeshStandardMaterial({ color: '#3d2b1f', roughness: 0.5, metalness: 0.08 });
        const accent = isWhite
            ? new THREE.MeshStandardMaterial({ color: '#e8d5a8', roughness: 0.5, metalness: 0.1 })
            : new THREE.MeshStandardMaterial({ color: '#2a1a10', roughness: 0.4, metalness: 0.12 });
        return { base, accent };
    }, [isWhite]);
};

// --- PROPS ---
export interface PieceProps {
    isWhite: boolean;
    position?: [number, number, number];
}

// Scale factor to fit pieces on 0.95-unit tiles
const S = 0.28;

// --- PAWN ---
export function Pawn({ isWhite, position = [0, 0, 0] }: PieceProps) {
    const { base, accent } = useWoodMaterials(isWhite);
    return (
        <group position={position} scale={S}>
            {/* Base */}
            <mesh position={[0, 0.15, 0]} material={base} castShadow>
                <cylinderGeometry args={[0.5, 0.6, 0.3, 24]} />
            </mesh>
            {/* Collar */}
            <mesh position={[0, 0.4, 0]} material={accent} castShadow>
                <cylinderGeometry args={[0.35, 0.45, 0.2, 24]} />
            </mesh>
            {/* Body taper */}
            <mesh position={[0, 0.85, 0]} material={base} castShadow>
                <cylinderGeometry args={[0.18, 0.3, 0.7, 24]} />
            </mesh>
            {/* Head ball */}
            <mesh position={[0, 1.35, 0]} material={accent} castShadow>
                <sphereGeometry args={[0.25, 24, 24]} />
            </mesh>
        </group>
    );
}

// --- ROOK ---
export function Rook({ isWhite, position = [0, 0, 0] }: PieceProps) {
    const { base, accent } = useWoodMaterials(isWhite);
    return (
        <group position={position} scale={S}>
            {/* Base */}
            <mesh position={[0, 0.15, 0]} material={base} castShadow>
                <cylinderGeometry args={[0.55, 0.65, 0.3, 24]} />
            </mesh>
            {/* Body */}
            <mesh position={[0, 0.85, 0]} material={accent} castShadow>
                <cylinderGeometry args={[0.35, 0.45, 1.1, 24]} />
            </mesh>
            {/* Battlements top */}
            <mesh position={[0, 1.55, 0]} material={base} castShadow>
                <cylinderGeometry args={[0.45, 0.4, 0.3, 6]} />
            </mesh>
            {/* Crown indent */}
            <mesh position={[0, 1.7, 0]} material={accent} castShadow>
                <cylinderGeometry args={[0.3, 0.35, 0.1, 6]} />
            </mesh>
        </group>
    );
}

// --- KNIGHT ---
export function Knight({ isWhite, position = [0, 0, 0] }: PieceProps) {
    const { base, accent } = useWoodMaterials(isWhite);
    return (
        <group position={position} scale={S}>
            {/* Base */}
            <mesh position={[0, 0.15, 0]} material={base} castShadow>
                <cylinderGeometry args={[0.5, 0.6, 0.3, 24]} />
            </mesh>
            {/* Neck */}
            <mesh position={[0, 0.8, 0]} material={accent} castShadow>
                <cylinderGeometry args={[0.25, 0.4, 1, 24]} />
            </mesh>
            {/* Head (angled block for horse head shape) */}
            <mesh position={[0.05, 1.45, 0]} rotation={[0, 0, 0.15]} material={base} castShadow>
                <boxGeometry args={[0.5, 0.6, 0.35]} />
            </mesh>
            {/* Snout */}
            <mesh position={[-0.15, 1.6, 0]} rotation={[0, 0, 0.3]} material={accent} castShadow>
                <boxGeometry args={[0.3, 0.25, 0.28]} />
            </mesh>
        </group>
    );
}

// --- BISHOP ---
export function Bishop({ isWhite, position = [0, 0, 0] }: PieceProps) {
    const { base, accent } = useWoodMaterials(isWhite);
    return (
        <group position={position} scale={S}>
            {/* Base */}
            <mesh position={[0, 0.15, 0]} material={base} castShadow>
                <cylinderGeometry args={[0.5, 0.6, 0.3, 24]} />
            </mesh>
            {/* Collar */}
            <mesh position={[0, 0.4, 0]} material={accent} castShadow>
                <cylinderGeometry args={[0.35, 0.45, 0.2, 24]} />
            </mesh>
            {/* Body taper */}
            <mesh position={[0, 1.0, 0]} material={base} castShadow>
                <cylinderGeometry args={[0.15, 0.3, 1, 24]} />
            </mesh>
            {/* Mitre (pointed hat) */}
            <mesh position={[0, 1.6, 0]} material={accent} castShadow>
                <sphereGeometry args={[0.22, 24, 24]} />
            </mesh>
            {/* Tip ball */}
            <mesh position={[0, 1.85, 0]} material={base} castShadow>
                <sphereGeometry args={[0.08, 16, 16]} />
            </mesh>
        </group>
    );
}

// --- QUEEN ---
export function Queen({ isWhite, position = [0, 0, 0] }: PieceProps) {
    const { base, accent } = useWoodMaterials(isWhite);
    return (
        <group position={position} scale={S}>
            {/* Base */}
            <mesh position={[0, 0.15, 0]} material={base} castShadow>
                <cylinderGeometry args={[0.55, 0.7, 0.3, 24]} />
            </mesh>
            {/* Collar */}
            <mesh position={[0, 0.4, 0]} material={accent} castShadow>
                <cylinderGeometry args={[0.4, 0.5, 0.2, 24]} />
            </mesh>
            {/* Body */}
            <mesh position={[0, 1.1, 0]} material={base} castShadow>
                <cylinderGeometry args={[0.18, 0.35, 1.2, 24]} />
            </mesh>
            {/* Crown flare */}
            <mesh position={[0, 1.8, 0]} material={accent} castShadow>
                <cylinderGeometry args={[0.3, 0.15, 0.25, 12]} />
            </mesh>
            {/* Crown ball */}
            <mesh position={[0, 2.0, 0]} material={base} castShadow>
                <sphereGeometry args={[0.12, 16, 16]} />
            </mesh>
        </group>
    );
}

// --- KING ---
export function King({ isWhite, position = [0, 0, 0] }: PieceProps) {
    const { base, accent } = useWoodMaterials(isWhite);
    return (
        <group position={position} scale={S}>
            {/* Base */}
            <mesh position={[0, 0.15, 0]} material={base} castShadow>
                <cylinderGeometry args={[0.55, 0.7, 0.3, 24]} />
            </mesh>
            {/* Collar */}
            <mesh position={[0, 0.4, 0]} material={accent} castShadow>
                <cylinderGeometry args={[0.4, 0.5, 0.2, 24]} />
            </mesh>
            {/* Body */}
            <mesh position={[0, 1.15, 0]} material={base} castShadow>
                <cylinderGeometry args={[0.22, 0.35, 1.3, 24]} />
            </mesh>
            {/* Crown band */}
            <mesh position={[0, 1.9, 0]} material={accent} castShadow>
                <cylinderGeometry args={[0.32, 0.22, 0.25, 8]} />
            </mesh>
            {/* Cross vertical */}
            <mesh position={[0, 2.2, 0]} material={base} castShadow>
                <boxGeometry args={[0.08, 0.35, 0.08]} />
            </mesh>
            {/* Cross horizontal */}
            <mesh position={[0, 2.25, 0]} material={base} castShadow>
                <boxGeometry args={[0.25, 0.08, 0.08]} />
            </mesh>
        </group>
    );
}
