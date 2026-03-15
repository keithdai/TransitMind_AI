import { useState } from 'react'
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
  Shield,
  FolderKanban,
  AlertTriangle,
  BarChart3,
  Heart,
  Sparkles,
  PlayCircle,
  BookOpen,
  ExternalLink,
  Link2,
  Settings,
  Upload
} from 'lucide-react'
import { useFavorites } from '../contexts/FavoritesContext'

const categories = [
  { id: 'all', label: '全部', icon: Layers },
  { id: 'planning', label: '规划类', icon: Layers },
  { id: 'compliance', label: '合规类', icon: Shield },
  { id: 'project', label: '项目类', icon: FolderKanban },
  { id: 'emergency', label: '应急类', icon: AlertTriangle },
  { id: 'data', label: '数据类', icon: BarChart3 },
]

interface UseCase {
  title: string
  description: string
  result: string
}

interface Agent {
  id: string
  name: string
  description: string
  category: string
  icon: string
  color: string
  rating: number
  users: number
  tags: string[]
  subscribed: boolean
  features: string[]
  knowledgeBases: string[]
  useCases: UseCase[]
  recommended?: boolean
  externalUrl?: string
  isExternal?: boolean
}

const agents: Agent[] = [
  {
    id: '1',
    name: '交通分析智能体',
    description: '分析交通流量数据，识别拥堵热点，提供优化建议',
    category: 'data',
    icon: '🚦',
    color: 'from-cyan-500 to-blue-500',
    rating: 4.8,
    users: 128,
    tags: ['数据分析', '交通规划'],
    subscribed: true,
    features: ['流量分析', '拥堵识别', '优化建议'],
    knowledgeBases: ['交通法规知识库', '历史数据知识库'],
    recommended: true,
    useCases: [
      {
        title: '路段流量分析',
        description: '分析特定路段的交通流量数据，识别高峰时段和拥堵点',
        result: '生成流量分析报告，包含拥堵热力图和优化建议'
      },
      {
        title: '交通预测',
        description: '基于历史数据预测未来交通流量趋势',
        result: '输出未来一周的流量预测图表'
      },
      {
        title: '信号灯优化',
        description: '优化路口信号灯配时方案',
        result: '生成优化后的配时方案，预计提升通行效率15%'
      }
    ]
  },
  {
    id: '2',
    name: '合规检查智能体',
    description: '检查项目合规性，对标法规标准，生成合规报告',
    category: 'compliance',
    icon: '📋',
    color: 'from-purple-500 to-pink-500',
    rating: 4.6,
    users: 89,
    tags: ['合规检查', '法规对标'],
    subscribed: false,
    features: ['合规检查', '法规对标', '报告生成'],
    knowledgeBases: ['法规知识库'],
    recommended: true,
    useCases: [
      {
        title: '项目合规审查',
        description: '审查交通规划项目是否符合相关法规标准',
        result: '生成合规审查报告，标注风险点和整改建议'
      },
      {
        title: '法规对标分析',
        description: '将项目方案与最新法规进行对比分析',
        result: '输出对标分析表，显示符合项和不符合项'
      }
    ]
  },
  {
    id: '3',
    name: '报告生成智能体',
    description: '自动生成各类报告，支持多种模板格式',
    category: 'data',
    icon: '📊',
    color: 'from-green-500 to-emerald-500',
    rating: 4.9,
    users: 256,
    tags: ['报告生成', '文档处理'],
    subscribed: true,
    features: ['多模板支持', '自动排版', '数据可视化'],
    knowledgeBases: ['报告模板库'],
    recommended: false,
    useCases: [
      {
        title: '月度工作总结',
        description: '自动汇总月度工作数据，生成结构化报告',
        result: '生成包含图表、数据表格的Word格式报告'
      },
      {
        title: '项目进度报告',
        description: '跟踪项目进度，自动生成进度报告',
        result: '输出甘特图和进度分析报告'
      }
    ]
  },
  {
    id: '4',
    name: '应急响应智能体',
    description: '快速响应突发事件，生成处置方案',
    category: 'emergency',
    icon: '🚨',
    color: 'from-orange-500 to-red-500',
    rating: 4.7,
    users: 67,
    tags: ['应急响应', '事件处理'],
    subscribed: false,
    features: ['事件评估', '方案生成', '资源调度'],
    knowledgeBases: ['应急预案库', '历史案例库'],
    recommended: false,
    useCases: [
      {
        title: '交通事故处置',
        description: '快速评估事故影响，生成处置方案',
        result: '输出包含人员调度、交通疏导的完整方案'
      },
      {
        title: '应急预案启动',
        description: '根据事件类型匹配并启动相应预案',
        result: '生成预案执行清单和资源调配方案'
      }
    ]
  },
  {
    id: '5',
    name: '项目进度跟踪智能体',
    description: '跟踪项目进度，预警延期风险',
    category: 'project',
    icon: '📅',
    color: 'from-blue-500 to-indigo-500',
    rating: 4.5,
    users: 145,
    tags: ['项目管理', '进度跟踪'],
    subscribed: false,
    features: ['进度跟踪', '风险预警', '资源调配'],
    knowledgeBases: [],
    recommended: false,
    useCases: [
      {
        title: '项目进度监控',
        description: '实时监控项目进度，识别延期风险',
        result: '生成进度仪表盘和风险预警报告'
      }
    ]
  },
  {
    id: '6',
    name: '线路优化智能体',
    description: '优化公交线路，提升运营效率',
    category: 'planning',
    icon: '🗺️',
    color: 'from-teal-500 to-cyan-500',
    rating: 4.4,
    users: 52,
    tags: ['线路规划', '运营优化'],
    subscribed: false,
    features: ['线路分析', '优化建议', '效率评估'],
    knowledgeBases: ['线路数据知识库'],
    recommended: false,
    useCases: [
      {
        title: '公交线路优化',
        description: '分析客流数据，优化公交线路和班次',
        result: '输出优化方案和预期效益分析'
      }
    ]
  },
  {
    id: '7',
    name: '外部AI助手',
    description: '连接外部AI服务，提供通用智能对话能力',
    category: 'data',
    icon: '🤖',
    color: 'from-indigo-500 to-purple-500',
    rating: 4.3,
    users: 89,
    tags: ['外部服务', 'AI对话'],
    subscribed: false,
    features: ['通用对话', '知识问答', '文档处理'],
    knowledgeBases: [],
    recommended: false,
    isExternal: true,
    externalUrl: 'https://ai.example.com/chat',
    useCases: [
      {
        title: '通用问答',
        description: '回答各类通用问题',
        result: '提供准确的答案和相关建议'
      }
    ]
  },
]

const recommendedForUser = [
  { reason: '基于您的部门（交通规划部）', agentId: '1' },
  { reason: '本周热门推荐', agentId: '3' },
  { reason: '与您的历史使用相关', agentId: '2' },
]

interface NewAgentForm {
  name: string
  description: string
  category: string
  icon: string
  externalUrl: string
  tags: string
  features: string
}

export default function Marketplace() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')
  const [activeFilter, setActiveFilter] = useState<'all' | 'subscribed' | 'recommended' | 'favorites'>('all')
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null)
  const [showUseCases, setShowUseCases] = useState(false)
  const [showAddAgent, setShowAddAgent] = useState(false)
  const [newAgent, setNewAgent] = useState<NewAgentForm>({
    name: '',
    description: '',
    category: 'data',
    icon: '🤖',
    externalUrl: '',
    tags: '',
    features: ''
  })
  const [customAgents, setCustomAgents] = useState<Agent[]>([])
  const { favorites, addFavorite, removeFavorite, isFavorite } = useFavorites()

  const allAgents = [...agents, ...customAgents]

  const filteredAgents = allAgents.filter(agent => {
    const matchesSearch = agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          agent.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = activeCategory === 'all' || agent.category === activeCategory
    let matchesFilter = true
    if (activeFilter === 'subscribed') matchesFilter = agent.subscribed
    if (activeFilter === 'recommended') matchesFilter = agent.recommended || false
    if (activeFilter === 'favorites') matchesFilter = isFavorite(agent.id)
    return matchesSearch && matchesCategory && matchesFilter
  })

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
    if (agent.isExternal && agent.externalUrl) {
      window.open(agent.externalUrl, '_blank')
    } else {
      const workspaceUrl = `${window.location.origin}/workspace/${agent.id}`
      window.open(workspaceUrl, '_blank')
    }
  }

  const handleAddAgent = () => {
    if (!newAgent.name || !newAgent.externalUrl) return

    const agent: Agent = {
      id: `custom-${Date.now()}`,
      name: newAgent.name,
      description: newAgent.description,
      category: newAgent.category,
      icon: newAgent.icon,
      color: 'from-gray-500 to-slate-500',
      rating: 0,
      users: 0,
      tags: newAgent.tags.split(',').map(t => t.trim()).filter(Boolean),
      subscribed: false,
      features: newAgent.features.split(',').map(f => f.trim()).filter(Boolean),
      knowledgeBases: [],
      isExternal: true,
      externalUrl: newAgent.externalUrl,
      useCases: []
    }

    setCustomAgents(prev => [...prev, agent])
    setNewAgent({
      name: '',
      description: '',
      category: 'data',
      icon: '🤖',
      externalUrl: '',
      tags: '',
      features: ''
    })
    setShowAddAgent(false)
  }

  const iconOptions = ['🤖', '🚀', '⚡', '🎯', '💡', '🔧', '📊', '🧠', '🔮', '🌟']

  return (
    <div className="h-full p-8 overflow-auto">
      <div className="max-w-7xl mx-auto space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="font-display text-3xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>智能体超市</h1>
            <p style={{ color: 'var(--text-secondary)' }}>发现并订阅适合您工作需求的智能体</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
              <span className="font-mono" style={{ color: 'var(--accent-primary)' }}>{allAgents.length}</span>
              <span>个智能体可用</span>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowAddAgent(true)}
              className="cyber-button-primary flex items-center gap-2"
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
          className="glass-panel p-4"
        >
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: 'var(--text-muted)' }} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜索智能体..."
                className="input-cyber pl-12"
              />
            </div>
            
            <div className="flex items-center gap-2">
              {[
                { id: 'all', label: '全部' },
                { id: 'subscribed', label: '已订阅' },
                { id: 'favorites', label: '收藏', icon: Heart },
                { id: 'recommended', label: '推荐', icon: Sparkles },
              ].map((filter) => (
                <motion.button
                  key={filter.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveFilter(filter.id as typeof activeFilter)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all`}
                  style={{
                    background: activeFilter === filter.id ? 'rgba(0, 229, 255, 0.1)' : 'rgba(255,255,255,0.05)',
                    border: activeFilter === filter.id ? '1px solid var(--border-hover)' : '1px solid var(--border-color)',
                    color: activeFilter === filter.id ? 'var(--accent-primary)' : 'var(--text-secondary)'
                  }}
                >
                  {'icon' in filter && <filter.icon className="w-4 h-4" />}
                  <span>{filter.label}</span>
                </motion.button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 mt-4">
            {categories.map((category) => (
              <motion.button
                key={category.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveCategory(category.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all`}
                style={{
                  background: activeCategory === category.id ? 'rgba(0, 229, 255, 0.1)' : 'rgba(255,255,255,0.05)',
                  border: activeCategory === category.id ? '1px solid var(--border-hover)' : '1px solid var(--border-color)',
                  color: activeCategory === category.id ? 'var(--accent-primary)' : 'var(--text-secondary)'
                }}
              >
                <category.icon className="w-4 h-4" />
                <span>{category.label}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {activeFilter === 'recommended' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel p-4"
          >
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4" style={{ color: 'var(--accent-primary)' }} />
              <span className="font-medium" style={{ color: 'var(--text-primary)' }}>为您推荐</span>
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
                    style={{ background: 'rgba(255,255,255,0.05)' }}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${agent.color} flex items-center justify-center text-lg`}>
                        {agent.icon}
                      </div>
                      <div>
                        <div className="font-medium" style={{ color: 'var(--text-primary)' }}>{agent.name}</div>
                        <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{rec.reason}</div>
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedAgent(agent)}
                      className="cyber-button text-xs"
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
                whileHover={{ scale: 1.02, y: -5 }}
                onClick={() => setSelectedAgent(agent)}
                className="glass-card p-5 cursor-pointer group relative"
              >
                {agent.recommended && (
                  <div className="absolute top-3 right-3">
                    <Sparkles className="w-4 h-4" style={{ color: 'var(--accent-primary)' }} />
                  </div>
                )}
                
                {agent.isExternal && (
                  <div className="absolute top-3 left-3">
                    <ExternalLink className="w-4 h-4" style={{ color: 'var(--accent-secondary)' }} />
                  </div>
                )}
                
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${agent.color} flex items-center justify-center text-2xl group-hover:scale-110 transition-transform`}>
                    {agent.icon}
                  </div>
                  <div className="flex items-center gap-2">
                    {agent.subscribed && (
                      <div className="flex items-center gap-1 px-2 py-1 rounded-full text-xs" style={{ background: 'rgba(34, 197, 94, 0.2)', color: '#22c55e' }}>
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
                      style={{ 
                        background: isFavorite(agent.id) ? 'rgba(239, 68, 68, 0.2)' : 'rgba(255,255,255,0.05)'
                      }}
                    >
                      <Heart className={`w-4 h-4 ${isFavorite(agent.id) ? 'fill-red-500 text-red-500' : ''}`} style={{ color: isFavorite(agent.id) ? '#ef4444' : 'var(--text-muted)' }} />
                    </motion.button>
                  </div>
                </div>

                <h3 className="font-display font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                  {agent.name}
                  {agent.isExternal && <span className="ml-2 text-xs" style={{ color: 'var(--accent-secondary)' }}>(外部)</span>}
                </h3>
                <p className="text-sm mb-4 line-clamp-2" style={{ color: 'var(--text-secondary)' }}>{agent.description}</p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {agent.tags.map((tag) => (
                    <span key={tag} className="tag-cyber">{tag}</span>
                  ))}
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-4" style={{ color: 'var(--text-muted)' }}>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span>{agent.rating}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>{agent.users}</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-all" style={{ color: 'var(--text-muted)' }} />
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
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-8"
            onClick={() => setSelectedAgent(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-panel p-8 max-w-3xl w-full max-h-[85vh] overflow-auto"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${selectedAgent.color} flex items-center justify-center text-3xl`}>
                    {selectedAgent.icon}
                  </div>
                  <div>
                    <h2 className="font-display text-2xl font-bold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                      {selectedAgent.name}
                      {selectedAgent.isExternal && (
                        <span className="text-xs px-2 py-1 rounded-full" style={{ background: 'rgba(123, 97, 255, 0.2)', color: 'var(--accent-secondary)' }}>
                          外部服务
                        </span>
                      )}
                    </h2>
                    <div className="flex items-center gap-4 mt-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
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
                        <span>2024-01-15 更新</span>
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
                    style={{ background: isFavorite(selectedAgent.id) ? 'rgba(239, 68, 68, 0.2)' : 'rgba(255,255,255,0.05)' }}
                  >
                    <Heart className={`w-5 h-5 ${isFavorite(selectedAgent.id) ? 'fill-red-500' : ''}`} style={{ color: isFavorite(selectedAgent.id) ? '#ef4444' : 'var(--text-muted)' }} />
                  </motion.button>
                  <button
                    onClick={() => setSelectedAgent(null)}
                    className="p-2 rounded-lg transition-colors"
                    style={{ background: 'rgba(255,255,255,0.05)' }}
                  >
                    <X className="w-5 h-5" style={{ color: 'var(--text-muted)' }} />
                  </button>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>功能介绍</h3>
                  <p style={{ color: 'var(--text-primary)' }}>{selectedAgent.description}</p>
                </div>

                {selectedAgent.externalUrl && (
                  <div>
                    <h3 className="text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>服务地址</h3>
                    <div className="flex items-center gap-2 p-3 rounded-lg" style={{ background: 'rgba(255,255,255,0.05)' }}>
                      <Link2 className="w-4 h-4" style={{ color: 'var(--accent-primary)' }} />
                      <span className="text-sm font-mono" style={{ color: 'var(--text-secondary)' }}>{selectedAgent.externalUrl}</span>
                    </div>
                  </div>
                )}

                {selectedAgent.features.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>核心功能</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedAgent.features.map((feature) => (
                        <span key={feature} className="tag-cyber">{feature}</span>
                      ))}
                    </div>
                  </div>
                )}

                {selectedAgent.useCases.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>使用案例</h3>
                      <button
                        onClick={() => setShowUseCases(!showUseCases)}
                        className="text-xs flex items-center gap-1"
                        style={{ color: 'var(--accent-primary)' }}
                      >
                        <BookOpen className="w-3 h-3" />
                        {showUseCases ? '收起' : '展开全部'}
                      </button>
                    </div>
                    <div className="space-y-3">
                      {(showUseCases ? selectedAgent.useCases : selectedAgent.useCases.slice(0, 2)).map((useCase, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="p-4 rounded-xl border"
                          style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'var(--border-color)' }}
                        >
                          <div className="flex items-start gap-3">
                            <div className="p-2 rounded-lg" style={{ background: 'rgba(0, 229, 255, 0.1)' }}>
                              <PlayCircle className="w-4 h-4" style={{ color: 'var(--accent-primary)' }} />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium mb-1" style={{ color: 'var(--text-primary)' }}>{useCase.title}</h4>
                              <p className="text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>{useCase.description}</p>
                              <div className="flex items-center gap-2 text-xs">
                                <span style={{ color: 'var(--text-muted)' }}>输出结果：</span>
                                <span style={{ color: 'var(--accent-primary)' }}>{useCase.result}</span>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedAgent.knowledgeBases.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>关联知识库</h3>
                    <div className="space-y-2">
                      {selectedAgent.knowledgeBases.map((kb) => (
                        <div key={kb} className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ background: 'rgba(255,255,255,0.05)' }}>
                          <Layers className="w-4 h-4" style={{ color: 'var(--accent-secondary)' }} />
                          <span className="text-sm" style={{ color: 'var(--text-primary)' }}>{kb}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-4 pt-4 border-t" style={{ borderColor: 'var(--border-color)' }}>
                  {selectedAgent.subscribed ? (
                    <>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleUse(selectedAgent)}
                        className="flex-1 cyber-button-primary flex items-center justify-center gap-2"
                      >
                        {selectedAgent.isExternal ? <ExternalLink className="w-4 h-4" /> : null}
                        <span>{selectedAgent.isExternal ? '打开外部服务' : '立即使用'}</span>
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="cyber-button flex items-center justify-center gap-2"
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
                        className="flex-1 cyber-button flex items-center justify-center gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        订阅智能体
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleUse(selectedAgent)}
                        className="cyber-button-primary flex items-center justify-center gap-2"
                      >
                        {selectedAgent.isExternal ? <ExternalLink className="w-4 h-4" /> : null}
                        <span>{selectedAgent.isExternal ? '打开外部服务' : '立即使用'}</span>
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
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-8"
            onClick={() => setShowAddAgent(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-panel p-8 max-w-xl w-full max-h-[85vh] overflow-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="font-display text-xl font-bold" style={{ color: 'var(--text-primary)' }}>上架智能体</h2>
                  <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>通过配置链接将外部智能体服务上架到超市</p>
                </div>
                <button
                  onClick={() => setShowAddAgent(false)}
                  className="p-2 rounded-lg transition-colors"
                  style={{ background: 'rgba(255,255,255,0.05)' }}
                >
                  <X className="w-5 h-5" style={{ color: 'var(--text-muted)' }} />
                </button>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                    智能体名称 <span style={{ color: 'var(--accent-primary)' }}>*</span>
                  </label>
                  <input
                    type="text"
                    value={newAgent.name}
                    onChange={(e) => setNewAgent(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="输入智能体名称"
                    className="input-cyber"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                    服务链接 <span style={{ color: 'var(--accent-primary)' }}>*</span>
                  </label>
                  <div className="relative">
                    <Link2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: 'var(--text-muted)' }} />
                    <input
                      type="url"
                      value={newAgent.externalUrl}
                      onChange={(e) => setNewAgent(prev => ({ ...prev, externalUrl: e.target.value }))}
                      placeholder="https://example.com/agent"
                      className="input-cyber pl-12"
                    />
                  </div>
                  <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>智能体服务的访问地址，将在新窗口中打开</p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>描述</label>
                  <textarea
                    value={newAgent.description}
                    onChange={(e) => setNewAgent(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="输入智能体功能描述"
                    rows={3}
                    className="input-cyber resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>分类</label>
                    <select
                      value={newAgent.category}
                      onChange={(e) => setNewAgent(prev => ({ ...prev, category: e.target.value }))}
                      className="input-cyber"
                    >
                      <option value="planning">规划类</option>
                      <option value="compliance">合规类</option>
                      <option value="project">项目类</option>
                      <option value="emergency">应急类</option>
                      <option value="data">数据类</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>图标</label>
                    <div className="flex flex-wrap gap-2">
                      {iconOptions.map((icon) => (
                        <button
                          key={icon}
                          onClick={() => setNewAgent(prev => ({ ...prev, icon }))}
                          className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl transition-all`}
                          style={{
                            background: newAgent.icon === icon ? 'rgba(0, 229, 255, 0.2)' : 'rgba(255,255,255,0.05)',
                            border: newAgent.icon === icon ? '1px solid var(--border-hover)' : '1px solid var(--border-color)'
                          }}
                        >
                          {icon}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>标签</label>
                  <input
                    type="text"
                    value={newAgent.tags}
                    onChange={(e) => setNewAgent(prev => ({ ...prev, tags: e.target.value }))}
                    placeholder="数据分析, 报告生成（用逗号分隔）"
                    className="input-cyber"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>功能特性</label>
                  <input
                    type="text"
                    value={newAgent.features}
                    onChange={(e) => setNewAgent(prev => ({ ...prev, features: e.target.value }))}
                    placeholder="功能1, 功能2, 功能3（用逗号分隔）"
                    className="input-cyber"
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowAddAgent(false)}
                  className="cyber-button"
                >
                  取消
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAddAgent}
                  disabled={!newAgent.name || !newAgent.externalUrl}
                  className="cyber-button-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  上架智能体
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
