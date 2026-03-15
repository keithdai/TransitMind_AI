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
  Star,
  Coins
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useHistory } from '../contexts/HistoryContext'

const suggestions = [
  { text: '帮我分析XX路段的交通流量数据', icon: Target },
  { text: '生成一份交通规划报告', icon: Lightbulb },
  { text: '检查这个项目的合规性', icon: CheckCircle2 },
  { text: '查询上个月的应急事件统计', icon: Zap },
]

const defaultAgents = [
  { id: '1', name: '交通分析', icon: '🚦', color: 'from-cyan-500 to-blue-500' },
  { id: '2', name: '合规检查', icon: '📋', color: 'from-purple-500 to-pink-500' },
  { id: '3', name: '报告生成', icon: '📊', color: 'from-green-500 to-emerald-500' },
  { id: '4', name: '应急响应', icon: '🚨', color: 'from-orange-500 to-red-500' },
  { id: '5', name: '线路优化', icon: '🗺️', color: 'from-teal-500 to-cyan-500' },
  { id: '6', name: '项目跟踪', icon: '📅', color: 'from-blue-500 to-indigo-500' },
]

const availableAgents = [
  { id: '1', name: '交通分析', icon: '🚦', color: 'from-cyan-500 to-blue-500' },
  { id: '2', name: '合规检查', icon: '📋', color: 'from-purple-500 to-pink-500' },
  { id: '3', name: '报告生成', icon: '📊', color: 'from-green-500 to-emerald-500' },
  { id: '4', name: '应急响应', icon: '🚨', color: 'from-orange-500 to-red-500' },
  { id: '5', name: '线路优化', icon: '🗺️', color: 'from-teal-500 to-cyan-500' },
  { id: '6', name: '项目跟踪', icon: '📅', color: 'from-blue-500 to-indigo-500' },
  { id: '7', name: '外部AI助手', icon: '🤖', color: 'from-indigo-500 to-purple-500' },
]

const thinkingSteps = [
  { label: '理解意图', status: 'done', detail: '识别为数据分析任务' },
  { label: '提取实体', status: 'done', detail: 'XX路段、交通流量' },
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
  
  const [myAgents, setMyAgents] = useState(defaultAgents)
  const [showAddAgent, setShowAddAgent] = useState(false)

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
        { id: '1', text: '分析交通流量数据', agentId: '1', agentName: '交通分析智能体' },
        { id: '2', text: '检查项目合规性', agentId: '2', agentName: '合规检查智能体' },
        { id: '3', text: '生成项目报告', agentId: '3', agentName: '报告生成智能体' },
      ])
      return
    }
    
    addToHistory(input, '1', '交通分析智能体')
    setIsThinking(true)
    setShowThinking(true)
    setTimeout(() => {
      setIsThinking(false)
    }, 3000)
  }

  const handleAgentClick = (agentId: string) => {
    navigate(`/workspace/${agentId}`)
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
    <div className="h-full p-6 overflow-auto">
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
            style={{ background: 'rgba(0, 229, 255, 0.1)', borderColor: 'var(--border-hover)' }}
          >
            <Sparkles className="w-4 h-4" style={{ color: 'var(--accent-primary)' }} />
            <span className="text-sm font-medium" style={{ color: 'var(--accent-primary)' }}>智能体已就绪</span>
          </motion.div>
          
          <h1 className="font-display text-4xl font-bold" style={{ color: 'var(--text-primary)' }}>
            有什么可以帮您的？
          </h1>
          <p className="max-w-xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
            用自然语言描述您的需求，智能体工作台将理解您的意图并推荐最合适的智能体
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-panel p-6"
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
                    placeholder="描述您的需求，例如：帮我分析XX路段的交通流量..."
                    className="input-cyber text-lg py-4 pr-24 resize-none"
                    rows={3}
                    style={{ minHeight: '80px' }}
                  />
                  <div className="absolute right-3 top-3 flex items-center gap-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => fileInputRef.current?.click()}
                      className="p-2 rounded-lg transition-colors"
                      style={{ background: 'rgba(255,255,255,0.05)' }}
                      title="上传图片或文件"
                    >
                      <Image className="w-5 h-5" style={{ color: 'var(--text-muted)' }} />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 rounded-lg transition-colors"
                      style={{ background: 'rgba(255,255,255,0.05)' }}
                      title="语音输入"
                    >
                      <Mic className="w-5 h-5" style={{ color: 'var(--text-muted)' }} />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setShowHistory(!showHistory)}
                      className="p-2 rounded-lg transition-colors"
                      style={{ background: showHistory ? 'rgba(0, 229, 255, 0.2)' : 'rgba(255,255,255,0.05)' }}
                      title="历史记录"
                    >
                      <Clock className="w-5 h-5" style={{ color: showHistory ? 'var(--accent-primary)' : 'var(--text-muted)' }} />
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
                        style={{ background: 'rgba(255,255,255,0.05)', borderColor: 'var(--border-color)' }}
                      >
                        {att.type === 'image' && att.preview ? (
                          <img src={att.preview} alt={att.name} className="w-8 h-8 rounded object-cover" />
                        ) : (
                          <Paperclip className="w-4 h-4" style={{ color: 'var(--accent-primary)' }} />
                        )}
                        <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{att.name}</span>
                        <button onClick={() => removeAttachment(index)} className="p-1 rounded hover:bg-white/10">
                          <X className="w-3 h-3" style={{ color: 'var(--text-muted)' }} />
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
                      style={{ 
                        background: 'rgba(255,255,255,0.05)', 
                        borderColor: 'var(--border-color)',
                        color: 'var(--text-secondary)'
                      }}
                    >
                      <suggestion.icon className="w-3.5 h-3.5" style={{ color: 'var(--accent-primary)' }} />
                      <span>{suggestion.text}</span>
                    </motion.button>
                  ))}
                </div>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSubmit}
                className="cyber-button-primary flex items-center gap-2 self-end"
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
              className="glass-panel overflow-hidden"
            >
              <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: 'var(--border-color)' }}>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" style={{ color: 'var(--accent-primary)' }} />
                  <span className="font-medium" style={{ color: 'var(--text-primary)' }}>历史记录</span>
                </div>
                <button
                  onClick={clearHistory}
                  className="text-xs flex items-center gap-1 px-2 py-1 rounded hover:bg-white/10"
                  style={{ color: 'var(--text-muted)' }}
                >
                  <Trash2 className="w-3 h-3" />
                  清空
                </button>
              </div>
              <div className="max-h-48 overflow-auto">
                {history.length === 0 ? (
                  <div className="p-4 text-center" style={{ color: 'var(--text-muted)' }}>
                    暂无历史记录
                  </div>
                ) : (
                  <div className="divide-y" style={{ borderColor: 'var(--border-color)' }}>
                    {history.map((item) => (
                      <div
                        key={item.id}
                        className="p-3 flex items-center justify-between hover:bg-white/5 cursor-pointer"
                        onClick={() => {
                          setInput(item.query)
                          setShowHistory(false)
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <MessageCircle className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                          <div>
                            <div className="text-sm" style={{ color: 'var(--text-primary)' }}>{item.query}</div>
                            {item.agentName && (
                              <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
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
                          className="p-1 rounded hover:bg-white/10"
                        >
                          <X className="w-3 h-3" style={{ color: 'var(--text-muted)' }} />
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
              className="glass-panel p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg" style={{ background: 'rgba(123, 97, 255, 0.2)' }}>
                  <HelpCircle className="w-5 h-5" style={{ color: 'var(--accent-secondary)' }} />
                </div>
                <div>
                  <span className="font-display font-semibold" style={{ color: 'var(--text-primary)' }}>需要更多信息</span>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>请选择您具体想要执行的操作</p>
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
                    style={{ 
                      background: 'rgba(255,255,255,0.05)', 
                      borderColor: 'var(--border-color)'
                    }}
                  >
                    <div>
                      <div className="font-medium" style={{ color: 'var(--text-primary)' }}>{option.text}</div>
                      <div className="text-sm" style={{ color: 'var(--text-muted)' }}>{option.agentName}</div>
                    </div>
                    <ArrowRight className="w-4 h-4" style={{ color: 'var(--accent-primary)' }} />
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
              className="glass-panel p-6 overflow-hidden"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg" style={{ background: 'rgba(123, 97, 255, 0.2)' }}>
                  <Brain className="w-5 h-5" style={{ color: 'var(--accent-secondary)' }} />
                </div>
                <span className="font-display font-semibold" style={{ color: 'var(--text-primary)' }}>思考过程</span>
                {isThinking && (
                  <Loader2 className="w-4 h-4 animate-spin ml-2" style={{ color: 'var(--accent-primary)' }} />
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
                    style={{
                      background: step.status === 'done' ? 'rgba(34, 197, 94, 0.1)' :
                             step.status === 'active' ? 'rgba(0, 229, 255, 0.1)' : 'rgba(255,255,255,0.05)',
                      borderColor: step.status === 'done' ? 'rgba(34, 197, 94, 0.3)' :
                                   step.status === 'active' ? 'var(--border-hover)' : 'var(--border-color)'
                    }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      {step.status === 'done' ? (
                        <CheckCircle2 className="w-4 h-4 text-green-400" />
                      ) : step.status === 'active' ? (
                        <Loader2 className="w-4 h-4 animate-spin" style={{ color: 'var(--accent-primary)' }} />
                      ) : (
                        <div className="w-4 h-4 rounded-full border-2" style={{ borderColor: 'var(--text-muted)' }} />
                      )}
                      <span className="text-sm font-medium" style={{
                        color: step.status === 'done' ? '#22c55e' :
                              step.status === 'active' ? 'var(--accent-primary)' : 'var(--text-muted)'
                      }}>
                        {step.label}
                      </span>
                    </div>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{step.detail}</p>
                  </motion.div>
                ))}
              </div>

              {!isThinking && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="mt-6 p-4 rounded-xl border"
                  style={{ background: 'rgba(0, 229, 255, 0.1)', borderColor: 'var(--border-hover)' }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-xl">
                        🚦
                      </div>
                      <div>
                        <div className="font-medium" style={{ color: 'var(--text-primary)' }}>交通分析智能体</div>
                        <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>最适合您的需求</div>
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => navigate('/workspace/1')}
                      className="cyber-button-primary flex items-center gap-2"
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
            <h2 className="section-title mb-0">我的常用</h2>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowAddAgent(true)}
              disabled={myAgents.length >= 6}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors disabled:opacity-50"
              style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)' }}
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
                className="glass-card p-3 cursor-pointer group relative"
              >
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    e.stopPropagation()
                    handleRemoveAgent(agent.id)
                  }}
                  className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
                  style={{ background: 'rgba(239, 68, 68, 0.8)' }}
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
                  <h3 className="font-medium text-sm truncate w-full" style={{ color: 'var(--text-primary)' }}>{agent.name}</h3>
                </div>
              </motion.div>
            ))}
            {myAgents.length < 6 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                onClick={() => setShowAddAgent(true)}
                className="glass-card p-3 cursor-pointer flex flex-col items-center justify-center min-h-[88px] border-dashed"
                style={{ borderStyle: 'dashed' }}
              >
                <Plus className="w-6 h-6 mb-1" style={{ color: 'var(--text-muted)' }} />
                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>添加</span>
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
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-8"
              onClick={() => setShowAddAgent(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="glass-panel p-6 max-w-md w-full"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-display text-lg font-bold" style={{ color: 'var(--text-primary)' }}>添加常用智能体</h3>
                  <button
                    onClick={() => setShowAddAgent(false)}
                    className="p-2 rounded-lg transition-colors"
                    style={{ background: 'rgba(255,255,255,0.05)' }}
                  >
                    <X className="w-5 h-5" style={{ color: 'var(--text-muted)' }} />
                  </button>
                </div>
                
                {availableToAdd.length === 0 ? (
                  <div className="text-center py-8" style={{ color: 'var(--text-muted)' }}>
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
                        className="glass-card p-3 flex flex-col items-center text-center"
                      >
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${agent.color} flex items-center justify-center text-xl mb-2`}>
                          {agent.icon}
                        </div>
                        <span className="text-sm" style={{ color: 'var(--text-primary)' }}>{agent.name}</span>
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
          <div className="glass-card p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg" style={{ background: 'rgba(34, 197, 94, 0.2)' }}>
                <CheckCircle2 className="w-4 h-4 text-green-400" />
              </div>
              <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>今日任务</span>
            </div>
            <div className="text-2xl font-display font-bold" style={{ color: 'var(--text-primary)' }}>12</div>
            <div className="text-xs" style={{ color: 'var(--text-muted)' }}>已完成 8 项</div>
          </div>

          <div className="glass-card p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg" style={{ background: 'rgba(0, 229, 255, 0.2)' }}>
                <Zap className="w-4 h-4" style={{ color: 'var(--accent-primary)' }} />
              </div>
              <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>智能体调用</span>
            </div>
            <div className="text-2xl font-display font-bold" style={{ color: 'var(--text-primary)' }}>38</div>
            <div className="text-xs" style={{ color: 'var(--text-muted)' }}>本周统计</div>
          </div>

          <div className="glass-card p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg" style={{ background: 'rgba(123, 97, 255, 0.2)' }}>
                <Coins className="w-4 h-4" style={{ color: 'var(--accent-secondary)' }} />
              </div>
              <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>今日Token消耗</span>
            </div>
            <div className="text-2xl font-display font-bold" style={{ color: 'var(--text-primary)' }}>12.5K</div>
            <div className="text-xs" style={{ color: 'var(--text-muted)' }}>累计 856.2K</div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
