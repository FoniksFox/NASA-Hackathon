import { Canvas } from '@react-three/fiber';
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Box } from '@mantine/core';
import classes from './MiniGraphView.module.css';
import { umapApi, handleApiError } from '../services/api';

interface PublicationNode {
  id: string;
  title: string;
  x: number;
  y: number;
  z: number;
  color: string;
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
        const color = isActive ? '#4db391' : node.color;
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

// Topic color palette - same as GraphView
const TOPIC_COLORS: Record<string, string> = {
  "Radiation Biology": "#D65C72", "Bone-related Biology": "#D65C72", "Cardiovascular-related Biology": "#D65C72",
  "Immunology": "#D65C72", "Microbiology": "#D65C72",
  "Space Biology": "#5465A2", "Microgravity": "#5465A2", "Astrobiology": "#5465A2",
  "Space Medicine": "#5465A2", "Plant Biology & Space Agriculture": "#5465A2",
  "Molecular Biology": "#BC9E62", "Genomics": "#BC9E62", "Bioinformatics & Systems Biology": "#BC9E62",
  "Stem Cell & Regenerative Medicine": "#BC9E62", "Oxidative Stress & Aging Biology": "#BC9E62",
};

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

function getArticleColor(articleId: string): string {
  const topics: string[] = [];
  for (const [topic, articles] of Object.entries(TOPIC_DATA)) {
    if (articles.includes(articleId)) topics.push(topic);
  }
  const colors = topics.map(topic => PALETTE_COLORS[topic]).filter(Boolean);
  if (colors.length === 0) return '#999999';
  if (colors.length === 1) return colors[0];
  
  // Simple color interpolation
  const hexToRgb = (hex: string): [number, number, number] => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [parseInt(result[1], 16) / 255, parseInt(result[2], 16) / 255, parseInt(result[3], 16) / 255] : [1, 1, 1];
  };
  const rgbColors = colors.map(hexToRgb);
  const avgR = rgbColors.reduce((sum, c) => sum + c[0], 0) / rgbColors.length;
  const avgG = rgbColors.reduce((sum, c) => sum + c[1], 0) / rgbColors.length;
  const avgB = rgbColors.reduce((sum, c) => sum + c[2], 0) / rgbColors.length;
  return `#${Math.round(avgR * 255).toString(16).padStart(2, '0')}${Math.round(avgG * 255).toString(16).padStart(2, '0')}${Math.round(avgB * 255).toString(16).padStart(2, '0')}`;
}

const PALETTE_COLORS = TOPIC_COLORS;

export function MiniGraphView({ activePublicationId }: MiniGraphViewProps) {
  const [nodes, setNodes] = useState<PublicationNode[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGraph = async () => {
      try {
        setLoading(true);
        const articles = await umapApi.getAllArticles();
        
        // Transform to match MiniGraphView scale (smaller than full GraphView)
        const transformedNodes: PublicationNode[] = articles.map((article) => ({
          id: article.id,
          title: article.title || `Article ${article.id}`,
          x: article.x * 1.5, // Smaller scale for mini view
          y: article.y * 1.5 - 5, // Move data down by 3 units
          z: article.z * 1.5 -15,
          color: getArticleColor(article.id),
        }));

        setNodes(transformedNodes);
      } catch (err) {
        console.error('Failed to fetch mini graph:', handleApiError(err));
        setNodes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchGraph();
  }, []);

  if (loading || nodes.length === 0) {
    return <Box className={classes.container} />;
  }

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
