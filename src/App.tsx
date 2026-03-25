import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Marketplace from './pages/Marketplace'
import Workspace from './pages/Workspace'
import KnowledgeBase from './pages/KnowledgeBase'
import Settings from './pages/Settings'
import DeveloperCenter from './pages/DeveloperCenter'
import DataCenter from './pages/DataCenter'
import CreateAgent from './pages/CreateAgent'
import Login from './pages/Login'
import { ThemeProvider } from './contexts/ThemeContext'
import { HistoryProvider } from './contexts/HistoryContext'
import { FavoritesProvider } from './contexts/FavoritesContext'
import { AuthProvider, useAuth } from './contexts/AuthContext'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth()
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  
  return <>{children}</>
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <HistoryProvider>
          <FavoritesProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route
                  path="/"
                  element={
                    <ProtectedRoute>
                      <Layout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<Home />} />
                  <Route path="marketplace" element={<Marketplace />} />
                  <Route path="knowledge-base" element={<KnowledgeBase />} />
                  <Route path="settings" element={<Settings />} />
                  <Route path="developer" element={<DeveloperCenter />} />
                  <Route path="data-center" element={<DataCenter />} />
                </Route>
                <Route
                  path="/workspace/:agentId"
                  element={
                    <ProtectedRoute>
                      <Workspace />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/developer/create"
                  element={
                    <ProtectedRoute>
                      <CreateAgent />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </BrowserRouter>
          </FavoritesProvider>
        </HistoryProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
