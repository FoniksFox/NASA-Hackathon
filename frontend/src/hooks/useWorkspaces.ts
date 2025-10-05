import { useState, useCallback } from 'react';
import type { Tab } from './useBrowserTabs';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  topic?: string; // The specialist/topic handling this message
}

export interface Workspace {
  id: string;
  name: string;
  color?: string; // Optional color for visual identification
  openTabs: Tab[];
  activeTab: string;
  chatMessages: Message[]; // Chat history for this workspace
  currentTopic?: string; // Current active specialist/topic
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
  updateWorkspaceChatMessages: (workspaceId: string, messages: Message[]) => void;
  updateWorkspaceCurrentTopic: (workspaceId: string, topic: string | undefined) => void;
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
      chatMessages: [],
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
      chatMessages: [],
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

  const updateWorkspaceChatMessages = useCallback((
    workspaceId: string,
    messages: Message[]
  ) => {
    setWorkspaces(prev =>
      prev.map(w =>
        w.id === workspaceId
          ? { ...w, chatMessages: messages }
          : w
      )
    );
  }, []);

  const updateWorkspaceCurrentTopic = useCallback((
    workspaceId: string,
    topic: string | undefined
  ) => {
    setWorkspaces(prev =>
      prev.map(w =>
        w.id === workspaceId
          ? { ...w, currentTopic: topic }
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
    updateWorkspaceChatMessages,
    updateWorkspaceCurrentTopic,
  };
}
