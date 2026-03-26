import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Search, 
  Star, 
  Users, 
  Clock,
  ChevronRight,
  Check,
  Plus,
  X,
  Layers,
  Heart,
  Sparkles,
  PlayCircle,
  Link2,
  Zap,
  Target,
  Trash2,
  FolderKanban,
  Edit3,
  Download,
  Upload,
  GripVertical
} from 'lucide-react'
import { useFavorites } from '../contexts/FavoritesContext'
import { useTheme } from '../contexts/ThemeContext'
import { agents, categories, Agent } from '../data/agents'

const categoryIcons: Record<string, React.ElementType> = {
  all: Layers,
  knowledge: Search,
  business: FolderKanban,
  procurement: Target,
  hr: Users,
}

const recommendedForUser = [
  { reason: '基于您的部门（综合科）', agentId: 'mvp_1' },
  { reason: '本周热门推荐', agentId: 'mvp_3' },
  { reason: '与您的历史使用相关', agentId: 'mvp_7' },
]

interface NewAgentForm {
  name: string
  description: string
  category: string
  icon: string
  color: string
  externalUrl: string
  tags: string
  features: string
}

export default function Marketplace() {
  const { theme } = useTheme()
  const isEnterprise = theme === 'enterprise'
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')
  const [activeFilter, setActiveFilter] = useState<'all' | 'subscribed' | 'recommended' | 'favorites' | 'mvp' | 't2'>('all')
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null)
  const [showDemoScenarios, setShowDemoScenarios] = useState(false)
  const [showAddAgent, setShowAddAgent] = useState(false)
  const [newAgent, setNewAgent] = useState<NewAgentForm>({
    name: '',
    description: '',
    category: 'knowledge',
    icon: '🤖',
    color: 'from-blue-500 to-indigo-500',
    externalUrl: '',
    tags: '',
    features: ''
  })
  const [customAgents, setCustomAgents] = useState<Agent[]>(() => {
    const saved = localStorage.getItem('customAgents')
    return saved ? JSON.parse(saved) : []
  })
  const [customAgentOrder, setCustomAgentOrder] = useState<string[]>(() => {
    const saved = localStorage.getItem('agentOrder')
    return saved ? JSON.parse(saved) : []
  })
  const [draggedId, setDraggedId] = useState<string | null>(null)
  const [dragOverId, setDragOverId] = useState<string | null>(null)
  const [showEditAgent, setShowEditAgent] = useState(false)
  const [editForm, setEditForm] = useState<NewAgentForm>({
    name: '',
    description: '',
    category: 'knowledge',
    icon: '🤖',
    color: 'from-blue-500 to-indigo-500',
    externalUrl: '',
    tags: '',
    features: ''
  })
  const { addFavorite, removeFavorite, isFavorite } = useFavorites()

  useEffect(() => {
    localStorage.setItem('customAgents', JSON.stringify(customAgents))
  }, [customAgents])

  useEffect(() => {
    localStorage.setItem('agentOrder', JSON.stringify(customAgentOrder))
  }, [customAgentOrder])

  const allAgents = [...agents, ...customAgents]

  const filteredAgents = allAgents.filter(agent => {
    const matchesSearch = agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          agent.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = activeCategory === 'all' || agent.category === activeCategory
    let matchesFilter = true
    if (activeFilter === 'subscribed') matchesFilter = agent.subscribed
    if (activeFilter === 'recommended') matchesFilter = agent.recommended || false
    if (activeFilter === 'favorites') matchesFilter = isFavorite(agent.id)
    if (activeFilter === 'mvp') matchesFilter = agent.phase === 'MVP'
    if (activeFilter === 't2') matchesFilter = agent.phase === 'T2'
    return matchesSearch && matchesCategory && matchesFilter
  }).sort((a, b) => {
    const orderA = customAgentOrder.indexOf(a.id)
    const orderB = customAgentOrder.indexOf(b.id)
    if (orderA !== -1 && orderB !== -1) return orderA - orderB
    if (orderA !== -1) return -1
    if (orderB !== -1) return 1
    return 0
  })

  const handleDragStart = (e: React.DragEvent, agentId: string) => {
    setDraggedId(agentId)
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', agentId)
  }

  const handleDragOver = (e: React.DragEvent, agentId: string) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    if (draggedId !== agentId) {
      setDragOverId(agentId)
    }
  }

  const handleDragLeave = () => {
    setDragOverId(null)
  }

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault()
    if (!draggedId || draggedId === targetId) {
      setDraggedId(null)
      setDragOverId(null)
      return
    }

    const draggedIndex = customAgentOrder.indexOf(draggedId)
    const targetIndex = customAgentOrder.indexOf(targetId)

    if (draggedIndex === -1 && targetIndex === -1) {
      setCustomAgentOrder([...customAgentOrder, draggedId])
    } else if (draggedIndex === -1 && targetIndex !== -1) {
      const newOrder = [...customAgentOrder]
      newOrder.splice(targetIndex, 0, draggedId)
      setCustomAgentOrder(newOrder)
    } else if (draggedIndex !== -1 && targetIndex === -1) {
      const newOrder = customAgentOrder.filter(id => id !== draggedId)
      newOrder.push(draggedId)
      setCustomAgentOrder(newOrder)
    } else {
      const newOrder = [...customAgentOrder]
      newOrder.splice(draggedIndex, 1)
      newOrder.splice(targetIndex, 0, draggedId)
      setCustomAgentOrder(newOrder)
    }

    setDraggedId(null)
    setDragOverId(null)
  }

  const handleDragEnd = () => {
    setDraggedId(null)
    setDragOverId(null)
  }

  const handleSubscribe = (agentId: string) => {
    console.log('Subscribe:', agentId)
  }

  const handleFavorite = (agent: Agent) => {
    if (isFavorite(agent.id)) {
      removeFavorite(agent.id)
    } else {
      addFavorite({ id: agent.id, name: agent.name, icon: agent.icon, color: agent.color })
    }
  }

  const handleUse = (agent: Agent) => {
    console.log('handleUse called with agent:', agent)
    console.log('agent.externalUrl:', agent.externalUrl)
    if (agent.externalUrl && agent.externalUrl.trim() !== '') {
      console.log('Opening external URL:', agent.externalUrl)
      window.open(agent.externalUrl, '_blank')
    } else {
      const workspaceUrl = `${window.location.origin}/workspace/${agent.id}`
      console.log('Opening workspace URL:', workspaceUrl)
      window.open(workspaceUrl, '_blank')
    }
  }

  const handleDeleteAgent = (agentId: string) => {
    setCustomAgents(prev => prev.filter(a => a.id !== agentId))
    if (selectedAgent?.id === agentId) {
      setSelectedAgent(null)
    }
  }

  const handleAddAgent = () => {
    if (!newAgent.name || !newAgent.externalUrl) return

    const agent: Agent = {
      id: `custom-${Date.now()}`,
      name: newAgent.name,
      description: newAgent.description,
      category: newAgent.category,
      categoryName: categories.find(c => c.id === newAgent.category)?.label || '其他',
      icon: newAgent.icon,
      color: newAgent.color,
      rating: 0,
      users: 0,
      tags: newAgent.tags.split(',').map(t => t.trim()).filter(Boolean),
      subscribed: false,
      features: newAgent.features.split(',').map(f => f.trim()).filter(Boolean),
      knowledgeBases: [],
      recommended: false,
      phase: 'T2',
      coreCapabilities: [],
      demoScenarios: [],
      externalUrl: newAgent.externalUrl
    }

    setCustomAgents(prev => [...prev, agent])
    setNewAgent({
      name: '',
      description: '',
      category: 'knowledge',
      icon: '🤖',
      color: 'from-blue-500 to-indigo-500',
      externalUrl: '',
      tags: '',
      features: ''
    })
    setShowAddAgent(false)
  }

  const iconOptions = ['🤖', '🚀', '⚡', '🎯', '💡', '🔧', '📊', '🧠', '🔮', '🌟']

const colorOptions = [
  { id: 'from-blue-500 to-indigo-500', label: '蓝紫' },
  { id: 'from-purple-500 to-pink-500', label: '紫粉' },
  { id: 'from-green-500 to-emerald-500', label: '绿' },
  { id: 'from-orange-500 to-red-500', label: '橙红' },
  { id: 'from-cyan-500 to-blue-500', label: '青蓝' },
  { id: 'from-amber-500 to-yellow-500', label: '琥珀' },
  { id: 'from-rose-500 to-pink-500', label: '玫瑰' },
  { id: 'from-teal-500 to-cyan-500', label: '青绿' },
]

  return (
    <div 
      className="h-full overflow-auto" 
      style={isEnterprise ? { background: 'var(--bg-primary)', padding: 'var(--spacing-lg)' } : { padding: '32px' }}
    >
      <div className="max-w-7xl mx-auto space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 
              className="font-display text-3xl font-bold mb-2" 
              style={isEnterprise ? { color: 'var(--text-primary)' } : { color: 'var(--text-primary)' }}
            >
              智能体市场
            </h1>
            <p style={isEnterprise ? { color: 'var(--text-secondary)' } : { color: 'var(--text-secondary)' }}>
              发现并订阅适合您工作需求的政务智能体
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm" style={isEnterprise ? { color: 'var(--text-secondary)' } : { color: 'var(--text-secondary)' }}>
              <span className="font-mono" style={isEnterprise ? { color: 'var(--color-primary)' } : { color: 'var(--accent-primary)' }}>{allAgents.length}</span>
              <span>个智能体可用</span>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                const dataStr = JSON.stringify(customAgents, null, 2)
                const blob = new Blob([dataStr], { type: 'application/json' })
                const url = URL.createObjectURL(blob)
                const a = document.createElement('a')
                a.href = url
                a.download = `custom-agents-${new Date().toISOString().slice(0, 10)}.json`
                a.click()
                URL.revokeObjectURL(url)
              }}
              className={isEnterprise ? "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all" : "cyber-button flex items-center gap-2"}
              disabled={customAgents.length === 0}
              style={isEnterprise ? {
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-secondary)'
              } : undefined}
            >
              <Download className="w-4 h-4" />
              <span>导出</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                const input = document.createElement('input')
                input.type = 'file'
                input.accept = '.json'
                input.onchange = (e) => {
                  const file = (e.target as HTMLInputElement).files?.[0]
                  if (file) {
                    const reader = new FileReader()
                    reader.onload = (event) => {
                      try {
                        const imported = JSON.parse(event.target?.result as string)
                        if (Array.isArray(imported)) {
                          setCustomAgents(imported)
                          alert(`成功导入 ${imported.length} 个智能体`)
                        } else {
                          alert('文件格式不正确')
                        }
                      } catch {
                        alert('文件解析失败')
                      }
                    }
                    reader.readAsText(file)
                  }
                }
                input.click()
              }}
              className={isEnterprise ? "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all" : "cyber-button flex items-center gap-2"}
              style={isEnterprise ? {
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-secondary)'
              } : undefined}
            >
              <Upload className="w-4 h-4" />
              <span>导入</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowAddAgent(true)}
              className={isEnterprise ? "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all" : "cyber-button-primary flex items-center gap-2"}
              style={isEnterprise ? {
                background: 'var(--color-primary)',
                color: '#ffffff'
              } : undefined}
            >
              <Plus className="w-4 h-4" />
              <span>上架智能体</span>
            </motion.button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={isEnterprise ? "p-4 rounded-lg border" : "glass-panel p-4"}
          style={isEnterprise ? {
            background: 'var(--bg-secondary)',
            borderColor: 'var(--border-color)'
          } : undefined}
        >
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={isEnterprise ? { color: 'var(--text-muted)' } : { color: 'var(--text-muted)' }} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜索智能体..."
                className={isEnterprise ? "pl-12 pr-4 py-2.5 w-full rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" : "input-cyber pl-12"}
                style={isEnterprise ? {
                  background: 'var(--bg-tertiary)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-primary)'
                } : undefined}
              />
            </div>
            
            <div className="flex items-center gap-2 flex-wrap">
              {[
                { id: 'all', label: '全部' },
                { id: 'mvp', label: 'MVP阶段', icon: Zap },
                { id: 't2', label: 'T2阶段', icon: Target },
                { id: 'subscribed', label: '已订阅' },
                { id: 'favorites', label: '收藏', icon: Heart },
                { id: 'recommended', label: '推荐', icon: Sparkles },
              ].map((filter) => (
                <motion.button
                  key={filter.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveFilter(filter.id as typeof activeFilter)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all"
                  style={isEnterprise ? {
                    background: activeFilter === filter.id ? 'var(--color-primary-lighter)' : 'var(--bg-tertiary)',
                    border: activeFilter === filter.id ? '1px solid var(--color-primary)' : '1px solid transparent',
                    color: activeFilter === filter.id ? 'var(--color-primary)' : 'var(--text-secondary)'
                  } : {
                    background: activeFilter === filter.id ? 'rgba(0, 229, 255, 0.1)' : 'rgba(255,255,255,0.05)',
                    border: activeFilter === filter.id ? '1px solid var(--border-hover)' : '1px solid var(--border-color)',
                    color: activeFilter === filter.id ? 'var(--accent-primary)' : 'var(--text-secondary)'
                  }}
                >
                  {'icon' in filter && filter.icon && <filter.icon className="w-4 h-4" />}
                  <span>{filter.label}</span>
                </motion.button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 mt-4 flex-wrap">
            {categories.map((category) => {
              const IconComponent = categoryIcons[category.id] || Layers
              return (
                <motion.button
                  key={category.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveCategory(category.id)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all"
                  style={isEnterprise ? {
                    background: activeCategory === category.id ? 'var(--color-primary-lighter)' : 'var(--bg-tertiary)',
                    border: activeCategory === category.id ? '1px solid var(--color-primary)' : '1px solid transparent',
                    color: activeCategory === category.id ? 'var(--color-primary)' : 'var(--text-secondary)'
                  } : {
                    background: activeCategory === category.id ? 'rgba(0, 229, 255, 0.1)' : 'rgba(255,255,255,0.05)',
                    border: activeCategory === category.id ? '1px solid var(--border-hover)' : '1px solid var(--border-color)',
                    color: activeCategory === category.id ? 'var(--accent-primary)' : 'var(--text-secondary)'
                  }}
                >
                  <IconComponent className="w-4 h-4" />
                  <span>{category.label}</span>
                </motion.button>
              )
            })}
          </div>
        </motion.div>

        {activeFilter === 'recommended' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={isEnterprise ? "p-4 rounded-lg border" : "glass-panel p-4"}
            style={isEnterprise ? {
              background: 'var(--bg-secondary)',
              borderColor: 'var(--border-color)'
            } : undefined}
          >
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4" style={isEnterprise ? { color: 'var(--color-primary)' } : { color: 'var(--accent-primary)' }} />
              <span className="font-medium" style={isEnterprise ? { color: 'var(--text-primary)' } : { color: 'var(--text-primary)' }}>为您推荐</span>
            </div>
            <div className="space-y-2">
              {recommendedForUser.map((rec, index) => {
                const agent = allAgents.find(a => a.id === rec.agentId)
                if (!agent) return null
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-3 rounded-lg"
                    style={isEnterprise ? {
                      background: 'var(--bg-tertiary)',
                      border: '1px solid var(--color-border-light)'
                    } : { background: 'rgba(255,255,255,0.05)' }}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${agent.color} flex items-center justify-center text-lg`}>
                        {agent.icon}
                      </div>
                      <div>
                        <div className="font-medium" style={isEnterprise ? { color: 'var(--text-primary)' } : { color: 'var(--text-primary)' }}>{agent.name}</div>
                        <div className="text-xs" style={isEnterprise ? { color: 'var(--text-muted)' } : { color: 'var(--text-muted)' }}>{rec.reason}</div>
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedAgent(agent)}
                      className={isEnterprise ? "px-3 py-1.5 rounded-lg text-xs font-medium" : "cyber-button text-xs"}
                      style={isEnterprise ? {
                        background: 'var(--bg-tertiary)',
                        color: 'var(--text-secondary)'
                      } : undefined}
                    >
                      查看详情
                    </motion.button>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-3 gap-4">
          <AnimatePresence mode="popLayout">
            {filteredAgents.map((agent, index) => (
              <motion.div
                key={agent.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05 }}
                draggable
                onDragStart={(e) => handleDragStart(e as unknown as React.DragEvent, agent.id)}
                onDragOver={(e) => handleDragOver(e as unknown as React.DragEvent, agent.id)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e as unknown as React.DragEvent, agent.id)}
                onDragEnd={handleDragEnd}
                whileHover={isEnterprise ? { y: -4, boxShadow: 'var(--shadow-hover)' } : { scale: 1.02, y: -5 }}
                onClick={() => setSelectedAgent(agent)}
                className={`${isEnterprise ? "p-5 cursor-pointer group relative rounded-lg border transition-all" : "glass-card p-5 cursor-pointer group relative"} ${
                  draggedId === agent.id ? 'opacity-50 scale-95' : ''
                } ${
                  dragOverId === agent.id ? 'ring-2 ring-blue-500 ring-offset-2' : ''
                }`}
                style={isEnterprise ? {
                  background: 'var(--bg-secondary)',
                  borderColor: dragOverId === agent.id ? 'var(--color-primary)' : 'var(--border-color)'
                } : undefined}
              >
                {agent.recommended && (
                  <div className="absolute top-3 right-3">
                    <Sparkles className="w-4 h-4" style={isEnterprise ? { color: 'var(--color-primary)' } : { color: 'var(--accent-primary)' }} />
                  </div>
                )}

                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span
                    className={isEnterprise
                      ? `px-2 py-1 rounded-full text-xs font-medium ${
                          agent.phase === 'MVP'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-blue-100 text-blue-700'
                        }`
                      : `px-2 py-1 rounded-full text-xs font-medium ${
                          agent.phase === 'MVP'
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-blue-500/20 text-blue-400'
                        }`
                    }
                  >
                    {agent.phase}
                  </span>
                  <div className="cursor-grab active:cursor-grabbing p-1 rounded hover:bg-gray-100 transition-colors" style={{ color: 'var(--text-muted)' }}>
                    <GripVertical className="w-4 h-4" />
                  </div>
                </div>
                
                <div className="flex items-start justify-between mb-4 mt-6">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${agent.color} flex items-center justify-center text-2xl group-hover:scale-110 transition-transform`}>
                    {agent.icon}
                  </div>
                  <div className="flex items-center gap-2">
                    {agent.subscribed && (
                      <div className={isEnterprise ? "flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-green-100 text-green-700" : "flex items-center gap-1 px-2 py-1 rounded-full text-xs"} style={!isEnterprise ? { background: 'rgba(34, 197, 94, 0.2)', color: '#22c55e' } : undefined}>
                        <Check className="w-3 h-3" />
                        <span>已订阅</span>
                      </div>
                    )}
                    <motion.button
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => {
                        e.stopPropagation()
                        handleFavorite(agent)
                      }}
                      className="p-1.5 rounded-lg transition-colors"
                      style={isEnterprise 
                        ? { background: isFavorite(agent.id) ? '#fef2f2' : 'var(--bg-tertiary)' }
                        : { background: isFavorite(agent.id) ? 'rgba(239, 68, 68, 0.2)' : 'rgba(255,255,255,0.05)' }
                      }
                    >
                      <Heart className={`w-4 h-4 ${isFavorite(agent.id) ? 'fill-red-500 text-red-500' : ''}`} style={isFavorite(agent.id) ? { color: '#ef4444' } : isEnterprise ? { color: 'var(--text-muted)' } : { color: 'var(--text-muted)' }} />
                    </motion.button>
                  </div>
                </div>

                <h3 className="font-display font-semibold mb-2" style={isEnterprise ? { color: 'var(--text-primary)' } : { color: 'var(--text-primary)' }}>
                  {agent.name}
                </h3>
                <p className="text-sm mb-4 line-clamp-2" style={isEnterprise ? { color: 'var(--text-secondary)' } : { color: 'var(--text-secondary)' }}>{agent.description}</p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {agent.tags.slice(0, 3).map((tag) => (
                    <span 
                      key={tag} 
                      className={isEnterprise ? "px-2 py-1 rounded text-xs" : "tag-cyber"}
                      style={isEnterprise ? { background: 'var(--color-primary-lighter)', color: 'var(--color-primary)' } : undefined}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-4" style={isEnterprise ? { color: 'var(--text-muted)' } : { color: 'var(--text-muted)' }}>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span>{agent.rating}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>{agent.users}</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-all" style={isEnterprise ? { color: 'var(--text-muted)' } : { color: 'var(--text-muted)' }} />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {selectedAgent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-8"
            style={isEnterprise ? { background: 'rgba(0, 0, 0, 0.5)' } : { background: 'rgba(0, 0, 0, 0.6)', backdropFilter: 'blur(4px)' }}
            onClick={() => setSelectedAgent(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className={isEnterprise ? "p-8 max-w-4xl w-full max-h-[85vh] overflow-auto rounded-lg border" : "glass-panel p-8 max-w-4xl w-full max-h-[85vh] overflow-auto"}
              style={isEnterprise ? {
                background: 'var(--bg-secondary)',
                borderColor: 'var(--border-color)'
              } : undefined}
            >
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${selectedAgent.color} flex items-center justify-center text-3xl`}>
                    {selectedAgent.icon}
                  </div>
                  <div>
                    <h2 className="font-display text-2xl font-bold flex items-center gap-2" style={isEnterprise ? { color: 'var(--text-primary)' } : { color: 'var(--text-primary)' }}>
                      {selectedAgent.name}
                      <span 
                        className={isEnterprise 
                          ? `text-xs px-2 py-1 rounded-full font-medium ${
                              selectedAgent.phase === 'MVP' 
                                ? 'bg-green-100 text-green-700' 
                                : 'bg-blue-100 text-blue-700'
                            }`
                          : `text-xs px-2 py-1 rounded-full font-medium ${
                              selectedAgent.phase === 'MVP' 
                                ? 'bg-green-500/20 text-green-400' 
                                : 'bg-blue-500/20 text-blue-400'
                            }`
                        }
                      >
                        {selectedAgent.phase}
                      </span>
                    </h2>
                    <div className="flex items-center gap-4 mt-1 text-sm" style={isEnterprise ? { color: 'var(--text-secondary)' } : { color: 'var(--text-secondary)' }}>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <span>{selectedAgent.rating}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{selectedAgent.users} 人使用</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>2026-03-24 更新</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleFavorite(selectedAgent)}
                    className="p-2 rounded-lg transition-colors"
                    style={isEnterprise 
                      ? { background: isFavorite(selectedAgent.id) ? '#fef2f2' : 'var(--bg-tertiary)' }
                      : { background: isFavorite(selectedAgent.id) ? 'rgba(239, 68, 68, 0.2)' : 'rgba(255,255,255,0.05)' }
                    }
                  >
                    <Heart className={`w-5 h-5 ${isFavorite(selectedAgent.id) ? 'fill-red-500' : ''}`} style={isFavorite(selectedAgent.id) ? { color: '#ef4444' } : isEnterprise ? { color: 'var(--text-muted)' } : { color: 'var(--text-muted)' }} />
                  </motion.button>
                  <button
                    onClick={() => setSelectedAgent(null)}
                    className="p-2 rounded-lg transition-colors"
                    style={isEnterprise ? { background: 'var(--bg-tertiary)' } : { background: 'rgba(255,255,255,0.05)' }}
                  >
                    <X className="w-5 h-5" style={isEnterprise ? { color: 'var(--text-muted)' } : { color: 'var(--text-muted)' }} />
                  </button>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium mb-2" style={isEnterprise ? { color: 'var(--text-secondary)' } : { color: 'var(--text-secondary)' }}>功能介绍</h3>
                  <p style={isEnterprise ? { color: 'var(--text-primary)' } : { color: 'var(--text-primary)' }}>{selectedAgent.description}</p>
                </div>

                {selectedAgent.coreCapabilities.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium mb-2" style={isEnterprise ? { color: 'var(--text-secondary)' } : { color: 'var(--text-secondary)' }}>核心能力</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedAgent.coreCapabilities.map((capability) => (
                        <span 
                          key={capability} 
                          className="px-3 py-1.5 rounded-lg text-sm font-medium"
                          style={isEnterprise 
                            ? { background: 'var(--color-primary-lighter)', color: 'var(--color-primary)' }
                            : { background: 'rgba(0, 229, 255, 0.1)', color: 'var(--accent-primary)' }
                          }
                        >
                          {capability}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {selectedAgent.features.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium mb-2" style={isEnterprise ? { color: 'var(--text-secondary)' } : { color: 'var(--text-secondary)' }}>功能特性</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedAgent.features.map((feature) => (
                        <span 
                          key={feature} 
                          className={isEnterprise ? "px-2 py-1 rounded text-xs" : "tag-cyber"}
                          style={isEnterprise ? { background: 'var(--color-primary-lighter)', color: 'var(--color-primary)' } : undefined}
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {selectedAgent.demoScenarios.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-medium" style={isEnterprise ? { color: 'var(--text-secondary)' } : { color: 'var(--text-secondary)' }}>演示场景</h3>
                      <button
                        onClick={() => setShowDemoScenarios(!showDemoScenarios)}
                        className="text-xs flex items-center gap-1"
                        style={isEnterprise ? { color: 'var(--color-primary)' } : { color: 'var(--accent-primary)' }}
                      >
                        <PlayCircle className="w-3 h-3" />
                        {showDemoScenarios ? '收起' : '展开全部'}
                      </button>
                    </div>
                    <div className="space-y-3">
                      {(showDemoScenarios ? selectedAgent.demoScenarios : selectedAgent.demoScenarios.slice(0, 1)).map((scenario, index) => (
                        <motion.div
                          key={scenario.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="p-4 rounded-xl border"
                          style={isEnterprise 
                            ? { background: 'var(--bg-tertiary)', borderColor: 'var(--border-color)' }
                            : { background: 'rgba(255,255,255,0.03)', borderColor: 'var(--border-color)' }
                          }
                        >
                          <div className="flex items-start gap-3 mb-3">
                            <div 
                              className="p-2 rounded-lg"
                              style={isEnterprise 
                                ? { background: 'var(--color-primary-lighter)' }
                                : { background: 'rgba(0, 229, 255, 0.1)' }
                              }
                            >
                              <PlayCircle className="w-4 h-4" style={isEnterprise ? { color: 'var(--color-primary)' } : { color: 'var(--accent-primary)' }} />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium mb-1" style={isEnterprise ? { color: 'var(--text-primary)' } : { color: 'var(--text-primary)' }}>{scenario.title}</h4>
                              <div className="flex flex-wrap gap-1">
                                {scenario.highlights.map((highlight) => (
                                  <span 
                                    key={highlight} 
                                    className="text-xs px-2 py-0.5 rounded"
                                    style={isEnterprise 
                                      ? { background: 'var(--color-primary-lighter)', color: 'var(--color-primary)' }
                                      : { background: 'rgba(0, 229, 255, 0.1)', color: 'var(--accent-primary)' }
                                    }
                                  >
                                    {highlight}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                          
                          <div className="space-y-3">
                            <div 
                              className="p-3 rounded-lg"
                              style={isEnterprise ? { background: 'var(--bg-secondary)', border: '1px solid var(--color-border-light)' } : { background: 'rgba(255,255,255,0.02)' }}
                            >
                              <div className="text-xs mb-1" style={isEnterprise ? { color: 'var(--text-muted)' } : { color: 'var(--text-muted)' }}>用户输入</div>
                              <div className="text-sm" style={isEnterprise ? { color: 'var(--text-primary)' } : { color: 'var(--text-primary)' }}>{scenario.userInput}</div>
                            </div>
                            <div 
                              className="p-3 rounded-lg"
                              style={isEnterprise ? { background: 'var(--color-primary-lighter)' } : { background: 'rgba(0, 229, 255, 0.05)' }}
                            >
                              <div className="text-xs mb-1" style={isEnterprise ? { color: 'var(--color-primary)' } : { color: 'var(--accent-primary)' }}>智能体响应</div>
                              <pre className="text-sm whitespace-pre-wrap font-sans" style={isEnterprise ? { color: 'var(--text-primary)' } : { color: 'var(--text-primary)' }}>{scenario.agentResponse}</pre>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedAgent.knowledgeBases.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium mb-2" style={isEnterprise ? { color: 'var(--text-secondary)' } : { color: 'var(--text-secondary)' }}>关联知识库</h3>
                    <div className="space-y-2">
                      {selectedAgent.knowledgeBases.map((kb) => (
                        <div 
                          key={kb} 
                          className="flex items-center gap-2 px-3 py-2 rounded-lg"
                          style={isEnterprise ? { background: 'var(--bg-tertiary)' } : { background: 'rgba(255,255,255,0.05)' }}
                        >
                          <Layers className="w-4 h-4" style={isEnterprise ? { color: 'var(--text-secondary)' } : { color: 'var(--accent-secondary)' }} />
                          <span className="text-sm" style={isEnterprise ? { color: 'var(--text-primary)' } : { color: 'var(--text-primary)' }}>{kb}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-4 pt-4 border-t" style={isEnterprise ? { borderColor: 'var(--border-color)' } : { borderColor: 'var(--border-color)' }}>
                  {selectedAgent.subscribed ? (
                    <>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleUse(selectedAgent)}
                        className={isEnterprise ? "flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium" : "flex-1 cyber-button-primary flex items-center justify-center gap-2"}
                        style={isEnterprise ? {
                          background: 'var(--color-primary)',
                          color: '#ffffff'
                        } : undefined}
                      >
                        <span>立即使用</span>
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={isEnterprise ? "flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium bg-green-100 text-green-700" : "cyber-button flex items-center justify-center gap-2"}
                      >
                        <Check className="w-4 h-4" />
                        已订阅
                      </motion.button>
                    </>
                  ) : (
                    <>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleSubscribe(selectedAgent.id)}
                        className={isEnterprise ? "flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium border" : "flex-1 cyber-button flex items-center justify-center gap-2"}
                        style={isEnterprise ? {
                          background: 'var(--bg-secondary)',
                          borderColor: 'var(--border-color)',
                          color: 'var(--text-secondary)'
                        } : undefined}
                      >
                        <Plus className="w-4 h-4" />
                        订阅智能体
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleUse(selectedAgent)}
                        className={isEnterprise ? "flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium" : "cyber-button-primary flex items-center justify-center gap-2"}
                        style={isEnterprise ? {
                          background: 'var(--color-primary)',
                          color: '#ffffff'
                        } : undefined}
                      >
                        <span>立即使用</span>
                      </motion.button>
                    </>
                  )}
                  {selectedAgent.id.startsWith('custom-') && (
                    <>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          setEditForm({
                            name: selectedAgent.name,
                            description: selectedAgent.description,
                            category: selectedAgent.category,
                            icon: selectedAgent.icon,
                            color: selectedAgent.color,
                            externalUrl: selectedAgent.externalUrl || '',
                            tags: selectedAgent.tags.join(', '),
                            features: selectedAgent.features.join(', ')
                          })
                          setShowEditAgent(true)
                        }}
                        className={isEnterprise ? "flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium border" : "cyber-button flex items-center justify-center gap-2"}
                        style={isEnterprise ? {
                          background: 'var(--bg-secondary)',
                          borderColor: 'var(--border-color)',
                          color: 'var(--text-secondary)'
                        } : undefined}
                      >
                        <Edit3 className="w-4 h-4" />
                        编辑
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleDeleteAgent(selectedAgent.id)}
                        className={isEnterprise ? "flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium" : "cyber-button flex items-center justify-center gap-2"}
                        style={isEnterprise ? {
                          background: '#fef2f2',
                          color: '#dc2626',
                          border: '1px solid #fecaca'
                        } : { background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.3)' }}
                      >
                        <Trash2 className="w-4 h-4" />
                        删除
                      </motion.button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showAddAgent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-8"
            style={isEnterprise ? { background: 'rgba(0, 0, 0, 0.5)' } : { background: 'rgba(0, 0, 0, 0.6)', backdropFilter: 'blur(4px)' }}
            onClick={() => setShowAddAgent(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className={isEnterprise ? "p-8 max-w-xl w-full max-h-[85vh] overflow-auto rounded-lg border" : "glass-panel p-8 max-w-xl w-full max-h-[85vh] overflow-auto"}
              style={isEnterprise ? {
                background: 'var(--bg-secondary)',
                borderColor: 'var(--border-color)'
              } : undefined}
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="font-display text-xl font-bold" style={isEnterprise ? { color: 'var(--text-primary)' } : { color: 'var(--text-primary)' }}>上架智能体</h2>
                  <p className="text-sm mt-1" style={isEnterprise ? { color: 'var(--text-secondary)' } : { color: 'var(--text-secondary)' }}>通过配置链接将外部智能体服务上架到市场</p>
                </div>
                <button
                  onClick={() => setShowAddAgent(false)}
                  className="p-2 rounded-lg transition-colors"
                  style={isEnterprise ? { background: 'var(--bg-tertiary)' } : { background: 'rgba(255,255,255,0.05)' }}
                >
                  <X className="w-5 h-5" style={isEnterprise ? { color: 'var(--text-muted)' } : { color: 'var(--text-muted)' }} />
                </button>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium mb-2" style={isEnterprise ? { color: 'var(--text-primary)' } : { color: 'var(--text-secondary)' }}>
                    智能体名称 <span style={isEnterprise ? { color: 'var(--color-primary)' } : { color: 'var(--accent-primary)' }}>*</span>
                  </label>
                  <input
                    type="text"
                    value={newAgent.name}
                    onChange={(e) => setNewAgent(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="输入智能体名称"
                    className={isEnterprise ? "w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" : "input-cyber"}
                    style={isEnterprise ? {
                      background: 'var(--bg-tertiary)',
                      borderColor: 'var(--border-color)',
                      color: 'var(--text-primary)'
                    } : undefined}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={isEnterprise ? { color: 'var(--text-primary)' } : { color: 'var(--text-secondary)' }}>
                    服务链接 <span style={isEnterprise ? { color: 'var(--color-primary)' } : { color: 'var(--accent-primary)' }}>*</span>
                  </label>
                  <div className="relative">
                    <Link2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={isEnterprise ? { color: 'var(--text-muted)' } : { color: 'var(--text-muted)' }} />
                    <input
                      type="url"
                      value={newAgent.externalUrl}
                      onChange={(e) => setNewAgent(prev => ({ ...prev, externalUrl: e.target.value }))}
                      placeholder="https://example.com/agent"
                      className={isEnterprise ? "w-full pl-12 pr-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" : "input-cyber pl-12"}
                      style={isEnterprise ? {
                        background: 'var(--bg-tertiary)',
                        borderColor: 'var(--border-color)',
                        color: 'var(--text-primary)'
                      } : undefined}
                    />
                  </div>
                  <p className="text-xs mt-1" style={isEnterprise ? { color: 'var(--text-muted)' } : { color: 'var(--text-muted)' }}>智能体服务的访问地址，将在新窗口中打开</p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={isEnterprise ? { color: 'var(--text-primary)' } : { color: 'var(--text-secondary)' }}>描述</label>
                  <textarea
                    value={newAgent.description}
                    onChange={(e) => setNewAgent(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="输入智能体功能描述"
                    rows={3}
                    className={isEnterprise ? "w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none" : "input-cyber resize-none"}
                    style={isEnterprise ? {
                      background: 'var(--bg-tertiary)',
                      borderColor: 'var(--border-color)',
                      color: 'var(--text-primary)'
                    } : undefined}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2" style={isEnterprise ? { color: 'var(--text-primary)' } : { color: 'var(--text-secondary)' }}>分类</label>
                    <select
                      value={newAgent.category}
                      onChange={(e) => setNewAgent(prev => ({ ...prev, category: e.target.value }))}
                      className={isEnterprise ? "w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" : "input-cyber"}
                      style={isEnterprise ? {
                        background: 'var(--bg-tertiary)',
                        borderColor: 'var(--border-color)',
                        color: 'var(--text-primary)'
                      } : undefined}
                    >
                      {categories.filter(c => c.id !== 'all').map((cat) => (
                        <option key={cat.id} value={cat.id}>{cat.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2" style={isEnterprise ? { color: 'var(--text-primary)' } : { color: 'var(--text-secondary)' }}>图标</label>
                    <div className="flex flex-wrap gap-2">
                      {iconOptions.map((icon) => (
                        <button
                          key={icon}
                          onClick={() => setNewAgent(prev => ({ ...prev, icon }))}
                          className="w-10 h-10 rounded-lg flex items-center justify-center text-xl transition-all"
                          style={isEnterprise ? {
                            background: newAgent.icon === icon ? 'var(--color-primary-lighter)' : 'var(--bg-tertiary)',
                            border: newAgent.icon === icon ? '1px solid var(--color-primary)' : '1px solid transparent'
                          } : {
                            background: newAgent.icon === icon ? 'rgba(0, 229, 255, 0.2)' : 'rgba(255,255,255,0.05)',
                            border: newAgent.icon === icon ? '1px solid var(--border-hover)' : '1px solid var(--border-color)'
                          }}
                        >
                          {icon}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2" style={isEnterprise ? { color: 'var(--text-primary)' } : { color: 'var(--text-secondary)' }}>颜色</label>
                    <div className="flex flex-wrap gap-2">
                      {colorOptions.map((color) => (
                        <button
                          key={color.id}
                          onClick={() => setNewAgent(prev => ({ ...prev, color: color.id }))}
                          className={`w-10 h-10 rounded-lg flex items-center justify-center text-xs transition-all bg-gradient-to-br ${color.id}`}
                          style={isEnterprise ? {
                            border: newAgent.color === color.id ? '2px solid var(--color-primary)' : '1px solid var(--border-color)',
                            transform: newAgent.color === color.id ? 'scale(1.1)' : 'scale(1)'
                          } : {
                            border: newAgent.color === color.id ? '2px solid var(--border-hover)' : '1px solid var(--border-color)',
                            transform: newAgent.color === color.id ? 'scale(1.1)' : 'scale(1)'
                          }}
                          title={color.label}
                        >
                          
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={isEnterprise ? { color: 'var(--text-primary)' } : { color: 'var(--text-secondary)' }}>标签</label>
                  <input
                    type="text"
                    value={newAgent.tags}
                    onChange={(e) => setNewAgent(prev => ({ ...prev, tags: e.target.value }))}
                    placeholder="数据分析, 报告生成（用逗号分隔）"
                    className={isEnterprise ? "w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" : "input-cyber"}
                    style={isEnterprise ? {
                      background: 'var(--bg-tertiary)',
                      borderColor: 'var(--border-color)',
                      color: 'var(--text-primary)'
                    } : undefined}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={isEnterprise ? { color: 'var(--text-primary)' } : { color: 'var(--text-secondary)' }}>功能特性</label>
                  <input
                    type="text"
                    value={newAgent.features}
                    onChange={(e) => setNewAgent(prev => ({ ...prev, features: e.target.value }))}
                    placeholder="功能1, 功能2, 功能3（用逗号分隔）"
                    className={isEnterprise ? "w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" : "input-cyber"}
                    style={isEnterprise ? {
                      background: 'var(--bg-tertiary)',
                      borderColor: 'var(--border-color)',
                      color: 'var(--text-primary)'
                    } : undefined}
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowAddAgent(false)}
                  className={isEnterprise ? "px-4 py-2.5 rounded-lg text-sm font-medium border" : "cyber-button"}
                  style={isEnterprise ? {
                    background: 'var(--bg-secondary)',
                    borderColor: 'var(--border-color)',
                    color: 'var(--text-secondary)'
                  } : undefined}
                >
                  取消
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAddAgent}
                  disabled={!newAgent.name || !newAgent.externalUrl}
                  className={isEnterprise ? "px-4 py-2.5 rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed" : "cyber-button-primary disabled:opacity-50 disabled:cursor-not-allowed"}
                  style={isEnterprise ? {
                    background: 'var(--color-primary)',
                    color: '#ffffff'
                  } : undefined}
                >
                  上架智能体
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showEditAgent && selectedAgent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-8"
            style={isEnterprise ? { background: 'rgba(0, 0, 0, 0.5)' } : { background: 'rgba(0, 0, 0, 0.6)', backdropFilter: 'blur(4px)' }}
            onClick={() => setShowEditAgent(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className={isEnterprise ? "p-8 max-w-xl w-full max-h-[85vh] overflow-auto rounded-lg border" : "glass-panel p-8 max-w-xl w-full max-h-[85vh] overflow-auto"}
              style={isEnterprise ? {
                background: 'var(--bg-secondary)',
                borderColor: 'var(--border-color)'
              } : undefined}
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="font-display text-xl font-bold" style={isEnterprise ? { color: 'var(--text-primary)' } : { color: 'var(--text-primary)' }}>编辑智能体</h2>
                  <p className="text-sm mt-1" style={isEnterprise ? { color: 'var(--text-secondary)' } : { color: 'var(--text-secondary)' }}>修改智能体信息</p>
                </div>
                <button
                  onClick={() => setShowEditAgent(false)}
                  className="p-2 rounded-lg transition-colors"
                  style={isEnterprise ? { background: 'var(--bg-tertiary)' } : { background: 'rgba(255,255,255,0.05)' }}
                >
                  <X className="w-5 h-5" style={isEnterprise ? { color: 'var(--text-muted)' } : { color: 'var(--text-muted)' }} />
                </button>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium mb-2" style={isEnterprise ? { color: 'var(--text-primary)' } : { color: 'var(--text-secondary)' }}>
                    智能体名称 <span style={isEnterprise ? { color: 'var(--color-primary)' } : { color: 'var(--accent-primary)' }}>*</span>
                  </label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="输入智能体名称"
                    className={isEnterprise ? "w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" : "input-cyber"}
                    style={isEnterprise ? {
                      background: 'var(--bg-tertiary)',
                      borderColor: 'var(--border-color)',
                      color: 'var(--text-primary)'
                    } : undefined}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={isEnterprise ? { color: 'var(--text-primary)' } : { color: 'var(--text-secondary)' }}>
                    服务链接 <span style={isEnterprise ? { color: 'var(--color-primary)' } : { color: 'var(--accent-primary)' }}>*</span>
                  </label>
                  <div className="relative">
                    <Link2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={isEnterprise ? { color: 'var(--text-muted)' } : { color: 'var(--text-muted)' }} />
                    <input
                      type="url"
                      value={editForm.externalUrl}
                      onChange={(e) => setEditForm(prev => ({ ...prev, externalUrl: e.target.value }))}
                      placeholder="https://example.com/agent"
                      className={isEnterprise ? "w-full pl-12 pr-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" : "input-cyber pl-12"}
                      style={isEnterprise ? {
                        background: 'var(--bg-tertiary)',
                        borderColor: 'var(--border-color)',
                        color: 'var(--text-primary)'
                      } : undefined}
                    />
                  </div>
                  <p className="text-xs mt-1" style={isEnterprise ? { color: 'var(--text-muted)' } : { color: 'var(--text-muted)' }}>智能体服务的访问地址，将在新窗口中打开</p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={isEnterprise ? { color: 'var(--text-primary)' } : { color: 'var(--text-secondary)' }}>描述</label>
                  <textarea
                    value={editForm.description}
                    onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="输入智能体功能描述"
                    rows={3}
                    className={isEnterprise ? "w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none" : "input-cyber resize-none"}
                    style={isEnterprise ? {
                      background: 'var(--bg-tertiary)',
                      borderColor: 'var(--border-color)',
                      color: 'var(--text-primary)'
                    } : undefined}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2" style={isEnterprise ? { color: 'var(--text-primary)' } : { color: 'var(--text-secondary)' }}>分类</label>
                    <select
                      value={editForm.category}
                      onChange={(e) => setEditForm(prev => ({ ...prev, category: e.target.value }))}
                      className={isEnterprise ? "w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" : "input-cyber"}
                      style={isEnterprise ? {
                        background: 'var(--bg-tertiary)',
                        borderColor: 'var(--border-color)',
                        color: 'var(--text-primary)'
                      } : undefined}
                    >
                      {categories.filter(c => c.id !== 'all').map((cat) => (
                        <option key={cat.id} value={cat.id}>{cat.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2" style={isEnterprise ? { color: 'var(--text-primary)' } : { color: 'var(--text-secondary)' }}>图标</label>
                    <div className="flex flex-wrap gap-2">
                      {iconOptions.map((icon) => (
                        <button
                          key={icon}
                          onClick={() => setEditForm(prev => ({ ...prev, icon }))}
                          className="w-10 h-10 rounded-lg flex items-center justify-center text-xl transition-all"
                          style={isEnterprise ? {
                            background: editForm.icon === icon ? 'var(--color-primary-lighter)' : 'var(--bg-tertiary)',
                            border: editForm.icon === icon ? '1px solid var(--color-primary)' : '1px solid transparent'
                          } : {
                            background: editForm.icon === icon ? 'rgba(0, 229, 255, 0.2)' : 'rgba(255,255,255,0.05)',
                            border: editForm.icon === icon ? '1px solid var(--border-hover)' : '1px solid var(--border-color)'
                          }}
                        >
                          {icon}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2" style={isEnterprise ? { color: 'var(--text-primary)' } : { color: 'var(--text-secondary)' }}>颜色</label>
                    <div className="flex flex-wrap gap-2">
                      {colorOptions.map((color) => (
                        <button
                          key={color.id}
                          onClick={() => setEditForm(prev => ({ ...prev, color: color.id }))}
                          className={`w-10 h-10 rounded-lg flex items-center justify-center text-xs transition-all bg-gradient-to-br ${color.id}`}
                          style={isEnterprise ? {
                            border: editForm.color === color.id ? '2px solid var(--color-primary)' : '1px solid var(--border-color)',
                            transform: editForm.color === color.id ? 'scale(1.1)' : 'scale(1)'
                          } : {
                            border: editForm.color === color.id ? '2px solid var(--border-hover)' : '1px solid var(--border-color)',
                            transform: editForm.color === color.id ? 'scale(1.1)' : 'scale(1)'
                          }}
                          title={color.label}
                        >
                          
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={isEnterprise ? { color: 'var(--text-primary)' } : { color: 'var(--text-secondary)' }}>标签</label>
                  <input
                    type="text"
                    value={editForm.tags}
                    onChange={(e) => setEditForm(prev => ({ ...prev, tags: e.target.value }))}
                    placeholder="数据分析, 报告生成（用逗号分隔）"
                    className={isEnterprise ? "w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" : "input-cyber"}
                    style={isEnterprise ? {
                      background: 'var(--bg-tertiary)',
                      borderColor: 'var(--border-color)',
                      color: 'var(--text-primary)'
                    } : undefined}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={isEnterprise ? { color: 'var(--text-primary)' } : { color: 'var(--text-secondary)' }}>功能特性</label>
                  <input
                    type="text"
                    value={editForm.features}
                    onChange={(e) => setEditForm(prev => ({ ...prev, features: e.target.value }))}
                    placeholder="功能1, 功能2, 功能3（用逗号分隔）"
                    className={isEnterprise ? "w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" : "input-cyber"}
                    style={isEnterprise ? {
                      background: 'var(--bg-tertiary)',
                      borderColor: 'var(--border-color)',
                      color: 'var(--text-primary)'
                    } : undefined}
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowEditAgent(false)}
                  className={isEnterprise ? "px-4 py-2.5 rounded-lg text-sm font-medium border" : "cyber-button"}
                  style={isEnterprise ? {
                    background: 'var(--bg-secondary)',
                    borderColor: 'var(--border-color)',
                    color: 'var(--text-secondary)'
                  } : undefined}
                >
                  取消
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setCustomAgents(prev => prev.map(a => {
                      if (a.id === selectedAgent.id) {
                        return {
                          ...a,
                          name: editForm.name,
                          description: editForm.description,
                          category: editForm.category,
                          categoryName: categories.find(c => c.id === editForm.category)?.label || '其他',
                          icon: editForm.icon,
                          color: editForm.color,
                          externalUrl: editForm.externalUrl,
                          tags: editForm.tags.split(',').map(t => t.trim()).filter(Boolean),
                          features: editForm.features.split(',').map(f => f.trim()).filter(Boolean)
                        }
                      }
                      return a
                    }))
                    setShowEditAgent(false)
                    setSelectedAgent(null)
                  }}
                  disabled={!editForm.name || !editForm.externalUrl}
                  className={isEnterprise ? "px-4 py-2.5 rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed" : "cyber-button-primary disabled:opacity-50 disabled:cursor-not-allowed"}
                  style={isEnterprise ? {
                    background: 'var(--color-primary)',
                    color: '#ffffff'
                  } : undefined}
                >
                  保存修改
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
