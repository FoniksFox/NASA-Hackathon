# Components

This directory contains reusable UI components for Simbiosis (NASA Bioscience Explorer).

## BrowserHeader

A browser-style header with tabs functionality. Features:

- **Logo/Name Section**: Fixed left section (200px width) for branding, positioned above the sidebar
- **Pinned Tabs**: Two permanent icon-only tabs (AI Chat, Graph) that are always visible and cannot be closed
  - Fixed width (48px each)
  - Show only icons for compact display
  - Tooltips on hover reveal full names
- **Publication Tabs**: Dynamic tabs that can be opened and closed, representing open publications
  - Scrollable horizontally when many tabs are open
  - Show icon + text
- **Tab Management**: Click to switch tabs, click X to close publication tabs

### Usage

```tsx
import { BrowserHeader } from './components';
import { useBrowserTabs } from './hooks';

function App() {
  const {
    activeTab,
    publicationTabs,
    setActiveTab,
    addPublicationTab,
    closePublicationTab,
  } = useBrowserTabs('chat');

  return (
    <BrowserHeader 
      appName="Simbiosis"
      logoUrl="/logo_clear.png" // optional
      activeTab={activeTab}
      publicationTabs={publicationTabs}
      onTabChange={setActiveTab}
      onTabClose={closePublicationTab}
    />
  );
}
```

### Props

- `appName` (string, optional): Application name displayed next to logo. Default: "NASA Bioscience Explorer"
- `logoUrl` (string, optional): URL or path to logo image
- `activeTab` (string, required): ID of the currently active tab
- `publicationTabs` (Tab[], optional): Array of publication tabs to display
- `onTabChange` ((tabId: string) => void, required): Callback when a tab is clicked
- `onTabClose` ((tabId: string) => void, required): Callback when a publication tab is closed

### Tab Types

```typescript
interface Tab {
  id: string;           // Unique identifier
  title: string;        // Display title
  type: 'pinned' | 'document';
  icon?: React.ReactNode; // Optional icon
}
```

### Hooks

#### useBrowserTabs

Hook for managing browser-style tabs state.

```typescript
const {
  activeTab,              // Currently active tab ID
  publicationTabs,        // Array of publication tabs
  setActiveTab,           // Function to switch active tab
  addPublicationTab,      // Function to add a new publication tab
  closePublicationTab,    // Function to close a publication tab
  updateTabTitle,         // Function to update a tab's title
} = useBrowserTabs(initialActiveTab);
```

**Methods:**

- `addPublicationTab(title: string, id?: string): string` - Adds a new publication tab and activates it. Returns the tab ID.
- `closePublicationTab(tabId: string): void` - Closes a publication tab. If it was active, switches to another tab.
- `updateTabTitle(tabId: string, newTitle: string): void` - Updates the title of an existing tab.

### Styling

The header uses CSS modules (`BrowserHeader.module.css`) with Mantine's color tokens for automatic dark/light mode support.

Key features:
- **Layout**:
  - Height: 40px
  - Logo section width: 200px (matches sidebar width)
  - Pinned tabs: Fixed width 48px each (icon only)
  - Publication tabs: min-width 140px, max-width 200px (with ellipsis for overflow)
  
- **Interactions**:
  - Active tab indicated by bottom border in primary color
  - Close button appears on hover for publication tabs
  - Tooltips show full names for pinned tabs on hover
  
- **Scrolling** (publication tabs only):
  - Horizontal scrolling when many tabs are open
  - Mouse wheel support for horizontal scrolling
  - Auto-scroll to keep active tab visible
  - Thin scrollbar (4px height) that appears on hover
  
- **Fixed Elements**:
  - Logo section and pinned tabs remain visible during scroll
  - Only publication tabs scroll horizontally
