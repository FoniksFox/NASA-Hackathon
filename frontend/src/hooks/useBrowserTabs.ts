import { useState, useCallback } from 'react';

export interface Tab {
  id: string;
  title: string;
  type: 'pinned' | 'document';
  icon?: React.ReactNode;
}

export interface UseBrowserTabsReturn {
  activeTab: string;
  publicationTabs: Tab[];
  setActiveTab: (tabId: string) => void;
  addPublicationTab: (title: string, id?: string) => string;
  closePublicationTab: (tabId: string) => void;
  updateTabTitle: (tabId: string, newTitle: string) => void;
}

/**
 * Hook for managing browser-style tabs with pinned and dynamic publication tabs
 */
export function useBrowserTabs(initialActiveTab: string = 'chat'): UseBrowserTabsReturn {
  const [activeTab, setActiveTab] = useState<string>(initialActiveTab);
  const [publicationTabs, setPublicationTabs] = useState<Tab[]>([]);

  const addPublicationTab = useCallback((title: string, id?: string): string => {
    const newTabId = id || `pub-${Date.now()}`;
    
    // Check if tab already exists
    const existingTab = publicationTabs.find(tab => tab.id === newTabId);
    if (existingTab) {
      setActiveTab(newTabId);
      return newTabId;
    }

    const newTab: Tab = {
      id: newTabId,
      title,
      type: 'document',
    };

    setPublicationTabs(prev => [...prev, newTab]);
    setActiveTab(newTabId);
    return newTabId;
  }, [publicationTabs]);

  const closePublicationTab = useCallback((tabId: string) => {
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
  }, [activeTab]);

  const updateTabTitle = useCallback((tabId: string, newTitle: string) => {
    setPublicationTabs(prev => 
      prev.map(tab => 
        tab.id === tabId ? { ...tab, title: newTitle } : tab
      )
    );
  }, []);

  return {
    activeTab,
    publicationTabs,
    setActiveTab,
    addPublicationTab,
    closePublicationTab,
    updateTabTitle,
  };
}
