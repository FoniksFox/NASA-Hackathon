import './App.css'

export default function App() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', flexDirection: 'column' }}>
      <header style={{ height: 60, display: 'flex', alignItems: 'center', padding: '0 16px', fontWeight: 700 }}>NASA Bioscience Explorer</header>
      <main style={{ flex: 1, display: 'flex' }}>
        <nav style={{ width: 200, padding: 12, borderRight: '1px solid #eee' }}>Navbar</nav>
        <section style={{ flex: 1, padding: 16 }}>
          <h2>Welcome</h2>
          <p>This is the frontend shell. Build the UMAP explorer and chat UI inside.</p>
        </section>
      </main>
    </div>
  )
}
