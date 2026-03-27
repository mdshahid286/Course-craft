import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Environment, ContactShadows } from '@react-three/drei';

function Box({ position, color }) {
  const mesh = useRef();
  useFrame((state, delta) => (mesh.current.rotation.x = mesh.current.rotation.y += delta * 0.4));
  return (
    <Float speed={2} rotationIntensity={1.5} floatIntensity={2} position={position}>
      <mesh ref={mesh}>
        <boxGeometry args={[1.2, 1.2, 1.2]} />
        <meshStandardMaterial color={color} roughness={0.2} metalness={0.1} />
      </mesh>
    </Float>
  );
}

function Sphere({ position, color }) {
  const mesh = useRef();
  useFrame((state, delta) => (mesh.current.rotation.y += delta * 0.2));
  return (
    <Float speed={1.5} rotationIntensity={0} floatIntensity={3} position={position}>
      <mesh ref={mesh}>
        <sphereGeometry args={[0.8, 32, 32]} />
        <meshStandardMaterial color={color} roughness={0.1} metalness={0.2} />
      </mesh>
    </Float>
  );
}

function Torus({ position, color }) {
  const mesh = useRef();
  useFrame((state, delta) => {
    mesh.current.rotation.x += delta * 0.5;
    mesh.current.rotation.y += delta * 0.3;
  });
  return (
    <Float speed={2.5} rotationIntensity={2} floatIntensity={1} position={position}>
      <mesh ref={mesh}>
        <torusGeometry args={[0.7, 0.3, 16, 32]} />
        <meshStandardMaterial color={color} roughness={0.3} metalness={0.4} />
      </mesh>
    </Float>
  );
}

export default function ThreeBackground() {
  return (
    <div className="fixed inset-0 z-[-1] pointer-events-none opacity-60">
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 20, 10]} intensity={1.5} castShadow />
        <Environment preset="city" />
        
        <Box position={[-4, 2, -2]} color="#FF5757" />
        <Sphere position={[5, -1, -3]} color="#577BFF" />
        <Torus position={[-3, -3, -1]} color="#57FF85" />
        <Box position={[4, 3, -1]} color="#FFD157" />

        <ContactShadows resolution={512} position={[0, -4, 0]} opacity={0.3} scale={20} blur={2} far={5} />
      </Canvas>
    </div>
  );
}
