import { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

function BoxMesh({ width, height, depth, color, finish }) {
  const meshRef = useRef();

  const geometry = useMemo(
    () => new THREE.BoxGeometry(width, height, depth),
    [width, height, depth]
  );

  const material = useMemo(() => {
    const roughness = finish === 'Matte' ? 0.9 : finish === 'Soft Touch' ? 0.75 : 0.2;
    const metalness = finish === 'Gloss' ? 0.1 : 0;
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color(color),
      roughness,
      metalness,
    });
  }, [color, finish]);

  // Subtle idle rotation
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.15;
    }
  });

  return (
    <mesh ref={meshRef} geometry={geometry} material={material} castShadow receiveShadow>
      {/* Edge lines for a box look */}
      <lineSegments>
        <edgesGeometry args={[geometry]} />
        <lineBasicMaterial color="#00000033" />
      </lineSegments>
    </mesh>
  );
}

function Dieline({ width, height, depth, color }) {
  return (
    <group rotation={[-Math.PI / 2, 0, 0]}>
      {/* Center panel (front face) */}
      <mesh position={[0, 0, 0]}>
        <planeGeometry args={[width, height]} />
        <meshStandardMaterial color={color} roughness={0.8} />
      </mesh>
      {/* Top flap */}
      <mesh position={[0, (height + depth) / 2, 0]}>
        <planeGeometry args={[width, depth]} />
        <meshStandardMaterial color={color} roughness={0.8} opacity={0.7} transparent />
      </mesh>
      {/* Bottom flap */}
      <mesh position={[0, -(height + depth) / 2, 0]}>
        <planeGeometry args={[width, depth]} />
        <meshStandardMaterial color={color} roughness={0.8} opacity={0.7} transparent />
      </mesh>
      {/* Left side */}
      <mesh position={[-(width + depth) / 2, 0, 0]}>
        <planeGeometry args={[depth, height]} />
        <meshStandardMaterial color={color} roughness={0.8} opacity={0.7} transparent />
      </mesh>
      {/* Right side */}
      <mesh position={[(width + depth) / 2, 0, 0]}>
        <planeGeometry args={[depth, height]} />
        <meshStandardMaterial color={color} roughness={0.8} opacity={0.7} transparent />
      </mesh>
    </group>
  );
}

export default function Box3DPreview({ dims, color, finish, viewMode }) {
  const scale = 1 / Math.max(dims.l, dims.w, dims.h, 1);
  const w = dims.l * scale * 2.5;
  const h = dims.h * scale * 2.5;
  const d = dims.w * scale * 2.5;

  return (
    <Canvas
      camera={{ position: [4, 3, 4], fov: 40 }}
      shadows
      gl={{ antialias: true }}
      style={{ background: 'transparent' }}
    >
      <ambientLight intensity={0.6} />
      <directionalLight
        position={[5, 8, 5]}
        intensity={1.2}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <directionalLight position={[-3, 2, -3]} intensity={0.3} />

      <Suspense fallback={null}>
        <Environment files="/potsdamer_platz_1k.hdr?v=2" />
        {viewMode === '3d' ? (
          <BoxMesh width={w} height={h} depth={d} color={color} finish={finish} />
        ) : (
          <Dieline width={w} height={h} depth={d} color={color} />
        )}
        <ContactShadows
          position={[0, -h / 2 - 0.01, 0]}
          opacity={0.3}
          scale={6}
          blur={2}
        />
      </Suspense>

      <OrbitControls
        enablePan={false}
        minDistance={2}
        maxDistance={10}
        autoRotate={false}
      />
    </Canvas>
  );
}
