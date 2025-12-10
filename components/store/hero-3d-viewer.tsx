"use client";

import { useRef, Suspense, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
	OrbitControls,
	PerspectiveCamera,
	useGLTF,
	Center,
	Environment,
} from "@react-three/drei";
import * as THREE from "three";

const gundamModel = "/3d/rx-0_full_armor_unicorn.glb";

function GundamModel(props: any) {
	const { scene } = useGLTF(gundamModel);
	const meshRef = useRef<THREE.Group>(null);

	useFrame((state, delta) => {
		if (meshRef.current) {
			// Slow rotation for showcase effect
			meshRef.current.rotation.y += delta * 0.15;
		}
	});

	return (
		<group ref={meshRef} {...props}>
			<Center>
				<primitive object={scene} />
			</Center>
		</group>
	);
}

// Preload the model
useGLTF.preload(gundamModel);

// HUD-style loading cube
function Loader() {
	const meshRef = useRef<THREE.Mesh>(null);

	useFrame((state, delta) => {
		if (meshRef.current) {
			meshRef.current.rotation.x += delta * 2;
			meshRef.current.rotation.y += delta * 2;
		}
	});

	return (
		<mesh ref={meshRef}>
			<boxGeometry args={[0.5, 0.5, 0.5]} />
			<meshStandardMaterial
				color="#06b6d4"
				wireframe
				emissive="#06b6d4"
				emissiveIntensity={0.5}
			/>
		</mesh>
	);
}

export function Hero3DViewer() {
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	if (!isMounted) {
		return (
			<div className="h-full w-full min-h-[400px] flex flex-col items-center justify-center bg-transparent gap-4">
				{/* HUD-style loading indicator */}
				<div className="relative w-16 h-16">
					<div className="absolute inset-0 border-2 border-primary/30 animate-pulse" />
					<div
						className="absolute inset-2 border border-primary/50 animate-spin"
						style={{ animationDuration: "3s" }}
					/>
					<div className="absolute inset-4 bg-primary/20" />
				</div>
				<span className="font-mono text-xs text-primary/60">
					LOADING_ASSET...
				</span>
			</div>
		);
	}

	return (
		<div className="h-full w-full min-h-[400px] bg-transparent relative">
			<Canvas
				gl={{ alpha: true, antialias: true }}
				className="bg-transparent h-full w-full">
				<PerspectiveCamera makeDefault position={[0, 0, 4]} />
				<OrbitControls
					enableZoom={true}
					enablePan={false}
					minPolarAngle={Math.PI / 4}
					maxPolarAngle={Math.PI / 1.5}
					autoRotate={false}
				/>

				{/* Enhanced lighting for metallic/mecha look */}
				<ambientLight intensity={0.8} />
				<spotLight
					position={[10, 10, 10]}
					angle={0.15}
					penumbra={1}
					intensity={2}
					color="#ffffff"
				/>
				{/* Cyan rim light for mecha effect */}
				<pointLight position={[-10, 5, -10]} intensity={1.5} color="#06b6d4" />
				{/* Warm accent light from below */}
				<pointLight position={[5, -10, 5]} intensity={0.5} color="#ffd700" />
				<Environment preset="city" />

				<Suspense fallback={<Loader />}>
					<GundamModel
						scale={0.8}
						position={[0, 0, 0]}
						rotation={[0, Math.PI, 0]}
					/>
				</Suspense>
			</Canvas>
		</div>
	);
}
