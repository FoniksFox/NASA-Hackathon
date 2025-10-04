import { useState, useCallback } from 'react';
import type { Tab } from './useBrowserTabs';

export interface Workspace {
  id: string;
  name: string;
  color?: string; // Optional color for visual identification
  openTabs: Tab[];
  activeTab: string;
  // Future: Add chat history, graph state, etc.
}

export interface UseWorkspacesReturn {
  workspaces: Workspace[];
  activeWorkspaceId: string;
  activeWorkspace: Workspace | undefined;
  createWorkspace: (name: string, color?: string) => string;
  switchWorkspace: (workspaceId: string) => void;
  deleteWorkspace: (workspaceId: string) => void;
  renameWorkspace: (workspaceId: string, newName: string) => void;
  updateWorkspaceTabs: (workspaceId: string, tabs: Tab[], activeTab: string) => void;
}

const DEFAULT_COLORS = [
  'blue', 'red', 'green', 'yellow', 'cyan', 'pink', 'grape', 'violet', 'indigo', 'teal'
];

/**
 * Hook for managing workspaces
 * Each workspace maintains its own set of tabs, active tab, and context
 */
export function useWorkspaces(defaultWorkspaceName = 'Default'): UseWorkspacesReturn {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([
    {
      id: 'workspace-1',
      name: defaultWorkspaceName,
      color: 'blue',
      openTabs: [],
      activeTab: 'chat',
    },
  ]);
  
  const [activeWorkspaceId, setActiveWorkspaceId] = useState<string>('workspace-1');

  const activeWorkspace = workspaces.find(w => w.id === activeWorkspaceId);

  const createWorkspace = useCallback((name: string, color?: string): string => {
    const newWorkspaceId = `workspace-${Date.now()}`;
    const newWorkspace: Workspace = {
      id: newWorkspaceId,
      name,
      color: color || DEFAULT_COLORS[workspaces.length % DEFAULT_COLORS.length],
      openTabs: [],
      activeTab: 'chat',
    };

    setWorkspaces(prev => [...prev, newWorkspace]);
    setActiveWorkspaceId(newWorkspaceId);
    return newWorkspaceId;
  }, [workspaces.length]);

  const switchWorkspace = useCallback((workspaceId: string) => {
    const workspace = workspaces.find(w => w.id === workspaceId);
    if (workspace) {
      setActiveWorkspaceId(workspaceId);
    }
  }, [workspaces]);

  const deleteWorkspace = useCallback((workspaceId: string) => {
    if (workspaces.length <= 1) {
      // Don't delete the last workspace
      return;
    }

    setWorkspaces(prev => {
      const filtered = prev.filter(w => w.id !== workspaceId);
      
      // If deleting active workspace, switch to first remaining workspace
      if (activeWorkspaceId === workspaceId && filtered.length > 0) {
        setActiveWorkspaceId(filtered[0].id);
      }
      
      return filtered;
    });
  }, [workspaces.length, activeWorkspaceId]);

  const renameWorkspace = useCallback((workspaceId: string, newName: string) => {
    setWorkspaces(prev =>
      prev.map(w => w.id === workspaceId ? { ...w, name: newName } : w)
    );
  }, []);

  const updateWorkspaceTabs = useCallback((
    workspaceId: string,
    tabs: Tab[],
    activeTab: string
  ) => {
    setWorkspaces(prev =>
      prev.map(w =>
        w.id === workspaceId
          ? { ...w, openTabs: tabs, activeTab }
          : w
      )
    );
  }, []);

  return {
    workspaces,
    activeWorkspaceId,
    activeWorkspace,
    createWorkspace,
    switchWorkspace,
    deleteWorkspace,
    renameWorkspace,
    updateWorkspaceTabs,
  };
}
