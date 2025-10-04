# MiniGraphView Component

A compact 3D graph visualization component for the sidebar that provides a preview of the publication network and centers on the currently active publication.

## Features

- **Auto-Rotation**: Continuously rotates for dynamic preview
- **Active Node Highlighting**: Larger mint-colored node for active publication
- **Auto-Centering**: Centers view on the currently open publication
- **Compact Design**: Fixed 150px height, fits perfectly in sidebar
- **Simplified Visualization**: Fewer connections for clearer preview

## Usage

```tsx
import { MiniGraphView } from './components';

<MiniGraphView activePublicationId="pub-123" />
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `activePublicationId` | `string` | No | ID of the currently active publication to highlight and center on |

## Visual Design

### Node Appearance

1. **Default Nodes**
   - Color: `#3c9779` (zomp)
   - Scale: 0.1 units
   - Emissive intensity: 0.3
   - Shape: Low-poly sphere (16 segments)

2. **Active Node**
   - Color: `#4db391` (mint)
   - Scale: 0.2 units (2x larger)
   - Emissive intensity: 0.8
   - Stands out from other nodes

### Connections

- **Color**: Zomp (`#3c9779`)
- **Opacity**: 0.15 (more subtle than main graph)
- **Threshold**: Distance < 3 units
- **Purpose**: Show relationships without cluttering

### Animation

- **Rotation**: Continuous Y-axis rotation
- **Speed**: 0.01 radians per frame (~0.6 rpm)
- **Smooth**: Consistent rotation speed

### Camera

- **Position**: (0, 0, 15) - Front view
- **Field of View**: 50°
- **No Controls**: Static camera (rotation only)

## Integration

### In Sidebar

```tsx
<Box className={classes.umapSection}>
  <Text size="xs" fw={600} mb="xs" px="xs" c="dimmed">
    GRAPH PREVIEW
  </Text>
  <MiniGraphView activePublicationId={activePublicationId} />
</Box>
```

### Data Source

Currently uses the same mock data structure as `GraphView`. In production, this should share the same data source:

```typescript
interface PublicationNode {
  id: string;
  title: string;
  x: number;
  y: number;
  z: number;
}
```

## Behavior

### Centering Logic

When `activePublicationId` changes:
1. Finds the active node in the dataset
2. Moves the entire graph group to center on that node
3. Sets group position to negative of node coordinates
4. Result: Active node appears at center (0, 0, 0)

```typescript
groupRef.current.position.set(-activeNode.x, -activeNode.y, -activeNode.z);
```

### Auto-Rotation

Independent of active node centering:
1. Continuously rotates around Y-axis
2. Provides dynamic, engaging visualization
3. Helps users see 3D structure at a glance

## Styling

Uses `MiniGraphView.module.css`:

```css
.container {
  width: 100%;
  height: 150px;
  background-color: light-dark(
    var(--mantine-color-light-2),
    var(--mantine-color-darker-8)
  );
  border-radius: var(--mantine-radius-md);
  overflow: hidden;
}
```

## Performance

- **Optimized for Sidebar**: Uses lower polygon count (16 vs 32 segments)
- **Simplified Geometry**: Fewer nodes rendered (30 vs 50)
- **No User Interaction**: No hover/click detection overhead
- **Smooth Animation**: Efficient rotation using requestAnimationFrame

## Differences from GraphView

| Feature | GraphView | MiniGraphView |
|---------|-----------|---------------|
| Size | Full viewport | 150px fixed |
| Controls | Interactive orbit | Auto-rotate only |
| Interactions | Click, hover | None |
| Node Detail | High poly (32 seg) | Low poly (16 seg) |
| Tooltip | Yes | No |
| Lighting | Complex | Simple |
| Purpose | Exploration | Preview |

## Future Enhancements

- [ ] Click to open full graph view
- [ ] Synchronized with main graph view data
- [ ] Minimap indicator showing current view in full graph
- [ ] Option to pause auto-rotation on hover
- [ ] Show cluster colors
- [ ] Transition animation when active node changes
