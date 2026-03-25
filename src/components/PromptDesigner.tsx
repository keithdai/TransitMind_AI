import { useState, useEffect } from 'react'
import { 
  User, 
  Target, 
  FileText, 
  Lightbulb, 
  Settings, 
  Plus, 
  Trash2, 
  Sparkles,
  ChevronDown,
  ChevronUp
} from 'lucide-react'

export interface PromptDesign {
  role: {
    name: string
    position: string
    domains: string[]
  }
  task: {
    coreTask: string
    objectives: string[]
    boundaries: string
  }
  output: {
    format: 'formal' | 'simple' | 'checklist'
    style: 'formal' | 'concise' | 'detailed'
    qualityStandards: string[]
  }
  examples: {
    id: string
    input: string
    output: string
  }[]
  modelParams: {
    temperature: number
    maxTokens: number
    topP: number
  }
  generatedPrompt: string
}

interface PromptDesignerProps {
  value: PromptDesign
  onChange: (value: PromptDesign) => void
}

const defaultPromptDesign: PromptDesign = {
  role: {
    name: '',
    position: '',
    domains: []
  },
  task: {
    coreTask: '',
    objectives: [''],
    boundaries: ''
  },
  output: {
    format: 'formal',
    style: 'formal',
    qualityStandards: []
  },
  examples: [],
  modelParams: {
    temperature: 0.7,
    maxTokens: 4096,
    topP: 0.9
  },
  generatedPrompt: ''
}

const qualityStandardOptions = [
  { id: 'format', label: '格式规范' },
  { id: 'logic', label: '逻辑清晰' },
  { id: 'complete', label: '要点完整' },
  { id: 'deadline', label: '时限明确' },
  { id: 'accurate', label: '数据准确' },
  { id: 'professional', label: '表述专业' }
]

export default function PromptDesigner({ value, onChange }: PromptDesignerProps) {
  const [expandedSections, setExpandedSections] = useState({
    role: true,
    task: true,
    output: true,
    examples: true,
    modelParams: false,
    preview: true
  })

  const data = { ...defaultPromptDesign, ...value }

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }))
  }

  const updateRole = (field: keyof PromptDesign['role'], value: string) => {
    onChange({
      ...data,
      role: { ...data.role, [field]: value }
    })
  }

  const updateRoleDomains = (value: string) => {
    const domains = value.split(/[,，、]/).map(d => d.trim()).filter(Boolean)
    onChange({
      ...data,
      role: { ...data.role, domains }
    })
  }

  const updateTask = (field: keyof PromptDesign['task'], value: string | string[]) => {
    onChange({
      ...data,
      task: { ...data.task, [field]: value }
    })
  }

  const addObjective = () => {
    onChange({
      ...data,
      task: { ...data.task, objectives: [...data.task.objectives, ''] }
    })
  }

  const updateObjective = (index: number, value: string) => {
    const newObjectives = [...data.task.objectives]
    newObjectives[index] = value
    onChange({
      ...data,
      task: { ...data.task, objectives: newObjectives }
    })
  }

  const removeObjective = (index: number) => {
    onChange({
      ...data,
      task: { 
        ...data.task, 
        objectives: data.task.objectives.filter((_, i) => i !== index) 
      }
    })
  }

  const updateOutput = (field: keyof PromptDesign['output'], value: string | string[]) => {
    onChange({
      ...data,
      output: { ...data.output, [field]: value }
    })
  }

  const toggleQualityStandard = (id: string) => {
    const current = data.output.qualityStandards
    const updated = current.includes(id)
      ? current.filter(s => s !== id)
      : [...current, id]
    updateOutput('qualityStandards', updated)
  }

  const addExample = () => {
    onChange({
      ...data,
      examples: [...data.examples, { id: `ex_${Date.now()}`, input: '', output: '' }]
    })
  }

  const updateExample = (id: string, field: 'input' | 'output', value: string) => {
    onChange({
      ...data,
      examples: data.examples.map(ex => 
        ex.id === id ? { ...ex, [field]: value } : ex
      )
    })
  }

  const removeExample = (id: string) => {
    onChange({
      ...data,
      examples: data.examples.filter(ex => ex.id !== id)
    })
  }

  const updateModelParams = (field: keyof PromptDesign['modelParams'], value: number) => {
    onChange({
      ...data,
      modelParams: { ...data.modelParams, [field]: value }
    })
  }

  const generatePrompt = () => {
    const formatDesc: Record<string, string> = {
      formal: '正式版',
      simple: '简版',
      checklist: '议定事项清单'
    }
    const styleDesc: Record<string, string> = {
      formal: '正式公文风格',
      concise: '简洁明了风格',
      detailed: '详细完整风格'
    }

    let prompt = `# 角色定义\n`
    if (data.role.name) {
      prompt += `你是${data.role.name}`
      if (data.role.position) {
        prompt += `，${data.role.position}`
      }
      prompt += `。\n`
    }
    if (data.role.domains.length > 0) {
      prompt += `专业领域：${data.role.domains.join('、')}\n`
    }

    prompt += `\n# 任务说明\n`
    if (data.task.coreTask) {
      prompt += `${data.task.coreTask}\n`
    }
    const validObjectives = data.task.objectives.filter(o => o.trim())
    if (validObjectives.length > 0) {
      prompt += `\n任务目标：\n`
      validObjectives.forEach((o, i) => {
        prompt += `${i + 1}. ${o}\n`
      })
    }
    if (data.task.boundaries) {
      prompt += `\n执行边界：${data.task.boundaries}\n`
    }

    prompt += `\n# 输出规范\n`
    prompt += `输出格式：${formatDesc[data.output.format]}\n`
    prompt += `输出风格：${styleDesc[data.output.style]}\n`
    if (data.output.qualityStandards.length > 0) {
      const standards = data.output.qualityStandards.map(id => 
        qualityStandardOptions.find(o => o.id === id)?.label
      ).filter(Boolean)
      prompt += `质量标准：${standards.join('、')}\n`
    }

    if (data.examples.length > 0) {
      prompt += `\n# 示例\n`
      data.examples.forEach((ex, i) => {
        if (ex.input || ex.output) {
          prompt += `\n## 示例 ${i + 1}\n`
          if (ex.input) {
            prompt += `输入：\n${ex.input}\n`
          }
          if (ex.output) {
            prompt += `输出：\n${ex.output}\n`
          }
        }
      })
    }

    onChange({ ...data, generatedPrompt: prompt.trim() })
  }

  useEffect(() => {
    generatePrompt()
  }, [data.role, data.task, data.output, data.examples])

  const SectionHeader = ({ 
    section, 
    title, 
    icon: Icon 
  }: { 
    section: keyof typeof expandedSections
    title: string
    icon: typeof User
  }) => (
    <button
      onClick={() => toggleSection(section)}
      className="w-full flex items-center justify-between p-3 rounded-lg transition-all"
      style={{ background: 'var(--bg-primary)' }}
    >
      <div className="flex items-center gap-2">
        <Icon className="w-4 h-4" style={{ color: 'var(--accent-primary)' }} />
        <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{title}</span>
      </div>
      {expandedSections[section] ? (
        <ChevronUp className="w-4 h-4" style={{ color: 'var(--text-secondary)' }} />
      ) : (
        <ChevronDown className="w-4 h-4" style={{ color: 'var(--text-secondary)' }} />
      )}
    </button>
  )

  return (
    <div className="space-y-4">
      <div className="rounded-xl border overflow-hidden" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
        <SectionHeader section="role" title="角色定义" icon={User} />
        {expandedSections.role && (
          <div className="p-4 space-y-4 border-t" style={{ borderColor: 'var(--border-color)' }}>
            <div>
              <label className="block text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>角色名称</label>
              <input
                type="text"
                value={data.role.name}
                onChange={(e) => updateRole('name', e.target.value)}
                placeholder="例如：会议纪要生成助手"
                className="w-full px-3 py-2 rounded-lg border text-sm"
                style={{ background: 'var(--bg-primary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
              />
            </div>
            <div>
              <label className="block text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>角色定位</label>
              <input
                type="text"
                value={data.role.position}
                onChange={(e) => updateRole('position', e.target.value)}
                placeholder="例如：专业的政务会议纪要撰写专家"
                className="w-full px-3 py-2 rounded-lg border text-sm"
                style={{ background: 'var(--bg-primary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
              />
            </div>
            <div>
              <label className="block text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>专业领域（用逗号分隔）</label>
              <input
                type="text"
                value={data.role.domains.join('、')}
                onChange={(e) => updateRoleDomains(e.target.value)}
                placeholder="例如：政务办公、公文写作、会议管理"
                className="w-full px-3 py-2 rounded-lg border text-sm"
                style={{ background: 'var(--bg-primary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
              />
            </div>
          </div>
        )}
      </div>

      <div className="rounded-xl border overflow-hidden" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
        <SectionHeader section="task" title="任务描述" icon={Target} />
        {expandedSections.task && (
          <div className="p-4 space-y-4 border-t" style={{ borderColor: 'var(--border-color)' }}>
            <div>
              <label className="block text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>核心任务</label>
              <textarea
                value={data.task.coreTask}
                onChange={(e) => updateTask('coreTask', e.target.value)}
                placeholder="描述智能体的核心任务..."
                rows={2}
                className="w-full px-3 py-2 rounded-lg border text-sm resize-none"
                style={{ background: 'var(--bg-primary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
              />
            </div>
            <div>
              <label className="block text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>任务目标</label>
              {data.task.objectives.map((obj, index) => (
                <div key={index} className="flex items-center gap-2 mb-2">
                  <span className="text-xs px-2 py-1 rounded" style={{ background: 'var(--accent-primary)20', color: 'var(--accent-primary)' }}>
                    {index + 1}
                  </span>
                  <input
                    type="text"
                    value={obj}
                    onChange={(e) => updateObjective(index, e.target.value)}
                    placeholder={`目标 ${index + 1}`}
                    className="flex-1 px-3 py-2 rounded-lg border text-sm"
                    style={{ background: 'var(--bg-primary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                  />
                  {data.task.objectives.length > 1 && (
                    <button
                      onClick={() => removeObjective(index)}
                      className="p-2 rounded-lg border transition-all hover:border-red-500"
                      style={{ borderColor: 'var(--border-color)' }}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  )}
                </div>
              ))}
              <button
                onClick={addObjective}
                className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg border transition-all"
                style={{ borderColor: 'var(--accent-primary)', color: 'var(--accent-primary)' }}
              >
                <Plus className="w-3 h-3" />
                添加目标
              </button>
            </div>
            <div>
              <label className="block text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>执行边界</label>
              <textarea
                value={data.task.boundaries}
                onChange={(e) => updateTask('boundaries', e.target.value)}
                placeholder="描述智能体的执行边界和限制..."
                rows={2}
                className="w-full px-3 py-2 rounded-lg border text-sm resize-none"
                style={{ background: 'var(--bg-primary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
              />
            </div>
          </div>
        )}
      </div>

      <div className="rounded-xl border overflow-hidden" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
        <SectionHeader section="output" title="输出规范" icon={FileText} />
        {expandedSections.output && (
          <div className="p-4 space-y-4 border-t" style={{ borderColor: 'var(--border-color)' }}>
            <div>
              <label className="block text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>输出格式</label>
              <div className="flex gap-2">
                {[
                  { id: 'formal', label: '正式版' },
                  { id: 'simple', label: '简版' },
                  { id: 'checklist', label: '清单' }
                ].map(option => (
                  <button
                    key={option.id}
                    onClick={() => updateOutput('format', option.id)}
                    className={`px-3 py-1.5 rounded-lg text-sm border transition-all`}
                    style={{
                      background: data.output.format === option.id ? 'var(--accent-primary)10' : 'var(--bg-primary)',
                      borderColor: data.output.format === option.id ? 'var(--accent-primary)' : 'var(--border-color)',
                      color: data.output.format === option.id ? 'var(--accent-primary)' : 'var(--text-primary)'
                    }}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>输出风格</label>
              <div className="flex gap-2">
                {[
                  { id: 'formal', label: '正式公文' },
                  { id: 'concise', label: '简洁明了' },
                  { id: 'detailed', label: '详细完整' }
                ].map(option => (
                  <button
                    key={option.id}
                    onClick={() => updateOutput('style', option.id)}
                    className={`px-3 py-1.5 rounded-lg text-sm border transition-all`}
                    style={{
                      background: data.output.style === option.id ? 'var(--accent-primary)10' : 'var(--bg-primary)',
                      borderColor: data.output.style === option.id ? 'var(--accent-primary)' : 'var(--border-color)',
                      color: data.output.style === option.id ? 'var(--accent-primary)' : 'var(--text-primary)'
                    }}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>质量标准</label>
              <div className="flex flex-wrap gap-2">
                {qualityStandardOptions.map(option => (
                  <button
                    key={option.id}
                    onClick={() => toggleQualityStandard(option.id)}
                    className={`px-3 py-1.5 rounded-lg text-sm border transition-all`}
                    style={{
                      background: data.output.qualityStandards.includes(option.id) ? 'var(--accent-primary)10' : 'var(--bg-primary)',
                      borderColor: data.output.qualityStandards.includes(option.id) ? 'var(--accent-primary)' : 'var(--border-color)',
                      color: data.output.qualityStandards.includes(option.id) ? 'var(--accent-primary)' : 'var(--text-primary)'
                    }}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="rounded-xl border overflow-hidden" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
        <SectionHeader section="examples" title="示例配置 (Few-shot)" icon={Lightbulb} />
        {expandedSections.examples && (
          <div className="p-4 space-y-4 border-t" style={{ borderColor: 'var(--border-color)' }}>
            {data.examples.map((example, index) => (
              <div key={example.id} className="p-3 rounded-lg border" style={{ background: 'var(--bg-primary)', borderColor: 'var(--border-color)' }}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>示例 {index + 1}</span>
                  <button
                    onClick={() => removeExample(example.id)}
                    className="p-1 rounded hover:bg-red-500/10 transition-all"
                  >
                    <Trash2 className="w-3 h-3 text-red-500" />
                  </button>
                </div>
                <div className="space-y-2">
                  <div>
                    <label className="block text-xs mb-1" style={{ color: 'var(--text-secondary)' }}>输入</label>
                    <textarea
                      value={example.input}
                      onChange={(e) => updateExample(example.id, 'input', e.target.value)}
                      placeholder="输入示例..."
                      rows={2}
                      className="w-full px-2 py-1.5 rounded border text-sm resize-none"
                      style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                    />
                  </div>
                  <div>
                    <label className="block text-xs mb-1" style={{ color: 'var(--text-secondary)' }}>输出</label>
                    <textarea
                      value={example.output}
                      onChange={(e) => updateExample(example.id, 'output', e.target.value)}
                      placeholder="输出示例..."
                      rows={3}
                      className="w-full px-2 py-1.5 rounded border text-sm resize-none font-mono"
                      style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                    />
                  </div>
                </div>
              </div>
            ))}
            <button
              onClick={addExample}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-dashed transition-all"
              style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}
            >
              <Plus className="w-4 h-4" />
              添加示例
            </button>
          </div>
        )}
      </div>

      <div className="rounded-xl border overflow-hidden" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
        <SectionHeader section="modelParams" title="模型参数" icon={Settings} />
        {expandedSections.modelParams && (
          <div className="p-4 space-y-4 border-t" style={{ borderColor: 'var(--border-color)' }}>
            <div>
              <label className="block text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>
                Temperature: {data.modelParams.temperature}
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={data.modelParams.temperature}
                onChange={(e) => updateModelParams('temperature', parseFloat(e.target.value))}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>Max Tokens</label>
              <input
                type="number"
                value={data.modelParams.maxTokens}
                onChange={(e) => updateModelParams('maxTokens', parseInt(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border text-sm"
                style={{ background: 'var(--bg-primary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
              />
            </div>
            <div>
              <label className="block text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>
                Top P: {data.modelParams.topP}
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={data.modelParams.topP}
                onChange={(e) => updateModelParams('topP', parseFloat(e.target.value))}
                className="w-full"
              />
            </div>
          </div>
        )}
      </div>

      <div className="rounded-xl border overflow-hidden" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
        <div className="flex items-center justify-between p-3" style={{ background: 'var(--bg-primary)' }}>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4" style={{ color: 'var(--accent-primary)' }} />
            <span className="font-medium" style={{ color: 'var(--text-primary)' }}>生成的系统提示词预览</span>
          </div>
          <button
            onClick={generatePrompt}
            className="text-xs px-2 py-1 rounded border transition-all"
            style={{ borderColor: 'var(--accent-primary)', color: 'var(--accent-primary)' }}
          >
            <Sparkles className="w-3 h-3 inline mr-1" />
            AI优化
          </button>
        </div>
        <div className="p-4 border-t" style={{ borderColor: 'var(--border-color)' }}>
          <pre className="text-sm whitespace-pre-wrap font-mono overflow-auto max-h-64 p-3 rounded-lg" style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
            {data.generatedPrompt || '填写上述信息后，系统提示词将自动生成...'}
          </pre>
        </div>
      </div>
    </div>
  )
}
