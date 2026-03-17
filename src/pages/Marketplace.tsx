import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Search, 
  Star, 
  Users, 
  Clock,
  ChevronRight,
  Check,
  Plus,
  X,
  Layers,
  Shield,
  FolderKanban,
  AlertTriangle,
  BarChart3,
  Heart,
  Sparkles,
  PlayCircle,
  BookOpen,
  ExternalLink,
  Link2,
  FileText
} from 'lucide-react'
import { useFavorites } from '../contexts/FavoritesContext'

const categories = [
  { id: 'all', label: '全部', icon: Layers },
  { id: 'material', label: '材料生产', icon: FileText },
  { id: 'knowledge', label: '知识检索', icon: Search },
  { id: 'business', label: '业务协同', icon: Users },
  { id: 'data', label: '数据分析', icon: BarChart3 },
  { id: 'planning', label: '规划类', icon: Layers },
  { id: 'compliance', label: '合规类', icon: Shield },
  { id: 'project', label: '项目类', icon: FolderKanban },
  { id: 'emergency', label: '应急类', icon: AlertTriangle },
]

interface UseCase {
  title: string
  description: string
  result: string
}

interface Agent {
  id: string
  name: string
  description: string
  category: string
  icon: string
  color: string
  rating: number
  users: number
  tags: string[]
  subscribed: boolean
  features: string[]
  knowledgeBases: string[]
  useCases: UseCase[]
  recommended?: boolean
  externalUrl?: string
  isExternal?: boolean
}

const agents: Agent[] = [
  {
    id: '1',
    name: '交通分析智能体',
    description: '分析交通流量数据，识别拥堵热点，提供优化建议',
    category: 'data',
    icon: '🚦',
    color: 'from-cyan-500 to-blue-500',
    rating: 4.8,
    users: 128,
    tags: ['数据分析', '交通规划'],
    subscribed: true,
    features: ['流量分析', '拥堵识别', '优化建议'],
    knowledgeBases: ['交通法规知识库', '历史数据知识库'],
    recommended: true,
    useCases: [
      {
        title: '路段流量分析',
        description: '分析特定路段的交通流量数据，识别高峰时段和拥堵点',
        result: '生成流量分析报告，包含拥堵热力图和优化建议'
      },
      {
        title: '交通预测',
        description: '基于历史数据预测未来交通流量趋势',
        result: '输出未来一周的流量预测图表'
      },
      {
        title: '信号灯优化',
        description: '优化路口信号灯配时方案',
        result: '生成优化后的配时方案，预计提升通行效率15%'
      }
    ]
  },
  {
    id: '2',
    name: '合规检查智能体',
    description: '检查项目合规性，对标法规标准，生成合规报告',
    category: 'compliance',
    icon: '📋',
    color: 'from-purple-500 to-pink-500',
    rating: 4.6,
    users: 89,
    tags: ['合规检查', '法规对标'],
    subscribed: false,
    features: ['合规检查', '法规对标', '报告生成'],
    knowledgeBases: ['法规知识库'],
    recommended: true,
    useCases: [
      {
        title: '项目合规审查',
        description: '审查交通规划项目是否符合相关法规标准',
        result: '生成合规审查报告，标注风险点和整改建议'
      },
      {
        title: '法规对标分析',
        description: '将项目方案与最新法规进行对比分析',
        result: '输出对标分析表，显示符合项和不符合项'
      }
    ]
  },
  {
    id: '3',
    name: '报告生成智能体',
    description: '自动生成各类报告，支持多种模板格式',
    category: 'data',
    icon: '📊',
    color: 'from-green-500 to-emerald-500',
    rating: 4.9,
    users: 256,
    tags: ['报告生成', '文档处理'],
    subscribed: true,
    features: ['多模板支持', '自动排版', '数据可视化'],
    knowledgeBases: ['报告模板库'],
    recommended: false,
    useCases: [
      {
        title: '月度工作总结',
        description: '自动汇总月度工作数据，生成结构化报告',
        result: '生成包含图表、数据表格的Word格式报告'
      },
      {
        title: '项目进度报告',
        description: '跟踪项目进度，自动生成进度报告',
        result: '输出甘特图和进度分析报告'
      }
    ]
  },
  {
    id: '4',
    name: '应急响应智能体',
    description: '快速响应突发事件，生成处置方案',
    category: 'emergency',
    icon: '🚨',
    color: 'from-orange-500 to-red-500',
    rating: 4.7,
    users: 67,
    tags: ['应急响应', '事件处理'],
    subscribed: false,
    features: ['事件评估', '方案生成', '资源调度'],
    knowledgeBases: ['应急预案库', '历史案例库'],
    recommended: false,
    useCases: [
      {
        title: '交通事故处置',
        description: '快速评估事故影响，生成处置方案',
        result: '输出包含人员调度、交通疏导的完整方案'
      },
      {
        title: '应急预案启动',
        description: '根据事件类型匹配并启动相应预案',
        result: '生成预案执行清单和资源调配方案'
      }
    ]
  },
  {
    id: '5',
    name: '项目进度跟踪智能体',
    description: '跟踪项目进度，预警延期风险',
    category: 'project',
    icon: '📅',
    color: 'from-blue-500 to-indigo-500',
    rating: 4.5,
    users: 145,
    tags: ['项目管理', '进度跟踪'],
    subscribed: false,
    features: ['进度跟踪', '风险预警', '资源调配'],
    knowledgeBases: [],
    recommended: false,
    useCases: [
      {
        title: '项目进度监控',
        description: '实时监控项目进度，识别延期风险',
        result: '生成进度仪表盘和风险预警报告'
      }
    ]
  },
  {
    id: '6',
    name: '线路优化智能体',
    description: '优化公交线路，提升运营效率',
    category: 'planning',
    icon: '🗺️',
    color: 'from-teal-500 to-cyan-500',
    rating: 4.4,
    users: 52,
    tags: ['线路规划', '运营优化'],
    subscribed: false,
    features: ['线路分析', '优化建议', '效率评估'],
    knowledgeBases: ['线路数据知识库'],
    recommended: false,
    useCases: [
      {
        title: '公交线路优化',
        description: '分析客流数据，优化公交线路和班次',
        result: '输出优化方案和预期效益分析'
      }
    ]
  },
  {
    id: '7',
    name: '外部AI助手',
    description: '连接外部AI服务，提供通用智能对话能力',
    category: 'data',
    icon: '🤖',
    color: 'from-indigo-500 to-purple-500',
    rating: 4.3,
    users: 89,
    tags: ['外部服务', 'AI对话'],
    subscribed: false,
    features: ['通用对话', '知识问答', '文档处理'],
    knowledgeBases: [],
    recommended: false,
    isExternal: true,
    externalUrl: 'https://ai.example.com/chat',
    useCases: [
      {
        title: '通用问答',
        description: '回答各类通用问题',
        result: '提供准确的答案和相关建议'
      }
    ]
  },
  {
    id: 'material_1',
    name: '会议纪要生成',
    description: '对办公会、专题会、协调会等录音或转写内容自动生成纪要，提炼议定事项、责任科室、完成时限',
    category: 'material',
    icon: '📝',
    color: 'from-blue-500 to-cyan-500',
    rating: 4.9,
    users: 328,
    tags: ['材料生产', '会议纪要', '公文处理'],
    subscribed: false,
    features: ['录音转写', '要点提炼', '责任分配', '多格式输出'],
    knowledgeBases: ['局内纪要模板', '历史纪要', '科室职责清单'],
    recommended: true,
    useCases: [
      {
        title: '办公会纪要生成',
        description: '自动生成局办公会会议纪要',
        result: '输出正式版和简版纪要，包含议定事项和责任分工'
      },
      {
        title: '专题会纪要',
        description: '生成专题会议纪要',
        result: '输出结构化纪要，包含议题、讨论内容和决议'
      }
    ]
  },
  {
    id: 'material_2',
    name: '请示文与公文起草',
    description: '根据事项背景、问题、拟请示内容自动生成请示、报告、函、情况说明等公文初稿',
    category: 'material',
    icon: '📄',
    color: 'from-purple-500 to-pink-500',
    rating: 4.8,
    users: 256,
    tags: ['材料生产', '公文起草', '格式规范'],
    subscribed: false,
    features: ['公文模板', '格式规范', '审核要点提示'],
    knowledgeBases: ['公文模板', '历史优秀文稿', '常用口径库'],
    recommended: true,
    useCases: [
      {
        title: '请示起草',
        description: '生成请示公文初稿',
        result: '输出符合公文格式的请示文本'
      },
      {
        title: '报告起草',
        description: '生成情况报告初稿',
        result: '输出规范的情况报告文本'
      }
    ]
  },
  {
    id: 'material_3',
    name: '招标采购需求文件与合同编写',
    description: '根据采购事项、项目需求和历史范本，辅助编写需求文件、采购文件、合同文本',
    category: 'material',
    icon: '📋',
    color: 'from-green-500 to-emerald-500',
    rating: 4.7,
    users: 189,
    tags: ['材料生产', '采购管理', '合同编写'],
    subscribed: false,
    features: ['需求说明书', '招标文件', '合同文本', '合规审查'],
    knowledgeBases: ['采购模板', '合同范本', '历史采购项目材料'],
    useCases: [
      {
        title: '采购需求文件',
        description: '生成采购需求说明书',
        result: '输出完整的技术需求和规格说明'
      },
      {
        title: '合同文本编写',
        description: '生成合同初稿',
        result: '输出符合规范的合同文本'
      }
    ]
  },
  {
    id: 'material_4',
    name: '周报月报收口',
    description: '汇总各科室报送内容，自动去重、归类、统一格式，形成局级周报、月报',
    category: 'material',
    icon: '📊',
    color: 'from-orange-500 to-red-500',
    rating: 4.6,
    users: 312,
    tags: ['材料生产', '周报月报', '汇总统计'],
    subscribed: false,
    features: ['自动去重', '智能归类', '格式统一', '统计报表'],
    knowledgeBases: ['周报月报模板', '历史报送材料', '分类规则'],
    useCases: [
      {
        title: '周报汇总',
        description: '汇总各科室周报',
        result: '生成局级周报和重点事项清单'
      },
      {
        title: '月报收口',
        description: '汇总各科室月报',
        result: '生成局级月报和数据分析'
      }
    ]
  },
  {
    id: 'material_5',
    name: '公文审核校对',
    description: '对已形成公文进行错别字、格式、逻辑、政策依据、表述风险检查',
    category: 'material',
    icon: '✅',
    color: 'from-teal-500 to-cyan-500',
    rating: 4.8,
    users: 421,
    tags: ['材料生产', '公文审核', '质量检查'],
    subscribed: false,
    features: ['错别字检查', '格式规范', '逻辑审核', '风险预警'],
    knowledgeBases: ['公文规范', '局内行文要求', '政策文件库'],
    recommended: true,
    useCases: [
      {
        title: '公文审核',
        description: '全面审核公文内容',
        result: '输出审核报告和修改建议'
      }
    ]
  },
  {
    id: 'material_6',
    name: '会议材料提纲自动生成',
    description: '根据会议主题、现有材料及历史模板，快速生成会议材料提纲和汇报框架',
    category: 'material',
    icon: '📑',
    color: 'from-indigo-500 to-purple-500',
    rating: 4.5,
    users: 178,
    tags: ['材料生产', '提纲生成', '汇报材料'],
    subscribed: false,
    features: ['提纲生成', '框架设计', '要点提取', '时长建议'],
    knowledgeBases: ['会议通知', '历史会议材料', '汇报模板'],
    useCases: [
      {
        title: '汇报提纲生成',
        description: '生成领导汇报材料提纲',
        result: '输出完整的汇报框架和要点目录'
      }
    ]
  },
  {
    id: 'material_7',
    name: '领导汇报PPT编制',
    description: '根据会议主题、已有文稿自动生成PPT目录、页标题、核心观点和正文要点',
    category: 'material',
    icon: '📈',
    color: 'from-cyan-500 to-blue-500',
    rating: 4.7,
    users: 234,
    tags: ['材料生产', 'PPT制作', '汇报演示'],
    subscribed: false,
    features: ['目录结构', '页标题设计', '图表建议', '演讲要点'],
    knowledgeBases: ['历史汇报PPT', '重点项目资料', '年度重点工作清单'],
    useCases: [
      {
        title: 'PPT大纲生成',
        description: '生成汇报PPT大纲',
        result: '输出PPT结构和每页核心内容'
      }
    ]
  },
  {
    id: 'material_8',
    name: '年度总结与述职材料编制',
    description: '基于全年周报、纪要、台账自动形成年度总结、述职材料、亮点成效',
    category: 'material',
    icon: '📋',
    color: 'from-yellow-500 to-orange-500',
    rating: 4.6,
    users: 156,
    tags: ['材料生产', '年度总结', '述职报告'],
    subscribed: false,
    features: ['亮点提炼', '问题分析', '计划制定'],
    knowledgeBases: ['年度任务清单', '周月报', '历史总结范文'],
    useCases: [
      {
        title: '年度总结',
        description: '生成年度工作总结',
        result: '输出包含亮点和问题的总结报告'
      },
      {
        title: '述职报告',
        description: '生成述职报告',
        result: '输出结构化述职材料'
      }
    ]
  },
  {
    id: 'material_9',
    name: 'OA通讯稿自动生成',
    description: '针对会议、调研、学习等活动，自动生成OA通讯稿或信息稿',
    category: 'material',
    icon: '📰',
    color: 'from-pink-500 to-rose-500',
    rating: 4.4,
    users: 198,
    tags: ['材料生产', '通讯稿', '宣传文案'],
    subscribed: false,
    features: ['多风格支持', '自动排版', '模板匹配'],
    knowledgeBases: ['历史OA通讯稿', '宣传信息稿', '典型活动材料'],
    useCases: [
      {
        title: '会议通讯稿',
        description: '生成会议通讯稿',
        result: '输出规范的OA通讯稿'
      }
    ]
  },
  {
    id: 'material_10',
    name: '年报/简报编制',
    description: '面向年度工作报告、阶段性专报、专项简报等，自动汇总各类材料',
    category: 'material',
    icon: '📚',
    color: 'from-violet-500 to-purple-500',
    rating: 4.5,
    users: 167,
    tags: ['材料生产', '年报编制', '简报生成'],
    subscribed: false,
    features: ['多类型支持', '数据统计', '格式规范'],
    knowledgeBases: ['历史年报', '简报模板', '任务台账'],
    useCases: [
      {
        title: '年度报告',
        description: '生成年度工作报告',
        result: '输出完整的年度工作报告'
      },
      {
        title: '专报生成',
        description: '生成专项简报',
        result: '输出专项工作简报'
      }
    ]
  },
  {
    id: 'material_11',
    name: '领导讲话稿与发言提纲',
    description: '根据会议主题和近期工作自动生成讲话稿、发言提纲、对上汇报口径',
    category: 'material',
    icon: '🎤',
    color: 'from-red-500 to-pink-500',
    rating: 4.7,
    users: 145,
    tags: ['材料生产', '讲话稿', '发言提纲'],
    subscribed: false,
    features: ['讲话稿生成', '要点提炼', '口语化表达'],
    knowledgeBases: ['历史讲话稿', '专题汇报材料', '近期重点工作信息'],
    useCases: [
      {
        title: '讲话稿生成',
        description: '生成领导讲话稿',
        result: '输出完整的讲话稿文本'
      }
    ]
  },
  {
    id: 'material_12',
    name: '报会办会材料生成与通知辅助',
    description: '定期收集议题，结合会议流程、函件和以往模板，自动生成报会材料、会议通知',
    category: 'material',
    icon: '🏢',
    color: 'from-slate-500 to-gray-500',
    rating: 4.3,
    users: 123,
    tags: ['材料生产', '会议材料', '通知生成'],
    subscribed: false,
    features: ['材料生成', '通知编写', '议程安排'],
    knowledgeBases: ['会议流程', '会务模板', '历史报会材料'],
    useCases: [
      {
        title: '报会材料生成',
        description: '生成报会材料',
        result: '输出完整的报会材料'
      },
      {
        title: '会议通知',
        description: '生成会议通知',
        result: '输出规范的通知文本'
      }
    ]
  },
  {
    id: 'knowledge_1',
    name: '历史会议纪要检索',
    description: '按项目名、事项名、道路名、企业名、时间等检索历史纪要，快速回答以前怎么定的',
    category: 'knowledge',
    icon: '🔍',
    color: 'from-blue-600 to-indigo-600',
    rating: 4.9,
    users: 567,
    tags: ['知识检索', '历史查询', '纪要检索'],
    subscribed: false,
    features: ['关键词检索', '高级筛选', '自然语言查询', '原文引用'],
    knowledgeBases: ['历史会议纪要', '会议通知', '督办单'],
    recommended: true,
    useCases: [
      {
        title: '历史纪要查询',
        description: '检索历史会议纪要',
        result: '返回相关纪要列表和原文引用'
      }
    ]
  },
  {
    id: 'knowledge_2',
    name: '政策法规问答',
    description: '围绕交通及相关领域法规、规范性文件、上级政策开展问答，输出依据条文和出处',
    category: 'knowledge',
    icon: '⚖️',
    color: 'from-amber-500 to-yellow-500',
    rating: 4.8,
    users: 432,
    tags: ['知识检索', '政策法规', '问答系统'],
    subscribed: false,
    features: ['智能问答', '条文引用', '政策解读', '相关推荐'],
    knowledgeBases: ['法律法规', '规范性文件', '上级政策文件'],
    recommended: true,
    useCases: [
      {
        title: '政策咨询',
        description: '咨询相关政策法规',
        result: '返回答案和相关条文依据'
      }
    ]
  },
  {
    id: 'knowledge_3',
    name: '局内制度流程问答',
    description: '对发文、请示、采购、合同等内部流程开展问答式导航',
    category: 'knowledge',
    icon: '📋',
    color: 'from-emerald-500 to-teal-500',
    rating: 4.7,
    users: 389,
    tags: ['知识检索', '流程问答', '制度查询'],
    subscribed: false,
    features: ['流程导航', '材料清单', '时限提醒', '模板推荐'],
    knowledgeBases: ['局内制度文件', '流程文件', '表单模板'],
    useCases: [
      {
        title: '流程咨询',
        description: '咨询业务流程',
        result: '返回流程步骤和所需材料'
      }
    ]
  },
  {
    id: 'knowledge_4',
    name: '历史材料复用',
    description: '检索历史请示、报告、讲话稿等，提取可复用结构、段落和规范表达',
    category: 'knowledge',
    icon: '📂',
    color: 'from-orange-500 to-amber-500',
    rating: 4.6,
    users: 234,
    tags: ['知识检索', '材料复用', '历史参考'],
    subscribed: false,
    features: ['结构提取', '段落推荐', '规范表达', '写作建议'],
    knowledgeBases: ['历史文稿库', '材料模板库'],
    useCases: [
      {
        title: '材料参考',
        description: '查找可复用的历史材料',
        result: '返回可复用的结构和段落'
      }
    ]
  },
  {
    id: 'knowledge_5',
    name: '单项目资料问答',
    description: '围绕某一重点项目建立专属知识库，查询项目背景、历次协调意见、时间线',
    category: 'knowledge',
    icon: '🗂️',
    color: 'from-cyan-500 to-sky-500',
    rating: 4.5,
    users: 178,
    tags: ['知识检索', '项目查询', '资料管理'],
    subscribed: false,
    features: ['项目背景', '协调意见', '时间线', '问题清单'],
    knowledgeBases: ['项目全周期资料'],
    useCases: [
      {
        title: '项目查询',
        description: '查询项目相关资料',
        result: '返回项目背景和历史资料'
      }
    ]
  },
  {
    id: 'business_1',
    name: '信访舆情自动筛选分发与答复辅助',
    description: '对信访舆情事项进行自动筛选、分类分发、转办，生成答复初稿',
    category: 'business',
    icon: '📨',
    color: 'from-red-500 to-rose-500',
    rating: 4.8,
    users: 156,
    tags: ['业务协同', '信访处理', '舆情管理'],
    subscribed: false,
    features: ['自动筛选', '分类分发', '答复生成', '风险提示'],
    knowledgeBases: ['历史信访件', '舆情案例', '答复口径'],
    recommended: true,
    useCases: [
      {
        title: '信访件处理',
        description: '处理信访件并生成答复',
        result: '输出分类结果和答复初稿'
      }
    ]
  },
  {
    id: 'business_2',
    name: '人大建议和政协提案处置辅助',
    description: '对人大建议、政协提案进行自动筛选分发、转办，生成答复初稿',
    category: 'business',
    icon: '🏛️',
    color: 'from-purple-500 to-violet-500',
    rating: 4.7,
    users: 134,
    tags: ['业务协同', '建议提案', '办理辅助'],
    subscribed: false,
    features: ['筛选分发', '要点提取', '答复生成', '质量评估'],
    knowledgeBases: ['历史建议提案', '历年答复材料', '办理规范'],
    useCases: [
      {
        title: '提案办理',
        description: '辅助办理人大建议政协提案',
        result: '输出办理建议和答复初稿'
      }
    ]
  },
  {
    id: 'business_3',
    name: '督办事项分解与跟踪',
    description: '从纪要、公文、批示件中抽取待办事项，自动生成责任台账和时间节点',
    category: 'business',
    icon: '🎯',
    color: 'from-yellow-500 to-orange-500',
    rating: 4.9,
    users: 289,
    tags: ['业务协同', '督办管理', '任务跟踪'],
    subscribed: false,
    features: ['事项抽取', '责任分配', '时间节点', '进展汇总'],
    knowledgeBases: ['纪要', '公文', '批示件', '督办台账'],
    recommended: true,
    useCases: [
      {
        title: '督办分解',
        description: '分解督办事项',
        result: '输出待办清单和责任分工'
      }
    ]
  },
  {
    id: 'business_4',
    name: '外业踏勘前内业支撑',
    description: '针对道路、停车、设施等外业任务，自动汇总项目背景、历史问题、踏勘重点',
    category: 'business',
    icon: '🛣️',
    color: 'from-green-500 to-emerald-500',
    rating: 4.6,
    users: 178,
    tags: ['业务协同', '外业支撑', '踏勘辅助'],
    subscribed: false,
    features: ['背景汇总', '问题清单', '重点提取', '检查表'],
    knowledgeBases: ['历史项目资料', '投诉工单', '设施基础资料'],
    useCases: [
      {
        title: '踏勘准备',
        description: '生成踏勘准备资料',
        result: '输出项目背景和检查清单'
      }
    ]
  },
  {
    id: 'business_5',
    name: '建设项目台账管理与进展报告',
    description: '对建设项目进展情况进行动态跟踪，自动汇总形成阶段性进展报告',
    category: 'business',
    icon: '🏗️',
    color: 'from-blue-500 to-indigo-500',
    rating: 4.5,
    users: 234,
    tags: ['业务协同', '项目管理', '进度跟踪'],
    subscribed: false,
    features: ['台账管理', '进展汇总', '问题清单', '预警提醒'],
    knowledgeBases: ['建设项目台账', '进度报送材料', '会议纪要'],
    useCases: [
      {
        title: '项目进展报告',
        description: '生成项目进展报告',
        result: '输出进展报告和问题清单'
      }
    ]
  },
  {
    id: 'business_6',
    name: '领导批示件办理辅助',
    description: '对领导批示内容进行解析，生成办理建议、背景材料、回复口径',
    category: 'business',
    icon: '📌',
    color: 'from-pink-500 to-rose-500',
    rating: 4.4,
    users: 145,
    tags: ['业务协同', '批示办理', '跟踪反馈'],
    subscribed: false,
    features: ['批示解析', '办理建议', '背景材料', '回复口径'],
    knowledgeBases: ['批示件', '项目背景材料', '历史办理稿'],
    useCases: [
      {
        title: '批示办理',
        description: '辅助办理领导批示',
        result: '输出办理建议和回复口径'
      }
    ]
  },
  {
    id: 'business_7',
    name: '专项工作专班协同',
    description: '围绕专项任务汇总材料，形成专报、问题清单和阶段性进展',
    category: 'business',
    icon: '👥',
    color: 'from-indigo-500 to-blue-500',
    rating: 4.3,
    users: 123,
    tags: ['业务协同', '专项工作', '专班协同'],
    subscribed: false,
    features: ['材料汇总', '专报生成', '问题清单', '任务分工'],
    knowledgeBases: ['专班材料', '阶段台账', '会议纪要'],
    useCases: [
      {
        title: '专班工作汇总',
        description: '汇总专班工作材料',
        result: '输出专报和问题清单'
      }
    ]
  },
  {
    id: 'business_8',
    name: '新人入职与岗位辅导',
    description: '回答岗位职责、常见工作、流程要求、模板使用和注意事项',
    category: 'business',
    icon: '👋',
    color: 'from-teal-500 to-cyan-500',
    rating: 4.8,
    users: 456,
    tags: ['业务协同', '新人辅导', '岗位培训'],
    subscribed: false,
    features: ['岗位说明', '工作指南', '流程图解', '常见问题'],
    knowledgeBases: ['岗位手册', '制度流程', '模板和案例'],
    recommended: true,
    useCases: [
      {
        title: '入职辅导',
        description: '回答新人入职问题',
        result: '返回岗位说明和工作指南'
      }
    ]
  },
  {
    id: 'data_1',
    name: '固投台账报表自动生成',
    description: '结合固投任务目标及项目投资计划，自动生成固投进展报告',
    category: 'data',
    icon: '📈',
    color: 'from-green-600 to-emerald-600',
    rating: 4.7,
    users: 189,
    tags: ['数据分析', '固投管理', '报表生成'],
    subscribed: false,
    features: ['进展报告', '进度对比', '异常提醒', '图表展示'],
    knowledgeBases: ['固投任务目标', '投资计划', '历史报表'],
    useCases: [
      {
        title: '固投报表',
        description: '生成固投进展报表',
        result: '输出包含图表的进展报告'
      }
    ]
  },
  {
    id: 'data_2',
    name: '研究项目台账报表与节点提醒',
    description: '围绕研究项目进度计划、支付情况，自动生成项目台账报表并开展节点提醒',
    category: 'data',
    icon: '🔬',
    color: 'from-purple-500 to-violet-500',
    rating: 4.6,
    users: 145,
    tags: ['数据分析', '项目管理', '节点提醒'],
    subscribed: false,
    features: ['台账报表', '节点提醒', '支付计划', '查重参考'],
    knowledgeBases: ['研究项目台账', '合同信息', '支付计划'],
    useCases: [
      {
        title: '项目台账',
        description: '生成研究项目台账',
        result: '输出项目台账和提醒'
      }
    ]
  },
  {
    id: 'data_3',
    name: '数据分析与图表说明',
    description: '根据Excel表、统计报表自动生成同比环比分析、图表说明和结论摘要',
    category: 'data',
    icon: '📊',
    color: 'from-cyan-500 to-blue-500',
    rating: 4.8,
    users: 367,
    tags: ['数据分析', '图表生成', '统计分析'],
    subscribed: false,
    features: ['数据分析', '图表生成', '同比环比', '结论摘要'],
    knowledgeBases: ['指标说明', '历史报表'],
    recommended: true,
    useCases: [
      {
        title: '数据分析',
        description: '分析上传的数据',
        result: '输出分析报告和图表'
      }
    ]
  },
]

const recommendedForUser = [
  { reason: '基于您的部门（交通规划部）', agentId: '1' },
  { reason: '本周热门推荐', agentId: '3' },
  { reason: '与您的历史使用相关', agentId: '2' },
]

interface NewAgentForm {
  name: string
  description: string
  category: string
  icon: string
  externalUrl: string
  tags: string
  features: string
}

export default function Marketplace() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')
  const [activeFilter, setActiveFilter] = useState<'all' | 'subscribed' | 'recommended' | 'favorites'>('all')
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null)
  const [showUseCases, setShowUseCases] = useState(false)
  const [showAddAgent, setShowAddAgent] = useState(false)
  const [newAgent, setNewAgent] = useState<NewAgentForm>({
    name: '',
    description: '',
    category: 'data',
    icon: '🤖',
    externalUrl: '',
    tags: '',
    features: ''
  })
  const [customAgents, setCustomAgents] = useState<Agent[]>(() => {
    const saved = localStorage.getItem('customAgents')
    return saved ? JSON.parse(saved) : []
  })
  const { addFavorite, removeFavorite, isFavorite } = useFavorites()

  useEffect(() => {
    localStorage.setItem('customAgents', JSON.stringify(customAgents))
  }, [customAgents])

  const allAgents = [...agents, ...customAgents]

  const filteredAgents = allAgents.filter(agent => {
    const matchesSearch = agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          agent.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = activeCategory === 'all' || agent.category === activeCategory
    let matchesFilter = true
    if (activeFilter === 'subscribed') matchesFilter = agent.subscribed
    if (activeFilter === 'recommended') matchesFilter = agent.recommended || false
    if (activeFilter === 'favorites') matchesFilter = isFavorite(agent.id)
    return matchesSearch && matchesCategory && matchesFilter
  })

  const handleSubscribe = (agentId: string) => {
    console.log('Subscribe:', agentId)
  }

  const handleFavorite = (agent: Agent) => {
    if (isFavorite(agent.id)) {
      removeFavorite(agent.id)
    } else {
      addFavorite({ id: agent.id, name: agent.name, icon: agent.icon, color: agent.color })
    }
  }

  const handleUse = (agent: Agent) => {
    if (agent.isExternal && agent.externalUrl) {
      window.open(agent.externalUrl, '_blank')
    } else {
      const workspaceUrl = `${window.location.origin}/workspace/${agent.id}`
      window.open(workspaceUrl, '_blank')
    }
  }

  const handleAddAgent = () => {
    if (!newAgent.name || !newAgent.externalUrl) return

    const agent: Agent = {
      id: `custom-${Date.now()}`,
      name: newAgent.name,
      description: newAgent.description,
      category: newAgent.category,
      icon: newAgent.icon,
      color: 'from-gray-500 to-slate-500',
      rating: 0,
      users: 0,
      tags: newAgent.tags.split(',').map(t => t.trim()).filter(Boolean),
      subscribed: false,
      features: newAgent.features.split(',').map(f => f.trim()).filter(Boolean),
      knowledgeBases: [],
      isExternal: true,
      externalUrl: newAgent.externalUrl,
      useCases: []
    }

    setCustomAgents(prev => [...prev, agent])
    setNewAgent({
      name: '',
      description: '',
      category: 'data',
      icon: '🤖',
      externalUrl: '',
      tags: '',
      features: ''
    })
    setShowAddAgent(false)
  }

  const iconOptions = ['🤖', '🚀', '⚡', '🎯', '💡', '🔧', '📊', '🧠', '🔮', '🌟']

  return (
    <div className="h-full p-8 overflow-auto">
      <div className="max-w-7xl mx-auto space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="font-display text-3xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>智能体超市</h1>
            <p style={{ color: 'var(--text-secondary)' }}>发现并订阅适合您工作需求的智能体</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
              <span className="font-mono" style={{ color: 'var(--accent-primary)' }}>{allAgents.length}</span>
              <span>个智能体可用</span>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowAddAgent(true)}
              className="cyber-button-primary flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>上架智能体</span>
            </motion.button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-panel p-4"
        >
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: 'var(--text-muted)' }} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜索智能体..."
                className="input-cyber pl-12"
              />
            </div>
            
            <div className="flex items-center gap-2">
              {[
                { id: 'all', label: '全部' },
                { id: 'subscribed', label: '已订阅' },
                { id: 'favorites', label: '收藏', icon: Heart },
                { id: 'recommended', label: '推荐', icon: Sparkles },
              ].map((filter) => (
                <motion.button
                  key={filter.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveFilter(filter.id as typeof activeFilter)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all`}
                  style={{
                    background: activeFilter === filter.id ? 'rgba(0, 229, 255, 0.1)' : 'rgba(255,255,255,0.05)',
                    border: activeFilter === filter.id ? '1px solid var(--border-hover)' : '1px solid var(--border-color)',
                    color: activeFilter === filter.id ? 'var(--accent-primary)' : 'var(--text-secondary)'
                  }}
                >
                  {'icon' in filter && filter.icon && <filter.icon className="w-4 h-4" />}
                  <span>{filter.label}</span>
                </motion.button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 mt-4">
            {categories.map((category) => (
              <motion.button
                key={category.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveCategory(category.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all`}
                style={{
                  background: activeCategory === category.id ? 'rgba(0, 229, 255, 0.1)' : 'rgba(255,255,255,0.05)',
                  border: activeCategory === category.id ? '1px solid var(--border-hover)' : '1px solid var(--border-color)',
                  color: activeCategory === category.id ? 'var(--accent-primary)' : 'var(--text-secondary)'
                }}
              >
                <category.icon className="w-4 h-4" />
                <span>{category.label}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {activeFilter === 'recommended' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel p-4"
          >
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4" style={{ color: 'var(--accent-primary)' }} />
              <span className="font-medium" style={{ color: 'var(--text-primary)' }}>为您推荐</span>
            </div>
            <div className="space-y-2">
              {recommendedForUser.map((rec, index) => {
                const agent = allAgents.find(a => a.id === rec.agentId)
                if (!agent) return null
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-3 rounded-lg"
                    style={{ background: 'rgba(255,255,255,0.05)' }}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${agent.color} flex items-center justify-center text-lg`}>
                        {agent.icon}
                      </div>
                      <div>
                        <div className="font-medium" style={{ color: 'var(--text-primary)' }}>{agent.name}</div>
                        <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{rec.reason}</div>
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedAgent(agent)}
                      className="cyber-button text-xs"
                    >
                      查看详情
                    </motion.button>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-3 gap-4">
          <AnimatePresence mode="popLayout">
            {filteredAgents.map((agent, index) => (
              <motion.div
                key={agent.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.02, y: -5 }}
                onClick={() => setSelectedAgent(agent)}
                className="glass-card p-5 cursor-pointer group relative"
              >
                {agent.recommended && (
                  <div className="absolute top-3 right-3">
                    <Sparkles className="w-4 h-4" style={{ color: 'var(--accent-primary)' }} />
                  </div>
                )}
                
                {agent.isExternal && (
                  <div className="absolute top-3 left-3">
                    <ExternalLink className="w-4 h-4" style={{ color: 'var(--accent-secondary)' }} />
                  </div>
                )}
                
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${agent.color} flex items-center justify-center text-2xl group-hover:scale-110 transition-transform`}>
                    {agent.icon}
                  </div>
                  <div className="flex items-center gap-2">
                    {agent.subscribed && (
                      <div className="flex items-center gap-1 px-2 py-1 rounded-full text-xs" style={{ background: 'rgba(34, 197, 94, 0.2)', color: '#22c55e' }}>
                        <Check className="w-3 h-3" />
                        <span>已订阅</span>
                      </div>
                    )}
                    <motion.button
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => {
                        e.stopPropagation()
                        handleFavorite(agent)
                      }}
                      className="p-1.5 rounded-lg transition-colors"
                      style={{ 
                        background: isFavorite(agent.id) ? 'rgba(239, 68, 68, 0.2)' : 'rgba(255,255,255,0.05)'
                      }}
                    >
                      <Heart className={`w-4 h-4 ${isFavorite(agent.id) ? 'fill-red-500 text-red-500' : ''}`} style={{ color: isFavorite(agent.id) ? '#ef4444' : 'var(--text-muted)' }} />
                    </motion.button>
                  </div>
                </div>

                <h3 className="font-display font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                  {agent.name}
                  {agent.isExternal && <span className="ml-2 text-xs" style={{ color: 'var(--accent-secondary)' }}>(外部)</span>}
                </h3>
                <p className="text-sm mb-4 line-clamp-2" style={{ color: 'var(--text-secondary)' }}>{agent.description}</p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {agent.tags.map((tag) => (
                    <span key={tag} className="tag-cyber">{tag}</span>
                  ))}
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-4" style={{ color: 'var(--text-muted)' }}>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span>{agent.rating}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>{agent.users}</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-all" style={{ color: 'var(--text-muted)' }} />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {selectedAgent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-8"
            onClick={() => setSelectedAgent(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-panel p-8 max-w-3xl w-full max-h-[85vh] overflow-auto"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${selectedAgent.color} flex items-center justify-center text-3xl`}>
                    {selectedAgent.icon}
                  </div>
                  <div>
                    <h2 className="font-display text-2xl font-bold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                      {selectedAgent.name}
                      {selectedAgent.isExternal && (
                        <span className="text-xs px-2 py-1 rounded-full" style={{ background: 'rgba(123, 97, 255, 0.2)', color: 'var(--accent-secondary)' }}>
                          外部服务
                        </span>
                      )}
                    </h2>
                    <div className="flex items-center gap-4 mt-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <span>{selectedAgent.rating}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{selectedAgent.users} 人使用</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>2024-01-15 更新</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleFavorite(selectedAgent)}
                    className="p-2 rounded-lg transition-colors"
                    style={{ background: isFavorite(selectedAgent.id) ? 'rgba(239, 68, 68, 0.2)' : 'rgba(255,255,255,0.05)' }}
                  >
                    <Heart className={`w-5 h-5 ${isFavorite(selectedAgent.id) ? 'fill-red-500' : ''}`} style={{ color: isFavorite(selectedAgent.id) ? '#ef4444' : 'var(--text-muted)' }} />
                  </motion.button>
                  <button
                    onClick={() => setSelectedAgent(null)}
                    className="p-2 rounded-lg transition-colors"
                    style={{ background: 'rgba(255,255,255,0.05)' }}
                  >
                    <X className="w-5 h-5" style={{ color: 'var(--text-muted)' }} />
                  </button>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>功能介绍</h3>
                  <p style={{ color: 'var(--text-primary)' }}>{selectedAgent.description}</p>
                </div>

                {selectedAgent.externalUrl && (
                  <div>
                    <h3 className="text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>服务地址</h3>
                    <div className="flex items-center gap-2 p-3 rounded-lg" style={{ background: 'rgba(255,255,255,0.05)' }}>
                      <Link2 className="w-4 h-4" style={{ color: 'var(--accent-primary)' }} />
                      <span className="text-sm font-mono" style={{ color: 'var(--text-secondary)' }}>{selectedAgent.externalUrl}</span>
                    </div>
                  </div>
                )}

                {selectedAgent.features.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>核心功能</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedAgent.features.map((feature) => (
                        <span key={feature} className="tag-cyber">{feature}</span>
                      ))}
                    </div>
                  </div>
                )}

                {selectedAgent.useCases.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>使用案例</h3>
                      <button
                        onClick={() => setShowUseCases(!showUseCases)}
                        className="text-xs flex items-center gap-1"
                        style={{ color: 'var(--accent-primary)' }}
                      >
                        <BookOpen className="w-3 h-3" />
                        {showUseCases ? '收起' : '展开全部'}
                      </button>
                    </div>
                    <div className="space-y-3">
                      {(showUseCases ? selectedAgent.useCases : selectedAgent.useCases.slice(0, 2)).map((useCase, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="p-4 rounded-xl border"
                          style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'var(--border-color)' }}
                        >
                          <div className="flex items-start gap-3">
                            <div className="p-2 rounded-lg" style={{ background: 'rgba(0, 229, 255, 0.1)' }}>
                              <PlayCircle className="w-4 h-4" style={{ color: 'var(--accent-primary)' }} />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium mb-1" style={{ color: 'var(--text-primary)' }}>{useCase.title}</h4>
                              <p className="text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>{useCase.description}</p>
                              <div className="flex items-center gap-2 text-xs">
                                <span style={{ color: 'var(--text-muted)' }}>输出结果：</span>
                                <span style={{ color: 'var(--accent-primary)' }}>{useCase.result}</span>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedAgent.knowledgeBases.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>关联知识库</h3>
                    <div className="space-y-2">
                      {selectedAgent.knowledgeBases.map((kb) => (
                        <div key={kb} className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ background: 'rgba(255,255,255,0.05)' }}>
                          <Layers className="w-4 h-4" style={{ color: 'var(--accent-secondary)' }} />
                          <span className="text-sm" style={{ color: 'var(--text-primary)' }}>{kb}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-4 pt-4 border-t" style={{ borderColor: 'var(--border-color)' }}>
                  {selectedAgent.subscribed ? (
                    <>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleUse(selectedAgent)}
                        className="flex-1 cyber-button-primary flex items-center justify-center gap-2"
                      >
                        {selectedAgent.isExternal ? <ExternalLink className="w-4 h-4" /> : null}
                        <span>{selectedAgent.isExternal ? '打开外部服务' : '立即使用'}</span>
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="cyber-button flex items-center justify-center gap-2"
                      >
                        <Check className="w-4 h-4" />
                        已订阅
                      </motion.button>
                    </>
                  ) : (
                    <>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleSubscribe(selectedAgent.id)}
                        className="flex-1 cyber-button flex items-center justify-center gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        订阅智能体
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleUse(selectedAgent)}
                        className="cyber-button-primary flex items-center justify-center gap-2"
                      >
                        {selectedAgent.isExternal ? <ExternalLink className="w-4 h-4" /> : null}
                        <span>{selectedAgent.isExternal ? '打开外部服务' : '立即使用'}</span>
                      </motion.button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
              className="glass-panel p-8 max-w-xl w-full max-h-[85vh] overflow-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="font-display text-xl font-bold" style={{ color: 'var(--text-primary)' }}>上架智能体</h2>
                  <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>通过配置链接将外部智能体服务上架到超市</p>
                </div>
                <button
                  onClick={() => setShowAddAgent(false)}
                  className="p-2 rounded-lg transition-colors"
                  style={{ background: 'rgba(255,255,255,0.05)' }}
                >
                  <X className="w-5 h-5" style={{ color: 'var(--text-muted)' }} />
                </button>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                    智能体名称 <span style={{ color: 'var(--accent-primary)' }}>*</span>
                  </label>
                  <input
                    type="text"
                    value={newAgent.name}
                    onChange={(e) => setNewAgent(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="输入智能体名称"
                    className="input-cyber"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                    服务链接 <span style={{ color: 'var(--accent-primary)' }}>*</span>
                  </label>
                  <div className="relative">
                    <Link2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: 'var(--text-muted)' }} />
                    <input
                      type="url"
                      value={newAgent.externalUrl}
                      onChange={(e) => setNewAgent(prev => ({ ...prev, externalUrl: e.target.value }))}
                      placeholder="https://example.com/agent"
                      className="input-cyber pl-12"
                    />
                  </div>
                  <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>智能体服务的访问地址，将在新窗口中打开</p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>描述</label>
                  <textarea
                    value={newAgent.description}
                    onChange={(e) => setNewAgent(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="输入智能体功能描述"
                    rows={3}
                    className="input-cyber resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>分类</label>
                    <select
                      value={newAgent.category}
                      onChange={(e) => setNewAgent(prev => ({ ...prev, category: e.target.value }))}
                      className="input-cyber"
                    >
                      <option value="planning">规划类</option>
                      <option value="compliance">合规类</option>
                      <option value="project">项目类</option>
                      <option value="emergency">应急类</option>
                      <option value="data">数据类</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>图标</label>
                    <div className="flex flex-wrap gap-2">
                      {iconOptions.map((icon) => (
                        <button
                          key={icon}
                          onClick={() => setNewAgent(prev => ({ ...prev, icon }))}
                          className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl transition-all`}
                          style={{
                            background: newAgent.icon === icon ? 'rgba(0, 229, 255, 0.2)' : 'rgba(255,255,255,0.05)',
                            border: newAgent.icon === icon ? '1px solid var(--border-hover)' : '1px solid var(--border-color)'
                          }}
                        >
                          {icon}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>标签</label>
                  <input
                    type="text"
                    value={newAgent.tags}
                    onChange={(e) => setNewAgent(prev => ({ ...prev, tags: e.target.value }))}
                    placeholder="数据分析, 报告生成（用逗号分隔）"
                    className="input-cyber"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>功能特性</label>
                  <input
                    type="text"
                    value={newAgent.features}
                    onChange={(e) => setNewAgent(prev => ({ ...prev, features: e.target.value }))}
                    placeholder="功能1, 功能2, 功能3（用逗号分隔）"
                    className="input-cyber"
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowAddAgent(false)}
                  className="cyber-button"
                >
                  取消
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAddAgent}
                  disabled={!newAgent.name || !newAgent.externalUrl}
                  className="cyber-button-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  上架智能体
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
