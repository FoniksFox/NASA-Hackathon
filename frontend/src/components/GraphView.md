# GraphView Component

A 3D interactive graph visualization component using Three.js and React Three Fiber to display publication embeddings in 3D space.

## Features

- **3D Navigation**: Intuitive orbit controls for rotating, panning, and zooming
- **Interactive Nodes**: Hover to see publication titles, click to open publications
- **Active Node Highlighting**: Automatically centers and highlights the currently open publication
- **Connection Visualization**: Displays edges between nearby publications (proximity-based)
- **Auto-Centering**: Automatically focuses on the active publication when opened
- **Responsive Tooltip**: Shows publication title when hovering over nodes

## Usage

```tsx
import { GraphView } from './components';

<GraphView
  activePublicationId="pub-123"
  onNodeClick={(id, title) => {
    console.log('Clicked:', id, title);
  }}
/>
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `activePublicationId` | `string` | No | ID of the currently active publication to highlight and center on |
| `onNodeClick` | `(id: string, title: string) => void` | Yes | Callback when a node is clicked |

## Data Structure

The component expects backend data in the following format:

```typescript
interface PublicationNode {
  id: string;      // Unique publication identifier
  title: string;   // Publication title
  x: number;       // X coordinate in 3D space
  y: number;       // Y coordinate in 3D space
  z: number;       // Z coordinate in 3D space
}
```

### Backend API Endpoint

```
GET /api/umap/articles
```

**Response:**
```json
[
  {
    "id": "12345678",
    "title": "Study on Microgravity Effects",
    "x": 2.5,
    "y": -1.3,
    "z": 4.2
  },
  ...
]
```

Note: Article IDs are PubMed Central IDs (PMC IDs without the "PMC" prefix).

## Visual Design

### Node States

1. **Default**: Light gray sphere with subtle glow
   - Color: `#ebebeb` (anti-flash white)
   - Emissive intensity: 0.1

2. **Hovered**: Zomp-colored with increased glow
   - Color: `#3c9779` (zomp)
   - Scale: 1.2x
   - Emissive intensity: 0.3
   - Cursor: pointer

3. **Active**: Mint-colored with pulsing animation
   - Color: `#4db391` (mint)
   - Scale: 1.5x (base) + pulsing
   - Emissive intensity: 0.5
   - Animation: Sine wave pulse

### Connections

- **Color**: Zomp (`#3c9779`)
- **Opacity**: 0.2
- **Threshold**: Only drawn between nodes within distance < 3 units
- **Visual**: Thin lines connecting related publications

### Camera & Navigation

- **Initial Position**: (10, 10, 10)
- **Field of View**: 75°
- **Controls**:
  - Left mouse: Rotate
  - Right mouse: Pan
  - Scroll: Zoom
  - Min distance: 2 units
  - Max distance: 50 units
- **Damping**: Enabled (smooth motion)
- **Auto-center**: Focuses on active publication when changed

### Lighting

- **Ambient Light**: 0.5 intensity (overall illumination)
- **Directional Lights**: 
  - Primary: (10, 10, 10) at 1.0 intensity
  - Fill: (-10, -10, -10) at 0.5 intensity

## Controls

| Action | Control |
|--------|---------|
| Rotate | Left mouse drag |
| Pan | Right mouse drag |
| Zoom | Mouse wheel |
| Select Node | Left click on node |
| View Title | Hover over node |

## Integration

### With Tab System

```tsx
const handleNodeClick = (id: string, title: string) => {
  // Create new publication tab
  addPublicationTab(title);
};

<GraphView
  activePublicationId={activeTab.startsWith('pub-') ? activeTab : undefined}
  onNodeClick={handleNodeClick}
/>
```

### With Workspace System

Each workspace can maintain its own active publication state for the graph view.

## Performance Considerations

- **Node Count**: Optimized for 50-100 nodes
- **Connection Threshold**: Adjustable distance parameter to limit edge count
- **Rendering**: Uses Three.js instanced meshes for efficient rendering
- **Updates**: Only re-centers camera when active publication changes

## Customization

### Adjusting Connection Threshold

In `GraphView.tsx`, modify the distance check:

```tsx
if (distance < 3) { // Change this value
  // Draw connection
}
```

### Changing Node Appearance

Modify the `Node` component's mesh properties:

```tsx
<sphereGeometry args={[0.3, 32, 32]} /> // [radius, widthSegments, heightSegments]
```

### Animation Speed

Adjust the pulsing animation in the `useFrame` hook:

```tsx
const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
//                                                  ^ speed multiplier
//                                                        ^ amplitude
```

## Future Enhancements

- [ ] Cluster visualization with different colors
- [ ] Edge bundling for dense graphs
- [ ] Node labels always visible option
- [ ] Search and highlight specific publications
- [ ] Different layout algorithms (force-directed, hierarchical)
- [ ] Export graph as image
- [ ] Mini-map overlay for large graphs
- [ ] Animation between different embeddings
- [ ] Filter nodes by categories/tags
