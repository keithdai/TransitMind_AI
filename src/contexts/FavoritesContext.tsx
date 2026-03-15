import { createContext, useContext, useState, ReactNode } from 'react'

interface FavoriteAgent {
  id: string
  name: string
  icon: string
  color: string
  addedAt: Date
}

interface FavoritesContextType {
  favorites: FavoriteAgent[]
  addFavorite: (agent: Omit<FavoriteAgent, 'addedAt'>) => void
  removeFavorite: (id: string) => void
  isFavorite: (id: string) => boolean
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined)

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<FavoriteAgent[]>([
    { id: '1', name: '交通分析智能体', icon: '🚦', color: 'from-cyan-500 to-blue-500', addedAt: new Date() },
    { id: '3', name: '报告生成智能体', icon: '📊', color: 'from-green-500 to-emerald-500', addedAt: new Date() },
  ])

  const addFavorite = (agent: Omit<FavoriteAgent, 'addedAt'>) => {
    setFavorites(prev => [...prev, { ...agent, addedAt: new Date() }])
  }

  const removeFavorite = (id: string) => {
    setFavorites(prev => prev.filter(fav => fav.id !== id))
  }

  const isFavorite = (id: string) => favorites.some(fav => fav.id === id)

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  )
}

export function useFavorites() {
  const context = useContext(FavoritesContext)
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider')
  }
  return context
}
