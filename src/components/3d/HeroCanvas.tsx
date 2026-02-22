"use client";

import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sphere, Float, Stars } from "@react-three/drei";
import * as THREE from "three";

function AnimatedSphere() {
  const sphereRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (sphereRef.current) {
      sphereRef.current.rotation.x = clock.getElapsedTime() * 0.15;
      sphereRef.current.rotation.y = clock.getElapsedTime() * 0.2;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.8} floatIntensity={1.5}>
      <Sphere ref={sphereRef} args={[1, 48, 48]} scale={2.5}>
        <meshStandardMaterial
          color="#1e40af"
          roughness={0.15}
          metalness={0.9}
          emissive="#1e3a5f"
          emissiveIntensity={0.3}
        />
      </Sphere>
    </Float>
  );
}

export default function HeroCanvas() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none opacity-50">
      <Canvas camera={{ position: [0, 0, 5] }} frameloop="demand">
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 10, 5]} intensity={0.8} />
        <pointLight position={[-10, -10, -5]} intensity={0.6} color="#06b6d4" />
        <AnimatedSphere />
        <Stars radius={100} depth={50} count={800} factor={5} saturation={0} fade speed={0.5} />
      </Canvas>
    </div>
  );
}
