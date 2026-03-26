import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Send, 
  Sparkles, 
  Mic, 
  Lightbulb,
  ArrowRight,
  Brain,
  Target,
  Zap,
  CheckCircle2,
  Loader2,
  Image,
  Paperclip,
  X,
  Clock,
  Trash2,
  MessageCircle,
  HelpCircle,
  Plus,
  Coins
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useHistory } from '../contexts/HistoryContext'
import { useTheme } from '../contexts/ThemeContext'
import { agents, getMvpAgents } from '../data/agents'

const suggestions = [
  { text: '帮我查一下差旅费报销标准', icon: Target },
  { text: '起草一份办公设备采购请示', icon: Lightbulb },
  { text: '解读政府采购公开招标门槛', icon: CheckCircle2 },
  { text: '生成项目进度风险报告', icon: Zap },
]

const thinkingSteps = [
  { label: '理解意图', status: 'done', detail: '识别为知识检索任务' },
  { label: '提取要素', status: 'done', detail: '差旅费、报销标准' },
  { label: '匹配智能体', status: 'active', detail: '正在匹配最佳智能体...' },
  { label: '准备执行', status: 'pending', detail: '等待中' },
]

interface ClarificationOption {
  id: string
  text: string
  agentId: string
  agentName: string
}

export default function Home() {
  const [input, setInput] = useState('')
  const [isThinking, setIsThinking] = useState(false)
  const [showThinking, setShowThinking] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [showClarification, setShowClarification] = useState(false)
  const [clarificationOptions, setClarificationOptions] = useState<ClarificationOption[]>([])
  const [attachments, setAttachments] = useState<{ name: string; type: string; preview?: string }[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()
  const { history, addToHistory, removeFromHistory, clearHistory } = useHistory()
  const { theme } = useTheme()
  
  const isEnterprise = theme === 'enterprise'
  
  const mvpAgents = getMvpAgents()
  
  const defaultAgents = mvpAgents.slice(0, 6).map(agent => ({
    id: agent.id,
    name: agent.name,
    icon: agent.icon,
    color: agent.color
  }))
  
  const customAgents = (() => {
    const saved = localStorage.getItem('customAgents')
    return saved ? JSON.parse(saved) : []
  })()
  
  const availableAgents = [...agents, ...customAgents].map(agent => ({
    id: agent.id,
    name: agent.name,
    icon: agent.icon,
    color: agent.color
  }))
  
  const [myAgents, setMyAgents] = useState(() => {
    const saved = localStorage.getItem('myFavoriteAgents')
    if (saved) {
      try {
        const savedIds = JSON.parse(saved) as string[]
        const savedAgents = savedIds
          .map(id => availableAgents.find(a => a.id === id))
          .filter(Boolean) as typeof defaultAgents
        if (savedAgents.length > 0) {
          return savedAgents
        }
      } catch {
        // ignore parse errors
      }
    }
    return defaultAgents
  })
  const [showAddAgent, setShowAddAgent] = useState(false)

  useEffect(() => {
    const agentIds = myAgents.map(a => a.id)
    localStorage.setItem('myFavoriteAgents', JSON.stringify(agentIds))
  }, [myAgents])

  const handleRemoveAgent = (agentId: string) => {
    setMyAgents(prev => prev.filter(a => a.id !== agentId))
  }

  const handleAddAgent = (agent: typeof defaultAgents[0]) => {
    if (myAgents.length >= 6) return
    if (myAgents.find(a => a.id === agent.id)) return
    setMyAgents(prev => [...prev, agent])
    setShowAddAgent(false)
  }

  const availableToAdd = availableAgents.filter(a => !myAgents.find(m => m.id === a.id))

  const handleSubmit = () => {
    if (!input.trim() && attachments.length === 0) return
    
    if (input.includes('处理') || input.includes('帮我') && !input.includes('分析') && !input.includes('检查') && !input.includes('生成')) {
      setShowClarification(true)
      setClarificationOptions([
        { id: '1', text: '查询差旅费报销标准', agentId: 'mvp_1', agentName: '知识库检索智能体' },
        { id: '2', text: '起草办公设备采购请示', agentId: 'mvp_3', agentName: '智能公文助手' },
        { id: '3', text: '解读政府采购政策', agentId: 'mvp_2', agentName: '知识库问答智能体' },
      ])
      return
    }
    
    addToHistory(input, 'mvp_1', '知识库检索智能体')
    setIsThinking(true)
    setShowThinking(true)
    setTimeout(() => {
      setIsThinking(false)
    }, 3000)
  }

  const handleAgentClick = (agentId: string) => {
    const customAgentsData = JSON.parse(localStorage.getItem('customAgents') || '[]')
    const allAgentsData = [...agents, ...customAgentsData]
    const agent = allAgentsData.find((a: { id: string; externalUrl?: string }) => a.id === agentId)
    
    if (agent?.externalUrl) {
      window.open(agent.externalUrl, '_blank')
    } else {
      navigate(`/workspace/${agentId}`)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    files.forEach(file => {
      const reader = new FileReader()
      reader.onload = (ev) => {
        setAttachments(prev => [...prev, {
          name: file.name,
          type: file.type.startsWith('image/') ? 'image' : 'file',
          preview: ev.target?.result as string
        }])
      }
      if (file.type.startsWith('image/')) {
        reader.readAsDataURL(file)
      } else {
        setAttachments(prev => [...prev, { name: file.name, type: 'file' }])
      }
    })
  }

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index))
  }

  const handleClarificationSelect = (option: ClarificationOption) => {
    setInput(option.text)
    setShowClarification(false)
    addToHistory(option.text, option.agentId, option.agentName)
    setIsThinking(true)
    setShowThinking(true)
    setTimeout(() => {
      setIsThinking(false)
    }, 3000)
  }

  const formatTimeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000)
    if (seconds < 60) return '刚刚'
    if (seconds < 3600) return `${Math.floor(seconds / 60)} 分钟前`
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} 小时前`
    return `${Math.floor(seconds / 86400)} 天前`
  }

  return (
    <div className={`h-full p-6 overflow-auto ${isEnterprise ? '' : ''}`} style={isEnterprise ? { background: '#F7F9FC' } : undefined}>
      <div className="max-w-7xl mx-auto space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border"
            style={isEnterprise ? { background: '#E8F3FF', borderColor: '#A8D4FF' } : { background: 'rgba(0, 229, 255, 0.1)', borderColor: 'var(--border-hover)' }}
          >
            <Sparkles className="w-4 h-4" style={isEnterprise ? { color: '#1459FA' } : { color: 'var(--accent-primary)' }} />
            <span className="text-sm font-medium" style={isEnterprise ? { color: '#1459FA' } : { color: 'var(--accent-primary)' }}>政务智能体已就绪</span>
          </motion.div>
          
          <h1 className="font-display text-4xl font-bold" style={isEnterprise ? { color: '#1D2129' } : { color: 'var(--text-primary)' }}>
            有什么可以帮您的？
          </h1>
          <p className="max-w-xl mx-auto" style={isEnterprise ? { color: '#4E5969' } : { color: 'var(--text-secondary)' }}>
            用自然语言描述您的政务办公需求，智能体工作台将理解您的意图并推荐最合适的智能体
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className={isEnterprise ? 'p-6' : 'glass-panel p-6'}
          style={isEnterprise ? { background: '#FFFFFF', borderRadius: '8px', boxShadow: '0 2px 12px rgba(0, 50, 166, 0.08)', border: '1px solid #F0F5FE' } : undefined}
        >
          <div className="relative">
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <div className="relative">
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault()
                        handleSubmit()
                      }
                    }}
                    placeholder="描述您的需求，例如：帮我查一下差旅费报销标准..."
                    className={`text-lg py-4 pr-24 resize-none w-full rounded-lg border focus:outline-none focus:ring-2 focus:border-transparent ${isEnterprise ? '' : 'input-cyber'}`}
                    rows={3}
                    style={isEnterprise ? { 
                      minHeight: '80px',
                      background: '#F7F9FC',
                      borderColor: '#E5E6EB',
                      color: '#1D2129',
                    } : { minHeight: '80px' }}
                  />
                  <div className="absolute right-3 top-3 flex items-center gap-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => fileInputRef.current?.click()}
                      className="p-2 rounded-lg transition-colors"
                      style={isEnterprise ? { background: '#F0F5FE' } : { background: 'rgba(255,255,255,0.05)' }}
                      title="上传图片或文件"
                    >
                      <Image className="w-5 h-5" style={isEnterprise ? { color: '#86909C' } : { color: 'var(--text-muted)' }} />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 rounded-lg transition-colors"
                      style={isEnterprise ? { background: '#F0F5FE' } : { background: 'rgba(255,255,255,0.05)' }}
                      title="语音输入"
                    >
                      <Mic className="w-5 h-5" style={isEnterprise ? { color: '#86909C' } : { color: 'var(--text-muted)' }} />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setShowHistory(!showHistory)}
                      className="p-2 rounded-lg transition-colors"
                      style={isEnterprise ? { background: showHistory ? '#E8F3FF' : '#F0F5FE' } : { background: showHistory ? 'rgba(0, 229, 255, 0.2)' : 'rgba(255,255,255,0.05)' }}
                      title="历史记录"
                    >
                      <Clock className="w-5 h-5" style={isEnterprise ? { color: showHistory ? '#1459FA' : '#86909C' } : { color: showHistory ? 'var(--accent-primary)' : 'var(--text-muted)' }} />
                    </motion.button>
                  </div>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"
                  multiple
                  onChange={handleFileSelect}
                  className="hidden"
                />

                {attachments.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {attachments.map((att, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg border"
                        style={isEnterprise ? { background: '#F7F9FC', borderColor: '#E5E6EB' } : { background: 'rgba(255,255,255,0.05)', borderColor: 'var(--border-color)' }}
                      >
                        {att.type === 'image' && att.preview ? (
                          <img src={att.preview} alt={att.name} className="w-8 h-8 rounded object-cover" />
                        ) : (
                          <Paperclip className="w-4 h-4" style={isEnterprise ? { color: '#1459FA' } : { color: 'var(--accent-primary)' }} />
                        )}
                        <span className="text-sm" style={isEnterprise ? { color: '#1D2129' } : { color: 'var(--text-secondary)' }}>{att.name}</span>
                        <button onClick={() => removeAttachment(index)} className={`p-1 rounded ${isEnterprise ? 'hover:bg-gray-200' : 'hover:bg-white/10'}`}>
                          <X className="w-3 h-3" style={isEnterprise ? { color: '#86909C' } : { color: 'var(--text-muted)' }} />
                        </button>
                      </motion.div>
                    ))}
                  </div>
                )}

                <div className="mt-4 flex flex-wrap gap-2">
                  {suggestions.map((suggestion, index) => (
                    <motion.button
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      onClick={() => setInput(suggestion.text)}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all text-sm"
                      style={isEnterprise ? { 
                        background: '#F0F5FE', 
                        borderColor: '#CFE3FE',
                        color: '#1459FA'
                      } : { 
                        background: 'rgba(255,255,255,0.05)', 
                        borderColor: 'var(--border-color)',
                        color: 'var(--text-secondary)'
                      }}
                    >
                      <suggestion.icon className="w-3.5 h-3.5" style={isEnterprise ? { color: '#1459FA' } : { color: 'var(--accent-primary)' }} />
                      <span>{suggestion.text}</span>
                    </motion.button>
                  ))}
                </div>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSubmit}
                className={isEnterprise ? '' : 'cyber-button-primary flex items-center gap-2 self-end'}
                style={isEnterprise ? { 
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  alignSelf: 'flex-end',
                  padding: '8px 20px',
                  background: '#1459FA',
                  color: '#FFFFFF',
                  borderRadius: '4px',
                  fontWeight: 500,
                  fontSize: '14px',
                  border: 'none',
                  cursor: 'pointer',
                } : undefined}
              >
                <Send className="w-4 h-4" />
                <span>发送</span>
              </motion.button>
            </div>
          </div>
        </motion.div>

        <AnimatePresence>
          {showHistory && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className={isEnterprise ? 'overflow-hidden' : 'glass-panel overflow-hidden'}
              style={isEnterprise ? { background: '#FFFFFF', borderRadius: '8px', boxShadow: '0 2px 12px rgba(0, 50, 166, 0.08)', border: '1px solid #F0F5FE' } : undefined}
            >
              <div className="p-4 border-b flex items-center justify-between" style={isEnterprise ? { borderColor: '#F0F5FE' } : { borderColor: 'var(--border-color)' }}>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" style={isEnterprise ? { color: '#1459FA' } : { color: 'var(--accent-primary)' }} />
                  <span className="font-medium" style={isEnterprise ? { color: '#1D2129' } : { color: 'var(--text-primary)' }}>历史记录</span>
                </div>
                <button
                  onClick={clearHistory}
                  className={`text-xs flex items-center gap-1 px-2 py-1 rounded ${isEnterprise ? 'hover:bg-gray-100' : 'hover:bg-white/10'}`}
                  style={isEnterprise ? { color: '#86909C' } : { color: 'var(--text-muted)' }}
                >
                  <Trash2 className="w-3 h-3" />
                  清空
                </button>
              </div>
              <div className="max-h-48 overflow-auto">
                {history.length === 0 ? (
                  <div className="p-4 text-center" style={isEnterprise ? { color: '#86909C' } : { color: 'var(--text-muted)' }}>
                    暂无历史记录
                  </div>
                ) : (
                  <div className="divide-y" style={isEnterprise ? { borderColor: '#F0F5FE' } : { borderColor: 'var(--border-color)' }}>
                    {history.map((item) => (
                      <div
                        key={item.id}
                        className={`p-3 flex items-center justify-between cursor-pointer ${isEnterprise ? 'hover:bg-gray-50' : 'hover:bg-white/5'}`}
                        onClick={() => {
                          setInput(item.query)
                          setShowHistory(false)
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <MessageCircle className="w-4 h-4" style={isEnterprise ? { color: '#86909C' } : { color: 'var(--text-muted)' }} />
                          <div>
                            <div className="text-sm" style={isEnterprise ? { color: '#1D2129' } : { color: 'var(--text-primary)' }}>{item.query}</div>
                            {item.agentName && (
                              <div className="text-xs" style={isEnterprise ? { color: '#4E5969' } : { color: 'var(--text-muted)' }}>
                                {item.agentName} · {formatTimeAgo(item.timestamp)}
                              </div>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            removeFromHistory(item.id)
                          }}
                          className={`p-1 rounded ${isEnterprise ? 'hover:bg-gray-200' : 'hover:bg-white/10'}`}
                        >
                          <X className="w-3 h-3" style={isEnterprise ? { color: '#86909C' } : { color: 'var(--text-muted)' }} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showClarification && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={isEnterprise ? 'p-6' : 'glass-panel p-6'}
              style={isEnterprise ? { background: '#FFFFFF', borderRadius: '8px', boxShadow: '0 2px 12px rgba(0, 50, 166, 0.08)', border: '1px solid #F0F5FE' } : undefined}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg" style={isEnterprise ? { background: '#E8F3FF' } : { background: 'rgba(123, 97, 255, 0.2)' }}>
                  <HelpCircle className="w-5 h-5" style={isEnterprise ? { color: '#1459FA' } : { color: 'var(--accent-secondary)' }} />
                </div>
                <div>
                  <span className="font-display font-semibold" style={isEnterprise ? { color: '#1D2129' } : { color: 'var(--text-primary)' }}>需要更多信息</span>
                  <p className="text-sm" style={isEnterprise ? { color: '#4E5969' } : { color: 'var(--text-secondary)' }}>请选择您具体想要执行的操作</p>
                </div>
              </div>

              <div className="space-y-2">
                {clarificationOptions.map((option) => (
                  <motion.button
                    key={option.id}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => handleClarificationSelect(option)}
                    className="w-full p-4 rounded-xl border text-left transition-all flex items-center justify-between"
                    style={isEnterprise ? { 
                      background: '#F7F9FC', 
                      borderColor: '#E5E6EB'
                    } : { 
                      background: 'rgba(255,255,255,0.05)', 
                      borderColor: 'var(--border-color)'
                    }}
                  >
                    <div>
                      <div className="font-medium" style={isEnterprise ? { color: '#1D2129' } : { color: 'var(--text-primary)' }}>{option.text}</div>
                      <div className="text-sm" style={isEnterprise ? { color: '#4E5969' } : { color: 'var(--text-muted)' }}>{option.agentName}</div>
                    </div>
                    <ArrowRight className="w-4 h-4" style={isEnterprise ? { color: '#1459FA' } : { color: 'var(--accent-primary)' }} />
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showThinking && !showClarification && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className={isEnterprise ? 'p-6 overflow-hidden' : 'glass-panel p-6 overflow-hidden'}
              style={isEnterprise ? { background: '#FFFFFF', borderRadius: '8px', boxShadow: '0 2px 12px rgba(0, 50, 166, 0.08)', border: '1px solid #F0F5FE' } : undefined}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg" style={isEnterprise ? { background: '#E8F3FF' } : { background: 'rgba(123, 97, 255, 0.2)' }}>
                  <Brain className="w-5 h-5" style={isEnterprise ? { color: '#1459FA' } : { color: 'var(--accent-secondary)' }} />
                </div>
                <span className="font-display font-semibold" style={isEnterprise ? { color: '#1D2129' } : { color: 'var(--text-primary)' }}>思考过程</span>
                {isThinking && (
                  <Loader2 className="w-4 h-4 animate-spin ml-2" style={isEnterprise ? { color: '#1459FA' } : { color: 'var(--accent-primary)' }} />
                )}
              </div>

              <div className="grid grid-cols-4 gap-4">
                {thinkingSteps.map((step, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.2 }}
                    className="p-4 rounded-xl border"
                    style={isEnterprise ? {
                      background: step.status === 'done' ? '#E8FFEA' :
                             step.status === 'active' ? '#E8F3FF' : '#F7F9FC',
                      borderColor: step.status === 'done' ? '#9CE6A0' :
                                   step.status === 'active' ? '#A8D4FF' : '#E5E6EB'
                    } : {
                      background: step.status === 'done' ? 'rgba(34, 197, 94, 0.1)' :
                             step.status === 'active' ? 'rgba(0, 229, 255, 0.1)' : 'rgba(255,255,255,0.05)',
                      borderColor: step.status === 'done' ? 'rgba(34, 197, 94, 0.3)' :
                                   step.status === 'active' ? 'var(--border-hover)' : 'var(--border-color)'
                    }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      {step.status === 'done' ? (
                        <CheckCircle2 className="w-4 h-4" style={isEnterprise ? { color: '#00B578' } : { color: '#22c55e' }} />
                      ) : step.status === 'active' ? (
                        <Loader2 className="w-4 h-4 animate-spin" style={isEnterprise ? { color: '#1459FA' } : { color: 'var(--accent-primary)' }} />
                      ) : (
                        <div className="w-4 h-4 rounded-full border-2" style={isEnterprise ? { borderColor: '#86909C' } : { borderColor: 'var(--text-muted)' }} />
                      )}
                      <span className="text-sm font-medium" style={isEnterprise ? {
                        color: step.status === 'done' ? '#00B578' :
                              step.status === 'active' ? '#1459FA' : '#86909C'
                      } : {
                        color: step.status === 'done' ? '#22c55e' :
                              step.status === 'active' ? 'var(--accent-primary)' : 'var(--text-muted)'
                      }}>
                        {step.label}
                      </span>
                    </div>
                    <p className="text-xs" style={isEnterprise ? { color: '#4E5969' } : { color: 'var(--text-muted)' }}>{step.detail}</p>
                  </motion.div>
                ))}
              </div>

              {!isThinking && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="mt-6 p-4 rounded-xl border"
                  style={isEnterprise ? { background: '#E8F3FF', borderColor: '#A8D4FF' } : { background: 'rgba(0, 229, 255, 0.1)', borderColor: 'var(--border-hover)' }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-xl">
                        🔍
                      </div>
                      <div>
                        <div className="font-medium" style={isEnterprise ? { color: '#1D2129' } : { color: 'var(--text-primary)' }}>知识库检索智能体</div>
                        <div className="text-sm" style={isEnterprise ? { color: '#4E5969' } : { color: 'var(--text-secondary)' }}>最适合您的需求</div>
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => navigate('/workspace/mvp_1')}
                      className={isEnterprise ? '' : 'cyber-button-primary flex items-center gap-2'}
                      style={isEnterprise ? { 
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '8px 20px',
                        background: '#1459FA',
                        color: '#FFFFFF',
                        borderRadius: '4px',
                        fontWeight: 500,
                        fontSize: '14px',
                        border: 'none',
                        cursor: 'pointer',
                      } : undefined}
                    >
                      <span>开始执行</span>
                      <ArrowRight className="w-4 h-4" />
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className={isEnterprise ? 'text-lg font-semibold mb-0' : 'section-title mb-0'} style={isEnterprise ? { color: '#1D2129' } : undefined}>我的常用</h2>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowAddAgent(true)}
              disabled={myAgents.length >= 6}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors disabled:opacity-50 ${isEnterprise ? '' : ''}`}
              style={isEnterprise ? { background: '#F0F5FE', color: '#1459FA' } : { background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)' }}
            >
              <Plus className="w-4 h-4" />
              <span>添加</span>
            </motion.button>
          </div>
          <div className="grid grid-cols-6 gap-3">
            {myAgents.map((agent, index) => (
              <motion.div
                key={agent.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.05 }}
                whileHover={{ scale: 1.02, y: -3 }}
                className={isEnterprise ? 'p-3 cursor-pointer group relative transition-shadow' : 'glass-card p-3 cursor-pointer group relative'}
                style={isEnterprise ? { background: '#FFFFFF', borderRadius: '8px', boxShadow: '0 2px 12px rgba(0, 50, 166, 0.08)', border: '1px solid #F0F5FE' } : undefined}
              >
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    e.stopPropagation()
                    handleRemoveAgent(agent.id)
                  }}
                  className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
                  style={isEnterprise ? { background: '#F53F3F' } : { background: 'rgba(239, 68, 68, 0.8)' }}
                >
                  <X className="w-3 h-3 text-white" />
                </motion.button>
                <div 
                  onClick={() => handleAgentClick(agent.id)}
                  className="flex flex-col items-center text-center"
                >
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${agent.color} flex items-center justify-center text-xl mb-2 group-hover:scale-110 transition-transform`}>
                    {agent.icon}
                  </div>
                  <h3 className="font-medium text-sm truncate w-full" style={isEnterprise ? { color: '#1D2129' } : { color: 'var(--text-primary)' }}>{agent.name}</h3>
                </div>
              </motion.div>
            ))}
            {myAgents.length < 6 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                onClick={() => setShowAddAgent(true)}
                className={isEnterprise ? 'p-3 cursor-pointer flex flex-col items-center justify-center min-h-[88px]' : 'glass-card p-3 cursor-pointer flex flex-col items-center justify-center min-h-[88px] border-dashed'}
                style={isEnterprise ? { background: '#FFFFFF', borderRadius: '8px', border: '2px dashed #E5E6EB' } : { borderStyle: 'dashed' }}
              >
                <Plus className="w-6 h-6 mb-1" style={isEnterprise ? { color: '#86909C' } : { color: 'var(--text-muted)' }} />
                <span className="text-xs" style={isEnterprise ? { color: '#86909C' } : { color: 'var(--text-muted)' }}>添加</span>
              </motion.div>
            )}
          </div>
        </motion.div>

        <AnimatePresence>
          {showAddAgent && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-8"
              style={isEnterprise ? { background: 'rgba(0, 0, 0, 0.45)' } : { background: 'rgba(0, 0, 0, 0.6)', backdropFilter: 'blur(4px)' }}
              onClick={() => setShowAddAgent(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className={isEnterprise ? 'p-6 max-w-md w-full max-h-[80vh] overflow-auto' : 'glass-panel p-6 max-w-md w-full max-h-[80vh] overflow-auto'}
                style={isEnterprise ? { background: '#FFFFFF', borderRadius: '8px', boxShadow: '0 8px 32px rgba(0, 50, 166, 0.16)' } : undefined}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-display text-lg font-bold" style={isEnterprise ? { color: '#1D2129' } : { color: 'var(--text-primary)' }}>添加常用智能体</h3>
                  <button
                    onClick={() => setShowAddAgent(false)}
                    className={`p-2 rounded-lg transition-colors ${isEnterprise ? 'hover:bg-gray-100' : ''}`}
                    style={isEnterprise ? { background: '#F7F9FC' } : { background: 'rgba(255,255,255,0.05)' }}
                  >
                    <X className="w-5 h-5" style={isEnterprise ? { color: '#86909C' } : { color: 'var(--text-muted)' }} />
                  </button>
                </div>
                
                {availableToAdd.length === 0 ? (
                  <div className="text-center py-8" style={isEnterprise ? { color: '#86909C' } : { color: 'var(--text-muted)' }}>
                    已添加所有可用智能体
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-3">
                    {availableToAdd.map((agent) => (
                      <motion.button
                        key={agent.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleAddAgent(agent)}
                        className={isEnterprise ? 'p-3 flex flex-col items-center text-center transition-colors' : 'glass-card p-3 flex flex-col items-center text-center'}
                        style={isEnterprise ? { background: '#F7F9FC', borderRadius: '8px' } : undefined}
                      >
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${agent.color} flex items-center justify-center text-xl mb-2`}>
                          {agent.icon}
                        </div>
                        <span className="text-sm truncate w-full" style={isEnterprise ? { color: '#1D2129' } : { color: 'var(--text-primary)' }}>{agent.name}</span>
                      </motion.button>
                    ))}
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="grid grid-cols-3 gap-3"
        >
          <div className={isEnterprise ? 'p-4' : 'glass-card p-4'} style={isEnterprise ? { background: '#FFFFFF', borderRadius: '8px', boxShadow: '0 2px 12px rgba(0, 50, 166, 0.08)', border: '1px solid #F0F5FE' } : undefined}>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg" style={isEnterprise ? { background: '#E8FFEA' } : { background: 'rgba(34, 197, 94, 0.2)' }}>
                <CheckCircle2 className="w-4 h-4" style={isEnterprise ? { color: '#00B578' } : { color: '#22c55e' }} />
              </div>
              <span className="text-sm" style={isEnterprise ? { color: '#4E5969' } : { color: 'var(--text-secondary)' }}>今日任务</span>
            </div>
            <div className="text-2xl font-display font-bold" style={isEnterprise ? { color: '#1D2129' } : { color: 'var(--text-primary)' }}>12</div>
            <div className="text-xs" style={isEnterprise ? { color: '#86909C' } : { color: 'var(--text-muted)' }}>已完成 8 项</div>
          </div>

          <div className={isEnterprise ? 'p-4' : 'glass-card p-4'} style={isEnterprise ? { background: '#FFFFFF', borderRadius: '8px', boxShadow: '0 2px 12px rgba(0, 50, 166, 0.08)', border: '1px solid #F0F5FE' } : undefined}>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg" style={isEnterprise ? { background: '#E8F3FF' } : { background: 'rgba(0, 229, 255, 0.2)' }}>
                <Zap className="w-4 h-4" style={isEnterprise ? { color: '#1459FA' } : { color: 'var(--accent-primary)' }} />
              </div>
              <span className="text-sm" style={isEnterprise ? { color: '#4E5969' } : { color: 'var(--text-secondary)' }}>智能体调用</span>
            </div>
            <div className="text-2xl font-display font-bold" style={isEnterprise ? { color: '#1D2129' } : { color: 'var(--text-primary)' }}>38</div>
            <div className="text-xs" style={isEnterprise ? { color: '#86909C' } : { color: 'var(--text-muted)' }}>本周统计</div>
          </div>

          <div className={isEnterprise ? 'p-4' : 'glass-card p-4'} style={isEnterprise ? { background: '#FFFFFF', borderRadius: '8px', boxShadow: '0 2px 12px rgba(0, 50, 166, 0.08)', border: '1px solid #F0F5FE' } : undefined}>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg" style={isEnterprise ? { background: '#FFF7E8' } : { background: 'rgba(123, 97, 255, 0.2)' }}>
                <Coins className="w-4 h-4" style={isEnterprise ? { color: '#FF8F1F' } : { color: 'var(--accent-secondary)' }} />
              </div>
              <span className="text-sm" style={isEnterprise ? { color: '#4E5969' } : { color: 'var(--text-secondary)' }}>今日Token消耗</span>
            </div>
            <div className="text-2xl font-display font-bold" style={isEnterprise ? { color: '#1D2129' } : { color: 'var(--text-primary)' }}>12.5K</div>
            <div className="text-xs" style={isEnterprise ? { color: '#86909C' } : { color: 'var(--text-muted)' }}>累计 856.2K</div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
