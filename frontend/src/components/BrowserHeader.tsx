import { useEffect, useRef } from 'react';
import { Group, UnstyledButton, ActionIcon, Box, Text, Tooltip } from '@mantine/core';
import { IconX, IconMessageCircle, IconNetwork } from '@tabler/icons-react';
import classes from './BrowserHeader.module.css';

export interface Tab {
  id: string;
  title: string;
  type: 'pinned' | 'document';
  icon?: React.ReactNode;
}

interface BrowserHeaderProps {
  logoUrl?: string;
  appName?: string;
  activeTab: string;
  publicationTabs?: Tab[];
  onTabChange: (tabId: string) => void;
  onTabClose: (tabId: string) => void;
}

export default function BrowserHeader({
  logoUrl,
  appName = 'NASA Bioscience Explorer',
  activeTab,
  publicationTabs = [],
  onTabChange,
  onTabClose,
}: BrowserHeaderProps) {
  const tabsContainerRef = useRef<HTMLDivElement>(null);
  const activeTabRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to active tab when it changes
  useEffect(() => {
    if (activeTabRef.current && tabsContainerRef.current) {
      const tabElement = activeTabRef.current;
      const container = tabsContainerRef.current;
      
      const tabLeft = tabElement.offsetLeft;
      const tabRight = tabLeft + tabElement.offsetWidth;
      const containerScrollLeft = container.scrollLeft;
      const containerWidth = container.offsetWidth;
      
      // Scroll if tab is not fully visible
      if (tabLeft < containerScrollLeft) {
        container.scrollTo({ left: tabLeft - 20, behavior: 'smooth' });
      } else if (tabRight > containerScrollLeft + containerWidth) {
        container.scrollTo({ left: tabRight - containerWidth + 20, behavior: 'smooth' });
      }
    }
  }, [activeTab]);

  // Enable horizontal scrolling with mouse wheel
  useEffect(() => {
    const container = tabsContainerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      // Only handle horizontal scroll if we have overflow
      if (container.scrollWidth > container.clientWidth) {
        e.preventDefault();
        container.scrollLeft += e.deltaY;
      }
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => container.removeEventListener('wheel', handleWheel);
  }, []);
  // Pinned tabs that can't be closed
  const pinnedTabs: Tab[] = [
    { id: 'chat', title: 'AI Chat', type: 'pinned', icon: <IconMessageCircle size={16} /> },
    { id: 'graph', title: 'Graph', type: 'pinned', icon: <IconNetwork size={16} /> },
  ];

  const handleTabClick = (tabId: string) => {
    onTabChange(tabId);
  };

  const handleCloseTab = (tabId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    onTabClose(tabId);
  };

  return (
    <Box className={classes.header}>
      <Group gap={0} h="100%" wrap="nowrap" className={classes.headerContent}>
        {/* Logo + Name Section */}
        <Box className={classes.logoSection}>
          <Group gap="xs" px="md">
            {logoUrl && (
              <img 
                src={logoUrl} 
                alt="Logo" 
                style={{ width: 24, height: 24, objectFit: 'contain' }} 
              />
            )}
            <Text size="sm" fw={600} style={{ whiteSpace: 'nowrap' }}>
              {appName}
            </Text>
          </Group>
        </Box>

        {/* Pinned Tabs Section - Always Visible */}
        <Group gap={0} h="100%" wrap="nowrap">
          {pinnedTabs.map((tab) => (
            <Tooltip label={tab.title} key={tab.id} position="bottom" withArrow>
              <Box
                className={`${classes.pinnedTab} ${activeTab === tab.id ? classes.tabActive : ''}`}
              >
                <UnstyledButton
                  onClick={() => handleTabClick(tab.id)}
                  className={classes.tabButton}
                  aria-label={tab.title}
                >
                  {tab.icon}
                </UnstyledButton>
              </Box>
            </Tooltip>
          ))}
        </Group>

        {/* Publication Tabs Section - Scrollable */}
        <Box className={classes.tabsContainer} ref={tabsContainerRef}>
          <Group gap={0} h="100%" wrap="nowrap" className={classes.tabsWrapper}>
            {publicationTabs.map((tab) => (
              <Box
                key={tab.id}
                ref={activeTab === tab.id ? activeTabRef : null}
                className={`${classes.tab} ${activeTab === tab.id ? classes.tabActive : ''}`}
              >
                <UnstyledButton
                  onClick={() => handleTabClick(tab.id)}
                  className={classes.tabButton}
                >
                  <Group gap="xs" wrap="nowrap" style={{ flex: 1, minWidth: 0 }}>
                    {tab.icon}
                    <Text 
                      size="sm" 
                      style={{ 
                        overflow: 'hidden', 
                        textOverflow: 'ellipsis', 
                        whiteSpace: 'nowrap' 
                      }}
                    >
                      {tab.title}
                    </Text>
                  </Group>
                </UnstyledButton>
                
                {tab.type === 'document' && (
                  <ActionIcon
                    size="xs"
                    variant="subtle"
                    color="gray"
                    className={classes.closeButton}
                    onClick={(e) => handleCloseTab(tab.id, e)}
                    aria-label={`Close ${tab.title}`}
                  >
                    <IconX size={12} />
                  </ActionIcon>
                )}
              </Box>
            ))}
          </Group>
        </Box>
      </Group>
    </Box>
  );
}
