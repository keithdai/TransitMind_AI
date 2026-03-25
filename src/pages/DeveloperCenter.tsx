import { useState } from 'react'
import { 
  Bot, 
  Plus, 
  Code2, 
  Database, 
  BarChart3, 
  Settings,
  ExternalLink,
  Users,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  FileText,
  Search
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface MyAgent {
  id: string
  name: string
  description: string
  icon: string
  status: 'draft' | 'reviewing' | 'published'
  version: string
  users: number
  calls: number
  rating: number
  updatedAt: string
}

const mockMyAgents: MyAgent[] = [
  {
    id: 'my_1',
    name: '会议纪要生成',
    description: '自动生成办公会、专题会会议纪要',
    icon: '📝',
    status: 'published',
    version: '1.2.0',
    users: 234,
    calls: 5678,
    rating: 4.8,
    updatedAt: '2026-03-14'
  },
  {
    id: 'my_2',
    name: '公文起草助手',
    description: '辅助生成请示、报告等公文初稿',
    icon: '📄',
    status: 'reviewing',
    version: '0.9.0',
    users: 0,
    calls: 0,
    rating: 0,
    updatedAt: '2026-03-15'
  },
  {
    id: 'my_3',
    name: '数据分析工具',
    description: '自动生成数据分析报告和图表',
    icon: '📊',
    status: 'draft',
    version: '0.5.0',
    users: 0,
    calls: 0,
    rating: 0,
    updatedAt: '2026-03-13'
  }
]

const statusConfig = {
  draft: { label: '草稿', color: 'text-gray-400', bg: 'bg-gray-500/20', icon: FileText },
  reviewing: { label: '审核中', color: 'text-yellow-400', bg: 'bg-yellow-500/20', icon: AlertCircle },
  published: { label: '已上架', color: 'text-green-400', bg: 'bg-green-500/20', icon: CheckCircle2 }
}

export default function DeveloperCenter() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<'agents' | 'skills' | 'data' | 'stats'>('agents')
  const [myAgents] = useState<MyAgent[]>(mockMyAgents)

  const stats = {
    totalAgents: myAgents.length,
    publishedAgents: myAgents.filter(a => a.status === 'published').length,
    totalCalls: myAgents.reduce((sum, a) => sum + a.calls, 0),
    totalUsers: myAgents.reduce((sum, a) => sum + a.users, 0),
    avgRating: myAgents.filter(a => a.rating > 0).reduce((sum, a, _, arr) => sum + a.rating / arr.length, 0)
  }

  return (
    <div className="min-h-screen p-6 space-y-6" style={{ background: 'var(--bg-primary)' }}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>开发者中心</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>创建、管理和发布你的智能体</p>
        </div>
        <button
          onClick={() => navigate('/developer/create')}
          className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all"
          style={{ 
            background: 'var(--accent-primary)',
            color: 'white'
          }}
        >
          <Plus className="w-4 h-4" />
          创建智能体
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-card p-4 cursor-pointer hover:scale-105 transition-all">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg" style={{ background: 'var(--accent-primary)20' }}>
              <Bot className="w-5 h-5" style={{ color: 'var(--accent-primary)' }} />
            </div>
            <div>
              <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{stats.totalAgents}</p>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>我的智能体</p>
            </div>
          </div>
        </div>

        <div className="glass-card p-4 cursor-pointer hover:scale-105 transition-all">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg" style={{ background: '#22c55e20' }}>
              <CheckCircle2 className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{stats.publishedAgents}</p>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>已上架</p>
            </div>
          </div>
        </div>

        <div className="glass-card p-4 cursor-pointer hover:scale-105 transition-all">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg" style={{ background: '#f59e0b20' }}>
              <TrendingUp className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{stats.totalCalls.toLocaleString()}</p>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>总调用量</p>
            </div>
          </div>
        </div>

        <div className="glass-card p-4 cursor-pointer hover:scale-105 transition-all">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg" style={{ background: '#8b5cf620' }}>
              <Users className="w-5 h-5 text-violet-500" />
            </div>
            <div>
              <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{stats.totalUsers}</p>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>使用用户</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-2 border-b" style={{ borderColor: 'var(--border-color)' }}>
        {[
          { id: 'agents', label: '我的智能体', icon: Bot },
          { id: 'skills', label: '技能市场', icon: Code2 },
          { id: 'data', label: '数据集中心', icon: Database },
          { id: 'stats', label: '运营数据', icon: BarChart3 }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-all ${
              activeTab === tab.id 
                ? 'border-current' 
                : 'border-transparent hover:border-gray-500'
            }`}
            style={{ 
              color: activeTab === tab.id ? 'var(--accent-primary)' : 'var(--text-secondary)'
            }}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'agents' && (
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-secondary)' }} />
              <input
                type="text"
                placeholder="搜索智能体..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border"
                style={{ 
                  background: 'var(--bg-card)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-primary)'
                }}
              />
            </div>
            <select
              className="px-4 py-2 rounded-lg border"
              style={{ 
                background: 'var(--bg-card)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-primary)'
              }}
            >
              <option value="all">全部状态</option>
              <option value="draft">草稿</option>
              <option value="reviewing">审核中</option>
              <option value="published">已上架</option>
            </select>
          </div>

          <div className="grid gap-4">
            {myAgents.map(agent => {
              const status = statusConfig[agent.status]
              const StatusIcon = status.icon
              return (
                <div
                  key={agent.id}
                  className="glass-card p-4 cursor-pointer"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="text-3xl">{agent.icon}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium" style={{ color: 'var(--text-primary)' }}>{agent.name}</h3>
                          <span className="text-xs px-2 py-0.5 rounded" style={{ background: 'var(--bg-primary)', color: 'var(--text-secondary)' }}>v{agent.version}</span>
                          <span className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded ${status.bg} ${status.color}`}>
                            <StatusIcon className="w-3 h-3" />
                            {status.label}
                          </span>
                        </div>
                        <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>{agent.description}</p>
                        {agent.status === 'published' && (
                          <div className="flex items-center gap-4 mt-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
                            <span className="flex items-center gap-1">
                              <Users className="w-3 h-3" />
                              {agent.users} 用户
                            </span>
                            <span className="flex items-center gap-1">
                              <TrendingUp className="w-3 h-3" />
                              {agent.calls.toLocaleString()} 次调用
                            </span>
                            {agent.rating > 0 && (
                              <span className="flex items-center gap-1">
                                ⭐ {agent.rating}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        className="p-2 rounded-lg border transition-all hover:border-opacity-50"
                        style={{ 
                          borderColor: 'var(--border-color)',
                          color: 'var(--text-secondary)'
                        }}
                      >
                        <Settings className="w-4 h-4" />
                      </button>
                      {agent.status === 'published' && (
                        <button
                          className="p-2 rounded-lg border transition-all hover:border-opacity-50"
                          style={{ 
                            borderColor: 'var(--border-color)',
                            color: 'var(--text-secondary)'
                          }}
                        >
                          <ExternalLink className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          <div 
            className="glass-card p-8 text-center cursor-pointer border-2 border-dashed"
            style={{ borderColor: 'var(--border-color)' }}
            onClick={() => navigate('/developer/create')}
          >
            <Plus className="w-8 h-8 mx-auto mb-2 opacity-50" style={{ color: 'var(--text-secondary)' }} />
            <p style={{ color: 'var(--text-secondary)' }}>创建新的智能体</p>
          </div>
        </div>
      )}

      {activeTab === 'skills' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="glass-card p-4">
              <h3 className="font-medium mb-3" style={{ color: 'var(--text-primary)' }}>输入技能</h3>
              <div className="space-y-2">
                {['文本理解', '语音转写', '文档解析', '表格识别', '图片理解'].map(skill => (
                  <div key={skill} className="flex items-center justify-between p-2 rounded-lg" style={{ background: 'var(--bg-primary)' }}>
                    <span className="text-sm" style={{ color: 'var(--text-primary)' }}>{skill}</span>
                    <span className="text-xs px-2 py-0.5 rounded" style={{ background: 'var(--accent-primary)20', color: 'var(--accent-primary)' }}>内置</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-card p-4">
              <h3 className="font-medium mb-3" style={{ color: 'var(--text-primary)' }}>输出技能</h3>
              <div className="space-y-2">
                {['内容生成', '格式转换', '可视化渲染', '文件导出'].map(skill => (
                  <div key={skill} className="flex items-center justify-between p-2 rounded-lg" style={{ background: 'var(--bg-primary)' }}>
                    <span className="text-sm" style={{ color: 'var(--text-primary)' }}>{skill}</span>
                    <span className="text-xs px-2 py-0.5 rounded" style={{ background: 'var(--accent-primary)20', color: 'var(--accent-primary)' }}>内置</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-card p-4">
              <h3 className="font-medium mb-3" style={{ color: 'var(--text-primary)' }}>工具技能</h3>
              <div className="space-y-2">
                {['数据查询', 'API调用', '流程执行', '外部系统集成'].map(skill => (
                  <div key={skill} className="flex items-center justify-between p-2 rounded-lg" style={{ background: 'var(--bg-primary)' }}>
                    <span className="text-sm" style={{ color: 'var(--text-primary)' }}>{skill}</span>
                    <span className="text-xs px-2 py-0.5 rounded" style={{ background: '#8b5cf620', color: '#8b5cf6' }}>可配置</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'data' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>数据集用于模型优化训练，包括指令集、标注数据、训练语料等</p>
            <button
              onClick={() => navigate('/data-center')}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border transition-all"
              style={{ 
                borderColor: 'var(--accent-primary)',
                color: 'var(--accent-primary)'
              }}
            >
              <Database className="w-4 h-4" />
              进入数据集中心
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="glass-card p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg" style={{ background: '#f59e0b20' }}>
                  <FileText className="w-5 h-5 text-amber-500" />
                </div>
                <div>
                  <h3 className="font-medium" style={{ color: 'var(--text-primary)' }}>指令集</h3>
                  <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>2,345 条指令</p>
                </div>
              </div>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>公文写作、问答、分析等各类指令数据</p>
            </div>

            <div className="glass-card p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg" style={{ background: '#22c55e20' }}>
                  <Database className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <h3 className="font-medium" style={{ color: 'var(--text-primary)' }}>标注数据</h3>
                  <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>12,678 条标注</p>
                </div>
              </div>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>实体标注、文档标注、多模态标注</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'stats' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="glass-card p-4">
              <h3 className="font-medium mb-4" style={{ color: 'var(--text-primary)' }}>调用趋势（近7天）</h3>
              <div className="h-48 flex items-end justify-between gap-2">
                {[65, 78, 90, 85, 120, 145, 180].map((value, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div 
                      className="w-full rounded-t transition-all"
                      style={{ 
                        height: `${value}px`,
                        background: 'linear-gradient(to top, var(--accent-primary), var(--accent-secondary))'
                      }}
                    />
                    <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                      {['周一', '周二', '周三', '周四', '周五', '周六', '周日'][i]}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-card p-4">
              <h3 className="font-medium mb-4" style={{ color: 'var(--text-primary)' }}>智能体使用排行</h3>
              <div className="space-y-3">
                {myAgents.filter(a => a.status === 'published').sort((a, b) => b.calls - a.calls).map((agent, i) => (
                  <div key={agent.id} className="flex items-center gap-3">
                    <span className="text-sm font-medium w-6" style={{ color: 'var(--text-secondary)' }}>#{i + 1}</span>
                    <span className="text-lg">{agent.icon}</span>
                    <span className="flex-1 text-sm" style={{ color: 'var(--text-primary)' }}>{agent.name}</span>
                    <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{agent.calls.toLocaleString()} 次</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
