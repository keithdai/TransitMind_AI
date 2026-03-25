import { useState } from 'react'
import { 
  Database, 
  Plus, 
  Upload, 
  Search, 
  FileText,
  Tag,
  BookOpen,
  BarChart3,
  ExternalLink,
  Download,
  Eye,
  Trash2,
  Bot
} from 'lucide-react'

interface Dataset {
  id: string
  name: string
  description: string
  type: 'instruction' | 'annotation' | 'corpus' | 'evaluation' | 'external'
  typeName: string
  count: number
  createdAt: string
  updatedAt: string
  agents: number
  status: 'ready' | 'processing' | 'error'
}

const mockDatasets: Dataset[] = [
  {
    id: 'ds_1',
    name: '公文写作指令集',
    description: '包含请示、报告、会议纪要等各类公文写作指令，用于模型微调优化',
    type: 'instruction',
    typeName: '指令集',
    count: 2345,
    createdAt: '2026-03-10',
    updatedAt: '2026-03-14',
    agents: 5,
    status: 'ready'
  },
  {
    id: 'ds_2',
    name: '公文实体标注数据',
    description: '机构名称、人名、地名等实体标注数据，用于命名实体识别训练',
    type: 'annotation',
    typeName: '标注数据',
    count: 12678,
    createdAt: '2026-03-08',
    updatedAt: '2026-03-12',
    agents: 3,
    status: 'ready'
  },
  {
    id: 'ds_3',
    name: '历史优秀公文语料',
    description: '经过筛选的历史优秀公文，用于模型预训练和微调',
    type: 'corpus',
    typeName: '训练语料',
    count: 5432,
    createdAt: '2026-03-05',
    updatedAt: '2026-03-10',
    agents: 8,
    status: 'ready'
  },
  {
    id: 'ds_4',
    name: '政策问答指令集',
    description: '政策法规相关问答指令数据，用于问答模型优化',
    type: 'instruction',
    typeName: '指令集',
    count: 1876,
    createdAt: '2026-03-12',
    updatedAt: '2026-03-15',
    agents: 2,
    status: 'ready'
  },
  {
    id: 'ds_5',
    name: '质量评估数据集',
    description: '用于评估智能体输出质量的测试数据集',
    type: 'evaluation',
    typeName: '评估数据',
    count: 500,
    createdAt: '2026-03-01',
    updatedAt: '2026-03-08',
    agents: 0,
    status: 'ready'
  },
  {
    id: 'ds_6',
    name: '交通领域专业语料',
    description: '交通领域专业术语和文档语料',
    type: 'corpus',
    typeName: '训练语料',
    count: 8765,
    createdAt: '2026-03-03',
    updatedAt: '2026-03-11',
    agents: 4,
    status: 'processing'
  }
]

const typeColors: Record<string, string> = {
  instruction: '#f59e0b',
  annotation: '#22c55e',
  corpus: '#8b5cf6',
  evaluation: '#06b6d4',
  external: '#64748b'
}

const typeIcons: Record<string, typeof FileText> = {
  instruction: FileText,
  annotation: Tag,
  corpus: BookOpen,
  evaluation: BarChart3,
  external: ExternalLink
}

export default function DataCenter() {
  const [datasets] = useState<Dataset[]>(mockDatasets)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState<string>('all')
  const [selectedDataset, setSelectedDataset] = useState<Dataset | null>(null)

  const filteredDatasets = datasets.filter(ds => {
    const matchesSearch = ds.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          ds.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = selectedType === 'all' || ds.type === selectedType
    return matchesSearch && matchesType
  })

  const stats = {
    total: datasets.length,
    totalRecords: datasets.reduce((sum, ds) => sum + ds.count, 0),
    totalAgents: datasets.reduce((sum, ds) => sum + ds.agents, 0)
  }

  return (
    <div className="min-h-screen p-6 space-y-6" style={{ background: 'var(--bg-primary)' }}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>数据集中心</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>管理用于模型优化训练的数据集，包括指令集、标注数据、训练语料等</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="flex items-center gap-2 px-4 py-2 rounded-lg border transition-all"
            style={{ 
              borderColor: 'var(--border-color)',
              color: 'var(--text-primary)'
            }}
          >
            <Upload className="w-4 h-4" />
            导入数据
          </button>
          <button
            className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all"
            style={{ 
              background: 'var(--accent-primary)',
              color: 'white'
            }}
          >
            <Plus className="w-4 h-4" />
            创建数据集
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div 
          className="p-4 rounded-xl border transition-all hover:scale-105"
          style={{ 
            background: 'var(--bg-secondary)',
            borderColor: 'var(--border-color)'
          }}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg" style={{ background: 'var(--accent-primary)20' }}>
              <Database className="w-5 h-5" style={{ color: 'var(--accent-primary)' }} />
            </div>
            <div>
              <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{stats.total}</p>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>数据集总数</p>
            </div>
          </div>
        </div>

        <div 
          className="p-4 rounded-xl border transition-all hover:scale-105"
          style={{ 
            background: 'var(--bg-secondary)',
            borderColor: 'var(--border-color)'
          }}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg" style={{ background: '#22c55e20' }}>
              <FileText className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{stats.totalRecords.toLocaleString()}</p>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>总数据条数</p>
            </div>
          </div>
        </div>

        <div 
          className="p-4 rounded-xl border transition-all hover:scale-105"
          style={{ 
            background: 'var(--bg-secondary)',
            borderColor: 'var(--border-color)'
          }}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg" style={{ background: '#8b5cf620' }}>
              <Bot className="w-5 h-5 text-violet-500" />
            </div>
            <div>
              <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{stats.totalAgents}</p>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>关联智能体</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-secondary)' }} />
          <input
            type="text"
            placeholder="搜索数据集..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border"
            style={{ 
              background: 'var(--bg-secondary)',
              borderColor: 'var(--border-color)',
              color: 'var(--text-primary)'
            }}
          />
        </div>
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="px-4 py-2 rounded-lg border"
          style={{ 
            background: 'var(--bg-secondary)',
            borderColor: 'var(--border-color)',
            color: 'var(--text-primary)'
          }}
        >
          <option value="all">全部类型</option>
          <option value="instruction">指令集</option>
          <option value="annotation">标注数据</option>
          <option value="corpus">训练语料</option>
          <option value="evaluation">评估数据</option>
          <option value="external">外部数据源</option>
        </select>
      </div>

      <div className="grid gap-4">
        {filteredDatasets.map(dataset => {
          const TypeIcon = typeIcons[dataset.type]
          const typeColor = typeColors[dataset.type]
          return (
            <div
              key={dataset.id}
              className="p-4 rounded-xl border transition-all cursor-pointer hover:border-opacity-50"
              style={{ 
                background: 'var(--bg-secondary)',
                borderColor: selectedDataset?.id === dataset.id ? typeColor : 'var(--border-color)'
              }}
              onClick={() => setSelectedDataset(selectedDataset?.id === dataset.id ? null : dataset)}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-lg" style={{ background: `${typeColor}20` }}>
                    <TypeIcon className="w-5 h-5" style={{ color: typeColor }} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium" style={{ color: 'var(--text-primary)' }}>{dataset.name}</h3>
                      <span 
                        className="text-xs px-2 py-0.5 rounded"
                        style={{ background: `${typeColor}20`, color: typeColor }}
                      >
                        {dataset.typeName}
                      </span>
                      {dataset.status === 'processing' && (
                        <span className="text-xs px-2 py-0.5 rounded bg-yellow-500/20 text-yellow-400">
                          处理中
                        </span>
                      )}
                    </div>
                    <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>{dataset.description}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
                      <span>{dataset.count.toLocaleString()} 条数据</span>
                      <span>创建于 {dataset.createdAt}</span>
                      <span>更新于 {dataset.updatedAt}</span>
                      {dataset.agents > 0 && (
                        <span className="flex items-center gap-1">
                          <Bot className="w-3 h-3" />
                          {dataset.agents} 个智能体使用
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    className="p-2 rounded-lg border transition-all hover:border-opacity-50"
                    style={{ borderColor: 'var(--border-color)' }}
                    onClick={(e) => { e.stopPropagation(); }}
                  >
                    <Eye className="w-4 h-4" style={{ color: 'var(--text-secondary)' }} />
                  </button>
                  <button 
                    className="p-2 rounded-lg border transition-all hover:border-opacity-50"
                    style={{ borderColor: 'var(--border-color)' }}
                    onClick={(e) => { e.stopPropagation(); }}
                  >
                    <Download className="w-4 h-4" style={{ color: 'var(--text-secondary)' }} />
                  </button>
                </div>
              </div>

              {selectedDataset?.id === dataset.id && (
                <div className="mt-4 pt-4 border-t" style={{ borderColor: 'var(--border-color)' }}>
                  <h4 className="text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>数据预览</h4>
                  <div 
                    className="p-3 rounded-lg text-sm font-mono overflow-x-auto"
                    style={{ background: 'var(--bg-primary)', color: 'var(--text-secondary)' }}
                  >
                    <pre>{`[
  {
    "instruction": "请根据以下会议内容生成会议纪要",
    "input": "会议时间：2026年3月5日...",
    "output": "会议纪要\\n会议时间：..."
  },
  {
    "instruction": "请根据以下事项起草请示公文",
    "input": "事项：申请购买办公设备...",
    "output": "关于申请购买办公设备的请示..."
  }
]`}</pre>
                  </div>
                  <div className="flex items-center gap-2 mt-3">
                    <button
                      className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm border transition-all"
                      style={{ borderColor: 'var(--accent-primary)', color: 'var(--accent-primary)' }}
                    >
                      <Bot className="w-4 h-4" />
                      绑定到智能体
                    </button>
                    <button
                      className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm border transition-all"
                      style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}
                    >
                      <Trash2 className="w-4 h-4" />
                      删除
                    </button>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {filteredDatasets.length === 0 && (
        <div 
          className="p-8 rounded-xl border border-dashed text-center"
          style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}
        >
          <Database className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p className="text-lg font-medium">暂无数据集</p>
          <p className="text-sm mt-1">点击"创建数据集"或"导入数据"开始</p>
        </div>
      )}

      <div 
        className="p-8 rounded-xl border border-dashed text-center cursor-pointer transition-all hover:border-opacity-50"
        style={{ 
          borderColor: 'var(--border-color)',
          color: 'var(--text-secondary)'
        }}
      >
        <Plus className="w-8 h-8 mx-auto mb-2 opacity-50" />
        <p>创建新的数据集</p>
      </div>
    </div>
  )
}
