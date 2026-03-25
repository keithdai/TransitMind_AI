export interface DemoScenario {
  id: string
  title: string
  userInput: string
  agentResponse: string
  highlights: string[]
}

export interface Agent {
  id: string
  name: string
  description: string
  category: string
  categoryName: string
  icon: string
  color: string
  rating: number
  users: number
  tags: string[]
  subscribed: boolean
  features: string[]
  knowledgeBases: string[]
  recommended: boolean
  phase: 'MVP' | 'T2'
  coreCapabilities: string[]
  demoScenarios: DemoScenario[]
  externalUrl?: string
}

export const categories = [
  { id: 'all', label: '全部' },
  { id: 'knowledge', label: '知识管理' },
  { id: 'business', label: '业务流程' },
  { id: 'procurement', label: '采购招标' },
  { id: 'hr', label: '人力资源' },
]

export const agents: Agent[] = [
  {
    id: 'mvp_1',
    name: '知识库检索智能体',
    description: '理解用户真实意图、主动推荐相关知识、发现知识关联的智能助手',
    category: 'knowledge',
    categoryName: '知识管理',
    icon: '🔍',
    color: 'from-blue-500 to-indigo-500',
    rating: 4.9,
    users: 1256,
    tags: ['知识检索', '语义搜索', '关联推荐'],
    subscribed: false,
    features: ['意图理解', '关联推荐', '知识图谱', '个性化排序'],
    knowledgeBases: ['政策法规知识库', '公文模板知识库', '历史文档知识库'],
    recommended: true,
    phase: 'MVP',
    coreCapabilities: ['意图理解', '主动追问', '关联推荐', '知识图谱', '个性化排序'],
    demoScenarios: [
      {
        id: 'demo_1_1',
        title: '模糊搜索智能澄清',
        userInput: '报销',
        agentResponse: `您好！关于"报销"，我理解您可能想了解以下内容：

📌 请选择您想了解的方向：
1️⃣ 差旅费报销标准和流程
2️⃣ 办公用品报销规定
3️⃣ 培训费用报销
4️⃣ 其他费用报销

或者直接告诉我您的具体情况，我来帮您找到最准确的信息。`,
        highlights: ['意图理解', '主动澄清', '选项引导']
      },
      {
        id: 'demo_1_2',
        title: '主动关联推荐',
        userInput: '我想查一下差旅费报销标准',
        agentResponse: `已为您找到《局机关差旅费管理办法》，以下是核心内容：

📋 **住宿费标准**
- 省会城市：450元/天
- 地级市：350元/天

📋 **伙食补助**
- 省内：100元/天
- 省外：120元/天

---
💡 **您可能还需要**：
- 📄 差旅费报销单模板
- 📋 出差审批流程图
- ❓ 常见问题：超标部分如何处理？`,
        highlights: ['精准检索', '关联推荐', '相关文档']
      }
    ]
  },
  {
    id: 'mvp_2',
    name: '知识库问答智能体',
    description: '深度理解政策意图、提供实操建议、预判问题风险的智能顾问',
    category: 'knowledge',
    categoryName: '知识管理',
    icon: '💬',
    color: 'from-purple-500 to-pink-500',
    rating: 4.8,
    users: 1089,
    tags: ['政策解读', '智能问答', '风险预警'],
    subscribed: false,
    features: ['深度理解', '实操指导', '风险预警', '案例对照'],
    knowledgeBases: ['政策法规知识库', '制度流程知识库'],
    recommended: true,
    phase: 'MVP',
    coreCapabilities: ['深度理解', '实操指导', '风险预警', '案例对照', '追问引导'],
    demoScenarios: [
      {
        id: 'demo_2_1',
        title: '政策深度解读',
        userInput: '项目采购金额达到多少需要公开招标？',
        agentResponse: `根据《政府采购法》和《招标投标法》规定：

📊 **公开招标门槛标准**：
- 货物类：200万元以上
- 服务类：200万元以上
- 工程类：400万元以上

---
💡 **深度解读**：
这个标准的设定是为了平衡采购效率和公平竞争。

⚠️ **特别提醒**：
1. 这里的"金额"是指单项或批量采购金额
2. 不得故意拆分项目规避公开招标（这是违规行为）
3. 部分特殊项目可以申请变更采购方式`,
        highlights: ['政策解读', '门槛标准', '风险提醒']
      }
    ]
  },
  {
    id: 'mvp_3',
    name: '智能公文助手',
    description: '理解公文意图、主动补充内容、检查合规风险的智能写作助手',
    category: 'knowledge',
    categoryName: '知识管理',
    icon: '📄',
    color: 'from-green-500 to-emerald-500',
    rating: 4.9,
    users: 2345,
    tags: ['公文写作', '格式规范', '合规检查'],
    subscribed: true,
    features: ['意图理解', '内容推理', '风格适配', '合规检查'],
    knowledgeBases: ['公文模板知识库', '公文格式规范'],
    recommended: true,
    phase: 'MVP',
    coreCapabilities: ['意图理解', '内容推理', '风格适配', '合规检查', '智能润色'],
    demoScenarios: [
      {
        id: 'demo_3_1',
        title: '请示公文生成',
        userInput: '帮我写个请示，想申请采购一批办公设备，我们科室来了两个新人，现有电脑不够用，想买2台电脑，预算大概1万5',
        agentResponse: `好的，信息已收集完整。让我为您起草请示：

---

**关于申请采购办公设备的请示**

局领导：

    因我科室近期新增工作人员2名，现有办公设备无法满足工作需要，特申请采购办公设备。现将有关事项请示如下：

    一、采购原因
    我科室近期调入工作人员2名，现有电脑设备已全部配发使用，新增人员暂无办公设备可用，影响正常工作开展。

    二、采购内容
    台式电脑2台，用于日常办公。参考市场价格，每台约7,500元，预算合计15,000元。

    三、资金来源
    建议从年度办公设备购置预算中列支。

    妥否，请批示。

                                                    XX科室
                                                  2026年3月24日

---
💡 **智能建议**：
1. ✅ 结构完整，符合请示格式要求
2. ⚠️ 建议：可以补充电脑的具体配置要求`,
        highlights: ['意图理解', '内容推理', '格式规范']
      }
    ]
  },
  {
    id: 'mvp_4',
    name: '会议全流程智能体',
    description: '理解会议意图、提取关键决策、跟踪议定事项的智能会议助手',
    category: 'business',
    categoryName: '业务流程',
    icon: '📝',
    color: 'from-orange-500 to-red-500',
    rating: 4.7,
    users: 876,
    tags: ['会议纪要', '事项跟踪', '录音转写'],
    subscribed: false,
    features: ['会议理解', '重点提取', '事项跟踪', '关联分析'],
    knowledgeBases: ['会议模板知识库'],
    recommended: true,
    phase: 'MVP',
    coreCapabilities: ['会议理解', '重点提取', '事项跟踪', '关联分析', '风险预警'],
    demoScenarios: [
      {
        id: 'demo_4_1',
        title: '会议纪要生成',
        userInput: '[上传会议录音] 这是今天的项目推进会议，帮我生成纪要',
        agentResponse: `已收到会议录音（45分钟），正在处理...

🔍 **会议信息识别**：
- 会议类型：专题会议
- 会议主题：XX项目推进
- 参会人员：张明、李华、王强、赵敏、刘洋

📊 **会议分析完成**：

**核心议题**：XX项目进度滞后问题

**关键决策**：
1. 征地拆迁工作由综合科牵头，4月15日前完成
2. 技术方案优化后报审，技术科负责
3. 财务科协调资金拨付

**议定事项**：4项

📋 **已创建事项跟踪**：
| 事项 | 责任科室 | 完成时限 | 状态 |
|------|----------|----------|------|
| 完成征地拆迁协议签订 | 综合科 | 4月15日 | ⏳进行中 |
| 优化技术方案并报审 | 技术科 | 4月10日 | ⏳进行中 |`,
        highlights: ['录音识别', '纪要生成', '事项提取']
      }
    ]
  },
  {
    id: 'mvp_5',
    name: '招采文件智能体',
    description: '理解采购需求、匹配法规要求、预警合规风险的智能采购顾问',
    category: 'procurement',
    categoryName: '采购招标',
    icon: '📋',
    color: 'from-teal-500 to-cyan-500',
    rating: 4.6,
    users: 654,
    tags: ['采购文件', '法规匹配', '合规检查'],
    subscribed: false,
    features: ['需求理解', '法规匹配', '风险预警', '策略优化'],
    knowledgeBases: ['采购法规知识库', '招标模板知识库'],
    recommended: false,
    phase: 'MVP',
    coreCapabilities: ['需求理解', '法规匹配', '风险预警', '策略优化', '案例参考'],
    demoScenarios: [
      {
        id: 'demo_5_1',
        title: '采购需求分析',
        userInput: '我要采购一批办公设备，预算10万左右',
        agentResponse: `好的，10万元的办公设备采购。让我帮您分析：

📊 **采购方式判断**：
- 类型：货物类采购
- 金额：10万元
- 结论：未达到公开招标门槛（200万），可采用询价或网上商城采购

---
📋 **采购前准备清单**：

**必须完成**：
❌ 采购需求确认（设备类型、数量、配置）
❌ 预算落实确认
❌ 采购计划备案

📌 **请您补充**：
1. 需要采购哪些设备？（电脑、打印机、办公家具？）
2. 大概需要多少台/套？
3. 有没有特殊的配置要求？`,
        highlights: ['需求分析', '方式判断', '准备清单']
      }
    ]
  },
  {
    id: 'mvp_6',
    name: '项目台账智能体',
    description: '主动发现项目问题、预测进度风险、生成分析报告的智能项目管理助手',
    category: 'business',
    categoryName: '业务流程',
    icon: '📊',
    color: 'from-indigo-500 to-purple-500',
    rating: 4.5,
    users: 543,
    tags: ['项目管理', '风险预警', '进度跟踪'],
    subscribed: false,
    features: ['风险预测', '异常发现', '智能报告', '关联分析'],
    knowledgeBases: ['项目管理知识库'],
    recommended: false,
    phase: 'MVP',
    coreCapabilities: ['风险预测', '异常发现', '智能报告', '关联分析', '主动提醒'],
    demoScenarios: [
      {
        id: 'demo_6_1',
        title: '项目风险预警',
        userInput: '帮我看看这个月项目整体情况怎么样',
        agentResponse: `📊 **3月项目整体情况报告**

**一、总体概况**
- 在管项目：12个
- 本月完成：1个
- 正常推进：9个
- 需关注：2个

**二、风险预警**
🔴 **高风险项目**：
| 项目 | 问题 | 影响 | 建议 |
|------|------|------|------|
| XX道路改造 | 进度滞后20% | 可能延期30天 | 加快征地拆迁 |

💡 **智能建议**：
1. 建议召开征地拆迁协调会
2. 建议核实智慧交通系统费用明细`,
        highlights: ['风险预警', '智能报告', '主动建议']
      }
    ]
  },
  {
    id: 'mvp_7',
    name: '辅助审查智能体',
    description: '理解公文意图、发现逻辑问题、提供修改建议的智能审核助手',
    category: 'business',
    categoryName: '业务流程',
    icon: '✅',
    color: 'from-rose-500 to-pink-500',
    rating: 4.7,
    users: 789,
    tags: ['公文审查', '逻辑检查', '润色建议'],
    subscribed: false,
    features: ['深度理解', '逻辑检查', '风险识别', '润色建议'],
    knowledgeBases: ['公文格式规范', '审查规则库'],
    recommended: true,
    phase: 'MVP',
    coreCapabilities: ['深度理解', '逻辑检查', '风险识别', '润色建议', '一键修复'],
    demoScenarios: [
      {
        id: 'demo_7_1',
        title: '公文深度审查',
        userInput: '[上传请示公文] 帮我审查一下这份请示',
        agentResponse: `🔍 **审查结果**：

**一、基础检查**
✅ 错别字：未发现问题
✅ 格式规范：符合要求

**二、内容审查**
🟡 **逻辑问题**：
1. 前后表述不一致
   - 第一段："预算15万元"
   - 第三段："预算约2万元"
   - 建议：核实并统一金额

**三、风险提示**
⚠️ **表述风险**：
1. "急需采购"可能暗示规避程序
   - 建议：改为"拟申请采购"

---
📊 **综合评分**：78分

需要我一键修复所有问题吗？`,
        highlights: ['多维度检查', '风险识别', '评分建议']
      }
    ]
  },
  {
    id: 't2_1',
    name: '造价智能体',
    description: '理解造价业务逻辑、发现价格异常、匹配历史数据的智能造价助手',
    category: 'procurement',
    categoryName: '采购招标',
    icon: '💰',
    color: 'from-yellow-500 to-orange-500',
    rating: 4.6,
    users: 432,
    tags: ['造价审核', 'OCR识别', '价格对比'],
    subscribed: false,
    features: ['智能识别', '异常发现', '定额匹配', '历史对比'],
    knowledgeBases: ['定额数据库', '材料价格库'],
    recommended: false,
    phase: 'T2',
    coreCapabilities: ['智能识别', '异常发现', '定额匹配', '历史对比', '风险预警'],
    demoScenarios: [
      {
        id: 'demo_8_1',
        title: '手写结算单识别',
        userInput: '[上传手写结算单扫描件]',
        agentResponse: `正在识别您的结算单...

🔍 **识别结果**：
- 项目名称：XX道路改造工程结算
- 结算金额：¥284,000.00
- 明细项数：12项

⚠️ **识别存疑**：
| 序号 | 项目 | 存疑内容 | 置信度 |
|------|------|----------|--------|
| 3 | 路面铣刨 | 数量"1200" | 72% |

💡 **智能发现**：
- "路面铣刨"单价高于市场均价15%
- 建议核实单价依据`,
        highlights: ['OCR识别', '异常发现', '置信度提示']
      }
    ]
  },
  {
    id: 't2_2',
    name: '招标智能体',
    description: '理解招标法规、识别公平性问题、核验投标人资质的智能招标助手',
    category: 'procurement',
    categoryName: '采购招标',
    icon: '📋',
    color: 'from-cyan-500 to-blue-500',
    rating: 4.5,
    users: 321,
    tags: ['招标管理', '资质核验', '公平性检测'],
    subscribed: false,
    features: ['问题分类', '回复建议', '资质核验', '公平性检测'],
    knowledgeBases: ['招标法规知识库', '资质数据库'],
    recommended: false,
    phase: 'T2',
    coreCapabilities: ['问题分类', '回复建议', '资质核验', '公平性检测', '清标分析'],
    demoScenarios: [
      {
        id: 'demo_9_1',
        title: '答疑问题处理',
        userInput: '收到15个投标人的答疑问题，帮我处理一下',
        agentResponse: `已分析15个投标人的67个答疑问题：

📊 **问题分类统计**：
| 类型 | 数量 | 占比 |
|------|------|------|
| 技术类问题 | 38 | 56.7% |
| 商务类问题 | 22 | 32.8% |
| 资格类问题 | 7 | 10.4% |

⚠️ **公平性风险**：
- 问题15："能否提供现有系统的技术架构图？"
  - 风险：可能对某些投标人有利
  - 建议：回复时对所有投标人公开相关信息`,
        highlights: ['智能分类', '公平性检测', '风险提示']
      }
    ]
  },
  {
    id: 't2_3',
    name: '规划智能体',
    description: '理解汇报场景、提炼工作亮点、设计汇报逻辑的智能汇报助手',
    category: 'knowledge',
    categoryName: '知识管理',
    icon: '📊',
    color: 'from-violet-500 to-purple-500',
    rating: 4.4,
    users: 456,
    tags: ['PPT生成', '汇报材料', '亮点提炼'],
    subscribed: false,
    features: ['场景理解', '亮点提炼', '逻辑设计', '内容生成'],
    knowledgeBases: ['汇报模板库', '数据可视化库'],
    recommended: false,
    phase: 'T2',
    coreCapabilities: ['场景理解', '亮点提炼', '逻辑设计', '内容生成', '智能修改'],
    demoScenarios: [
      {
        id: 'demo_10_1',
        title: '年终汇报PPT生成',
        userInput: '帮我做一个年终工作汇报PPT，汇报给部门领导，15分钟左右',
        agentResponse: `📊 **数据分析结果**：

**亮点发现**：
✨ 您的预算执行率高于科室平均水平10%
✨ 负责的XX项目获得了局级表彰
✨ 创新性地完成了XX工作，节省成本15%

---
已为您生成PPT初稿：

**📑 PPT大纲（共12页）**

第1页：封面
第2页：目录
第3-4页：年度工作概述
第5-7页：重点项目成果
第8-9页：创新工作亮点
第10页：存在问题与改进
第11页：2026年工作计划
第12页：结束页`,
        highlights: ['数据分析', '亮点提炼', '自动生成']
      }
    ]
  },
  {
    id: 't2_4',
    name: '投标智能体',
    description: '分析招标要求、制定投标策略、生成高质量标书的智能投标助手',
    category: 'procurement',
    categoryName: '采购招标',
    icon: '🎯',
    color: 'from-emerald-500 to-teal-500',
    rating: 4.5,
    users: 234,
    tags: ['投标策略', '标书生成', '合规检查'],
    subscribed: false,
    features: ['标书解析', '策略推荐', '内容生成', '合规检查'],
    knowledgeBases: ['投标模板库', '案例数据库'],
    recommended: false,
    phase: 'T2',
    coreCapabilities: ['标书解析', '策略推荐', '案例匹配', '内容生成', '合规检查'],
    demoScenarios: [
      {
        id: 'demo_11_1',
        title: '招标文件分析',
        userInput: '[上传招标文件] 帮我分析一下这个标',
        agentResponse: `📊 **招标文件分析报告**

**一、项目概况**
- 项目名称：智慧交通管理系统采购项目
- 预算金额：200万元
- 投标截止：2026年4月15日

**二、评分标准分析**：
| 评分项 | 分值 | 关键得分点 |
|--------|------|------------|
| 技术方案 | 40分 | 系统架构、功能完整性 |
| 商务报价 | 30分 | 价格竞争力 |
| 企业资质 | 15分 | 类似业绩、资质等级 |

💡 **投标策略建议**：
- 建议报价区间：180-190万元
- 技术方案重点：突出微服务架构、高可用设计`,
        highlights: ['标书解析', '策略推荐', '风险提示']
      }
    ]
  },
  {
    id: 't2_5',
    name: 'HR智能体',
    description: '理解岗位需求、智能评估候选人、生成面试方案的智能HR助手',
    category: 'hr',
    categoryName: '人力资源',
    icon: '👥',
    color: 'from-pink-500 to-rose-500',
    rating: 4.3,
    users: 345,
    tags: ['简历筛选', '面试辅助', '综合评估'],
    subscribed: false,
    features: ['岗位画像', '简历筛选', '面试生成', '综合评估'],
    knowledgeBases: ['岗位知识库', '面试题库'],
    recommended: false,
    phase: 'T2',
    coreCapabilities: ['岗位画像', '简历筛选', '面试生成', '综合评估', '风险预警'],
    demoScenarios: [
      {
        id: 'demo_12_1',
        title: '简历智能筛选',
        userInput: '收到一批简历，帮我筛选一下',
        agentResponse: `📊 **简历筛选结果**

**一、筛选统计**：
| 结果 | 数量 | 占比 |
|------|------|------|
| 推荐面试 | 3 | 20% |
| 待定 | 5 | 33% |
| 不推荐 | 7 | 47% |

**二、推荐候选人**：

⭐ **候选人A：张XX**
| 维度 | 评估结果 | 得分 |
|------|----------|------|
| 技术匹配 | Java 5年，Spring Boot熟练 | 95分 |
| 项目经验 | 3个大型项目 | 90分 |
| 稳定性 | 3年换2家公司 | 75分 |
| **综合匹配度** | | **92%** |

💡 **面试建议**：
- 重点考察：项目经验真实性、技术深度`,
        highlights: ['智能筛选', '综合评估', '面试建议']
      }
    ]
  },
  {
    id: 't2_6',
    name: '入职培训智能体',
    description: '理解新员工需求、主动引导学习、提醒重要事项的智能入职助手',
    category: 'hr',
    categoryName: '人力资源',
    icon: '📚',
    color: 'from-amber-500 to-yellow-500',
    rating: 4.6,
    users: 567,
    tags: ['入职引导', '学习跟踪', '问题解答'],
    subscribed: false,
    features: ['需求理解', '主动引导', '知识问答', '进度跟踪'],
    knowledgeBases: ['入职手册', '岗位培训库'],
    recommended: false,
    phase: 'T2',
    coreCapabilities: ['需求理解', '主动引导', '知识问答', '进度跟踪', '温馨提醒'],
    demoScenarios: [
      {
        id: 'demo_13_1',
        title: '入职第一天引导',
        userInput: '我刚入职，不知道该做什么',
        agentResponse: `欢迎加入！我是您的入职培训助手。

🎉 **入职第一天指南**

**今天需要完成的事项**：
| 时间 | 事项 | 地点 | 状态 |
|------|------|------|------|
| 9:00 | 签订劳动合同 | 人事科 | ⏳待完成 |
| 9:30 | 领取办公用品 | 行政科 | ⏳待完成 |
| 10:00 | 开通办公系统账号 | 信息中心 | ⏳待完成 |
| 14:00 | 新员工培训 | 会议室B | ⏳待完成 |

📌 **您的工位**：3楼305室
📌 **食堂**：1楼，午餐时间11:30-13:00

💡 **温馨提示**：
- 记得带身份证和学历证书原件
- 有任何问题随时问我！`,
        highlights: ['主动引导', '任务清单', '温馨提示']
      }
    ]
  },
  {
    id: 't2_7',
    name: '外业踏勘智能体',
    description: '汇总项目背景、生成检查清单、记录现场问题的智能外业助手',
    category: 'business',
    categoryName: '业务流程',
    icon: '🗺️',
    color: 'from-lime-500 to-green-500',
    rating: 4.4,
    users: 234,
    tags: ['踏勘准备', '问题记录', '报告生成'],
    subscribed: false,
    features: ['背景汇总', '清单生成', '问题记录', '报告生成'],
    knowledgeBases: ['项目档案库', '检查标准库'],
    recommended: false,
    phase: 'T2',
    coreCapabilities: ['背景汇总', '清单生成', '问题记录', '报告生成', '安全提醒'],
    demoScenarios: [
      {
        id: 'demo_14_1',
        title: '踏勘前准备',
        userInput: '明天要去踏勘XX道路改造项目',
        agentResponse: `📋 **踏勘准备清单**

**一、项目背景汇总**：
- 项目位置：XX路与YY路交叉口至ZZ路段
- 改造长度：约2.5公里
- 当前阶段：施工前踏勘

⚠️ **历史问题**：
- 2025年11月巡查发现路面坑槽3处
- 排水井盖破损2处

**二、踏勘检查清单**：
📝 **路面工程**
□ 路面破损情况
  □ 坑槽位置、尺寸记录
  □ 裂缝分布记录
📝 **排水系统**
□ 雨水口位置及数量
□ 管道疏通情况

⚠️ **安全提醒**：
- 该路段车流量大，请穿戴反光背心
- 明天天气：晴，气温18-25℃`,
        highlights: ['背景汇总', '清单生成', '安全提醒']
      }
    ]
  }
]

export const getAgentsByCategory = (categoryId: string): Agent[] => {
  if (categoryId === 'all') return agents
  return agents.filter(agent => agent.category === categoryId)
}

export const getAgentsByPhase = (phase: 'MVP' | 'T2'): Agent[] => {
  return agents.filter(agent => agent.phase === phase)
}

export const getAgentById = (id: string): Agent | undefined => {
  return agents.find(agent => agent.id === id)
}

export const getRecommendedAgents = (): Agent[] => {
  return agents.filter(agent => agent.recommended)
}

export const getMvpAgents = (): Agent[] => {
  return agents.filter(agent => agent.phase === 'MVP')
}

export const getT2Agents = (): Agent[] => {
  return agents.filter(agent => agent.phase === 'T2')
}
