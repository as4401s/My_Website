import { useRef, useEffect, useMemo, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface ParticleFieldProps {
  count?: number;
  isMobile?: boolean;
}

function ParticleField({ count = 60, isMobile = false }: ParticleFieldProps) {
  const meshRef = useRef<THREE.Points>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const { viewport } = useThree();

  // Reduce mouse interaction on mobile for better performance
  const mouseInteractionEnabled = !isMobile;

  // Create particles data
  const [positions, velocities] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10;
      
      vel[i * 3] = (Math.random() - 0.5) * 0.01;
      vel[i * 3 + 1] = (Math.random() - 0.5) * 0.01;
      vel[i * 3 + 2] = 0;
    }
    
    return [pos, vel];
  }, [count]);

  useEffect(() => {
    if (!mouseInteractionEnabled) return;

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseInteractionEnabled]);

  useFrame(() => {
    if (!meshRef.current) return;

    const posArray = meshRef.current.geometry.attributes.position.array as Float32Array;
    
    for (let i = 0; i < count; i++) {
      const idx = i * 3;
      
      // Update position with velocity
      posArray[idx] += velocities[idx];
      posArray[idx + 1] += velocities[idx + 1];
      
      // Mouse repulsion (only on desktop)
      if (mouseInteractionEnabled) {
        const dx = posArray[idx] - mouseRef.current.x * viewport.width * 0.5;
        const dy = posArray[idx + 1] - mouseRef.current.y * viewport.height * 0.5;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 3 && dist > 0) {
          const force = (3 - dist) / 3 * 0.02;
          posArray[idx] += (dx / dist) * force;
          posArray[idx + 1] += (dy / dist) * force;
        }
      }
      
      // Boundary wrap
      if (posArray[idx] > 10) posArray[idx] = -10;
      if (posArray[idx] < -10) posArray[idx] = 10;
      if (posArray[idx + 1] > 10) posArray[idx + 1] = -10;
      if (posArray[idx + 1] < -10) posArray[idx + 1] = 10;
    }
    
    meshRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#3b82f6"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

function ConnectionLines({ count = 60 }: { count?: number }) {
  const lineRef = useRef<THREE.LineSegments>(null);
  const maxConnections = 3;
  const connectionDistance = 2.5;

  const particles = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return pos;
  }, [count]);

  useFrame(() => {
    if (!lineRef.current) return;
    
    const positions: number[] = [];
    
    for (let i = 0; i < count; i++) {
      let connections = 0;
      for (let j = i + 1; j < count && connections < maxConnections; j++) {
        const dx = particles[i * 3] - particles[j * 3];
        const dy = particles[i * 3 + 1] - particles[j * 3 + 1];
        const dz = particles[i * 3 + 2] - particles[j * 3 + 2];
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        
        if (dist < connectionDistance) {
          positions.push(
            particles[i * 3], particles[i * 3 + 1], particles[i * 3 + 2],
            particles[j * 3], particles[j * 3 + 1], particles[j * 3 + 2]
          );
          connections++;
        }
      }
    }
    
    lineRef.current.geometry.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(positions, 3)
    );
  });

  return (
    <lineSegments ref={lineRef}>
      <bufferGeometry />
      <lineBasicMaterial color="#3b82f6" transparent opacity={0.1} />
    </lineSegments>
  );
}

export default function ParticleBackground() {
  const [isMobile, setIsMobile] = useState(false);
  const [particleCount, setParticleCount] = useState(60);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768 ||
                     /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

      setIsMobile(mobile);
      // Drastically reduce particles on mobile
      setParticleCount(mobile ? 20 : 60);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 75 }}
        dpr={isMobile ? [0.5, 1] : [1, 1.5]}
        gl={{
          antialias: false,
          alpha: true,
          powerPreference: 'high-performance'
        }}
        frameloop="demand"
        performance={{ min: 0.5 }}
      >
        <ambientLight intensity={0.5} />
        <ParticleField count={particleCount} isMobile={isMobile} />
        {/* Disable connection lines on mobile for better performance */}
        {!isMobile && <ConnectionLines count={particleCount} />}
      </Canvas>
    </div>
  );
}
