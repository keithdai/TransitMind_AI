import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Bot,
  Plus,
  Code2,
  Search,
  Trash2,
  Play,
  Save,
  Send,
  Check,
  Sparkles,
  FileText,
  BarChart3,
  Database,
  MessageSquare,
  Wand2,
  List,
  Loader2,
  X
} from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'

interface Skill {
  id: string
  name: string
  icon: string
  description: string
  category: string
  prompt: string
  inputParams: InputParam[]
  outputFormat: string
  tools: string[]
  status: 'draft' | 'published'
  createdAt: string
  updatedAt: string
}

interface InputParam {
  name: string
  type: 'string' | 'number' | 'boolean' | 'object'
  required: boolean
  defaultValue?: string
  description: string
}

interface SkillTemplate {
  id: string
  name: string
  icon: string
  description: string
  category: string
  prompt: string
  inputParams: InputParam[]
  outputFormat: string
  tools: string[]
  usageCount: number
}

const skillTemplates: SkillTemplate[] = [
  {
    id: 'tpl_text_summary',
    name: '文本摘要',
    icon: '📝',
    description: '自动提取文本核心要点，生成简洁摘要',
    category: 'text',
    prompt: '你是一个专业的文本摘要助手。请仔细阅读以下文本，提取核心要点，生成一段简洁准确的摘要。\n\n原文：{input}\n\n要求：\n1. 保留关键信息\n2. 控制在100字以内\n3. 语言精炼准确',
    inputParams: [
      { name: 'input', type: 'string', required: true, description: '待摘要的文本内容' },
      { name: 'maxLength', type: 'number', required: false, defaultValue: '100', description: '最大摘要长度' }
    ],
    outputFormat: '{"summary": "摘要内容", "keywords": ["关键词1", "关键词2"]}',
    tools: [],
    usageCount: 2341
  },
  {
    id: 'tpl_data_analysis',
    name: '数据分析',
    icon: '📊',
    description: '对数据进行统计分析，生成图表建议',
    category: 'data',
    prompt: '你是一个数据分析专家。请分析以下数据，提供洞察和建议。\n\n数据：{input}\n\n请提供：\n1. 基本统计描述\n2. 异常值检测\n3. 趋势分析\n4. 可视化建议',
    inputParams: [
      { name: 'input', type: 'string', required: true, description: '数据内容（CSV或表格格式）' },
      { name: 'analysisType', type: 'string', required: false, defaultValue: 'full', description: '分析类型：full/basic/trend' }
    ],
    outputFormat: '{"statistics": {}, "anomalies": [], "trends": "", "chartSuggestions": []}',
    tools: ['数据查询'],
    usageCount: 1856
  },
  {
    id: 'tpl_knowledge_retrieval',
    name: '知识检索',
    icon: '🔍',
    description: '在知识库中检索相关内容并整理',
    category: 'search',
    prompt: '你是一个知识库检索助手。请根据用户 query 在知识库中检索相关内容，并整理答案。\n\n查询：{input}\n\n请：\n1. 检索相关文档\n2. 提取相关信息\n3. 整理成完整答案\n4. 标注来源',
    inputParams: [
      { name: 'input', type: 'string', required: true, description: '检索查询' },
      { name: 'topK', type: 'number', required: false, defaultValue: '5', description: '返回结果数量' }
    ],
    outputFormat: '{"answer": "", "sources": [{"title": "", "content": "", "score": 0.9}]}',
    tools: ['知识库查询', '向量搜索'],
    usageCount: 3421
  },
  {
    id: 'tpl_doc_parse',
    name: '文档解析',
    icon: '📄',
    description: '解析文档结构，提取关键信息',
    category: 'document',
    prompt: '你是一个文档处理专家。请解析以下文档，提取关键信息。\n\n文档：{input}\n\n请提取：\n1. 文档标题和作者\n2. 关键段落\n3. 重要数据\n4. 文档摘要',
    inputParams: [
      { name: 'input', type: 'string', required: true, description: '文档内容' },
      { name: 'extractType', type: 'string', required: false, defaultValue: 'full', description: '提取类型：full/keys/structure' }
    ],
    outputFormat: '{"title": "", "author": "", "keySections": [], "importantData": {}, "summary": ""}',
    tools: ['文档解析'],
    usageCount: 1234
  },
  {
    id: 'tpl_qa',
    name: '智能问答',
    icon: '💬',
    description: '基于上下文进行智能问答',
    category: 'conversation',
    prompt: '你是一个智能问答助手。请根据提供的上下文回答用户问题。\n\n上下文：{context}\n\n问题：{input}\n\n要求：\n1. 基于上下文准确回答\n2. 如上下文不足，说明无法回答\n3. 回答简洁清晰',
    inputParams: [
      { name: 'input', type: 'string', required: true, description: '用户问题' },
      { name: 'context', type: 'string', required: true, description: '上下文内容' }
    ],
    outputFormat: '{"answer": "", "confidence": 0.95, "source": ""}',
    tools: [],
    usageCount: 4567
  }
]

const categories = [
  { id: 'text', label: '文本处理', icon: FileText },
  { id: 'data', label: '数据分析', icon: BarChart3 },
  { id: 'search', label: '检索增强', icon: Search },
  { id: 'document', label: '文档处理', icon: Database },
  { id: 'conversation', label: '对话', icon: MessageSquare }
]

const defaultSkill: Skill = {
  id: '',
  name: '新建技能',
  icon: '⚡',
  description: '',
  category: 'text',
  prompt: '',
  inputParams: [],
  outputFormat: '{"result": ""}',
  tools: [],
  status: 'draft',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
}

export default function SkillStudio() {
  const { theme } = useTheme()
  const isEnterprise = theme === 'enterprise'

  const [skills, setSkills] = useState<Skill[]>(() => {
    const saved = localStorage.getItem('mySkills')
    return saved ? JSON.parse(saved) : []
  })
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null)
  const [activeTab, setActiveTab] = useState<'basic' | 'input' | 'output' | 'prompt' | 'tools'>('basic')
  const [showTemplates, setShowTemplates] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [testInput, setTestInput] = useState('')
  const [testOutput, setTestOutput] = useState('')
  const [isTesting, setIsTesting] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)

  useEffect(() => {
    localStorage.setItem('mySkills', JSON.stringify(skills))
  }, [skills])

  const getCardStyle = () => {
    if (!isEnterprise) return {}
    return {
      background: 'var(--bg-card)',
      borderRadius: 'var(--radius-md)',
      boxShadow: 'var(--shadow-card)',
      border: '1px solid var(--border-color)'
    }
  }

  const getTextStyle = (type: 'primary' | 'secondary' | 'muted' = 'primary') => {
    if (!isEnterprise) return {}
    const colors = {
      primary: 'var(--text-primary)',
      secondary: 'var(--text-secondary)',
      muted: 'var(--text-muted)'
    }
    return { color: colors[type] }
  }

  const handleCreateSkill = () => {
    const newSkill: Skill = {
      ...defaultSkill,
      id: `skill_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    setSkills(prev => [...prev, newSkill])
    setSelectedSkill(newSkill)
    setHasChanges(false)
  }

  const handleSelectSkill = (skill: Skill) => {
    if (hasChanges && selectedSkill) {
      handleSaveSkill()
    }
    setSelectedSkill(skill)
    setTestOutput('')
    setHasChanges(false)
  }

  const handleSaveSkill = () => {
    if (!selectedSkill) return
    const updated: Skill = {
      ...selectedSkill,
      updatedAt: new Date().toISOString()
    }
    setSkills(prev => prev.map(s => s.id === selectedSkill.id ? updated : s))
    setSelectedSkill(updated)
    setHasChanges(false)
  }

  const handleDeleteSkill = (skillId: string) => {
    setSkills(prev => prev.filter(s => s.id !== skillId))
    if (selectedSkill?.id === skillId) {
      setSelectedSkill(null)
    }
  }

  const handleUseTemplate = (template: SkillTemplate) => {
    const newSkill: Skill = {
      id: `skill_${Date.now()}`,
      name: template.name,
      icon: template.icon,
      description: template.description,
      category: template.category,
      prompt: template.prompt,
      inputParams: [...template.inputParams],
      outputFormat: template.outputFormat,
      tools: [...template.tools],
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    setSkills(prev => [...prev, newSkill])
    setSelectedSkill(newSkill)
    setShowTemplates(false)
    setHasChanges(false)
  }

  const handleTest = () => {
    if (!testInput.trim() || !selectedSkill) return
    setIsTesting(true)
    setTestOutput('')

    setTimeout(() => {
      const mockResponse = {
        skill: selectedSkill.name,
        input: testInput,
        output: `根据您输入的内容，我已分析处理完成。\n\n[模拟输出]\n这里是 SKILL "${selectedSkill.name}" 的模拟返回结果。\n\n实际使用时，这里会根据您配置的 Prompt 和参数，调用后端服务生成真实响应。`,
        metadata: {
          tokens: Math.floor(Math.random() * 500) + 100,
          latency: Math.floor(Math.random() * 500) + 50,
          model: 'gpt-4'
        }
      }
      setTestOutput(JSON.stringify(mockResponse, null, 2))
      setIsTesting(false)
    }, 1500)
  }

  const updateSkillField = (field: keyof Skill, value: unknown) => {
    if (!selectedSkill) return
    const updated = { ...selectedSkill, [field]: value }
    setSelectedSkill(updated)
    setHasChanges(true)
  }

  const addInputParam = () => {
    if (!selectedSkill) return
    const newParam: InputParam = {
      name: '',
      type: 'string',
      required: false,
      description: ''
    }
    updateSkillField('inputParams', [...selectedSkill.inputParams, newParam])
  }

  const updateInputParam = (index: number, field: keyof InputParam, value: unknown) => {
    if (!selectedSkill) return
    const newParams = [...selectedSkill.inputParams]
    newParams[index] = { ...newParams[index], [field]: value }
    updateSkillField('inputParams', newParams)
  }

  const removeInputParam = (index: number) => {
    if (!selectedSkill) return
    const newParams = selectedSkill.inputParams.filter((_, i) => i !== index)
    updateSkillField('inputParams', newParams)
  }

  const filteredSkills = skills.filter(skill =>
    skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    skill.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="h-full flex" style={{ background: 'var(--bg-primary)' }}>
      <aside className="w-64 border-r flex flex-col" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
        <div className="p-4 border-b" style={{ borderColor: 'var(--border-color)' }}>
          <h2 className="font-semibold text-lg mb-3" style={getTextStyle('primary')}>我的技能</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={getTextStyle('muted')} />
            <input
              type="text"
              placeholder="搜索技能..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-lg text-sm"
              style={{ ...getCardStyle(), ...getTextStyle('primary') }}
            />
          </div>
        </div>

        <div className="flex-1 overflow-auto p-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleCreateSkill}
            className="w-full flex items-center gap-2 p-3 rounded-lg mb-3 font-medium transition-colors"
            style={{ background: 'var(--accent-primary)', color: 'white' }}
          >
            <Plus className="w-4 h-4" />
            新建技能
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowTemplates(true)}
            className="w-full flex items-center gap-2 p-3 rounded-lg mb-4 border transition-colors"
            style={{ borderColor: 'var(--border-color)', ...getTextStyle('secondary') }}
          >
            <Sparkles className="w-4 h-4" />
            模板市场
          </motion.button>

          <div className="space-y-2">
            {filteredSkills.map(skill => (
              <motion.div
                key={skill.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                onClick={() => handleSelectSkill(skill)}
                className={`p-3 rounded-lg cursor-pointer transition-all ${
                  selectedSkill?.id === skill.id ? 'ring-2' : ''
                }`}
                style={{
                  ...getCardStyle(),
                  ...(selectedSkill?.id === skill.id ? { ringColor: 'var(--accent-primary)' } : {}),
                  ...(selectedSkill?.id === skill.id ? { background: 'var(--color-primary-lighter)' } : {})
                }}
              >
                <div className="flex items-center gap-2">
                  <span className="text-xl">{skill.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate" style={getTextStyle('primary')}>{skill.name}</div>
                    <div className="text-xs truncate" style={getTextStyle('muted')}>{skill.description || '暂无描述'}</div>
                  </div>
                  <span
                    className="text-xs px-2 py-0.5 rounded"
                    style={{
                      background: skill.status === 'published' ? '#E8FFEA' : '#F7F9FC',
                      color: skill.status === 'published' ? '#00B578' : 'var(--text-muted)'
                    }}
                  >
                    {skill.status === 'published' ? '已发布' : '草稿'}
                  </span>
                </div>
              </motion.div>
            ))}

            {filteredSkills.length === 0 && (
              <div className="text-center py-8" style={getTextStyle('muted')}>
                <Bot className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm">暂无技能</p>
                <p className="text-xs mt-1">点击上方按钮创建或从模板市场选择</p>
              </div>
            )}
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden">
        {selectedSkill ? (
          <>
            <header className="p-4 border-b flex items-center justify-between" style={{ borderColor: 'var(--border-color)', background: 'var(--bg-card)' }}>
              <div className="flex items-center gap-3">
                <span className="text-2xl">{selectedSkill.icon}</span>
                <div>
                  <h1 className="font-semibold" style={getTextStyle('primary')}>{selectedSkill.name}</h1>
                  <p className="text-xs" style={getTextStyle('muted')}>
                    {categories.find(c => c.id === selectedSkill.category)?.label || '未分类'}
                    {hasChanges && <span className="ml-2 text-amber-500">· 未保存</span>}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSaveSkill}
                  disabled={!hasChanges}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
                  style={{ background: 'var(--color-primary)', color: 'white' }}
                >
                  <Save className="w-4 h-4" />
                  保存
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    const newStatus: 'draft' | 'published' = selectedSkill.status === 'published' ? 'draft' : 'published'
                    const updated: Skill = { ...selectedSkill, status: newStatus }
                    setSelectedSkill(updated)
                    setSkills(prev => prev.map(s => s.id === updated.id ? updated : s))
                  }}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium border transition-colors"
                  style={{
                    borderColor: selectedSkill.status === 'published' ? 'var(--text-muted)' : 'var(--color-success)',
                    color: selectedSkill.status === 'published' ? 'var(--text-muted)' : 'var(--color-success)'
                  }}
                >
                  {selectedSkill.status === 'published' ? (
                    <>
                      <X className="w-4 h-4" />
                      取消发布
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      发布
                    </>
                  )}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleDeleteSkill(selectedSkill.id)}
                  className="p-2 rounded-lg border transition-colors"
                  style={{ borderColor: 'var(--color-error)', color: 'var(--color-error)' }}
                >
                  <Trash2 className="w-4 h-4" />
                </motion.button>
              </div>
            </header>

            <div className="flex gap-2 px-4 pt-4 border-b" style={{ borderColor: 'var(--border-color)' }}>
              {[
                { id: 'basic', label: '基本信息' },
                { id: 'input', label: '输入定义' },
                { id: 'output', label: '输出定义' },
                { id: 'prompt', label: 'Prompt' },
                { id: 'tools', label: '工具配置' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className="px-4 py-2 text-sm font-medium border-b-2 transition-colors"
                  style={{
                    borderColor: activeTab === tab.id ? 'var(--accent-primary)' : 'transparent',
                    color: activeTab === tab.id ? 'var(--accent-primary)' : 'var(--text-secondary)'
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-auto p-6">
              {activeTab === 'basic' && (
                <div className="max-w-2xl space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2" style={getTextStyle('primary')}>技能名称</label>
                    <input
                      type="text"
                      value={selectedSkill.name}
                      onChange={(e) => updateSkillField('name', e.target.value)}
                      className="w-full px-4 py-2 rounded-lg"
                      style={{ ...getCardStyle(), ...getTextStyle('primary') }}
                      placeholder="输入技能名称"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2" style={getTextStyle('primary')}>图标</label>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl" style={getCardStyle()}>
                        {selectedSkill.icon}
                      </div>
                      <input
                        type="text"
                        value={selectedSkill.icon}
                        onChange={(e) => updateSkillField('icon', e.target.value)}
                        className="w-24 px-3 py-2 rounded-lg text-center text-xl"
                        style={{ ...getCardStyle(), ...getTextStyle('primary') }}
                        maxLength={2}
                      />
                      <span className="text-sm" style={getTextStyle('muted')}>选择一个emoji作为图标</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2" style={getTextStyle('primary')}>描述</label>
                    <textarea
                      value={selectedSkill.description}
                      onChange={(e) => updateSkillField('description', e.target.value)}
                      rows={3}
                      className="w-full px-4 py-2 rounded-lg resize-none"
                      style={{ ...getCardStyle(), ...getTextStyle('primary') }}
                      placeholder="简要描述这个技能的功能"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2" style={getTextStyle('primary')}>分类</label>
                    <div className="flex flex-wrap gap-2">
                      {categories.map(cat => (
                        <button
                          key={cat.id}
                          onClick={() => updateSkillField('category', cat.id)}
                          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors"
                          style={{
                            ...getCardStyle(),
                            ...(selectedSkill.category === cat.id ? {
                              background: 'var(--color-primary-lighter)',
                              borderColor: 'var(--accent-primary)'
                            } : {})
                          }}
                        >
                          <cat.icon className="w-4 h-4" style={selectedSkill.category === cat.id ? { color: 'var(--accent-primary)' } : getTextStyle('muted')} />
                          <span style={selectedSkill.category === cat.id ? { color: 'var(--accent-primary)' } : getTextStyle('secondary')}>
                            {cat.label}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'input' && (
                <div className="max-w-2xl space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium" style={getTextStyle('primary')}>输入参数</h3>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={addInputParam}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm"
                      style={{ background: 'var(--accent-primary)', color: 'white' }}
                    >
                      <Plus className="w-4 h-4" />
                      添加参数
                    </motion.button>
                  </div>

                  {selectedSkill.inputParams.length === 0 ? (
                    <div className="text-center py-8 rounded-lg border-2 border-dashed" style={{ borderColor: 'var(--border-color)' }}>
                      <List className="w-12 h-12 mx-auto mb-2 opacity-50" style={getTextStyle('muted')} />
                      <p style={getTextStyle('muted')}>暂无输入参数</p>
                      <p className="text-xs mt-1" style={getTextStyle('muted')}>点击上方按钮添加参数</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {selectedSkill.inputParams.map((param, index) => (
                        <motion.div
                          key={index}
                          layout
                          className="p-4 rounded-lg"
                          style={getCardStyle()}
                        >
                          <div className="grid grid-cols-4 gap-3 mb-3">
                            <div>
                              <label className="block text-xs mb-1" style={getTextStyle('muted')}>参数名</label>
                              <input
                                type="text"
                                value={param.name}
                                onChange={(e) => updateInputParam(index, 'name', e.target.value)}
                                className="w-full px-3 py-1.5 rounded text-sm"
                                style={{ ...getCardStyle(), ...getTextStyle('primary') }}
                                placeholder="paramName"
                              />
                            </div>
                            <div>
                              <label className="block text-xs mb-1" style={getTextStyle('muted')}>类型</label>
                              <select
                                value={param.type}
                                onChange={(e) => updateInputParam(index, 'type', e.target.value)}
                                className="w-full px-3 py-1.5 rounded text-sm"
                                style={{ ...getCardStyle(), ...getTextStyle('primary') }}
                              >
                                <option value="string">字符串</option>
                                <option value="number">数字</option>
                                <option value="boolean">布尔值</option>
                                <option value="object">对象</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-xs mb-1" style={getTextStyle('muted')}>默认值</label>
                              <input
                                type="text"
                                value={param.defaultValue || ''}
                                onChange={(e) => updateInputParam(index, 'defaultValue', e.target.value)}
                                className="w-full px-3 py-1.5 rounded text-sm"
                                style={{ ...getCardStyle(), ...getTextStyle('primary') }}
                                placeholder="可选"
                              />
                            </div>
                            <div className="flex items-end">
                              <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={param.required}
                                  onChange={(e) => updateInputParam(index, 'required', e.target.checked)}
                                  className="w-4 h-4 rounded"
                                />
                                <span className="text-sm" style={getTextStyle('secondary')}>必填</span>
                              </label>
                            </div>
                          </div>
                          <div>
                            <label className="block text-xs mb-1" style={getTextStyle('muted')}>描述</label>
                            <input
                              type="text"
                              value={param.description}
                              onChange={(e) => updateInputParam(index, 'description', e.target.value)}
                              className="w-full px-3 py-1.5 rounded text-sm"
                              style={{ ...getCardStyle(), ...getTextStyle('primary') }}
                              placeholder="参数说明"
                            />
                          </div>
                          <button
                            onClick={() => removeInputParam(index)}
                            className="mt-2 text-xs"
                            style={{ color: 'var(--color-error)' }}
                          >
                            删除此参数
                          </button>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'output' && (
                <div className="max-w-2xl space-y-4">
                  <div>
                    <h3 className="font-medium mb-2" style={getTextStyle('primary')}>输出格式定义</h3>
                    <p className="text-sm mb-4" style={getTextStyle('muted')}>定义技能返回的数据结构（JSON格式）</p>
                    <textarea
                      value={selectedSkill.outputFormat}
                      onChange={(e) => updateSkillField('outputFormat', e.target.value)}
                      rows={8}
                      className="w-full px-4 py-3 rounded-lg font-mono text-sm resize-none"
                      style={{ ...getCardStyle(), ...getTextStyle('primary') }}
                      placeholder='{"result": "", "status": "success"}'
                    />
                  </div>
                </div>
              )}

              {activeTab === 'prompt' && (
                <div className="max-w-2xl space-y-4">
                  <div>
                    <h3 className="font-medium mb-2" style={getTextStyle('primary')}>Prompt 模板</h3>
                    <p className="text-sm mb-4" style={getTextStyle('muted')}>
                      使用 {'{input}'} {'{context}'} 等占位符表示输入变量
                    </p>
                    <textarea
                      value={selectedSkill.prompt}
                      onChange={(e) => updateSkillField('prompt', e.target.value)}
                      rows={12}
                      className="w-full px-4 py-3 rounded-lg font-mono text-sm resize-none"
                      style={{ ...getCardStyle(), ...getTextStyle('primary') }}
                      placeholder={`你是一个专业的助手。请根据用户输入处理任务。\n\n用户输入：{input}\n\n请提供：...`}
                    />
                  </div>

                  <div className="p-4 rounded-lg border" style={{ borderColor: 'var(--border-color)', background: 'var(--color-primary-lighter)' }}>
                    <h4 className="font-medium mb-2 flex items-center gap-2" style={{ color: 'var(--accent-primary)' }}>
                      <Wand2 className="w-4 h-4" />
                      Prompt 编写技巧
                    </h4>
                    <ul className="text-sm space-y-1" style={{ color: 'var(--text-secondary)' }}>
                      <li>• 清晰定义角色：如"你是一个政务公文写作助手"</li>
                      <li>• 明确任务目标：说明需要完成什么</li>
                      <li>• 提供约束条件：格式、长度、风格等</li>
                      <li>• 使用变量占位符：{'{input}'} {'{context}'} 等</li>
                    </ul>
                  </div>
                </div>
              )}

              {activeTab === 'tools' && (
                <div className="max-w-2xl space-y-4">
                  <div>
                    <h3 className="font-medium mb-2" style={getTextStyle('primary')}>关联工具</h3>
                    <p className="text-sm mb-4" style={getTextStyle('muted')}>选择该技能可以调用的外部工具</p>
                    <div className="grid grid-cols-2 gap-3">
                      {['数据查询', 'API调用', '流程执行', '知识库查询', '向量搜索', '文档解析', '日历管理', '邮件发送'].map(tool => (
                        <label
                          key={tool}
                          className="flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors"
                          style={{
                            ...getCardStyle(),
                            ...(selectedSkill.tools.includes(tool) ? { background: 'var(--color-primary-lighter)' } : {})
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={selectedSkill.tools.includes(tool)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                updateSkillField('tools', [...selectedSkill.tools, tool])
                              } else {
                                updateSkillField('tools', selectedSkill.tools.filter(t => t !== tool))
                              }
                            }}
                            className="w-4 h-4 rounded"
                          />
                          <span style={selectedSkill.tools.includes(tool) ? { color: 'var(--accent-primary)' } : getTextStyle('secondary')}>
                            {tool}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <Code2 className="w-16 h-16 mx-auto mb-4 opacity-50" style={getTextStyle('muted')} />
              <h2 className="text-xl font-medium mb-2" style={getTextStyle('primary')}>SKILL 工作台</h2>
              <p className="mb-4" style={getTextStyle('muted')}>选择或创建一个技能开始编辑</p>
              <div className="flex items-center gap-3 justify-center">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCreateSkill}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium"
                  style={{ background: 'var(--accent-primary)', color: 'white' }}
                >
                  <Plus className="w-4 h-4" />
                  新建技能
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowTemplates(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium border"
                  style={{ borderColor: 'var(--border-color)', ...getTextStyle('secondary') }}
                >
                  <Sparkles className="w-4 h-4" />
                  从模板创建
                </motion.button>
              </div>
            </div>
          </div>
        )}
      </main>

      {selectedSkill && (
        <aside className="w-80 border-l flex flex-col" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
          <div className="p-4 border-b" style={{ borderColor: 'var(--border-color)' }}>
            <h2 className="font-semibold flex items-center gap-2" style={getTextStyle('primary')}>
              <Play className="w-4 h-4" />
              测试控制台
            </h2>
          </div>

          <div className="flex-1 overflow-auto p-4">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2" style={getTextStyle('primary')}>测试输入</label>
                <textarea
                  value={testInput}
                  onChange={(e) => setTestInput(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 rounded-lg text-sm resize-none"
                  style={{ ...getCardStyle(), ...getTextStyle('primary') }}
                  placeholder="输入测试内容..."
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleTest}
                disabled={!testInput.trim() || isTesting}
                className="w-full flex items-center justify-center gap-2 py-2 rounded-lg font-medium disabled:opacity-50"
                style={{ background: 'var(--accent-primary)', color: 'white' }}
              >
                {isTesting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    分析中...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    执行测试
                  </>
                )}
              </motion.button>

              {testOutput && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <label className="block text-sm font-medium mb-2" style={getTextStyle('primary')}>输出结果</label>
                  <div className="p-3 rounded-lg font-mono text-xs overflow-auto" style={{ ...getCardStyle(), maxHeight: '300px', ...getTextStyle('primary') }}>
                    <pre>{testOutput}</pre>
                  </div>
                </motion.div>
              )}

              <div className="p-3 rounded-lg text-xs" style={{ background: 'var(--bg-primary)' }}>
                <div className="flex items-center justify-between mb-2" style={getTextStyle('secondary')}>
                  <span>参数信息</span>
                </div>
                <div className="space-y-1">
                  {selectedSkill.inputParams.length > 0 ? (
                    selectedSkill.inputParams.map((param, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <code className="px-1 rounded text-xs" style={{ background: 'var(--color-primary-lighter)', color: 'var(--accent-primary)' }}>
                          {'{' + param.name + '}'}
                        </code>
                        <span style={getTextStyle('muted')}>{param.description}</span>
                      </div>
                    ))
                  ) : (
                    <span style={getTextStyle('muted')}>暂无输入参数</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </aside>
      )}

      <AnimatePresence>
        {showTemplates && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-8"
            style={{ background: 'rgba(0, 0, 0, 0.45)' }}
            onClick={() => setShowTemplates(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-4xl max-h-[80vh] overflow-auto rounded-lg p-6"
              style={{ background: 'var(--bg-card)', boxShadow: 'var(--shadow-modal)' }}
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold flex items-center gap-2" style={getTextStyle('primary')}>
                    <Sparkles className="w-5 h-5" style={{ color: 'var(--accent-primary)' }} />
                    模板市场
                  </h2>
                  <p className="text-sm mt-1" style={getTextStyle('muted')}>选择一个模板快速创建技能</p>
                </div>
                <button
                  onClick={() => setShowTemplates(false)}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  style={getTextStyle('muted')}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-3 gap-4">
                {skillTemplates.map(template => (
                  <motion.div
                    key={template.id}
                    whileHover={{ scale: 1.02, y: -2 }}
                    className="p-4 rounded-lg cursor-pointer"
                    style={getCardStyle()}
                    onClick={() => handleUseTemplate(template)}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-3xl">{template.icon}</span>
                      <div>
                        <h3 className="font-medium" style={getTextStyle('primary')}>{template.name}</h3>
                        <span className="text-xs" style={getTextStyle('muted')}>
                          {categories.find(c => c.id === template.category)?.label}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm mb-3" style={getTextStyle('secondary')}>{template.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs" style={getTextStyle('muted')}>
                        使用 {template.usageCount.toLocaleString()} 次
                      </span>
                      <span className="text-xs px-2 py-1 rounded" style={{ background: 'var(--color-primary-lighter)', color: 'var(--accent-primary)' }}>
                        使用此模板
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
