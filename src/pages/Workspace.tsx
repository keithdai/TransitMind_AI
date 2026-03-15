import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Send, 
  Paperclip, 
  Download,
  FileText,
  BarChart3,
  Clock,
  CheckCircle2,
  Loader2,
  Database,
  Wrench,
  Link2,
  Pause,
  Play,
  RotateCcw,
  Layout,
  Map,
  LineChart,
  PieChart,
  FileSpreadsheet,
  X,
  ChevronDown,
  ArrowLeft,
  Home
} from 'lucide-react'
import { useParams, useNavigate } from 'react-router-dom'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  status?: 'thinking' | 'done' | 'error'
  attachments?: { name: string; type: string }[]
  outputType?: 'text' | 'chart' | 'map' | 'table'
  outputData?: unknown
}

interface Template {
  id: string
  name: string
  description: string
  category: string
  icon: string
}

const templates: Template[] = [
  { id: '1', name: '交通流量分析', description: '分析路段流量数据', category: 'analysis', icon: '🚦' },
  { id: '2', name: '合规检查报告', description: '生成合规审查报告', category: 'report', icon: '📋' },
  { id: '3', name: '应急响应方案', description: '生成应急处置方案', category: 'emergency', icon: '🚨' },
  { id: '4', name: '项目进度报告', description: '生成项目进度报告', category: 'report', icon: '📊' },
  { id: '5', name: '线路优化建议', description: '分析线路优化方案', category: 'analysis', icon: '🗺️' },
  { id: '6', name: '数据统计报告', description: '生成数据统计报告', category: 'report', icon: '📈' },
]

const agentInfo = {
  id: '1',
  name: '交通分析智能体',
  icon: '🚦',
  color: 'from-cyan-500 to-blue-500',
  description: '分析交通流量数据，识别拥堵热点，提供优化建议',
}

const chartData = [
  { name: '周一', value: 65 },
  { name: '周二', value: 78 },
  { name: '周三', value: 82 },
  { name: '周四', value: 71 },
  { name: '周五', value: 89 },
  { name: '周六', value: 45 },
  { name: '周日', value: 38 },
]

const mockMessages: Message[] = [
  {
    id: '1',
    role: 'user',
    content: '帮我分析XX路段的交通流量数据',
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
  },
  {
    id: '2',
    role: 'assistant',
    content: '好的，我来分析XX路段的交通流量数据。正在检索相关数据...',
    timestamp: new Date(Date.now() - 1000 * 60 * 4),
    status: 'done',
  },
  {
    id: '3',
    role: 'assistant',
    content: `分析完成！以下是XX路段交通流量的主要发现：

**1. 高峰时段拥堵指数**
早高峰（7:00-9:00）拥堵指数达到 8.2，晚高峰（17:00-19:00）拥堵指数为 7.8。

**2. 主要拥堵点**
- XX路与YY路交叉口：平均等待时间 180 秒
- XX路段中段：车速降至 15km/h
- 公交站点附近：频繁停车导致拥堵

**3. 优化建议**
- 调整信号灯配时，优化交叉口通行效率
- 增设左转专用车道
- 优化公交站点位置，减少对主路影响`,
    timestamp: new Date(Date.now() - 1000 * 60 * 2),
    status: 'done',
    outputType: 'chart',
    outputData: chartData,
    attachments: [
      { name: '交通流量分析报告.pdf', type: 'pdf' },
      { name: '拥堵热点分布图.png', type: 'image' },
    ],
  },
]

const tasks = [
  { id: '1', name: 'XX路段流量分析', status: 'active', progress: 75 },
  { id: '2', name: '上周报告生成', status: 'done', progress: 100 },
]

const outputs = [
  { id: '1', name: '分析报告', type: 'pdf', icon: FileText },
  { id: '2', name: '数据图表', type: 'chart', icon: BarChart3 },
]

export default function Workspace() {
  const { agentId } = useParams()
  const navigate = useNavigate()
  const [messages, setMessages] = useState<Message[]>(mockMessages)
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [showTemplates, setShowTemplates] = useState(false)
  const [selectedOutputType, setSelectedOutputType] = useState<'chart' | 'map' | 'table' | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsTyping(true)

    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '好的，我来为您生成一份详细的报告。请稍候...',
        timestamp: new Date(),
        status: 'thinking',
      }
      setMessages(prev => [...prev, assistantMessage])
      
      setTimeout(() => {
        setMessages(prev => prev.map(m => 
          m.id === assistantMessage.id 
            ? { 
                ...m, 
                status: 'done', 
                content: '报告已生成完成！您可以在右侧输出面板查看和下载。',
                outputType: 'chart',
                outputData: chartData
              }
            : m
        ))
        setIsTyping(false)
      }, 2000)
    }, 1000)
  }

  const handleTemplateSelect = (template: Template) => {
    setInput(`使用「${template.name}」模板：`)
    setShowTemplates(false)
  }

  const renderChart = (data: typeof chartData) => {
    const maxValue = Math.max(...data.map(d => d.value))
    
    return (
      <div className="chart-container mt-4">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-medium" style={{ color: 'var(--text-primary)' }}>周流量统计</h4>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedOutputType('chart')}
              className="p-1.5 rounded transition-colors"
              style={{ 
                background: selectedOutputType === 'chart' ? 'rgba(0, 229, 255, 0.2)' : 'rgba(255,255,255,0.05)'
              }}
            >
              <LineChart className="w-4 h-4" style={{ color: 'var(--accent-primary)' }} />
            </button>
            <button
              onClick={() => setSelectedOutputType('table')}
              className="p-1.5 rounded transition-colors"
              style={{ 
                background: selectedOutputType === 'table' ? 'rgba(0, 229, 255, 0.2)' : 'rgba(255,255,255,0.05)'
              }}
            >
              <FileSpreadsheet className="w-4 h-4" style={{ color: 'var(--accent-primary)' }} />
            </button>
          </div>
        </div>
        
        {selectedOutputType !== 'table' ? (
          <div className="flex items-end justify-between h-40 gap-2">
            {data.map((item, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${(item.value / maxValue) * 100}%` }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="chart-bar w-full"
                  style={{ minHeight: '4px' }}
                />
                <span className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>{item.name}</span>
                <span className="text-xs font-mono" style={{ color: 'var(--accent-primary)' }}>{item.value}%</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="overflow-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <th className="text-left py-2" style={{ color: 'var(--text-secondary)' }}>日期</th>
                  <th className="text-right py-2" style={{ color: 'var(--text-secondary)' }}>流量指数</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item, index) => (
                  <tr key={index} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td className="py-2" style={{ color: 'var(--text-primary)' }}>{item.name}</td>
                    <td className="py-2 text-right font-mono" style={{ color: 'var(--accent-primary)' }}>{item.value}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    )
  }

  const renderMap = () => (
    <div className="map-container mt-4 h-48 relative">
      <svg viewBox="0 0 400 200" className="w-full h-full">
        <defs>
          <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="var(--accent-primary)" />
            <stop offset="100%" stopColor="var(--accent-secondary)" />
          </linearGradient>
        </defs>
        
        <path
          d="M50,100 Q100,50 150,100 T250,100 T350,100"
          className="map-route"
        />
        
        <circle cx="50" cy="100" r="8" className="map-marker" />
        <circle cx="150" cy="100" r="8" className="map-marker" />
        <circle cx="250" cy="100" r="8" className="map-marker" />
        <circle cx="350" cy="100" r="8" className="map-marker" />
        
        <text x="50" y="130" fill="var(--text-secondary)" fontSize="10" textAnchor="middle">站点A</text>
        <text x="150" y="130" fill="var(--text-secondary)" fontSize="10" textAnchor="middle">站点B</text>
        <text x="250" y="130" fill="var(--text-secondary)" fontSize="10" textAnchor="middle">站点C</text>
        <text x="350" y="130" fill="var(--text-secondary)" fontSize="10" textAnchor="middle">站点D</text>
      </svg>
      
      <div className="absolute bottom-2 left-2 flex items-center gap-2 px-2 py-1 rounded text-xs" style={{ background: 'var(--bg-card)' }}>
        <Map className="w-3 h-3" style={{ color: 'var(--accent-primary)' }} />
        <span style={{ color: 'var(--text-secondary)' }}>XX路段拥堵分布</span>
      </div>
    </div>
  )

  return (
    <div className="h-screen flex flex-col" style={{ background: 'var(--bg-primary)' }}>
      <header className="h-14 border-b flex items-center justify-between px-4" style={{ borderColor: 'var(--border-color)', background: 'var(--bg-card)' }}>
        <div className="flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/')}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors"
            style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)' }}
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">返回首页</span>
          </motion.button>
          <div className="h-6 w-px" style={{ background: 'var(--border-color)' }} />
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${agentInfo.color} flex items-center justify-center text-lg`}>
              {agentInfo.icon}
            </div>
            <div>
              <h1 className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>{agentInfo.name}</h1>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{agentInfo.description}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/marketplace')}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors"
            style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)' }}
          >
            <Home className="w-4 h-4" />
            <span className="text-sm">智能体超市</span>
          </motion.button>
        </div>
      </header>
      
      <div className="flex-1 flex overflow-hidden">
      <motion.aside
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="w-64 border-r flex flex-col"
        style={{ 
          borderColor: 'var(--border-color)',
          background: 'var(--bg-card)'
        }}
      >
        <div className="p-4 border-b" style={{ borderColor: 'var(--border-color)' }}>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${agentInfo.color} flex items-center justify-center text-xl`}>
              {agentInfo.icon}
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="font-medium truncate" style={{ color: 'var(--text-primary)' }}>{agentInfo.name}</h2>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>在线</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-4">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>模板库</h3>
              <button
                onClick={() => setShowTemplates(!showTemplates)}
                className="p-1 rounded transition-colors"
                style={{ background: 'rgba(255,255,255,0.05)' }}
              >
                <Layout className="w-4 h-4" style={{ color: 'var(--accent-primary)' }} />
              </button>
            </div>
            
            <AnimatePresence>
              {showTemplates && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2 mb-4"
                >
                  {templates.map((template) => (
                    <motion.button
                      key={template.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      onClick={() => handleTemplateSelect(template)}
                      className="w-full flex items-center gap-2 p-2 rounded-lg text-left transition-colors"
                      style={{ background: 'rgba(255,255,255,0.05)' }}
                    >
                      <span className="text-lg">{template.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm truncate" style={{ color: 'var(--text-primary)' }}>{template.name}</div>
                        <div className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>{template.description}</div>
                      </div>
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="mb-6">
            <h3 className="text-xs font-medium uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>当前任务</h3>
            <div className="space-y-2">
              {tasks.map((task) => (
                <div key={task.id} className="p-3 rounded-lg" style={{ background: 'rgba(255,255,255,0.05)' }}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm" style={{ color: 'var(--text-primary)' }}>{task.name}</span>
                    {task.status === 'active' ? (
                      <Loader2 className="w-4 h-4 animate-spin" style={{ color: 'var(--accent-primary)' }} />
                    ) : (
                      <CheckCircle2 className="w-4 h-4 text-green-400" />
                    )}
                  </div>
                  {task.status === 'active' && (
                    <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${task.progress}%` }}
                        className="h-full rounded-full"
                        style={{ background: 'linear-gradient(to right, var(--accent-primary), var(--accent-secondary))' }}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xs font-medium uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>历史任务</h3>
            <div className="space-y-2">
              <div className="p-3 rounded-lg opacity-60" style={{ background: 'rgba(255,255,255,0.05)' }}>
                <div className="flex items-center justify-between">
                  <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>上周报告生成</span>
                  <CheckCircle2 className="w-4 h-4 text-green-400" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 border-t" style={{ borderColor: 'var(--border-color)' }}>
          <h3 className="text-xs font-medium uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>输出文件</h3>
          <div className="space-y-2">
            {outputs.map((output) => (
              <motion.button
                key={output.id}
                whileHover={{ scale: 1.02 }}
                className="w-full flex items-center gap-2 p-2 rounded-lg transition-colors"
                style={{ background: 'rgba(255,255,255,0.05)' }}
              >
                <output.icon className="w-4 h-4" style={{ color: 'var(--accent-primary)' }} />
                <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{output.name}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </motion.aside>

      <div className="flex-1 flex flex-col">
        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-3xl mx-auto space-y-6">
            <AnimatePresence>
              {messages.map((message, index) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] ${message.role === 'user' ? 'order-2' : 'order-1'}`}>
                    {message.role === 'assistant' && (
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`w-6 h-6 rounded-lg bg-gradient-to-br ${agentInfo.color} flex items-center justify-center text-sm`}>
                          {agentInfo.icon}
                        </div>
                        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{agentInfo.name}</span>
                        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                          {message.timestamp.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    )}
                    
                    <div className="p-4 rounded-2xl" style={{
                      background: message.role === 'user' ? 'rgba(0, 229, 255, 0.1)' : 'var(--bg-card)',
                      border: `1px solid ${message.role === 'user' ? 'var(--border-hover)' : 'var(--border-color)'}`
                    }}>
                      <div className="whitespace-pre-wrap" style={{ color: 'var(--text-primary)' }}>{message.content}</div>
                      
                      {message.status === 'thinking' && (
                        <div className="flex items-center gap-2 mt-2" style={{ color: 'var(--accent-primary)' }}>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span className="text-sm">处理中...</span>
                        </div>
                      )}

                      {message.outputType === 'chart' && message.outputData && renderChart(message.outputData as typeof chartData)}
                      {message.outputType === 'map' && renderMap()}

                      {message.attachments && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {message.attachments.map((att, i) => (
                            <div key={i} className="flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ background: 'rgba(255,255,255,0.1)' }}>
                              <FileText className="w-4 h-4" style={{ color: 'var(--accent-primary)' }} />
                              <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{att.name}</span>
                              <Download className="w-4 h-4 cursor-pointer transition-colors" style={{ color: 'var(--text-muted)' }} />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {message.role === 'user' && (
                      <div className="flex justify-end mt-1">
                        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                          {message.timestamp.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {isTyping && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-2"
                style={{ color: 'var(--text-muted)' }}
              >
                <Loader2 className="w-4 h-4 animate-spin" style={{ color: 'var(--accent-primary)' }} />
                <span className="text-sm">智能体正在思考...</span>
              </motion.div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </div>

        <div className="p-4 border-t" style={{ borderColor: 'var(--border-color)', background: 'var(--bg-card)' }}>
          <div className="max-w-3xl mx-auto">
            <div className="flex items-end gap-3">
              <div className="flex-1 relative">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      handleSend()
                    }
                  }}
                  placeholder="输入消息... (Shift+Enter 换行)"
                  rows={1}
                  className="input-cyber resize-none"
                  style={{ minHeight: '48px', maxHeight: '120px' }}
                />
                <div className="absolute right-2 bottom-2 flex items-center gap-1">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 rounded-lg transition-colors"
                    style={{ background: 'rgba(255,255,255,0.05)' }}
                  >
                    <Paperclip className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                  </motion.button>
                </div>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSend}
                disabled={!input.trim()}
                className="cyber-button-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
                <span>发送</span>
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      <motion.aside
        initial={{ x: 20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="w-72 border-l flex flex-col"
        style={{ 
          borderColor: 'var(--border-color)',
          background: 'var(--bg-card)'
        }}
      >
        <div className="p-4 border-b" style={{ borderColor: 'var(--border-color)' }}>
          <h3 className="font-medium" style={{ color: 'var(--text-primary)' }}>辅助工具</h3>
        </div>

        <div className="flex-1 overflow-auto p-4 space-y-6">
          <div>
            <h4 className="text-xs font-medium uppercase tracking-wider mb-3 flex items-center gap-2" style={{ color: 'var(--text-muted)' }}>
              <Database className="w-4 h-4" />
              知识库
            </h4>
            <div className="space-y-2">
              {['交通法规知识库', '历史数据知识库'].map((kb) => (
                <div key={kb} className="flex items-center gap-2 p-2 rounded-lg transition-colors cursor-pointer" style={{ background: 'rgba(255,255,255,0.05)' }}>
                  <div className="w-2 h-2 rounded-full" style={{ background: 'var(--accent-primary)' }} />
                  <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{kb}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-xs font-medium uppercase tracking-wider mb-3 flex items-center gap-2" style={{ color: 'var(--text-muted)' }}>
              <Wrench className="w-4 h-4" />
              输出工具
            </h4>
            <div className="space-y-2">
              {[
                { name: '柱状图', icon: BarChart3 },
                { name: '折线图', icon: LineChart },
                { name: '饼图', icon: PieChart },
                { name: '地图', icon: Map },
              ].map((tool) => (
                <motion.button
                  key={tool.name}
                  whileHover={{ scale: 1.02 }}
                  className="w-full flex items-center gap-2 p-2 rounded-lg transition-colors"
                  style={{ background: 'rgba(255,255,255,0.05)' }}
                >
                  <tool.icon className="w-4 h-4" style={{ color: 'var(--accent-secondary)' }} />
                  <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{tool.name}</span>
                </motion.button>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-xs font-medium uppercase tracking-wider mb-3 flex items-center gap-2" style={{ color: 'var(--text-muted)' }}>
              <Link2 className="w-4 h-4" />
              相关资源
            </h4>
            <div className="space-y-2">
              {['XX路段数据', '历史对比', '相关法规'].map((res) => (
                <div key={res} className="flex items-center gap-2 p-2 rounded-lg transition-colors cursor-pointer" style={{ background: 'rgba(255,255,255,0.05)' }}>
                  <div className="w-2 h-2 rounded-full" style={{ background: 'var(--accent-secondary)' }} />
                  <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{res}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-4 border-t" style={{ borderColor: 'var(--border-color)' }}>
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              className="flex-1 flex items-center justify-center gap-2 p-2 rounded-lg text-sm"
              style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)' }}
            >
              <Pause className="w-4 h-4" />
              暂停
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              className="flex-1 flex items-center justify-center gap-2 p-2 rounded-lg text-sm"
              style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)' }}
            >
              <RotateCcw className="w-4 h-4" />
              重置
            </motion.button>
          </div>
        </div>
      </motion.aside>
      </div>
    </div>
  )
}
