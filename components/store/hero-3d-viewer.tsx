"use client";

import {
	useRef,
	Suspense,
	useState,
	useEffect,
	Component,
	ReactNode,
} from "react";
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

function BarbatosModel(props: any) {
	const { scene, nodes } = useGLTF(gundamModel);
	console.log(nodes);
	const meshRef = useRef<THREE.Group>(null);

	useFrame((state, delta) => {
		if (meshRef.current) {
			// Slow rotation for showcase effect
			meshRef.current.rotation.y += delta * 0.1;
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

function Loader() {
	return (
		<mesh>
			<boxGeometry args={[1, 1, 1]} />
			<meshStandardMaterial color="#00ff67" wireframe />
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
			<div className="h-full w-full min-h-[400px] flex items-center justify-center bg-transparent">
				<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
			</div>
		);
	}

	return (
		<div className="h-full w-full min-h-[400px] bg-transparent relative">
			{/* <ErrorBoundary> */}
			<Canvas
				// frameloop="demand"
				gl={{ alpha: true, antialias: true }}
				className="bg-transparent h-full w-full"
				// dpr={[1, 2]}
			>
				<PerspectiveCamera makeDefault position={[0, 0, 4]} />
				<OrbitControls
					enableZoom={true}
					enablePan={false}
					minPolarAngle={Math.PI / 4}
					maxPolarAngle={Math.PI / 1.5}
					autoRotate={false}
				/>

				{/* Lighting setup for metallic look */}
				<ambientLight intensity={1} />
				<spotLight
					position={[10, 10, 10]}
					angle={0.15}
					penumbra={1}
					intensity={2}
				/>
				<pointLight position={[-10, -10, -10]} intensity={1} color="#00ff67" />
				<Environment preset="city" />

				<Suspense fallback={<Loader />}>
					<BarbatosModel
						scale={0.8}
						position={[0, 0, 0]}
						rotation={[0, Math.PI, 0]}
					/>
				</Suspense>
			</Canvas>
			{/* </ErrorBoundary> */}
		</div>
	);
}
