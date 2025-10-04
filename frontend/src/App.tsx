import './App.css'
import { Button, Stack } from '@mantine/core'
import BrowserHeader from './components/BrowserHeader'
import { useBrowserTabs } from './hooks/useBrowserTabs'

export default function App() {
  const {
    activeTab,
    publicationTabs,
    setActiveTab,
    addPublicationTab,
    closePublicationTab,
  } = useBrowserTabs('chat');

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
    <div style={{ display: 'flex', minHeight: '100vh', flexDirection: 'column', width: '100%', maxWidth: '100vw', overflow: 'hidden' }}>
      <BrowserHeader 
        appName="NASA Bioscience Explorer"
        activeTab={activeTab}
        publicationTabs={publicationTabs}
        onTabChange={setActiveTab}
        onTabClose={closePublicationTab}
      />
      <main style={{ flex: 1, display: 'flex', minWidth: 0 }}>
        <nav style={{ width: 200, padding: 12, borderRight: '1px solid #eee' }}>Navbar</nav>
        <section style={{ flex: 1, padding: 16 }}>
          <Stack gap="md">
            <h2>Welcome</h2>
            <p>Active Tab: <strong>{activeTab}</strong></p>
            <p>This is the frontend shell. Build the UMAP explorer and chat UI inside.</p>
            
            {/* Demo button to test tab functionality */}
            <div>
              <Button onClick={addSamplePublication}>
                Open Sample Publication
              </Button>
            </div>
          </Stack>
        </section>
      </main>
    </div>
  )
}
