"use client";

import React, { useRef, useMemo, useState, useEffect, Component, type ReactNode } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Sparkles, Float } from "@react-three/drei";
import * as THREE from "three";

/* ─── WebGL support check — also test actual context creation ─── */
function isWebGLAvailable(): boolean {
  try {
    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl2") ||
      canvas.getContext("webgl") ||
      canvas.getContext("experimental-webgl");
    if (!gl) return false;
    // Verify renderer can actually be created
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
    renderer.dispose();
    return true;
  } catch {
    return false;
  }
}

/* ─── Error Boundary to catch Canvas crashes ─── */
class CanvasErrorBoundary extends Component<
  { children: ReactNode; fallback?: ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: ReactNode; fallback?: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error: Error) {
    console.warn("[HeroCanvas] WebGL error caught:", error.message);
  }
  render() {
    if (this.state.hasError) return this.props.fallback ?? null;
    return this.props.children;
  }
}

/* ─── Flowing Particle Nebula — replaces ring-based orbital core ─── */
function ParticleNebula() {
  const meshRef = useRef<THREE.Points>(null);
  const count = 1200;

  const [positions, colors, sizes] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const sz = new Float32Array(count);

    const palette = [
      new THREE.Color("#6366f1"), // indigo
      new THREE.Color("#0ea5e9"), // cyan
      new THREE.Color("#8b5cf6"), // violet
      new THREE.Color("#ec4899"), // pink
      new THREE.Color("#10b981"), // emerald
      new THREE.Color("#f59e0b"), // amber
    ];

    for (let i = 0; i < count; i++) {
      // Sphere-ish cloud distribution
      const r = 3.5 + Math.random() * 5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.6; // squash Y
      pos[i * 3 + 2] = r * Math.cos(phi) * 0.5;

      const c = palette[Math.floor(Math.random() * palette.length)];
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;

      sz[i] = 0.8 + Math.random() * 2.5;
    }

    return [pos, col, sz];
  }, []);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();
    const posArr = meshRef.current.geometry.attributes.position.array as Float32Array;

    for (let i = 0; i < count; i++) {
      const ix = i * 3;
      // Gentle wave motion — each axis has different frequency
      posArr[ix] += Math.sin(t * 0.15 + i * 0.01) * 0.001;
      posArr[ix + 1] += Math.cos(t * 0.12 + i * 0.015) * 0.0008;
      posArr[ix + 2] += Math.sin(t * 0.1 + i * 0.02) * 0.0006;
    }
    meshRef.current.geometry.attributes.position.needsUpdate = true;
    meshRef.current.rotation.y = t * 0.02;
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={colors}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={count}
          array={sizes}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        vertexColors
        transparent
        opacity={0.85}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

/* ─── Floating Glowing Orbs — soft neon spheres drifting slowly ─── */
function GlowOrbs() {
  const orbs = useMemo(
    () => [
      { pos: [-3, 1.5, -2] as [number, number, number], color: "#6366f1", scale: 0.35, speed: 1.2 },
      { pos: [3.5, -1, -1] as [number, number, number], color: "#0ea5e9", scale: 0.28, speed: 0.9 },
      { pos: [-1, -2, 1] as [number, number, number], color: "#ec4899", scale: 0.22, speed: 1.5 },
      { pos: [1.5, 2.5, -3] as [number, number, number], color: "#10b981", scale: 0.3, speed: 1.1 },
      { pos: [-2.5, -1.5, 2] as [number, number, number], color: "#8b5cf6", scale: 0.25, speed: 1.3 },
    ],
    []
  );

  return (
    <>
      {orbs.map((orb, i) => (
        <Float key={i} speed={orb.speed} rotationIntensity={0.3} floatIntensity={1.8}>
          <mesh position={orb.pos} scale={orb.scale}>
            <sphereGeometry args={[1, 32, 32]} />
            <meshStandardMaterial
              color={orb.color}
              emissive={orb.color}
              emissiveIntensity={1.2}
              transparent
              opacity={0.5}
              roughness={0}
              metalness={0.3}
            />
          </mesh>
        </Float>
      ))}
    </>
  );
}

/* ─── Data Stream Lines — subtle flowing lines for futuristic feel ─── */
function DataStreams() {
  const groupRef = useRef<THREE.Group>(null);

  const lines = useMemo(() => {
    const result: { points: THREE.Vector3[]; color: string }[] = [];
    const colors = ["#6366f1", "#0ea5e9", "#8b5cf6", "#10b981", "#ec4899"];

    for (let i = 0; i < 8; i++) {
      const pts: THREE.Vector3[] = [];
      const startX = (Math.random() - 0.5) * 12;
      const startY = (Math.random() - 0.5) * 6;
      const startZ = (Math.random() - 0.5) * 4 - 2;

      for (let j = 0; j < 20; j++) {
        pts.push(
          new THREE.Vector3(
            startX + j * 0.5 + Math.sin(j * 0.4) * 0.8,
            startY + Math.cos(j * 0.3 + i) * 0.6,
            startZ + Math.sin(j * 0.2) * 0.3
          )
        );
      }
      result.push({ points: pts, color: colors[i % colors.length] });
    }
    return result;
  }, []);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.05) * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      {lines.map((line, i) => {
        const curve = new THREE.CatmullRomCurve3(line.points);
        const tubeGeom = new THREE.TubeGeometry(curve, 64, 0.008, 4, false);
        return (
          <mesh key={i} geometry={tubeGeom}>
            <meshBasicMaterial
              color={line.color}
              transparent
              opacity={0.12 + (i % 3) * 0.04}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        );
      })}
    </group>
  );
}

/* ─── Camera Rig — mouse-reactive parallax ─── */
function CameraRig() {
  const { camera, pointer } = useThree();

  useFrame(() => {
    const targetX = pointer.x * 0.35;
    const targetY = pointer.y * 0.25;
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetX, 0.025);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, 0.025);
    camera.lookAt(0, 0, 0);
  });

  return null;
}

export default function HeroCanvas() {
  const [canRender, setCanRender] = useState<boolean | null>(null);

  useEffect(() => {
    // Disable 3D canvas on mobile / touch devices — too GPU-heavy
    const isMobile =
      window.matchMedia("(max-width: 768px)").matches ||
      window.matchMedia("(pointer: coarse)").matches;
    if (isMobile) {
      setCanRender(false);
      return;
    }
    setCanRender(isWebGLAvailable());
  }, []);

  // Still checking, mobile, or WebGL not available — render nothing
  if (canRender !== true) return null;

  return (
    <div className="absolute inset-0 z-0 pointer-events-none opacity-90">
      <CanvasErrorBoundary>
        <Canvas
          dpr={[1, 1.5]}
          camera={{ position: [0, 0, 8.5], fov: 45 }}
          frameloop="always"
          gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
          onCreated={({ gl }) => {
            gl.setClearColor(0x000000, 0);
          }}
        >
          <fog attach="fog" args={["#070716", 12, 22]} />
          <ambientLight intensity={0.4} />
          <directionalLight position={[6, 7, 5]} intensity={1.2} color="#e0e7ff" />

          {/* Colorful volumetric lights */}
          <pointLight position={[-7, -4, 4]} intensity={2.5} color="#0ea5e9" distance={25} />
          <pointLight position={[5, 4, -2]} intensity={2.5} color="#ec4899" distance={25} />
          <pointLight position={[0, -6, 3]} intensity={2} color="#10b981" distance={22} />
          <pointLight position={[-5, 5, -5]} intensity={2} color="#8b5cf6" distance={22} />
          <pointLight position={[4, -3, 5]} intensity={1.5} color="#f59e0b" distance={18} />

          <ParticleNebula />
          <GlowOrbs />
          <DataStreams />
          <CameraRig />

          {/* Multi-layer sparkle particles */}
          <Sparkles count={120} scale={[14, 10, 10]} size={3.5} speed={0.3} opacity={0.7} color="#6366f1" />
          <Sparkles count={80} scale={[12, 8, 8]} size={2.8} speed={0.4} opacity={0.55} color="#0ea5e9" />
          <Sparkles count={60} scale={[10, 12, 10]} size={2.2} speed={0.5} opacity={0.45} color="#ec4899" />
          <Sparkles count={40} scale={[16, 6, 6]} size={1.8} speed={0.6} opacity={0.35} color="#10b981" />
        </Canvas>
      </CanvasErrorBoundary>
    </div>
  );
}
