# Sidebar Component

The Sidebar component provides workspace management functionality, allowing users to create, switch between, rename, and delete workspaces. Each workspace maintains its own context including open tabs, active tab, and (in the future) chat history and graph state.

## Features

- **Create Workspaces**: Create new workspaces with custom names and colors
- **Switch Workspaces**: Click to switch between different workspaces
- **Rename Workspaces**: Edit workspace names inline
- **Delete Workspaces**: Remove workspaces (requires at least one workspace)
- **Visual Identification**: Color-coded workspaces for easy recognition
- **Active Indicator**: Clear visual feedback for the currently active workspace

## Usage

```tsx
import { Sidebar } from './components';
import { useWorkspaces } from './hooks';

function App() {
  const {
    workspaces,
    activeWorkspaceId,
    createWorkspace,
    switchWorkspace,
    deleteWorkspace,
    renameWorkspace,
  } = useWorkspaces('Main Workspace');

  return (
    <Sidebar
      workspaces={workspaces}
      activeWorkspaceId={activeWorkspaceId}
      onSwitchWorkspace={switchWorkspace}
      onCreateWorkspace={createWorkspace}
      onDeleteWorkspace={deleteWorkspace}
      onRenameWorkspace={renameWorkspace}
    />
  );
}
```

## Props

- `workspaces` (Workspace[]): Array of workspace objects
- `activeWorkspaceId` (string): ID of the currently active workspace
- `onSwitchWorkspace` ((workspaceId: string) => void): Callback when switching workspaces
- `onCreateWorkspace` ((name: string, color?: string) => void): Callback to create new workspace
- `onDeleteWorkspace` ((workspaceId: string) => void): Callback to delete a workspace
- `onRenameWorkspace` ((workspaceId: string, newName: string) => void): Callback to rename workspace

## Workspace Interface

```typescript
interface Workspace {
  id: string;           // Unique identifier
  name: string;         // Display name
  color?: string;       // Mantine color name for visual identification
  openTabs: Tab[];      // Array of open publication tabs
  activeTab: string;    // ID of the currently active tab
}
```

## useWorkspaces Hook

Hook for managing workspace state across the application.

```typescript
const {
  workspaces,              // Array of all workspaces
  activeWorkspaceId,       // Current workspace ID
  activeWorkspace,         // Current workspace object
  createWorkspace,         // Create a new workspace
  switchWorkspace,         // Switch to different workspace
  deleteWorkspace,         // Delete a workspace
  renameWorkspace,         // Rename a workspace
  updateWorkspaceTabs,     // Update workspace's tab state
} = useWorkspaces(defaultWorkspaceName);
```

### Methods

- `createWorkspace(name: string, color?: string): string` - Creates new workspace and switches to it. Returns workspace ID.
- `switchWorkspace(workspaceId: string): void` - Switches to the specified workspace.
- `deleteWorkspace(workspaceId: string): void` - Deletes workspace (cannot delete last workspace).
- `renameWorkspace(workspaceId: string, newName: string): void` - Renames a workspace.
- `updateWorkspaceTabs(workspaceId: string, tabs: Tab[], activeTab: string): void` - Updates workspace's tab state.

## Workspace Context

Each workspace maintains:
- **Open Tabs**: All publication tabs currently open in this workspace
- **Active Tab**: Which tab (pinned or publication) is currently active
- **Future**: Chat conversation history, graph state, filters, etc.

When you switch workspaces:
- Tabs are saved in the previous workspace
- New workspace's tabs are restored
- Active tab is restored
- All context switches seamlessly

## Color Palette

Available workspace colors:
- blue, red, green, yellow, cyan, pink, grape, violet, indigo, teal

## Layout

The sidebar uses a flexbox layout with two sections:
- **Top Section (Workspace List)**: Scrollable list of workspaces (flex: 1)
- **Bottom Section (UMAP Preview)**: Fixed height visualization preview (150px)

## Styling

The sidebar uses CSS modules (`Sidebar.module.css`) with:
- Fixed width: 200px (matches logo section in header)
- Full height with flexbox layout
- Scrollable workspace list section
- Fixed UMAP preview at bottom
- Hover effects on workspace items
- Active workspace highlighting
- Action buttons appear on hover
- Smooth transitions

## Interactions

### Creating a Workspace
1. Click "New" button
2. Enter workspace name in modal
3. Select a color (optional)
4. Click "Create"
5. Automatically switches to new workspace

### Editing a Workspace
1. Ensure workspace is active
2. Click pencil icon
3. Edit name inline
4. Press Enter or click checkmark to save
5. Press Escape or click X to cancel

### Deleting a Workspace
1. Ensure workspace is active
2. Click trash icon
3. Workspace is deleted immediately
4. Switches to first remaining workspace
5. Cannot delete if it's the last workspace

## Integration

The Sidebar integrates with:
- **BrowserHeader**: Tabs switch when workspace changes
- **App State**: Tab state is synced with workspace
- **Future Components**: Chat history, graph state, etc.
