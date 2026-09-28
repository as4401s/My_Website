import { useEffect, useRef } from 'react';

/** A decorative, progressively enhanced scene. The SVG remains if WebGL is unavailable. */
export default function NeuralSculpture({ paused }: { paused: boolean }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const pauseRef = useRef(paused);
  const updateRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    pauseRef.current = paused;
    updateRef.current?.();
  }, [paused]);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    let disposed = false;
    let cleanup = () => {};

    void import('three').then((THREE) => {
      if (disposed) return;
      let renderer: InstanceType<typeof THREE.WebGLRenderer>;
      try {
        renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' });
      } catch {
        return;
      }
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 30);
      camera.position.z = 8.5;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      renderer.setClearColor(0x000000, 0);
      renderer.domElement.setAttribute('aria-hidden', 'true');
      host.appendChild(renderer.domElement);

      const group = new THREE.Group();
      scene.add(group);
      // Each column is a layer; the moving points illustrate a forward pass.
      const layerSizes = [4, 6, 8, 6, 3];
      const layers = layerSizes.map((count, layer) =>
        Array.from({ length: count }, (_, node) => new THREE.Vector3(
          (layer - 2) * 1.08,
          (node - (count - 1) / 2) * 0.43,
          Math.sin(node * 1.7 + layer) * 0.23,
        )),
      );
      const geometry = new THREE.SphereGeometry(0.052, 12, 8);
      const material = new THREE.MeshBasicMaterial({ color: 0xa1eee3 });
      const neurons = new THREE.InstancedMesh(geometry, material, layerSizes.reduce((sum, size) => sum + size, 0));
      const matrix = new THREE.Matrix4();
      let neuronIndex = 0;
      for (const layer of layers) {
        for (const point of layer) {
          matrix.makeTranslation(point.x, point.y, point.z);
          neurons.setMatrixAt(neuronIndex++, matrix);
        }
      }
      group.add(neurons);

      const connections: number[] = [];
      const edges: Array<{ start: InstanceType<typeof THREE.Vector3>; end: InstanceType<typeof THREE.Vector3>; layer: number }> = [];
      layers.slice(0, -1).forEach((layer, layerIndex) => {
        layer.forEach((start) => {
          layers[layerIndex + 1].forEach((end) => {
            connections.push(start.x, start.y, start.z, end.x, end.y, end.z);
            edges.push({ start, end, layer: layerIndex });
          });
        });
      });
      const lineGeometry = new THREE.BufferGeometry();
      lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(connections, 3));
      const lineMaterial = new THREE.LineBasicMaterial({ color: 0x6fbeb5, transparent: true, opacity: 0.12 });
      group.add(new THREE.LineSegments(lineGeometry, lineMaterial));

      const signalPositions = new Float32Array(edges.length * 3);
      const signalColors = new Float32Array(edges.length * 3);
      const signalGeometry = new THREE.BufferGeometry();
      signalGeometry.setAttribute('position', new THREE.BufferAttribute(signalPositions, 3));
      signalGeometry.setAttribute('color', new THREE.BufferAttribute(signalColors, 3));
      const signalMaterial = new THREE.PointsMaterial({ size: 0.036, vertexColors: true, transparent: true, opacity: 0.95, blending: THREE.AdditiveBlending, depthWrite: false });
      group.add(new THREE.Points(signalGeometry, signalMaterial));
      group.rotation.set(-0.08, -0.18, -0.08);
      const updateSignals = (time: number) => {
        const phase = (time * 0.65) % 5;
        edges.forEach((edge, i) => {
          const progress = Math.max(0, Math.min(1, phase - edge.layer));
          const brightness = phase >= edge.layer && phase <= edge.layer + 1 ? Math.sin(progress * Math.PI) : 0;
          signalPositions[i * 3] = edge.start.x + (edge.end.x - edge.start.x) * progress;
          signalPositions[i * 3 + 1] = edge.start.y + (edge.end.y - edge.start.y) * progress;
          signalPositions[i * 3 + 2] = edge.start.z + (edge.end.z - edge.start.z) * progress;
          signalColors[i * 3] = brightness * 0.5;
          signalColors[i * 3 + 1] = brightness;
          signalColors[i * 3 + 2] = brightness * 0.88;
        });
        signalGeometry.attributes.position.needsUpdate = true;
        signalGeometry.attributes.color.needsUpdate = true;
      };
      updateSignals(2.2);
      const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      let visible = false;
      let lastTime = 0;
      let elapsed = 0;
      let pointerX = 0;
      let pointerY = 0;
      let contextLost = false;

      const render = () => renderer.render(scene, camera);
      const tick = (time: number) => {
        const delta = lastTime ? Math.min((time - lastTime) / 1000, 0.05) : 0;
        lastTime = time;
        elapsed += delta;
        updateSignals(elapsed);
        const damping = 1 - Math.exp(-delta * 3);
        group.rotation.y += (-0.18 + pointerX * 0.2 + Math.sin(elapsed * 0.18) * 0.06 - group.rotation.y) * damping;
        group.rotation.x += (-0.08 + pointerY * 0.12 - group.rotation.x) * damping;
        group.position.y = Math.sin(elapsed * 0.45) * 0.06;
        render();
      };
      const update = () => {
        if (contextLost) return;
        const running = visible && !document.hidden && !motionQuery.matches && !pauseRef.current;
        lastTime = 0;
        renderer.setAnimationLoop(running ? tick : null);
        if (!running) render();
      };
      updateRef.current = update;
      const resize = () => {
        const { width, height } = host.getBoundingClientRect();
        if (!width || !height || contextLost) return;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
        render();
      };
      const resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(host);
      const observer = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
        update();
      }, { threshold: 0.05 });
      observer.observe(host);
      const pointerMove = (event: PointerEvent) => {
        if (event.pointerType === 'touch') return;
        const rect = host.getBoundingClientRect();
        pointerX = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
        pointerY = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
      };
      const pointerLeave = () => { pointerX = 0; pointerY = 0; };
      const onContextLost = (event: Event) => {
        event.preventDefault();
        contextLost = true;
        renderer.setAnimationLoop(null);
        host.classList.remove('scene-ready');
      };
      const onContextRestored = () => {
        contextLost = false;
        resize();
        update();
        host.classList.add('scene-ready');
      };
      host.addEventListener('pointermove', pointerMove);
      host.addEventListener('pointerleave', pointerLeave);
      renderer.domElement.addEventListener('webglcontextlost', onContextLost);
      renderer.domElement.addEventListener('webglcontextrestored', onContextRestored);
      document.addEventListener('visibilitychange', update);
      motionQuery.addEventListener('change', update);
      resize();
      host.classList.add('scene-ready');

      cleanup = () => {
        updateRef.current = null;
        renderer.setAnimationLoop(null);
        observer.disconnect();
        resizeObserver.disconnect();
        host.removeEventListener('pointermove', pointerMove);
        host.removeEventListener('pointerleave', pointerLeave);
        document.removeEventListener('visibilitychange', update);
        motionQuery.removeEventListener('change', update);
        renderer.domElement.removeEventListener('webglcontextlost', onContextLost);
        renderer.domElement.removeEventListener('webglcontextrestored', onContextRestored);
        geometry.dispose();
        material.dispose();
        lineGeometry.dispose();
        lineMaterial.dispose();
        signalGeometry.dispose();
        signalMaterial.dispose();
        renderer.dispose();
        renderer.domElement.remove();
        host.classList.remove('scene-ready');
      };
    }).catch(() => { /* Keep the static artwork when the optional 3D module cannot load. */ });

    return () => { disposed = true; cleanup(); };
  }, []);

  return (
    <div ref={hostRef} className="neural-scene" aria-hidden="true">
      <svg className="neural-fallback" viewBox="0 0 600 600" fill="none">
        {[4, 6, 8, 6, 3].map((count, layer, sizes) => (
          <g key={layer}>
            {Array.from({ length: count }, (_, node) => {
              const x = 100 + layer * 100;
              const y = 300 + (node - (count - 1) / 2) * 38;
              return <g key={node}>
                {layer < 4 && Array.from({ length: sizes[layer + 1] }, (_, next) => <line key={next} x1={x} y1={y} x2={x + 100} y2={300 + (next - (sizes[layer + 1] - 1) / 2) * 38} stroke="#70d6c6" strokeOpacity="0.18" />)}
                <circle cx={x} cy={y} r="4" fill="#a1eee3" />
              </g>;
            })}
          </g>
        ))}
      </svg>
    </div>
  );
}
