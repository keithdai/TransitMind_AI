import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Marketplace from './pages/Marketplace'
import Workspace from './pages/Workspace'
import KnowledgeBase from './pages/KnowledgeBase'
import Settings from './pages/Settings'
import { ThemeProvider } from './contexts/ThemeContext'
import { HistoryProvider } from './contexts/HistoryContext'
import { FavoritesProvider } from './contexts/FavoritesContext'

function App() {
  return (
    <ThemeProvider>
      <HistoryProvider>
        <FavoritesProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="marketplace" element={<Marketplace />} />
                <Route path="knowledge-base" element={<KnowledgeBase />} />
                <Route path="settings" element={<Settings />} />
              </Route>
              <Route path="/workspace/:agentId" element={<Workspace />} />
            </Routes>
          </BrowserRouter>
        </FavoritesProvider>
      </HistoryProvider>
    </ThemeProvider>
  )
}

export default App
