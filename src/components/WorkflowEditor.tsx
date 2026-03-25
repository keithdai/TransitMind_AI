import { useState, useCallback } from 'react'
import { 
  Play, 
  FileText, 
  Search, 
  Bot, 
  Wrench, 
  GitBranch, 
  RefreshCw, 
  FileOutput, 
  Square,
  Plus,
  Trash2,
  X
} from 'lucide-react'

export type NodeType = 'start' | 'input' | 'knowledge' | 'model' | 'tool' | 'condition' | 'loop' | 'output' | 'end'

export interface WorkflowNode {
  id: string
  type: NodeType
  name: string
  position: { x: number; y: number }
  config: Record<string, any>
}

export interface WorkflowEdge {
  id: string
  source: string
  target: string
  condition?: string
}

export interface WorkflowVariable {
  id: string
  name: string
  type: 'input' | 'intermediate' | 'output'
  description?: string
}

export interface Workflow {
  nodes: WorkflowNode[]
  edges: WorkflowEdge[]
  variables: WorkflowVariable[]
}

interface WorkflowEditorProps {
  value: Workflow
  onChange: (value: Workflow) => void
}

const nodeTypes = [
  { type: 'start', name: '开始', icon: Play, color: '#22c55e', description: '定义智能体启动条件' },
  { type: 'input', name: '输入处理', icon: FileText, color: '#3b82f6', description: '处理用户输入' },
  { type: 'knowledge', name: '知识检索', icon: Search, color: '#8b5cf6', description: '检索相关知识' },
  { type: 'model', name: '模型推理', icon: Bot, color: '#f59e0b', description: 'LLM调用' },
  { type: 'tool', name: '工具调用', icon: Wrench, color: '#06b6d4', description: '调用外部工具/API' },
  { type: 'condition', name: '条件分支', icon: GitBranch, color: '#ec4899', description: 'if-else逻辑' },
  { type: 'loop', name: '循环节点', icon: RefreshCw, color: '#84cc16', description: '批量处理' },
  { type: 'output', name: '输出节点', icon: FileOutput, color: '#64748b', description: '结果输出' },
  { type: 'end', name: '结束', icon: Square, color: '#ef4444', description: '流程结束' }
] as const

const defaultNodeConfig: Record<string, Record<string, any>> = {
  start: { trigger: 'manual' },
  input: { inputType: 'text', preprocess: '' },
  knowledge: { knowledgeBases: [], retrievalMethod: 'hybrid', topK: 5, threshold: 0.7 },
  model: { model: 'wenxin', promptTemplate: '', temperature: 0.7 },
  tool: { toolType: 'api', endpoint: '', method: 'GET' },
  condition: { expression: '', branches: [] },
  loop: { loopVariable: '', maxIterations: 100 },
  output: { outputFormat: 'text', postprocess: '' },
  end: { status: 'success' }
}

const workflowTemplates: { name: string; description: string; nodes: WorkflowNode[]; edges: WorkflowEdge[] }[] = [
  {
    name: '简单问答流程',
    description: '基础的知识检索+模型推理流程',
    nodes: [
      { id: 'start_1', type: 'start', name: '开始', position: { x: 50, y: 100 }, config: {} },
      { id: 'input_1', type: 'input', name: '输入处理', position: { x: 200, y: 100 }, config: {} },
      { id: 'knowledge_1', type: 'knowledge', name: '知识检索', position: { x: 350, y: 100 }, config: {} },
      { id: 'model_1', type: 'model', name: '模型推理', position: { x: 500, y: 100 }, config: {} },
      { id: 'output_1', type: 'output', name: '输出', position: { x: 650, y: 100 }, config: {} },
      { id: 'end_1', type: 'end', name: '结束', position: { x: 800, y: 100 }, config: {} }
    ],
    edges: [
      { id: 'e1', source: 'start_1', target: 'input_1' },
      { id: 'e2', source: 'input_1', target: 'knowledge_1' },
      { id: 'e3', source: 'knowledge_1', target: 'model_1' },
      { id: 'e4', source: 'model_1', target: 'output_1' },
      { id: 'e5', source: 'output_1', target: 'end_1' }
    ]
  },
  {
    name: '文档生成流程',
    description: '包含格式转换的文档生成流程',
    nodes: [
      { id: 'start_1', type: 'start', name: '开始', position: { x: 50, y: 100 }, config: {} },
      { id: 'input_1', type: 'input', name: '输入处理', position: { x: 200, y: 100 }, config: {} },
      { id: 'knowledge_1', type: 'knowledge', name: '知识检索', position: { x: 350, y: 100 }, config: {} },
      { id: 'model_1', type: 'model', name: '模型推理', position: { x: 500, y: 100 }, config: {} },
      { id: 'tool_1', type: 'tool', name: '格式转换', position: { x: 650, y: 100 }, config: {} },
      { id: 'output_1', type: 'output', name: '输出', position: { x: 800, y: 100 }, config: {} },
      { id: 'end_1', type: 'end', name: '结束', position: { x: 950, y: 100 }, config: {} }
    ],
    edges: [
      { id: 'e1', source: 'start_1', target: 'input_1' },
      { id: 'e2', source: 'input_1', target: 'knowledge_1' },
      { id: 'e3', source: 'knowledge_1', target: 'model_1' },
      { id: 'e4', source: 'model_1', target: 'tool_1' },
      { id: 'e5', source: 'tool_1', target: 'output_1' },
      { id: 'e6', source: 'output_1', target: 'end_1' }
    ]
  },
  {
    name: '条件分支流程',
    description: '根据条件执行不同分支',
    nodes: [
      { id: 'start_1', type: 'start', name: '开始', position: { x: 50, y: 150 }, config: {} },
      { id: 'input_1', type: 'input', name: '输入处理', position: { x: 200, y: 150 }, config: {} },
      { id: 'condition_1', type: 'condition', name: '条件判断', position: { x: 350, y: 150 }, config: {} },
      { id: 'knowledge_1', type: 'knowledge', name: '知识检索', position: { x: 500, y: 80 }, config: {} },
      { id: 'tool_1', type: 'tool', name: '工具调用', position: { x: 500, y: 220 }, config: {} },
      { id: 'model_1', type: 'model', name: '模型推理', position: { x: 650, y: 150 }, config: {} },
      { id: 'output_1', type: 'output', name: '输出', position: { x: 800, y: 150 }, config: {} },
      { id: 'end_1', type: 'end', name: '结束', position: { x: 950, y: 150 }, config: {} }
    ],
    edges: [
      { id: 'e1', source: 'start_1', target: 'input_1' },
      { id: 'e2', source: 'input_1', target: 'condition_1' },
      { id: 'e3', source: 'condition_1', target: 'knowledge_1', condition: 'branch_a' },
      { id: 'e4', source: 'condition_1', target: 'tool_1', condition: 'branch_b' },
      { id: 'e5', source: 'knowledge_1', target: 'model_1' },
      { id: 'e6', source: 'tool_1', target: 'model_1' },
      { id: 'e7', source: 'model_1', target: 'output_1' },
      { id: 'e8', source: 'output_1', target: 'end_1' }
    ]
  }
]

export default function WorkflowEditor({ value, onChange }: WorkflowEditorProps) {
  const [selectedNode, setSelectedNode] = useState<WorkflowNode | null>(null)
  const [draggedNodeType, setDraggedNodeType] = useState<string | null>(null)
  const [showTemplates, setShowTemplates] = useState(false)

  const workflow = value || { nodes: [], edges: [], variables: [] }

  const generateId = () => `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

  const addNode = useCallback((type: string, position: { x: number; y: number }) => {
    const nodeType = nodeTypes.find(n => n.type === type)
    if (!nodeType) return

    const newNode: WorkflowNode = {
      id: generateId(),
      type: type as WorkflowNode['type'],
      name: nodeType.name,
      position,
      config: { ...defaultNodeConfig[type] }
    }

    onChange({
      ...workflow,
      nodes: [...workflow.nodes, newNode]
    })
    setSelectedNode(newNode)
  }, [workflow, onChange])

  const updateNode = useCallback((nodeId: string, updates: Partial<WorkflowNode>) => {
    onChange({
      ...workflow,
      nodes: workflow.nodes.map(n => n.id === nodeId ? { ...n, ...updates } : n)
    })
    if (selectedNode?.id === nodeId) {
      setSelectedNode(prev => prev ? { ...prev, ...updates } : null)
    }
  }, [workflow, onChange, selectedNode])

  const deleteNode = useCallback((nodeId: string) => {
    onChange({
      ...workflow,
      nodes: workflow.nodes.filter(n => n.id !== nodeId),
      edges: workflow.edges.filter(e => e.source !== nodeId && e.target !== nodeId)
    })
    if (selectedNode?.id === nodeId) {
      setSelectedNode(null)
    }
  }, [workflow, onChange, selectedNode])

  const deleteEdge = useCallback((edgeId: string) => {
    onChange({
      ...workflow,
      edges: workflow.edges.filter(e => e.id !== edgeId)
    })
  }, [workflow, onChange])

  const addVariable = useCallback((type: WorkflowVariable['type']) => {
    const newVar: WorkflowVariable = {
      id: generateId(),
      name: `var_${workflow.variables.filter(v => v.type === type).length + 1}`,
      type,
      description: ''
    }
    onChange({
      ...workflow,
      variables: [...workflow.variables, newVar]
    })
  }, [workflow, onChange])

  const updateVariable = useCallback((varId: string, updates: Partial<WorkflowVariable>) => {
    onChange({
      ...workflow,
      variables: workflow.variables.map(v => v.id === varId ? { ...v, ...updates } : v)
    })
  }, [workflow, onChange])

  const deleteVariable = useCallback((varId: string) => {
    onChange({
      ...workflow,
      variables: workflow.variables.filter(v => v.id !== varId)
    })
  }, [workflow, onChange])

  const applyTemplate = (template: typeof workflowTemplates[0]) => {
    onChange({
      nodes: template.nodes.map(n => ({ ...n, id: generateId() })),
      edges: template.edges.map(e => ({ ...e, id: generateId() })),
      variables: []
    })
    setShowTemplates(false)
  }

  const clearWorkflow = () => {
    onChange({ nodes: [], edges: [], variables: [] })
    setSelectedNode(null)
  }

  const handleDragStart = (type: string) => {
    setDraggedNodeType(type)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    if (!draggedNodeType) return

    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    addNode(draggedNodeType, { x: Math.max(0, x - 60), y: Math.max(0, y - 20) })
    setDraggedNodeType(null)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const getNodeStyle = (type: string) => {
    const nodeType = nodeTypes.find(n => n.type === type)
    return {
      borderColor: nodeType?.color,
      background: `${nodeType?.color}10`
    }
  }

  const renderNodeConfig = () => {
    if (!selectedNode) return null

    const nodeType = nodeTypes.find(n => n.type === selectedNode.type)
    if (!nodeType) return null

    return (
      <div className="p-4 rounded-xl border" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <nodeType.icon className="w-4 h-4" style={{ color: nodeType.color }} />
            <span className="font-medium" style={{ color: 'var(--text-primary)' }}>
              {selectedNode.name} 配置
            </span>
          </div>
          <button onClick={() => setSelectedNode(null)} className="p-1 rounded hover:bg-opacity-50">
            <X className="w-4 h-4" style={{ color: 'var(--text-secondary)' }} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>节点名称</label>
            <input
              type="text"
              value={selectedNode.name}
              onChange={(e) => updateNode(selectedNode.id, { name: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border text-sm"
              style={{ background: 'var(--bg-primary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
            />
          </div>

          {selectedNode.type === 'input' && (
            <>
              <div>
                <label className="block text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>输入类型</label>
                <select
                  value={selectedNode.config.inputType || 'text'}
                  onChange={(e) => updateNode(selectedNode.id, { config: { ...selectedNode.config, inputType: e.target.value } })}
                  className="w-full px-3 py-2 rounded-lg border text-sm"
                  style={{ background: 'var(--bg-primary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                >
                  <option value="text">文本</option>
                  <option value="file">文件</option>
                  <option value="audio">音频</option>
                  <option value="image">图片</option>
                </select>
              </div>
              <div>
                <label className="block text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>输出变量</label>
                <input
                  type="text"
                  value={selectedNode.config.outputVar || 'user_input'}
                  onChange={(e) => updateNode(selectedNode.id, { config: { ...selectedNode.config, outputVar: e.target.value } })}
                  className="w-full px-3 py-2 rounded-lg border text-sm"
                  style={{ background: 'var(--bg-primary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                />
              </div>
            </>
          )}

          {selectedNode.type === 'knowledge' && (
            <>
              <div>
                <label className="block text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>检索方式</label>
                <select
                  value={selectedNode.config.retrievalMethod || 'hybrid'}
                  onChange={(e) => updateNode(selectedNode.id, { config: { ...selectedNode.config, retrievalMethod: e.target.value } })}
                  className="w-full px-3 py-2 rounded-lg border text-sm"
                  style={{ background: 'var(--bg-primary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                >
                  <option value="vector">向量检索</option>
                  <option value="keyword">关键词检索</option>
                  <option value="hybrid">混合检索</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>返回条数</label>
                  <input
                    type="number"
                    value={selectedNode.config.topK || 5}
                    onChange={(e) => updateNode(selectedNode.id, { config: { ...selectedNode.config, topK: parseInt(e.target.value) } })}
                    className="w-full px-3 py-2 rounded-lg border text-sm"
                    style={{ background: 'var(--bg-primary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>相似度阈值</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="1"
                    value={selectedNode.config.threshold || 0.7}
                    onChange={(e) => updateNode(selectedNode.id, { config: { ...selectedNode.config, threshold: parseFloat(e.target.value) } })}
                    className="w-full px-3 py-2 rounded-lg border text-sm"
                    style={{ background: 'var(--bg-primary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>输出变量</label>
                <input
                  type="text"
                  value={selectedNode.config.outputVar || 'retrieved_docs'}
                  onChange={(e) => updateNode(selectedNode.id, { config: { ...selectedNode.config, outputVar: e.target.value } })}
                  className="w-full px-3 py-2 rounded-lg border text-sm"
                  style={{ background: 'var(--bg-primary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                />
              </div>
            </>
          )}

          {selectedNode.type === 'model' && (
            <>
              <div>
                <label className="block text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>模型选择</label>
                <select
                  value={selectedNode.config.model || 'wenxin'}
                  onChange={(e) => updateNode(selectedNode.id, { config: { ...selectedNode.config, model: e.target.value } })}
                  className="w-full px-3 py-2 rounded-lg border text-sm"
                  style={{ background: 'var(--bg-primary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                >
                  <option value="wenxin">文心一言</option>
                  <option value="qwen">通义千问</option>
                  <option value="zhipu">智谱AI</option>
                  <option value="local">本地模型</option>
                </select>
              </div>
              <div>
                <label className="block text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>Temperature: {selectedNode.config.temperature || 0.7}</label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={selectedNode.config.temperature || 0.7}
                  onChange={(e) => updateNode(selectedNode.id, { config: { ...selectedNode.config, temperature: parseFloat(e.target.value) } })}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>输出变量</label>
                <input
                  type="text"
                  value={selectedNode.config.outputVar || 'model_output'}
                  onChange={(e) => updateNode(selectedNode.id, { config: { ...selectedNode.config, outputVar: e.target.value } })}
                  className="w-full px-3 py-2 rounded-lg border text-sm"
                  style={{ background: 'var(--bg-primary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                />
              </div>
            </>
          )}

          {selectedNode.type === 'tool' && (
            <>
              <div>
                <label className="block text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>工具类型</label>
                <select
                  value={selectedNode.config.toolType || 'api'}
                  onChange={(e) => updateNode(selectedNode.id, { config: { ...selectedNode.config, toolType: e.target.value } })}
                  className="w-full px-3 py-2 rounded-lg border text-sm"
                  style={{ background: 'var(--bg-primary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                >
                  <option value="api">API调用</option>
                  <option value="database">数据库查询</option>
                  <option value="function">函数执行</option>
                </select>
              </div>
              <div>
                <label className="block text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>API地址</label>
                <input
                  type="text"
                  value={selectedNode.config.endpoint || ''}
                  onChange={(e) => updateNode(selectedNode.id, { config: { ...selectedNode.config, endpoint: e.target.value } })}
                  placeholder="https://api.example.com/endpoint"
                  className="w-full px-3 py-2 rounded-lg border text-sm"
                  style={{ background: 'var(--bg-primary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                />
              </div>
              <div>
                <label className="block text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>输出变量</label>
                <input
                  type="text"
                  value={selectedNode.config.outputVar || 'tool_result'}
                  onChange={(e) => updateNode(selectedNode.id, { config: { ...selectedNode.config, outputVar: e.target.value } })}
                  className="w-full px-3 py-2 rounded-lg border text-sm"
                  style={{ background: 'var(--bg-primary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                />
              </div>
            </>
          )}

          {selectedNode.type === 'condition' && (
            <>
              <div>
                <label className="block text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>条件表达式</label>
                <input
                  type="text"
                  value={selectedNode.config.expression || ''}
                  onChange={(e) => updateNode(selectedNode.id, { config: { ...selectedNode.config, expression: e.target.value } })}
                  placeholder="{{user_input}} contains '紧急'"
                  className="w-full px-3 py-2 rounded-lg border text-sm font-mono"
                  style={{ background: 'var(--bg-primary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                />
              </div>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                使用 {'{{变量名}}'} 引用变量，支持 contains, equals, gt, lt 等操作
              </p>
            </>
          )}

          {selectedNode.type === 'output' && (
            <>
              <div>
                <label className="block text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>输出格式</label>
                <select
                  value={selectedNode.config.outputFormat || 'text'}
                  onChange={(e) => updateNode(selectedNode.id, { config: { ...selectedNode.config, outputFormat: e.target.value } })}
                  className="w-full px-3 py-2 rounded-lg border text-sm"
                  style={{ background: 'var(--bg-primary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                >
                  <option value="text">纯文本</option>
                  <option value="markdown">Markdown</option>
                  <option value="json">JSON</option>
                  <option value="html">HTML</option>
                </select>
              </div>
            </>
          )}

          <button
            onClick={() => deleteNode(selectedNode.id)}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-red-500 text-red-500 text-sm transition-all hover:bg-red-500/10"
          >
            <Trash2 className="w-4 h-4" />
            删除节点
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-[500px] rounded-xl border overflow-hidden" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
      <div className="w-48 border-r flex flex-col" style={{ borderColor: 'var(--border-color)' }}>
        <div className="p-3 border-b" style={{ borderColor: 'var(--border-color)' }}>
          <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>节点面板</span>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {nodeTypes.map(nodeType => {
            const Icon = nodeType.icon
            return (
              <div
                key={nodeType.type}
                draggable
                onDragStart={() => handleDragStart(nodeType.type)}
                className="flex items-center gap-2 p-2 rounded-lg cursor-grab border transition-all hover:border-opacity-50"
                style={{ 
                  background: 'var(--bg-primary)', 
                  borderColor: nodeType.color + '40'
                }}
              >
                <div className="p-1 rounded" style={{ background: nodeType.color + '20' }}>
                  <Icon className="w-4 h-4" style={{ color: nodeType.color }} />
                </div>
                <div>
                  <div className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>{nodeType.name}</div>
                  <div className="text-xs truncate" style={{ color: 'var(--text-secondary)' }}>{nodeType.description}</div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="border-t p-2 space-y-2" style={{ borderColor: 'var(--border-color)' }}>
          <div className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>变量</div>
          <div className="space-y-1">
            {(['input', 'intermediate', 'output'] as const).map(type => (
              <div key={type} className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs capitalize" style={{ color: 'var(--text-secondary)' }}>
                    {type === 'input' ? '输入' : type === 'intermediate' ? '中间' : '输出'}
                  </span>
                  <button
                    onClick={() => addVariable(type)}
                    className="p-0.5 rounded hover:bg-opacity-50"
                  >
                    <Plus className="w-3 h-3" style={{ color: 'var(--accent-primary)' }} />
                  </button>
                </div>
                {workflow.variables.filter(v => v.type === type).map(v => (
                  <div key={v.id} className="flex items-center gap-1">
                    <input
                      type="text"
                      value={v.name}
                      onChange={(e) => updateVariable(v.id, { name: e.target.value })}
                      className="flex-1 px-2 py-1 rounded text-xs border"
                      style={{ background: 'var(--bg-primary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                    />
                    <button onClick={() => deleteVariable(v.id)} className="p-0.5">
                      <X className="w-3 h-3 text-red-500" />
                    </button>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="flex items-center justify-between p-2 border-b" style={{ borderColor: 'var(--border-color)' }}>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowTemplates(!showTemplates)}
              className="flex items-center gap-1 px-2 py-1 rounded text-xs border transition-all"
              style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}
            >
              <Plus className="w-3 h-3" />
              模板
            </button>
            <button
              onClick={clearWorkflow}
              className="flex items-center gap-1 px-2 py-1 rounded text-xs border transition-all"
              style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}
            >
              <Trash2 className="w-3 h-3" />
              清空
            </button>
          </div>
          <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
            {workflow.nodes.length} 节点 | {workflow.edges.length} 连接
          </span>
        </div>

        {showTemplates && (
          <div className="p-2 border-b grid grid-cols-3 gap-2" style={{ borderColor: 'var(--border-color)' }}>
            {workflowTemplates.map((template, i) => (
              <button
                key={i}
                onClick={() => applyTemplate(template)}
                className="p-2 rounded-lg border text-left transition-all hover:border-opacity-50"
                style={{ background: 'var(--bg-primary)', borderColor: 'var(--border-color)' }}
              >
                <div className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>{template.name}</div>
                <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>{template.description}</div>
              </button>
            ))}
          </div>
        )}

        <div 
          className="flex-1 relative overflow-auto"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          style={{ background: 'var(--bg-primary)' }}
        >
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {workflow.edges.map(edge => {
              const source = workflow.nodes.find(n => n.id === edge.source)
              const target = workflow.nodes.find(n => n.id === edge.target)
              if (!source || !target) return null

              const x1 = source.position.x + 60
              const y1 = source.position.y + 20
              const x2 = target.position.x + 60
              const y2 = target.position.y + 20

              return (
                <g key={edge.id}>
                  <path
                    d={`M ${x1} ${y1} C ${x1 + 50} ${y1}, ${x2 - 50} ${y2}, ${x2} ${y2}`}
                    fill="none"
                    stroke="var(--accent-primary)"
                    strokeWidth="2"
                    className="cursor-pointer"
                    onClick={() => deleteEdge(edge.id)}
                  />
                  <circle cx={x2} cy={y2} r="4" fill="var(--accent-primary)" />
                </g>
              )
            })}
          </svg>

          {workflow.nodes.map(node => {
            const nodeType = nodeTypes.find(n => n.type === node.type)
            if (!nodeType) return null
            const Icon = nodeType.icon
            const style = getNodeStyle(node.type)

            return (
              <div
                key={node.id}
                onClick={() => setSelectedNode(node)}
                className={`absolute cursor-pointer rounded-lg border-2 p-2 min-w-[120px] transition-all ${
                  selectedNode?.id === node.id ? 'ring-2 ring-offset-2' : ''
                }`}
                style={{
                  left: node.position.x,
                  top: node.position.y,
                  ...style,
                  '--ring-color': nodeType.color,
                  '--ring-offset-color': 'var(--bg-primary)'
                } as React.CSSProperties}
              >
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4" style={{ color: nodeType.color }} />
                  <span className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>{node.name}</span>
                </div>
                {node.config.outputVar && (
                  <div className="text-xs mt-1 px-1 rounded" style={{ background: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}>
                    → {node.config.outputVar}
                  </div>
                )}
              </div>
            )
          })}

          {workflow.nodes.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>从左侧拖拽节点到此处开始设计流程</p>
                <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>或点击"模板"使用预置模板</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {selectedNode && (
        <div className="w-64 border-l overflow-y-auto" style={{ borderColor: 'var(--border-color)' }}>
          <div className="p-3">
            {renderNodeConfig()}
          </div>
        </div>
      )}
    </div>
  )
}
