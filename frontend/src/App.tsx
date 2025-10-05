import './App.css'
import { BrowserHeader, Sidebar, PublicationViewer, GraphView, ChatView } from './components'
import { useWorkspaces } from './hooks'
import { useEffect, useState, useRef } from 'react'
import type { Tab, Message } from './hooks'
import { ragApi, handleApiError } from './services/api'

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
    updateWorkspaceChatMessages,
    updateWorkspaceCurrentTopic,
  } = useWorkspaces('Main Workspace');

  // Local state for current workspace tabs
  const [activeTab, setActiveTab] = useState(activeWorkspace?.activeTab || 'chat');
  const [publicationTabs, setPublicationTabs] = useState<Tab[]>(activeWorkspace?.openTabs || []);
  
  // Local state for chat messages
  const [chatMessages, setChatMessages] = useState<Message[]>(activeWorkspace?.chatMessages || []);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [currentTopic, setCurrentTopic] = useState<string | undefined>(activeWorkspace?.currentTopic);
  
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
      setChatMessages(activeWorkspace.chatMessages);
      setCurrentTopic(activeWorkspace.currentTopic);
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

  // Update workspace when chat messages change
  useEffect(() => {
    if (activeWorkspaceId && !isLoadingFromWorkspace.current) {
      updateWorkspaceChatMessages(activeWorkspaceId, chatMessages);
    }
  }, [chatMessages, activeWorkspaceId, updateWorkspaceChatMessages]);

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

  const handleSendMessage = async (message: string) => {
    // Add user message
    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: message,
      timestamp: new Date(),
    };

    setChatMessages(prev => [...prev, userMessage]);
    setIsChatLoading(true);

    try {
      // Step 1: Find the most relevant topic for the question
      const detectedTopic = await ragApi.findTopic(message);
      
      // Step 2: Get AI response for the question within that topic
      const aiResponse = await ragApi.askTopic(detectedTopic, message);
      
      const aiMessage: Message = {
        id: `msg-${Date.now()}-ai`,
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date(),
        topic: detectedTopic,
      };

      setChatMessages(prev => [...prev, aiMessage]);
      
      // Update current topic for workspace
      setCurrentTopic(detectedTopic);
      if (activeWorkspaceId) {
        updateWorkspaceCurrentTopic(activeWorkspaceId, detectedTopic);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Add error message to chat
      const errorMessage: Message = {
        id: `msg-${Date.now()}-error`,
        role: 'assistant',
        content: `Sorry, I encountered an error: ${handleApiError(error)}. Please make sure the backend server is running.`,
        timestamp: new Date(),
      };
      setChatMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsChatLoading(false);
    }
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
            <ChatView
              messages={chatMessages}
              onSendMessage={handleSendMessage}
              isLoading={isChatLoading}
              currentTopic={currentTopic}
            />
          )}

          {activeTab === 'graph' && (
            <GraphView
              activePublicationId={activeTab === 'graph' ? undefined : activeTab}
              onNodeClick={addPublicationTab}
            />
          )}

          {activeTab.startsWith('pub-') && (
            <PublicationViewer publicationId={activeTab} />
          )}
        </section>
      </main>
    </div>
  )
}
