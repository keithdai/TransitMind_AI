import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Plus, 
  Upload, 
  FileText, 
  Trash2, 
  Edit3, 
  Search,
  CheckCircle2,
  Clock,
  AlertCircle,
  Layers,
  Link2,
  Settings,
  X,
  File,
  FileImage,
  FileSpreadsheet,
  Loader2,
  Eye,
  Play,
  History,
  RotateCcw,
  Download,
  ChevronDown,
  ChevronUp
} from 'lucide-react'

interface KnowledgeBaseItem {
  id: string
  name: string
  description: string
  documentCount: number
  lastUpdated: string
  linkedAgents: string[]
  status: 'ready' | 'processing' | 'error'
}

interface Document {
  id: string
  name: string
  type: 'pdf' | 'word' | 'excel' | 'txt' | 'md'
  size: string
  status: 'done' | 'processing' | 'pending' | 'error'
  uploadTime: string
  versions?: { version: number; date: string; size: string }[]
  preview?: string
}

interface SearchResult {
  id: string
  documentName: string
  snippet: string
  relevance: number
}

const knowledgeBases: KnowledgeBaseItem[] = [
  {
    id: '1',
    name: '交通法规知识库',
    description: '包含交通法规、标准规范等文档',
    documentCount: 128,
    lastUpdated: '2024-01-15',
    linkedAgents: ['合规检查智能体', '审批助手智能体'],
    status: 'ready',
  },
  {
    id: '2',
    name: '历史案例知识库',
    description: '历史交通案例、处置方案等',
    documentCount: 256,
    lastUpdated: '2024-01-10',
    linkedAgents: ['交通分析智能体', '应急响应智能体'],
    status: 'ready',
  },
  {
    id: '3',
    name: '应急预案知识库',
    description: '各类应急预案和处置流程',
    documentCount: 45,
    lastUpdated: '2024-01-12',
    linkedAgents: ['应急响应智能体'],
    status: 'processing',
  },
]

const mockDocuments: Document[] = [
  { 
    id: '1', 
    name: '交通法规汇编.pdf', 
    type: 'pdf', 
    size: '12.5 MB', 
    status: 'done', 
    uploadTime: '2024-01-15',
    versions: [
      { version: 3, date: '2024-01-15', size: '12.5 MB' },
      { version: 2, date: '2024-01-10', size: '11.8 MB' },
      { version: 1, date: '2024-01-05', size: '10.2 MB' },
    ],
    preview: '第一章 总则\n\n第一条 为了维护道路交通秩序，预防和减少交通事故，保护人身安全，保护公民、法人和其他组织的财产安全及其他合法权益...'
  },
  { 
    id: '2', 
    name: '道路交通安全法.docx', 
    type: 'word', 
    size: '2.3 MB', 
    status: 'done', 
    uploadTime: '2024-01-15',
    versions: [
      { version: 2, date: '2024-01-15', size: '2.3 MB' },
      { version: 1, date: '2024-01-08', size: '2.1 MB' },
    ],
    preview: '中华人民共和国道路交通安全法\n\n（2003年10月28日第十届全国人民代表大会常务委员会第五次会议通过）...'
  },
  { 
    id: '3', 
    name: '公路工程技术标准.pdf', 
    type: 'pdf', 
    size: '8.7 MB', 
    status: 'processing', 
    uploadTime: '2024-01-15' 
  },
  { 
    id: '4', 
    name: '城市道路交通规划导则.pdf', 
    type: 'pdf', 
    size: '5.2 MB', 
    status: 'pending', 
    uploadTime: '2024-01-15' 
  },
  { 
    id: '5', 
    name: '交通流量统计.xlsx', 
    type: 'excel', 
    size: '1.8 MB', 
    status: 'done', 
    uploadTime: '2024-01-14',
    preview: '路段名称,早高峰流量,晚高峰流量,日均流量\nXX路,12500,15200,89000\nYY路,8900,10200,65000...'
  },
]

const mockSearchResults: SearchResult[] = [
  { id: '1', documentName: '交通法规汇编.pdf', snippet: '...机动车驾驶人应当遵守道路交通安全法律、法规的规定，按照操作规范安全驾驶、文明驾驶...', relevance: 95 },
  { id: '2', documentName: '道路交通安全法.docx', snippet: '...饮酒后驾驶机动车的，处暂扣六个月机动车驾驶证，并处一千元以上二千元以下罚款...', relevance: 88 },
  { id: '3', documentName: '公路工程技术标准.pdf', snippet: '...公路应根据交通量及其组成、地形条件等，合理确定公路等级和设计速度...', relevance: 72 },
]

const getFileIcon = (type: Document['type']) => {
  switch (type) {
    case 'pdf': return FileText
    case 'word': return FileText
    case 'excel': return FileSpreadsheet
    case 'txt': return File
    case 'md': return FileText
    default: return File
  }
}

const getStatusIcon = (status: Document['status']) => {
  switch (status) {
    case 'done': return <CheckCircle2 className="w-4 h-4 text-green-400" />
    case 'processing': return <Loader2 className="w-4 h-4 animate-spin" style={{ color: 'var(--accent-primary)' }} />
    case 'pending': return <Clock className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
    case 'error': return <AlertCircle className="w-4 h-4 text-red-400" />
  }
}

const getStatusText = (status: Document['status']) => {
  switch (status) {
    case 'done': return '已处理'
    case 'processing': return '处理中'
    case 'pending': return '等待中'
    case 'error': return '处理失败'
  }
}

export default function KnowledgeBase() {
  const [selectedKB, setSelectedKB] = useState<KnowledgeBaseItem | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [documents, setDocuments] = useState<Document[]>(mockDocuments)
  const [isDragging, setIsDragging] = useState(false)
  const [previewDocument, setPreviewDocument] = useState<Document | null>(null)
  const [showSearchTest, setShowSearchTest] = useState(false)
  const [testSearchQuery, setTestSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [showVersions, setShowVersions] = useState<string | null>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const files = Array.from(e.dataTransfer.files)
    const newDocs: Document[] = files.map((file, index) => ({
      id: `${Date.now()}-${index}`,
      name: file.name,
      type: file.name.endsWith('.pdf') ? 'pdf' : 
            file.name.endsWith('.docx') ? 'word' :
            file.name.endsWith('.xlsx') ? 'excel' : 'txt',
      size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
      status: 'pending' as const,
      uploadTime: new Date().toLocaleDateString('zh-CN'),
    }))
    setDocuments(prev => [...prev, ...newDocs])
  }

  const handleTestSearch = () => {
    if (!testSearchQuery.trim()) return
    setSearchResults(mockSearchResults)
  }

  const handlePreview = (doc: Document) => {
    if (doc.status === 'done' && doc.preview) {
      setPreviewDocument(doc)
    }
  }

  const handleRollback = (docId: string, version: number) => {
    console.log('Rollback document:', docId, 'to version:', version)
    setShowVersions(null)
  }

  return (
    <div className="h-full p-6 overflow-auto">
      <div className="max-w-7xl mx-auto space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="font-display text-3xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>知识库管理</h1>
            <p style={{ color: 'var(--text-secondary)' }}>配置知识库让智能体更懂您的业务</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowCreateModal(true)}
            className="cyber-button-primary flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>新建知识库</span>
          </motion.button>
        </motion.div>

        <div className="grid grid-cols-3 gap-4">
          {knowledgeBases.map((kb, index) => (
            <motion.div
              key={kb.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -5 }}
              onClick={() => setSelectedKB(kb)}
              className="glass-card p-5 cursor-pointer group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-xl" style={{ background: 'linear-gradient(135deg, rgba(0, 229, 255, 0.2), rgba(123, 97, 255, 0.2))' }}>
                  <Layers className="w-6 h-6" style={{ color: 'var(--accent-primary)' }} />
                </div>
                <div className="flex items-center gap-1">
                  {kb.status === 'ready' ? (
                    <CheckCircle2 className="w-4 h-4 text-green-400" />
                  ) : kb.status === 'processing' ? (
                    <Loader2 className="w-4 h-4 animate-spin" style={{ color: 'var(--accent-primary)' }} />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-red-400" />
                  )}
                </div>
              </div>

              <h3 className="font-display font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>{kb.name}</h3>
              <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>{kb.description}</p>

              <div className="flex items-center justify-between text-sm" style={{ color: 'var(--text-muted)' }}>
                <div className="flex items-center gap-1">
                  <FileText className="w-4 h-4" />
                  <span>{kb.documentCount} 个文档</span>
                </div>
                <span>{kb.lastUpdated}</span>
              </div>

              <div className="mt-4 pt-4" style={{ borderTop: '1px solid var(--border-color)' }}>
                <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-muted)' }}>
                  <Link2 className="w-3 h-3" />
                  <span>关联 {kb.linkedAgents.length} 个智能体</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <AnimatePresence>
          {selectedKB && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="glass-panel p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl" style={{ background: 'linear-gradient(135deg, rgba(0, 229, 255, 0.2), rgba(123, 97, 255, 0.2))' }}>
                    <Layers className="w-6 h-6" style={{ color: 'var(--accent-primary)' }} />
                  </div>
                  <div>
                    <h2 className="font-display text-xl font-bold" style={{ color: 'var(--text-primary)' }}>{selectedKB.name}</h2>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{selectedKB.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowSearchTest(true)}
                    className="cyber-button flex items-center gap-2"
                  >
                    <Play className="w-4 h-4" />
                    <span>检索测试</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowUploadModal(true)}
                    className="cyber-button flex items-center gap-2"
                  >
                    <Upload className="w-4 h-4" />
                    <span>上传文档</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="cyber-button flex items-center gap-2"
                  >
                    <Settings className="w-4 h-4" />
                    <span>配置检索</span>
                  </motion.button>
                </div>
              </div>

              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: 'var(--text-muted)' }} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="搜索文档..."
                    className="input-cyber pl-12"
                  />
                </div>
              </div>

              <div className="space-y-2">
                {documents.map((doc, index) => {
                  const FileIcon = getFileIcon(doc.type)
                  return (
                    <motion.div
                      key={doc.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="rounded-xl border transition-colors"
                      style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'var(--border-color)' }}
                    >
                      <div className="flex items-center justify-between p-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg" style={{ background: 'rgba(255,255,255,0.1)' }}>
                            <FileIcon className="w-5 h-5" style={{ color: 'var(--accent-primary)' }} />
                          </div>
                          <div>
                            <div className="font-medium" style={{ color: 'var(--text-primary)' }}>{doc.name}</div>
                            <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{doc.size} · {doc.uploadTime}</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(doc.status)}
                            <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{getStatusText(doc.status)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {doc.status === 'done' && doc.preview && (
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handlePreview(doc)}
                                className="p-2 rounded-lg transition-colors"
                                style={{ background: 'rgba(255,255,255,0.05)' }}
                                title="预览"
                              >
                                <Eye className="w-4 h-4" style={{ color: 'var(--accent-primary)' }} />
                              </motion.button>
                            )}
                            {doc.versions && doc.versions.length > 1 && (
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => setShowVersions(showVersions === doc.id ? null : doc.id)}
                                className="p-2 rounded-lg transition-colors"
                                style={{ background: 'rgba(255,255,255,0.05)' }}
                                title="版本历史"
                              >
                                <History className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                              </motion.button>
                            )}
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="p-2 rounded-lg transition-colors"
                              style={{ background: 'rgba(255,255,255,0.05)' }}
                            >
                              <Edit3 className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="p-2 rounded-lg transition-colors"
                              style={{ background: 'rgba(255,255,255,0.05)' }}
                            >
                              <Trash2 className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                            </motion.button>
                          </div>
                        </div>
                      </div>

                      <AnimatePresence>
                        {showVersions === doc.id && doc.versions && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="border-t px-4 py-3"
                            style={{ borderColor: 'var(--border-color)' }}
                          >
                            <div className="text-xs font-medium mb-2" style={{ color: 'var(--text-muted)' }}>版本历史</div>
                            <div className="space-y-2">
                              {doc.versions.map((v, vIndex) => (
                                <div key={v.version} className="flex items-center justify-between p-2 rounded-lg" style={{ background: 'rgba(255,255,255,0.03)' }}>
                                  <div className="flex items-center gap-3">
                                    <span className="text-xs font-mono px-2 py-0.5 rounded" style={{ background: 'rgba(0, 229, 255, 0.1)', color: 'var(--accent-primary)' }}>
                                      v{v.version}
                                    </span>
                                    <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{v.date}</span>
                                    <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{v.size}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    {vIndex > 0 && (
                                      <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => handleRollback(doc.id, v.version)}
                                        className="text-xs flex items-center gap-1 px-2 py-1 rounded"
                                        style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)' }}
                                      >
                                        <RotateCcw className="w-3 h-3" />
                                        回滚
                                      </motion.button>
                                    )}
                                    <motion.button
                                      whileHover={{ scale: 1.02 }}
                                      whileTap={{ scale: 0.98 }}
                                      className="text-xs flex items-center gap-1 px-2 py-1 rounded"
                                      style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)' }}
                                    >
                                      <Download className="w-3 h-3" />
                                      下载
                                    </motion.button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  )
                })}
              </div>

              <div className="mt-6 pt-6" style={{ borderTop: '1px solid var(--border-color)' }}>
                <h3 className="text-sm font-medium mb-3" style={{ color: 'var(--text-secondary)' }}>关联智能体</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedKB.linkedAgents.map((agent) => (
                    <div key={agent} className="flex items-center gap-2 px-3 py-1.5 rounded-full border" style={{ background: 'rgba(123, 97, 255, 0.1)', borderColor: 'rgba(123, 97, 255, 0.3)', color: 'var(--accent-secondary)' }}>
                      <Link2 className="w-3 h-3" />
                      <span className="text-sm">{agent}</span>
                    </div>
                  ))}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm transition-colors"
                    style={{ background: 'rgba(255,255,255,0.05)', borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}
                  >
                    <Plus className="w-3 h-3" />
                    <span>添加关联</span>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {showSearchTest && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-8"
            onClick={() => setShowSearchTest(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-panel p-8 max-w-2xl w-full"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-xl font-bold" style={{ color: 'var(--text-primary)' }}>检索测试</h2>
                <button
                  onClick={() => setShowSearchTest(false)}
                  className="p-2 rounded-lg transition-colors"
                  style={{ background: 'rgba(255,255,255,0.05)' }}
                >
                  <X className="w-5 h-5" style={{ color: 'var(--text-muted)' }} />
                </button>
              </div>

              <div className="flex items-center gap-3 mb-6">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: 'var(--text-muted)' }} />
                  <input
                    type="text"
                    value={testSearchQuery}
                    onChange={(e) => setTestSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleTestSearch()}
                    placeholder="输入测试查询..."
                    className="input-cyber pl-12"
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleTestSearch}
                  className="cyber-button-primary"
                >
                  测试
                </motion.button>
              </div>

              {searchResults.length > 0 ? (
                <div className="space-y-3">
                  <div className="text-sm mb-2" style={{ color: 'var(--text-muted)' }}>找到 {searchResults.length} 个相关结果</div>
                  {searchResults.map((result, index) => (
                    <motion.div
                      key={result.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-4 rounded-xl border"
                      style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'var(--border-color)' }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4" style={{ color: 'var(--accent-primary)' }} />
                          <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{result.documentName}</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs">
                          <span style={{ color: 'var(--text-muted)' }}>相关度:</span>
                          <span className="font-mono" style={{ color: 'var(--accent-primary)' }}>{result.relevance}%</span>
                        </div>
                      </div>
                      <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{result.snippet}</p>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8" style={{ color: 'var(--text-muted)' }}>
                  输入查询词并点击测试按钮
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {previewDocument && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-8"
            onClick={() => setPreviewDocument(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-panel p-8 max-w-3xl w-full max-h-[80vh] overflow-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5" style={{ color: 'var(--accent-primary)' }} />
                  <h2 className="font-display text-xl font-bold" style={{ color: 'var(--text-primary)' }}>{previewDocument.name}</h2>
                </div>
                <button
                  onClick={() => setPreviewDocument(null)}
                  className="p-2 rounded-lg transition-colors"
                  style={{ background: 'rgba(255,255,255,0.05)' }}
                >
                  <X className="w-5 h-5" style={{ color: 'var(--text-muted)' }} />
                </button>
              </div>

              <div className="p-4 rounded-xl font-mono text-sm whitespace-pre-wrap" style={{ background: 'rgba(255,255,255,0.03)', color: 'var(--text-secondary)' }}>
                {previewDocument.preview}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showUploadModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-8"
            onClick={() => setShowUploadModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-panel p-8 max-w-2xl w-full"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-xl font-bold" style={{ color: 'var(--text-primary)' }}>上传文档</h2>
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="p-2 rounded-lg transition-colors"
                  style={{ background: 'rgba(255,255,255,0.05)' }}
                >
                  <X className="w-5 h-5" style={{ color: 'var(--text-muted)' }} />
                </button>
              </div>

              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors ${
                  isDragging 
                    ? 'border-[var(--accent-primary)]' 
                    : ''
                }`}
                style={{ 
                  borderColor: isDragging ? 'var(--accent-primary)' : 'var(--border-color)',
                  background: isDragging ? 'rgba(0, 229, 255, 0.1)' : 'rgba(255,255,255,0.03)'
                }}
              >
                <Upload className="w-12 h-12 mx-auto mb-4" style={{ color: isDragging ? 'var(--accent-primary)' : 'var(--text-muted)' }} />
                <p className="text-lg mb-2" style={{ color: 'var(--text-primary)' }}>拖拽文件到此处，或点击上传</p>
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>支持 PDF、Word、Excel、TXT、Markdown</p>
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>单个文件最大 50MB</p>
              </div>

              <div className="mt-6">
                <h3 className="text-sm font-medium mb-3" style={{ color: 'var(--text-secondary)' }}>已上传文档</h3>
                <div className="space-y-2 max-h-48 overflow-auto">
                  {documents.filter(d => d.status !== 'done').map((doc) => {
                    const FileIcon = getFileIcon(doc.type)
                    return (
                      <div key={doc.id} className="flex items-center justify-between p-3 rounded-lg" style={{ background: 'rgba(255,255,255,0.05)' }}>
                        <div className="flex items-center gap-3">
                          <FileIcon className="w-4 h-4" style={{ color: 'var(--accent-primary)' }} />
                          <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{doc.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(doc.status)}
                          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{getStatusText(doc.status)}</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowUploadModal(false)}
                  className="cyber-button"
                >
                  取消
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="cyber-button-primary"
                >
                  完成上传
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-8"
            onClick={() => setShowCreateModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-panel p-8 max-w-lg w-full"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-xl font-bold" style={{ color: 'var(--text-primary)' }}>新建知识库</h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="p-2 rounded-lg transition-colors"
                  style={{ background: 'rgba(255,255,255,0.05)' }}
                >
                  <X className="w-5 h-5" style={{ color: 'var(--text-muted)' }} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>知识库名称</label>
                  <input
                    type="text"
                    placeholder="输入知识库名称"
                    className="input-cyber"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>描述</label>
                  <textarea
                    placeholder="输入知识库描述"
                    rows={3}
                    className="input-cyber resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>知识库类型</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['文档库', '数据库', '网页库'].map((type) => (
                      <motion.button
                        key={type}
                        whileHover={{ scale: 1.02 }}
                        className="p-3 rounded-lg border text-center text-sm transition-colors"
                        style={{ background: 'rgba(255,255,255,0.05)', borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}
                      >
                        {type}
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowCreateModal(false)}
                  className="cyber-button"
                >
                  取消
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="cyber-button-primary"
                >
                  创建知识库
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
