import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Box, Loader } from '@mantine/core';
import classes from './GraphView.module.css';
import { umapApi, handleApiError } from '../services/api';

// Topic definitions with their articles
const TOPIC_DATA: Record<string, string[]> = {
  "Molecular Biology": ["5587110", "6813909", "4095884", "3040128", "3177255", "11500582", "5387210", "4642138", "2915878", "10772081", "11166944", "8716943", "4826010", "7503278", "8364238", "11579474", "2998437", "3005423", "3190158", "3289768"],
  "Space Biology": ["4136787", "3630201", "11988870", "7998608", "5587110", "8396460", "5460236", "6222041", "4642138", "5387210", "3901686", "6371294", "7072278", "8441986", "9400218", "9576569", "10789781", "11166946", "11166944", "11166968"],
  "Microgravity": ["4136787", "3630201", "11988870", "7998608", "5587110", "5460236", "3901686", "9267413", "7000411", "7787258", "7010715", "11579474", "3774184", "4118556", "4653813", "6915713", "8509868", "5672023", "5899691", "6204554"],
  "Space Medicine": ["4136787", "11988870", "5460236", "6222041", "6387434", "8441986", "9400218", "9267413", "9576569", "11166968", "6124165", "11063234", "5899691", "6204554", "8099722", "10285634", "9832585", "7829349", "7828077", "11094041"],
  "Radiation Biology": ["5666799", "6813909", "6387434", "7072278", "8441986", "9267413", "10789781", "11166944", "11166968", "11063234", "4033213", "9832585", "4964660"],
  "Immunology": ["3901686", "10772081", "3570223", "3457586", "3558598", "11046949", "3890248", "3868799", "4960141", "5736159", "5761896", "5826609", "6366624", "11929063", "10996920"],
  "Genomics": ["7072278", "10789781", "8364238", "8509868", "4902601", "7829349", "3570223", "5761896", "5826609", "6366624", "11929063", "8044432", "11403809", "8220224"],
  "Bioinformatics & Systems Biology": ["3040128", "11500582", "6371294", "9576569", "11166946", "7787258", "11127935", "6915713", "3818365", "5736159", "8044432", "7778922", "7870178", "7733874", "7828077", "11166911", "11094041", "11053165", "11403809"],
  "Bone-related Biology": ["3630201", "5666799", "6222041", "6813909", "3774184", "4118556", "4653813", "6124165", "8509868", "10285634", "3502426", "3856860", "4169763", "4398884", "4379453", "6615562"],
  "Cardiovascular-related Biology": ["8396460", "6387434", "7787258", "11063234", "6062551", "8513672", "3502426", "3856860", "3615599", "4050424", "3659353", "4169763", "4398884", "4379453", "4385880", "4964660", "5866446", "7339929"],
  "Microbiology": ["9400218", "10772081", "7000411", "2998437", "3005423", "3190158", "3289768", "3508904", "3430326", "3593973", "11127935", "8099722", "7829349", "3457586", "3558598", "11046949", "4228280", "3639165", "11126634", "11386075"],
  "Astrobiology": ["11930778"],
  "Plant Biology & Space Agriculture": ["3040128", "3177255", "11500582", "5387210", "4642138", "8716943", "4826010", "7010715", "7503278", "8364238", "3981873", "4378170", "4618186", "4453782", "4902601", "4776492", "5415411", "6289879", "7987364", "4033213"],
  "Stem Cell & Regenerative Medicine": ["7998608", "6062551"],
  "Oxidative Stress & Aging Biology": ["8396460", "5666799", "11166946", "8816950", "6289879", "3502426", "3615599", "5866446"],
};

// Color palette assignments
const PALETTE_COLORS: Record<string, string> = {
  // Palette 1: #D65C72
  "Radiation Biology": "#D65C72",
  "Bone-related Biology": "#D65C72",
  "Cardiovascular-related Biology": "#D65C72",
  "Immunology": "#D65C72",
  "Microbiology": "#D65C72",
  
  // Palette 2: #5465A2
  "Space Biology": "#5465A2",
  "Microgravity": "#5465A2",
  "Astrobiology": "#5465A2",
  "Space Medicine": "#5465A2",
  "Plant Biology & Space Agriculture": "#5465A2",
  
  // Palette 3: #BC9E62
  "Molecular Biology": "#BC9E62",
  "Genomics": "#BC9E62",
  "Bioinformatics & Systems Biology": "#BC9E62",
  "Stem Cell & Regenerative Medicine": "#BC9E62",
  "Oxidative Stress & Aging Biology": "#BC9E62",
};

// Helper function to convert hex to RGB
function hexToRgb(hex: string): [number, number, number] {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? [parseInt(result[1], 16) / 255, parseInt(result[2], 16) / 255, parseInt(result[3], 16) / 255]
    : [1, 1, 1];
}

// Helper function to interpolate colors
function interpolateColors(colors: string[]): string {
  if (colors.length === 0) return '#ffffff';
  if (colors.length === 1) return colors[0];
  
  const rgbColors = colors.map(hexToRgb);
  const avgR = rgbColors.reduce((sum, c) => sum + c[0], 0) / rgbColors.length;
  const avgG = rgbColors.reduce((sum, c) => sum + c[1], 0) / rgbColors.length;
  const avgB = rgbColors.reduce((sum, c) => sum + c[2], 0) / rgbColors.length;
  
  return `#${Math.round(avgR * 255).toString(16).padStart(2, '0')}${Math.round(avgG * 255).toString(16).padStart(2, '0')}${Math.round(avgB * 255).toString(16).padStart(2, '0')}`;
}

// Get color for an article based on its topics
function getArticleColor(articleId: string): string {
  const topics: string[] = [];
  
  // Find all topics this article belongs to
  for (const [topic, articles] of Object.entries(TOPIC_DATA)) {
    if (articles.includes(articleId)) {
      topics.push(topic);
    }
  }
  
  // Get colors for each topic
  const colors = topics.map(topic => PALETTE_COLORS[topic]).filter(Boolean);
  
  // If article has no topic, return white
  if (colors.length === 0) {
    console.log(`Article ${articleId} has no topic`);
    return '#999999';
  }
  
  // Interpolate if article belongs to multiple topics
  const finalColor = interpolateColors(colors);
  if (colors.length > 1) {
    console.log(`Article ${articleId} in ${colors.length} topics, interpolated to ${finalColor}`);
  }
  return finalColor;
}

interface PublicationNode {
  id: string;
  title: string;
  x: number;
  y: number;
  z: number;
  color: string;
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
  const glowRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const { camera } = useThree();

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

  // Dynamic scaling and pulsing animation
  useFrame((state) => {
    if (meshRef.current && glowRef.current) {
      // Calculate distance from camera to node
      const nodePos = new THREE.Vector3(node.x, node.y, node.z);
      const distance = camera.position.distanceTo(nodePos);
      
      // Scale nodes based on distance (increased factor for larger nodes)
      // Closer = smaller, farther = larger
      const distanceScale = Math.max(1.2, Math.min(6, distance * 0.04));
      
      // Pulsing animation for active node
      if (isActive) {
        const pulseScale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
        meshRef.current.scale.set(distanceScale * pulseScale, distanceScale * pulseScale, distanceScale * pulseScale);
        glowRef.current.scale.set(distanceScale * pulseScale * 1.5, distanceScale * pulseScale * 1.5, distanceScale * pulseScale * 1.5);
      } else {
        meshRef.current.scale.set(distanceScale, distanceScale, distanceScale);
        glowRef.current.scale.set(distanceScale * 1.5, distanceScale * 1.5, distanceScale * 1.5);
      }
    }
  });

  // Use the node's color from topic data
  const baseColor = node.color || '#999999';
  const color = isActive ? '#4db391' : baseColor;
  const hoverScale = hovered ? 1.3 : 1.0;
  
  // Increase emissive on hover for better visibility
  const emissiveIntensity = isActive ? 0.8 : hovered ? 0.6 : 0.4;

  return (
    <group>
      <mesh
        ref={meshRef}
        position={[node.x, node.y, node.z]}
        onClick={handleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        scale={hoverScale}
      >
        <sphereGeometry args={[0.15, 32, 32]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={emissiveIntensity}
          metalness={0.2}
          roughness={0.5}
        />
      </mesh>
      {/* Outer glow */}
      <mesh 
        ref={glowRef}
        position={[node.x, node.y, node.z]}
      >
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={isActive ? 0.3 : hovered ? 0.2 : 0.15}
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
        minDistance={5}
        maxDistance={200}
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

        // Fetch article coordinates from backend
        const articles = await umapApi.getAllArticles();
        
        console.log('Fetched articles from backend:', articles.length, 'articles');
        console.log('Sample article:', articles[0]);
        
        // Transform API response to match our PublicationNode interface
        const transformedNodes: PublicationNode[] = articles.map((article) => ({
          id: article.id,
          title: article.title || `Article ${article.id}`,
          x: article.x * 8, // Scale up for better spacing
          y: article.y * 8,
          z: article.z * 8, // Scale all dimensions equally
          color: getArticleColor(article.id), // Get color based on topic membership
        }));

        console.log('Transformed nodes:', transformedNodes.length, 'nodes');
        console.log('Sample node with color:', transformedNodes[0]);
        setNodes(transformedNodes);
      } catch (err) {
        console.error('Failed to fetch graph:', handleApiError(err));
        
        // Fallback to empty array on error
        setNodes([]);
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

      {/* Topic Legend */}
      <Box style={{
        position: 'absolute',
        top: '20px',
        right: '20px',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        padding: '15px',
        borderRadius: '8px',
        color: 'white',
        fontSize: '12px',
        maxHeight: '80vh',
        overflowY: 'auto',
        zIndex: 10,
      }}>
        <div style={{ fontWeight: 'bold', marginBottom: '10px', fontSize: '14px' }}>Topics</div>
        
        <div style={{ marginBottom: '10px' }}>
          <div style={{ fontWeight: 'bold', marginBottom: '5px', color: '#D65C72' }}>Biology & Medicine</div>
          {['Radiation Biology', 'Bone-related Biology', 'Cardiovascular-related Biology', 'Immunology', 'Microbiology'].map(topic => (
            <div key={topic} style={{ marginLeft: '10px', marginBottom: '3px', fontSize: '11px' }}>• {topic}</div>
          ))}
        </div>
        
        <div style={{ marginBottom: '10px' }}>
          <div style={{ fontWeight: 'bold', marginBottom: '5px', color: '#5465A2' }}>Space Sciences</div>
          {['Space Biology', 'Microgravity', 'Astrobiology', 'Space Medicine', 'Plant Biology & Space Agriculture'].map(topic => (
            <div key={topic} style={{ marginLeft: '10px', marginBottom: '3px', fontSize: '11px' }}>• {topic}</div>
          ))}
        </div>
        
        <div>
          <div style={{ fontWeight: 'bold', marginBottom: '5px', color: '#BC9E62' }}>Molecular Sciences</div>
          {['Molecular Biology', 'Genomics', 'Bioinformatics & Systems Biology', 'Stem Cell & Regenerative Medicine', 'Oxidative Stress & Aging Biology'].map(topic => (
            <div key={topic} style={{ marginLeft: '10px', marginBottom: '3px', fontSize: '11px' }}>• {topic}</div>
          ))}
        </div>
      </Box>

      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [40, 40, 40], fov: 75 }}
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
