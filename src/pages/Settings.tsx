import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  User, 
  Palette, 
  Bell, 
  Keyboard,
  Store,
  Database,
  Shield,
  Activity,
  FileText,
  Moon,
  Sun,
  Monitor,
  Check
} from 'lucide-react'

const settingsSections = [
  { id: 'account', label: '账户信息', icon: User },
  { id: 'appearance', label: '界面偏好', icon: Palette },
  { id: 'notifications', label: '通知设置', icon: Bell },
  { id: 'shortcuts', label: '快捷键', icon: Keyboard },
  { id: 'agents', label: '智能体设置', icon: Store },
  { id: 'knowledge', label: '知识库管理', icon: Database },
  { id: 'permissions', label: '权限管理', icon: Shield, admin: true },
  { id: 'logs', label: '操作日志', icon: FileText, admin: true },
  { id: 'monitor', label: '系统监控', icon: Activity, admin: true },
]

const themeOptions = [
  { id: 'dark', label: '深色模式', icon: Moon },
  { id: 'light', label: '浅色模式', icon: Sun },
  { id: 'system', label: '跟随系统', icon: Monitor },
]

const fontSizeOptions = [
  { id: 'small', label: '小' },
  { id: 'medium', label: '中' },
  { id: 'large', label: '大' },
]

export default function Settings() {
  const [activeSection, setActiveSection] = useState('appearance')
  const [theme, setTheme] = useState('dark')
  const [fontSize, setFontSize] = useState('medium')
  const [animationsEnabled, setAnimationsEnabled] = useState(true)
  const [simpleMode, setSimpleMode] = useState(false)

  const renderContent = () => {
    switch (activeSection) {
      case 'appearance':
        return (
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-medium text-white mb-4">主题模式</h3>
              <div className="grid grid-cols-3 gap-4">
                {themeOptions.map((option) => (
                  <motion.button
                    key={option.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setTheme(option.id)}
                    className={`p-4 rounded-xl border transition-all ${
                      theme === option.id
                        ? 'bg-aurora-cyan/10 border-aurora-cyan/50'
                        : 'bg-white/5 border-white/10 hover:border-white/20'
                    }`}
                  >
                    <option.icon className={`w-6 h-6 mx-auto mb-2 ${theme === option.id ? 'text-aurora-cyan' : 'text-gray-400'}`} />
                    <div className={`text-sm text-center ${theme === option.id ? 'text-aurora-cyan' : 'text-gray-400'}`}>
                      {option.label}
                    </div>
                    {theme === option.id && (
                      <div className="flex justify-center mt-2">
                        <Check className="w-4 h-4 text-aurora-cyan" />
                      </div>
                    )}
                  </motion.button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-white mb-4">动效设置</h3>
              <div className="glass-card p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-white">启用动画效果</div>
                    <div className="text-sm text-gray-500">关闭可提升老旧设备性能</div>
                  </div>
                  <button
                    onClick={() => setAnimationsEnabled(!animationsEnabled)}
                    className={`relative w-12 h-6 rounded-full transition-colors ${
                      animationsEnabled ? 'bg-aurora-cyan' : 'bg-white/20'
                    }`}
                  >
                    <motion.div
                      animate={{ x: animationsEnabled ? 24 : 2 }}
                      className="absolute top-1 w-4 h-4 rounded-full bg-white"
                    />
                  </button>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-white mb-4">字体大小</h3>
              <div className="flex items-center gap-4">
                {fontSizeOptions.map((option) => (
                  <motion.button
                    key={option.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setFontSize(option.id)}
                    className={`flex-1 p-3 rounded-lg border transition-all ${
                      fontSize === option.id
                        ? 'bg-aurora-cyan/10 border-aurora-cyan/50 text-aurora-cyan'
                        : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20'
                    }`}
                  >
                    {option.label}
                  </motion.button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-white mb-4">简洁模式</h3>
              <div className="glass-card p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-white">启用简洁模式</div>
                    <div className="text-sm text-gray-500">减少视觉元素，提升专注度</div>
                  </div>
                  <button
                    onClick={() => setSimpleMode(!simpleMode)}
                    className={`relative w-12 h-6 rounded-full transition-colors ${
                      simpleMode ? 'bg-aurora-cyan' : 'bg-white/20'
                    }`}
                  >
                    <motion.div
                      animate={{ x: simpleMode ? 24 : 2 }}
                      className="absolute top-1 w-4 h-4 rounded-full bg-white"
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )

      case 'account':
        return (
          <div className="space-y-6">
            <div className="glass-card p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-aurora-purple to-aurora-cyan flex items-center justify-center">
                  <User className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-medium text-white">张明</h3>
                  <p className="text-gray-500">交通规划部</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">用户名</label>
                  <input
                    type="text"
                    defaultValue="张明"
                    className="input-cyber"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">邮箱</label>
                  <input
                    type="email"
                    defaultValue="zhangming@transit.gov.cn"
                    className="input-cyber"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">部门</label>
                  <input
                    type="text"
                    defaultValue="交通规划部"
                    className="input-cyber"
                    disabled
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="cyber-button-primary"
              >
                保存更改
              </motion.button>
            </div>
          </div>
        )

      case 'agents':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-white mb-4">我的订阅</h3>
              <div className="space-y-3">
                {[
                  { name: '交通分析智能体', icon: '🚦', subscribed: true },
                  { name: '报告生成智能体', icon: '📊', subscribed: true },
                  { name: '合规检查智能体', icon: '📋', subscribed: false },
                ].map((agent) => (
                  <div key={agent.name} className="glass-card p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-xl">
                        {agent.icon}
                      </div>
                      <span className="text-white">{agent.name}</span>
                    </div>
                    <button
                      className={`px-3 py-1 rounded-lg text-sm ${
                        agent.subscribed
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-white/10 text-gray-400'
                      }`}
                    >
                      {agent.subscribed ? '已订阅' : '订阅'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )

      case 'permissions':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-white mb-4">用户管理</h3>
              <div className="glass-card overflow-hidden">
                <table className="w-full">
                  <thead className="bg-white/5">
                    <tr>
                      <th className="text-left p-4 text-sm font-medium text-gray-400">用户</th>
                      <th className="text-left p-4 text-sm font-medium text-gray-400">部门</th>
                      <th className="text-left p-4 text-sm font-medium text-gray-400">角色</th>
                      <th className="text-left p-4 text-sm font-medium text-gray-400">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {[
                      { name: '张明', dept: '交通规划部', role: '管理员' },
                      { name: '李华', dept: '运营管理部', role: '普通用户' },
                      { name: '王芳', dept: '安全监管部', role: '部门主管' },
                    ].map((user) => (
                      <tr key={user.name} className="hover:bg-white/5">
                        <td className="p-4 text-white">{user.name}</td>
                        <td className="p-4 text-gray-400">{user.dept}</td>
                        <td className="p-4">
                          <span className="tag-cyber">{user.role}</span>
                        </td>
                        <td className="p-4">
                          <button className="text-aurora-cyan text-sm hover:underline">编辑</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )

      default:
        return (
          <div className="flex items-center justify-center h-64 text-gray-500">
            该功能正在开发中...
          </div>
        )
    }
  }

  return (
    <div className="h-full p-6 overflow-auto">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="font-display text-3xl font-bold text-white mb-2">系统设置</h1>
          <p className="text-gray-400">管理您的账户和系统偏好</p>
        </motion.div>

        <div className="flex gap-6">
          <motion.aside
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-56 shrink-0"
          >
            <nav className="space-y-1">
              {settingsSections.map((section, index) => (
                <motion.button
                  key={section.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${
                    activeSection === section.id
                      ? 'bg-aurora-cyan/10 text-aurora-cyan border border-aurora-cyan/30'
                      : 'text-gray-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <section.icon className="w-5 h-5" />
                  <span className="text-sm">{section.label}</span>
                  {section.admin && (
                    <span className="ml-auto text-xs px-1.5 py-0.5 rounded bg-aurora-purple/20 text-aurora-purple">
                      管理员
                    </span>
                  )}
                </motion.button>
              ))}
            </nav>
          </motion.aside>

          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1 glass-panel p-6"
          >
            {renderContent()}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
