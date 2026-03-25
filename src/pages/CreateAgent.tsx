import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  ArrowLeft,
  ArrowRight,
  Bot,
  Sparkles,
  Database,
  GitBranch,
  Play,
  CheckCircle2,
  MessageSquare,
  Send,
  Loader2
} from 'lucide-react'
import PromptDesigner, { PromptDesign } from '../components/PromptDesigner'
import WorkflowEditor, { Workflow } from '../components/WorkflowEditor'

const steps = [
  { id: 1, name: '基础配置', icon: Bot, description: '设置智能体基本信息' },
  { id: 2, name: '提示词设计', icon: Sparkles, description: '结构化设计系统提示词' },
  { id: 3, name: '知识库配置', icon: Database, description: '绑定知识库和数据集' },
  { id: 4, name: '流程编排', icon: GitBranch, description: '可视化工作流设计' },
  { id: 5, name: '测试验证', icon: Play, description: '测试智能体效果' },
  { id: 6, name: '发布设置', icon: CheckCircle2, description: '设置发布范围和定价' }
]

const knowledgeBases = [
  { id: 'kb_1', name: '政策法规库', documents: 1234, type: 'internal' },
  { id: 'kb_2', name: '历史会议纪要', documents: 567, type: 'internal' },
  { id: 'kb_3', name: '公文模板库', documents: 89, type: 'internal' },
  { id: 'kb_4', name: '业务知识库', documents: 456, type: 'internal' },
  { id: 'kb_5', name: '交通数据', documents: 789, type: 'internal' }
]

const datasets = [
  { id: 'ds_1', name: '公文写作指令集', records: 2345, type: 'instruction' },
  { id: 'ds_2', name: '公文实体标注数据', records: 12678, type: 'annotation' },
  { id: 'ds_3', name: '历史优秀公文语料', records: 5432, type: 'corpus' }
]

const defaultPromptDesign: PromptDesign = {
  role: { name: '', position: '', domains: [] },
  task: { coreTask: '', objectives: [''], boundaries: '' },
  output: { format: 'formal', style: 'formal', qualityStandards: [] },
  examples: [],
  modelParams: { temperature: 0.7, maxTokens: 4096, topP: 0.9 },
  generatedPrompt: ''
}

const defaultWorkflow: Workflow = {
  nodes: [],
  edges: [],
  variables: [
    { id: 'v1', name: 'user_input', type: 'input', description: '用户输入' },
    { id: 'v2', name: 'result', type: 'output', description: '输出结果' }
  ]
}

export default function CreateAgent() {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'material',
    icon: '🤖',
    enableMultiTurn: true,
    enableFileUpload: true,
    enableStreaming: true,
    selectedKnowledgeBases: [] as string[],
    selectedDatasets: [] as string[],
    retrievalMethod: 'hybrid',
    retrievalCount: 5,
    similarityThreshold: 0.7,
    visibility: 'department',
    pricing: 'free',
    securityLevel: 'internal'
  })

  const [promptDesign, setPromptDesign] = useState<PromptDesign>(defaultPromptDesign)
  const [workflow, setWorkflow] = useState<Workflow>(defaultWorkflow)
  const [testInput, setTestInput] = useState('')
  const [testOutput, setTestOutput] = useState('')
  const [isTesting, setIsTesting] = useState(false)

  const updateFormData = (updates: Partial<typeof formData>) => {
    setFormData(prev => ({ ...prev, ...updates }))
  }

  const toggleKnowledgeBase = (kbId: string) => {
    setFormData(prev => ({
      ...prev,
      selectedKnowledgeBases: prev.selectedKnowledgeBases.includes(kbId)
        ? prev.selectedKnowledgeBases.filter(id => id !== kbId)
        : [...prev.selectedKnowledgeBases, kbId]
    }))
  }

  const toggleDataset = (dsId: string) => {
    setFormData(prev => ({
      ...prev,
      selectedDatasets: prev.selectedDatasets.includes(dsId)
        ? prev.selectedDatasets.filter(id => id !== dsId)
        : [...prev.selectedDatasets, dsId]
    }))
  }

  const handleTest = async () => {
    if (!testInput.trim()) return
    setIsTesting(true)
    await new Promise(resolve => setTimeout(resolve, 2000))
    setTestOutput(`好的，我已收到您的请求："${testInput}"

作为${promptDesign.role.name || formData.name || '智能体'}，我将根据您的需求进行处理...

【工作流执行日志】
1. 输入处理节点 - 已接收用户输入
2. 知识检索节点 - 检索到 ${formData.selectedKnowledgeBases.length} 个知识库的相关内容
3. 模型推理节点 - 使用配置的模型生成响应
4. 输出节点 - 格式化输出结果

[这是一个模拟的测试输出，实际输出将根据配置的模型、提示词和工作流生成]`)
    setIsTesting(false)
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    await new Promise(resolve => setTimeout(resolve, 1500))
    navigate('/developer')
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.name.trim() !== '' && formData.description.trim() !== ''
      case 2:
        return promptDesign.role.name.trim() !== '' || promptDesign.task.coreTask.trim() !== ''
      case 3:
        return true
      case 4:
        return workflow.nodes.length >= 2
      case 5:
        return true
      case 6:
        return true
      default:
        return true
    }
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      <div className="border-b" style={{ borderColor: 'var(--border-color)' }}>
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/developer')}
                className="p-2 rounded-lg border transition-all hover:border-opacity-50"
                style={{ borderColor: 'var(--border-color)' }}
              >
                <ArrowLeft className="w-4 h-4" style={{ color: 'var(--text-secondary)' }} />
              </button>
              <div>
                <h1 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>创建智能体</h1>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  步骤 {currentStep} / {steps.length}：{steps[currentStep - 1].name}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 mt-4 overflow-x-auto pb-2">
            {steps.map((step, index) => {
              const StepIcon = step.icon
              const isActive = currentStep === step.id
              const isCompleted = currentStep > step.id
              return (
                <div key={step.id} className="flex items-center">
                  <button
                    onClick={() => step.id < currentStep && setCurrentStep(step.id)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
                      isActive ? '' : isCompleted ? '' : 'opacity-50'
                    }`}
                    style={{
                      background: isActive ? 'var(--accent-primary)20' : 'transparent',
                      color: isActive ? 'var(--accent-primary)' : isCompleted ? 'var(--accent-primary)' : 'var(--text-secondary)'
                    }}
                    disabled={step.id > currentStep}
                  >
                    <div 
                      className="w-6 h-6 rounded-full flex items-center justify-center text-xs"
                      style={{
                        background: isCompleted ? 'var(--accent-primary)' : isActive ? 'var(--accent-primary)20' : 'var(--bg-secondary)',
                        color: isCompleted ? 'white' : isActive ? 'var(--accent-primary)' : 'var(--text-secondary)'
                      }}
                    >
                      {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : <StepIcon className="w-3 h-3" />}
                    </div>
                    <span className="text-sm whitespace-nowrap">{step.name}</span>
                  </button>
                  {index < steps.length - 1 && (
                    <div className="w-8 h-px mx-1" style={{ background: 'var(--border-color)' }} />
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-6">
        <div className="p-6 rounded-xl border" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                  智能体名称 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => updateFormData({ name: e.target.value })}
                  placeholder="例如：会议纪要生成助手"
                  className="w-full px-4 py-2 rounded-lg border"
                  style={{ background: 'var(--bg-primary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                  描述 <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => updateFormData({ description: e.target.value })}
                  placeholder="描述智能体的功能和使用场景"
                  rows={3}
                  className="w-full px-4 py-2 rounded-lg border resize-none"
                  style={{ background: 'var(--bg-primary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>分类</label>
                  <select
                    value={formData.category}
                    onChange={(e) => updateFormData({ category: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border"
                    style={{ background: 'var(--bg-primary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                  >
                    <option value="material">材料生产</option>
                    <option value="knowledge">知识检索</option>
                    <option value="business">业务协同</option>
                    <option value="data">数据分析</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>图标</label>
                  <div className="flex items-center gap-2">
                    <div className="text-3xl p-2 rounded-lg border" style={{ background: 'var(--bg-primary)', borderColor: 'var(--border-color)' }}>
                      {formData.icon}
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {['🤖', '📝', '📄', '📊', '🔍', '⚖️', '📋', '📈', '🎤', '🏗️'].map(icon => (
                        <button
                          key={icon}
                          onClick={() => updateFormData({ icon })}
                          className="text-2xl p-1 rounded hover:bg-opacity-50 transition-all"
                          style={{ background: formData.icon === icon ? 'var(--accent-primary)20' : 'transparent' }}
                        >
                          {icon}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>高级设置</label>
                <div className="flex flex-wrap gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.enableMultiTurn}
                      onChange={(e) => updateFormData({ enableMultiTurn: e.target.checked })}
                      className="w-4 h-4 rounded"
                    />
                    <span className="text-sm" style={{ color: 'var(--text-primary)' }}>启用多轮对话</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.enableFileUpload}
                      onChange={(e) => updateFormData({ enableFileUpload: e.target.checked })}
                      className="w-4 h-4 rounded"
                    />
                    <span className="text-sm" style={{ color: 'var(--text-primary)' }}>支持文件上传</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.enableStreaming}
                      onChange={(e) => updateFormData({ enableStreaming: e.target.checked })}
                      className="w-4 h-4 rounded"
                    />
                    <span className="text-sm" style={{ color: 'var(--text-primary)' }}>支持流式输出</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <PromptDesigner value={promptDesign} onChange={setPromptDesign} />
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>选择知识库</label>
                <div className="grid grid-cols-2 gap-3">
                  {knowledgeBases.map(kb => (
                    <button
                      key={kb.id}
                      onClick={() => toggleKnowledgeBase(kb.id)}
                      className={`p-3 rounded-lg border text-left transition-all ${
                        formData.selectedKnowledgeBases.includes(kb.id) ? 'border-opacity-100' : 'border-opacity-50'
                      }`}
                      style={{
                        background: formData.selectedKnowledgeBases.includes(kb.id) ? 'var(--accent-primary)10' : 'var(--bg-primary)',
                        borderColor: formData.selectedKnowledgeBases.includes(kb.id) ? 'var(--accent-primary)' : 'var(--border-color)'
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{kb.name}</span>
                        <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{kb.documents} 文档</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>选择数据集（可选）</label>
                <div className="grid grid-cols-2 gap-3">
                  {datasets.map(ds => (
                    <button
                      key={ds.id}
                      onClick={() => toggleDataset(ds.id)}
                      className={`p-3 rounded-lg border text-left transition-all ${
                        formData.selectedDatasets.includes(ds.id) ? 'border-opacity-100' : 'border-opacity-50'
                      }`}
                      style={{
                        background: formData.selectedDatasets.includes(ds.id) ? '#8b5cf610' : 'var(--bg-primary)',
                        borderColor: formData.selectedDatasets.includes(ds.id) ? '#8b5cf6' : 'var(--border-color)'
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{ds.name}</span>
                        <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{ds.records} 条</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>检索方式</label>
                  <select
                    value={formData.retrievalMethod}
                    onChange={(e) => updateFormData({ retrievalMethod: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border"
                    style={{ background: 'var(--bg-primary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                  >
                    <option value="vector">向量检索</option>
                    <option value="keyword">关键词检索</option>
                    <option value="hybrid">混合检索</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>返回条数</label>
                  <input
                    type="number"
                    value={formData.retrievalCount}
                    onChange={(e) => updateFormData({ retrievalCount: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 rounded-lg border"
                    style={{ background: 'var(--bg-primary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                    相似度阈值: {formData.similarityThreshold}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={formData.similarityThreshold}
                    onChange={(e) => updateFormData({ similarityThreshold: parseFloat(e.target.value) })}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium" style={{ color: 'var(--text-primary)' }}>工作流编排</h3>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>拖拽节点设计智能体执行流程，技能和工具已整合到节点中</p>
                </div>
              </div>
              <WorkflowEditor value={workflow} onChange={setWorkflow} />
            </div>
          )}

          {currentStep === 5 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>测试面板</label>
                <div className="rounded-lg border overflow-hidden" style={{ borderColor: 'var(--border-color)' }}>
                  <div className="p-4 border-b" style={{ background: 'var(--bg-primary)', borderColor: 'var(--border-color)' }}>
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4" style={{ color: 'var(--text-secondary)' }} />
                      <span className="text-sm" style={{ color: 'var(--text-primary)' }}>对话测试</span>
                    </div>
                  </div>
                  <div className="p-4 space-y-4 min-h-[200px]" style={{ background: 'var(--bg-secondary)' }}>
                    {testOutput && (
                      <div className="space-y-3">
                        <div className="flex gap-3">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm" style={{ background: 'var(--accent-primary)20' }}>
                            👤
                          </div>
                          <div className="flex-1 p-3 rounded-lg" style={{ background: 'var(--bg-primary)' }}>
                            <p className="text-sm" style={{ color: 'var(--text-primary)' }}>{testInput}</p>
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm" style={{ background: 'var(--accent-primary)' }}>
                            🤖
                          </div>
                          <div className="flex-1 p-3 rounded-lg" style={{ background: 'var(--bg-primary)' }}>
                            <p className="text-sm whitespace-pre-wrap" style={{ color: 'var(--text-primary)' }}>{testOutput}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="p-4 border-t flex gap-2" style={{ borderColor: 'var(--border-color)' }}>
                    <input
                      type="text"
                      value={testInput}
                      onChange={(e) => setTestInput(e.target.value)}
                      placeholder="输入测试问题..."
                      className="flex-1 px-4 py-2 rounded-lg border"
                      style={{ background: 'var(--bg-primary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                      onKeyDown={(e) => e.key === 'Enter' && handleTest()}
                    />
                    <button
                      onClick={handleTest}
                      disabled={isTesting || !testInput.trim()}
                      className="px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2"
                      style={{ background: 'var(--accent-primary)', color: 'white', opacity: isTesting ? 0.7 : 1 }}
                    >
                      {isTesting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                      测试
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-lg" style={{ background: 'var(--bg-primary)' }}>
                <h4 className="font-medium mb-3" style={{ color: 'var(--text-primary)' }}>配置摘要</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span style={{ color: 'var(--text-secondary)' }}>名称：</span>
                    <span style={{ color: 'var(--text-primary)' }}>{formData.name || '未设置'}</span>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-secondary)' }}>角色：</span>
                    <span style={{ color: 'var(--text-primary)' }}>{promptDesign.role.name || '未设置'}</span>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-secondary)' }}>知识库：</span>
                    <span style={{ color: 'var(--text-primary)' }}>{formData.selectedKnowledgeBases.length} 个</span>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-secondary)' }}>数据集：</span>
                    <span style={{ color: 'var(--text-primary)' }}>{formData.selectedDatasets.length} 个</span>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-secondary)' }}>工作流节点：</span>
                    <span style={{ color: 'var(--text-primary)' }}>{workflow.nodes.length} 个</span>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-secondary)' }}>示例数量：</span>
                    <span style={{ color: 'var(--text-primary)' }}>{promptDesign.examples.length} 个</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 6 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>可见范围</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'self', label: '仅自己', desc: '只有自己可以使用' },
                    { id: 'department', label: '本部门', desc: '部门内可见可用' },
                    { id: 'global', label: '全局', desc: '所有人可见可用' }
                  ].map(option => (
                    <button
                      key={option.id}
                      onClick={() => updateFormData({ visibility: option.id })}
                      className={`p-3 rounded-lg border text-left transition-all`}
                      style={{
                        background: formData.visibility === option.id ? 'var(--accent-primary)10' : 'var(--bg-primary)',
                        borderColor: formData.visibility === option.id ? 'var(--accent-primary)' : 'var(--border-color)'
                      }}
                    >
                      <div className="font-medium" style={{ color: 'var(--text-primary)' }}>{option.label}</div>
                      <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>{option.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>定价策略</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'free', label: '免费', desc: '完全免费使用' },
                    { id: 'subscription', label: '订阅制', desc: '按月/年订阅' },
                    { id: 'pay-per-use', label: '按次计费', desc: '按调用次数收费' }
                  ].map(option => (
                    <button
                      key={option.id}
                      onClick={() => updateFormData({ pricing: option.id })}
                      className={`p-3 rounded-lg border text-left transition-all`}
                      style={{
                        background: formData.pricing === option.id ? 'var(--accent-primary)10' : 'var(--bg-primary)',
                        borderColor: formData.pricing === option.id ? 'var(--accent-primary)' : 'var(--border-color)'
                      }}
                    >
                      <div className="font-medium" style={{ color: 'var(--text-primary)' }}>{option.label}</div>
                      <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>{option.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>安全等级</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'public', label: '公开', desc: '可处理公开数据' },
                    { id: 'internal', label: '内部', desc: '可处理内部数据' },
                    { id: 'confidential', label: '机密', desc: '可处理机密数据' }
                  ].map(option => (
                    <button
                      key={option.id}
                      onClick={() => updateFormData({ securityLevel: option.id })}
                      className={`p-3 rounded-lg border text-left transition-all`}
                      style={{
                        background: formData.securityLevel === option.id ? 'var(--accent-primary)10' : 'var(--bg-primary)',
                        borderColor: formData.securityLevel === option.id ? 'var(--accent-primary)' : 'var(--border-color)'
                      }}
                    >
                      <div className="font-medium" style={{ color: 'var(--text-primary)' }}>{option.label}</div>
                      <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>{option.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-lg" style={{ background: 'var(--bg-primary)' }}>
                <h4 className="font-medium mb-2" style={{ color: 'var(--text-primary)' }}>最终配置确认</h4>
                <div className="space-y-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                  <div className="flex justify-between">
                    <span>智能体名称</span>
                    <span style={{ color: 'var(--text-primary)' }}>{formData.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>角色定位</span>
                    <span style={{ color: 'var(--text-primary)' }}>{promptDesign.role.position || '未设置'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>知识库</span>
                    <span style={{ color: 'var(--text-primary)' }}>{formData.selectedKnowledgeBases.length} 个</span>
                  </div>
                  <div className="flex justify-between">
                    <span>工作流节点</span>
                    <span style={{ color: 'var(--text-primary)' }}>{workflow.nodes.length} 个</span>
                  </div>
                  <div className="flex justify-between">
                    <span>可见范围</span>
                    <span style={{ color: 'var(--text-primary)' }}>
                      {formData.visibility === 'self' ? '仅自己' : formData.visibility === 'department' ? '本部门' : '全局'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between mt-6">
          <button
            onClick={() => setCurrentStep(prev => prev - 1)}
            disabled={currentStep === 1}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border transition-all"
            style={{ 
              borderColor: 'var(--border-color)',
              color: 'var(--text-secondary)',
              opacity: currentStep === 1 ? 0.5 : 1
            }}
          >
            <ArrowLeft className="w-4 h-4" />
            上一步
          </button>

          {currentStep < steps.length ? (
            <button
              onClick={() => setCurrentStep(prev => prev + 1)}
              disabled={!canProceed()}
              className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all"
              style={{ 
                background: 'var(--accent-primary)',
                color: 'white',
                opacity: canProceed() ? 1 : 0.5
              }}
            >
              下一步
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                className="px-4 py-2 rounded-lg border transition-all"
                style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}
              >
                保存草稿
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all"
                style={{ background: 'var(--accent-primary)', color: 'white' }}
              >
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                {isSubmitting ? '提交中...' : '提交审核'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
