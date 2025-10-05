import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Box, Loader } from '@mantine/core';
import classes from './GraphView.module.css';

interface PublicationNode {
  id: string;
  title: string;
  x: number;
  y: number;
  z: number;
}

interface GraphViewProps {
  activePublicationId?: string;
  onNodeClick: (id: string, title: string) => void;
}

interface NodeProps {
  node: PublicationNode;
  isActive: boolean;
  onNodeClick: (id: string, title: string) => void;
  onHover: (title: string | null) => void;
}

function Node({ node, isActive, onNodeClick, onHover }: NodeProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    document.body.style.cursor = hovered ? 'pointer' : 'auto';
    return () => {
      document.body.style.cursor = 'auto';
    };
  }, [hovered]);

  const handlePointerOver = () => {
    setHovered(true);
    onHover(node.title);
  };

  const handlePointerOut = () => {
    setHovered(false);
    onHover(null);
  };

  const handleClick = () => {
    onNodeClick(node.id, node.title);
  };

  // Pulsing animation for active node
  useFrame((state) => {
    if (meshRef.current && isActive) {
      const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
      meshRef.current.scale.set(scale, scale, scale);
    }
  });

  const color = isActive ? '#4db391' : hovered ? '#3c9779' : '#ffffff';
  const scale = isActive ? 1.5 : hovered ? 1.2 : 1;

  return (
    <group>
      <mesh
        ref={meshRef}
        position={[node.x, node.y, node.z]}
        onClick={handleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        scale={isActive ? 1 : scale}
      >
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={isActive ? 0.8 : hovered ? 0.5 : 0.3}
          metalness={0.3}
          roughness={0.4}
        />
      </mesh>
      {/* Outer glow */}
      <mesh position={[node.x, node.y, node.z]} scale={(isActive ? 1.5 : scale) * 1.5}>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={isActive ? 0.3 : hovered ? 0.2 : 0.1}
        />
      </mesh>
    </group>
  );
}

interface SceneProps {
  nodes: PublicationNode[];
  activePublicationId?: string;
  onNodeClick: (id: string, title: string) => void;
  onHover: (title: string | null) => void;
}

function Scene({ nodes, activePublicationId, onNodeClick, onHover }: SceneProps) {
  const { camera } = useThree();
  const controlsRef = useRef<any>(null);

  // Center camera on active node
  useEffect(() => {
    if (activePublicationId) {
      const activeNode = nodes.find((n) => n.id === activePublicationId);
      if (activeNode && controlsRef.current) {
        const target = new THREE.Vector3(activeNode.x, activeNode.y, activeNode.z);
        controlsRef.current.target.copy(target);
        
        // Position camera to look at the node from a distance
        const offset = new THREE.Vector3(5, 5, 5);
        const cameraPosition = target.clone().add(offset);
        camera.position.copy(cameraPosition);
        
        controlsRef.current.update();
      }
    }
  }, [activePublicationId, nodes, camera]);

  return (
    <>
      {/* Ambient light for overall illumination */}
      <ambientLight intensity={0.6} />
      
      {/* Directional lights for depth and atmosphere */}
      <directionalLight position={[10, 10, 10]} intensity={0.8} color="#ffffff" />
      <directionalLight position={[-10, -10, -10]} intensity={0.4} color="#4db391" />
      <pointLight position={[0, 0, 0]} intensity={0.5} color="#3c9779" distance={50} />

      {/* Render nodes */}
      {nodes.map((node) => (
        <Node
          key={node.id}
          node={node}
          isActive={node.id === activePublicationId}
          onNodeClick={onNodeClick}
          onHover={onHover}
        />
      ))}

      {/* Orbit controls for navigation */}
      <OrbitControls
        ref={controlsRef}
        enableDamping
        dampingFactor={0.05}
        rotateSpeed={0.5}
        zoomSpeed={0.8}
        panSpeed={0.5}
        minDistance={2}
        maxDistance={50}
      />
    </>
  );
}

export function GraphView({ activePublicationId, onNodeClick }: GraphViewProps) {
  const [nodes, setNodes] = useState<PublicationNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredTitle, setHoveredTitle] = useState<string | null>(null);

  useEffect(() => {
    const fetchGraph = async () => {
      try {
        setLoading(true);

        // TODO: Replace with actual backend API call
        // const response = await fetch('/api/graph/embeddings');
        // const data = await response.json();
        // setNodes(data);

        // Mock data for demonstration
        const mockNodes: PublicationNode[] = Array.from({ length: 50 }, (_, i) => ({
          id: `pub-${i}`,
          title: `Publication ${i + 1}: Research on Topic ${i + 1}`,
          x: (Math.random() - 0.5) * 20,
          y: (Math.random() - 0.5) * 20,
          z: (Math.random() - 0.5) * 20,
        }));

        setNodes(mockNodes);
      } catch (err) {
        console.error('Failed to fetch graph:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchGraph();
  }, []);

  if (loading) {
    return (
      <Box className={classes.container}>
        <Loader color="mint" size="lg" />
      </Box>
    );
  }

  return (
    <Box className={classes.container}>
      {/* Hover tooltip */}
      {hoveredTitle && (
        <Box className={classes.tooltip}>
          {hoveredTitle}
        </Box>
      )}

      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [10, 10, 10], fov: 75 }}
        className={classes.canvas}
      >
        <Scene
          nodes={nodes}
          activePublicationId={activePublicationId}
          onNodeClick={onNodeClick}
          onHover={setHoveredTitle}
        />
      </Canvas>
    </Box>
  );
}
