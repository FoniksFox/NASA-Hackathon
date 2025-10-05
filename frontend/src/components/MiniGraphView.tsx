import { Canvas } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { Box } from '@mantine/core';
import classes from './MiniGraphView.module.css';

interface PublicationNode {
  id: string;
  title: string;
  x: number;
  y: number;
  z: number;
}

interface MiniGraphViewProps {
  activePublicationId?: string;
}

interface MiniSceneProps {
  nodes: PublicationNode[];
  activePublicationId?: string;
}

function MiniScene({ nodes, activePublicationId }: MiniSceneProps) {
  const groupRef = useRef<THREE.Group>(null);

  // Auto-rotate the entire scene
  useEffect(() => {
    const interval = setInterval(() => {
      if (groupRef.current) {
        groupRef.current.rotation.y += 0.01;
      }
    }, 16); // ~60fps

    return () => clearInterval(interval);
  }, []);

  // Center on active node
  useEffect(() => {
    if (activePublicationId && groupRef.current) {
      const activeNode = nodes.find((n) => n.id === activePublicationId);
      if (activeNode) {
        groupRef.current.position.set(-activeNode.x, -activeNode.y, -activeNode.z);
      }
    }
  }, [activePublicationId, nodes]);

  return (
    <group ref={groupRef}>
      <ambientLight intensity={0.8} />
      <directionalLight position={[5, 5, 5]} intensity={0.5} />

      {/* Render nodes */}
      {nodes.map((node) => {
        const isActive = node.id === activePublicationId;
        const color = isActive ? '#4db391' : '#3c9779';
        const scale = isActive ? 0.2 : 0.1;

        return (
          <mesh key={node.id} position={[node.x, node.y, node.z]} scale={scale}>
            <sphereGeometry args={[1, 16, 16]} />
            <meshStandardMaterial
              color={color}
              emissive={color}
              emissiveIntensity={isActive ? 0.8 : 0.3}
            />
          </mesh>
        );
      })}
    </group>
  );
}

export function MiniGraphView({ activePublicationId }: MiniGraphViewProps) {
  // Mock data - in real app, this would come from the same source as GraphView
  const nodes: PublicationNode[] = Array.from({ length: 30 }, (_, i) => ({
    id: `pub-${i}`,
    title: `Publication ${i + 1}`,
    x: (Math.random() - 0.5) * 10,
    y: (Math.random() - 0.5) * 10,
    z: (Math.random() - 0.5) * 10,
  }));

  return (
    <Box className={classes.container}>
      <Canvas
        camera={{ position: [0, 0, 15], fov: 50 }}
        className={classes.canvas}
      >
        <MiniScene nodes={nodes} activePublicationId={activePublicationId} />
      </Canvas>
    </Box>
  );
}
