import './App.css'
import { Button, Stack, Box, Text } from '@mantine/core'
import { BrowserHeader, Sidebar, PublicationViewer } from './components'
import { useWorkspaces } from './hooks'
import { useEffect, useState, useRef } from 'react'
import type { Tab } from './hooks'

export default function App() {
  const {
    workspaces,
    activeWorkspaceId,
    activeWorkspace,
    createWorkspace,
    switchWorkspace,
    deleteWorkspace,
    renameWorkspace,
    updateWorkspaceTabs,
  } = useWorkspaces('Main Workspace');

  // Local state for current workspace tabs
  const [activeTab, setActiveTab] = useState(activeWorkspace?.activeTab || 'chat');
  const [publicationTabs, setPublicationTabs] = useState<Tab[]>(activeWorkspace?.openTabs || []);
  
  // Track if we're currently loading from workspace (to prevent update loop)
  const isLoadingFromWorkspace = useRef(false);
  const prevWorkspaceId = useRef(activeWorkspaceId);

  // Sync with workspace when switching
  useEffect(() => {
    // Only load if workspace actually changed
    if (prevWorkspaceId.current !== activeWorkspaceId && activeWorkspace) {
      isLoadingFromWorkspace.current = true;
      setActiveTab(activeWorkspace.activeTab);
      setPublicationTabs(activeWorkspace.openTabs);
      prevWorkspaceId.current = activeWorkspaceId;
      
      // Reset flag after state updates
      setTimeout(() => {
        isLoadingFromWorkspace.current = false;
      }, 0);
    }
  }, [activeWorkspaceId, activeWorkspace]);

  // Update workspace when tabs change (but not when loading from workspace)
  useEffect(() => {
    if (activeWorkspaceId && !isLoadingFromWorkspace.current) {
      updateWorkspaceTabs(activeWorkspaceId, publicationTabs, activeTab);
    }
  }, [activeTab, publicationTabs, activeWorkspaceId, updateWorkspaceTabs]);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
  };

  const handleTabClose = (tabId: string) => {
    setPublicationTabs(prev => {
      const filtered = prev.filter(tab => tab.id !== tabId);
      
      // If closing active tab, switch to another tab
      if (activeTab === tabId) {
        if (filtered.length > 0) {
          setActiveTab(filtered[filtered.length - 1].id);
        } else {
          setActiveTab('chat');
        }
      }
      
      return filtered;
    });
  };

  const addPublicationTab = (title: string) => {
    const newTabId = `pub-${Date.now()}`;
    const newTab: Tab = {
      id: newTabId,
      title,
      type: 'document',
    };

    setPublicationTabs(prev => [...prev, newTab]);
    setActiveTab(newTabId);
  };

  // Demo function to add sample publication tabs
  const addSamplePublication = () => {
    const titles = [
      'Plant Growth in Microgravity',
      'Cell Behavior Studies',
      'Radiation Effects on DNA',
      'Bone Density in Space',
      'Muscle Atrophy Research',
    ];
    const randomTitle = titles[Math.floor(Math.random() * titles.length)];
    addPublicationTab(randomTitle);
  };

  return (
    <div style={{ display: 'flex', height: '100vh', flexDirection: 'column', width: '100%', maxWidth: '100vw', overflow: 'hidden' }}>
      <BrowserHeader 
        logoUrl="/logo_clear.png"
        appName="NASA Bioscience Explorer"
        activeTab={activeTab}
        publicationTabs={publicationTabs}
        onTabChange={handleTabChange}
        onTabClose={handleTabClose}
      />
      <main style={{ flex: 1, display: 'flex', minWidth: 0, minHeight: 0 }}>
        <Sidebar
          workspaces={workspaces}
          activeWorkspaceId={activeWorkspaceId}
          onSwitchWorkspace={switchWorkspace}
          onCreateWorkspace={createWorkspace}
          onDeleteWorkspace={deleteWorkspace}
          onRenameWorkspace={renameWorkspace}
        />
        <section style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, minHeight: 0 }}>
          {activeTab === 'chat' && (
            <Box p="md">
              <Stack gap="md">
                <h2>AI Chat</h2>
                <Text c="dimmed">Chat interface coming soon...</Text>
                
                {/* Demo button to test tab functionality */}
                <div>
                  <Button onClick={addSamplePublication}>
                    Open Sample Publication
                  </Button>
                </div>
              </Stack>
            </Box>
          )}

          {activeTab === 'graph' && (
            <Box p="md">
              <Stack gap="md">
                <h2>Graph View</h2>
                <Text c="dimmed">Graph visualization coming soon...</Text>
              </Stack>
            </Box>
          )}

          {activeTab.startsWith('pub-') && (
            <PublicationViewer publicationId={activeTab} />
          )}
        </section>
      </main>
    </div>
  )
}
