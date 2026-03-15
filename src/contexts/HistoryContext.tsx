import { createContext, useContext, useState, ReactNode } from 'react'

interface HistoryItem {
  id: string
  query: string
  timestamp: Date
  agentId?: string
  agentName?: string
}

interface HistoryContextType {
  history: HistoryItem[]
  addToHistory: (query: string, agentId?: string, agentName?: string) => void
  clearHistory: () => void
  removeFromHistory: (id: string) => void
}

const HistoryContext = createContext<HistoryContextType | undefined>(undefined)

export function HistoryProvider({ children }: { children: ReactNode }) {
  const [history, setHistory] = useState<HistoryItem[]>([
    { id: '1', query: '帮我分析XX路段的交通流量数据', timestamp: new Date(Date.now() - 1000 * 60 * 30), agentId: '1', agentName: '交通分析智能体' },
    { id: '2', query: '生成一份交通规划报告', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), agentId: '3', agentName: '报告生成智能体' },
    { id: '3', query: '检查这个项目的合规性', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), agentId: '2', agentName: '合规检查智能体' },
    { id: '4', query: '查询上个月的应急事件统计', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), agentId: '4', agentName: '应急响应智能体' },
    { id: '5', query: '优化YY线路的运营方案', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48), agentId: '6', agentName: '线路优化智能体' },
  ])

  const addToHistory = (query: string, agentId?: string, agentName?: string) => {
    const newItem: HistoryItem = {
      id: Date.now().toString(),
      query,
      timestamp: new Date(),
      agentId,
      agentName,
    }
    setHistory(prev => [newItem, ...prev].slice(0, 20))
  }

  const clearHistory = () => setHistory([])

  const removeFromHistory = (id: string) => {
    setHistory(prev => prev.filter(item => item.id !== id))
  }

  return (
    <HistoryContext.Provider value={{ history, addToHistory, clearHistory, removeFromHistory }}>
      {children}
    </HistoryContext.Provider>
  )
}

export function useHistory() {
  const context = useContext(HistoryContext)
  if (!context) {
    throw new Error('useHistory must be used within a HistoryProvider')
  }
  return context
}
