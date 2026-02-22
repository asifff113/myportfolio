"use client";

import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sphere, Float, Sparkles, OrbitControls, Icosahedron, TorusKnot } from "@react-three/drei";
import * as THREE from "three";

function AnimatedOrbitalCore() {
  const groupRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const frameRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    if (groupRef.current) {
      groupRef.current.rotation.z = Math.sin(t * 0.25) * 0.1;
      groupRef.current.position.y = Math.sin(t * 0.4) * 0.1;
    }

    if (coreRef.current) {
      coreRef.current.rotation.x = t * 0.15;
      coreRef.current.rotation.y = t * 0.2;
    }

    if (ringRef.current) {
      ringRef.current.rotation.x = Math.PI / 2 + Math.sin(t * 0.3) * 0.15;
      ringRef.current.rotation.z = t * 0.25;
    }
    
    if (frameRef.current) {
      frameRef.current.rotation.x = t * 0.1;
      frameRef.current.rotation.y = -t * 0.15;
      frameRef.current.rotation.z = t * 0.1;
    }
  });

  return (
    <Float speed={1.2} rotationIntensity={0.6} floatIntensity={1.2}>
      <group ref={groupRef}>
        {/* Core Glowing Orb */}
        <Sphere ref={coreRef} args={[1, 64, 64]} scale={2.0}>
          <meshPhysicalMaterial
            color="#0ea5e9"
            roughness={0.1}
            metalness={0.4}
            transmission={0.8}
            thickness={1.5}
            transparent
            opacity={0.85}
            clearcoat={1}
            clearcoatRoughness={0.1}
            emissive="#0284c7"
            emissiveIntensity={0.4}
          />
        </Sphere>

        {/* Inner Geometric Frame */}
        <Icosahedron ref={frameRef} args={[1, 1]} scale={2.4}>
          <meshBasicMaterial color="#ec4899" wireframe transparent opacity={0.25} />
        </Icosahedron>

        {/* Surrounding Dynamic Ring */}
        <mesh ref={ringRef} scale={3.4}>
          <torusGeometry args={[1, 0.015, 64, 128]} />
          <meshStandardMaterial
            color="#8b5cf6"
            emissive="#8b5cf6"
            emissiveIntensity={0.8}
            roughness={0.1}
            metalness={0.8}
            transparent
            opacity={0.9}
          />
        </mesh>
        
        {/* Outer TorusKnot for complexity */}
        <Float speed={2} rotationIntensity={1} floatIntensity={1}>
          <TorusKnot args={[3.2, 0.05, 128, 32]} scale={1.2}>
            <meshStandardMaterial
              color="#10b981"
              emissive="#059669"
              emissiveIntensity={0.3}
              wireframe
              transparent
              opacity={0.15}
            />
          </TorusKnot>
        </Float>
      </group>
    </Float>
  );
}

export default function HeroCanvas() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none opacity-90">
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 8.5], fov: 45 }}
        frameloop="always"
        gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[6, 7, 5]} intensity={1.5} color="#ffffff" />
        
        {/* Colorful Neon Lights */}
        <pointLight position={[-7, -4, 4]} intensity={2} color="#0ea5e9" distance={20} />
        <pointLight position={[5, 4, -2]} intensity={2} color="#ec4899" distance={20} />
        <pointLight position={[0, -6, 3]} intensity={1.5} color="#10b981" distance={20} />
        <pointLight position={[-5, 5, -5]} intensity={1.5} color="#8b5cf6" distance={20} />

        <AnimatedOrbitalCore />

        {/* Particles */}
        <Sparkles
          count={80}
          scale={[12, 8, 8]}
          size={3}
          speed={0.4}
          opacity={0.6}
          color="#0ea5e9"
        />
        <Sparkles
          count={60}
          scale={[10, 10, 10]}
          size={2.5}
          speed={0.3}
          opacity={0.5}
          color="#8b5cf6"
        />
        <Sparkles
          count={40}
          scale={[14, 6, 6]}
          size={2}
          speed={0.5}
          opacity={0.4}
          color="#ec4899"
        />
      </Canvas>
    </div>
  );
}
