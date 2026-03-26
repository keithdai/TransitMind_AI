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
  Building2,
  Check
} from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'

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
  { id: 'dark', label: '深色模式', icon: Moon, description: '科技感强，适合夜间使用' },
  { id: 'light', label: '浅色模式', icon: Sun, description: '明亮清新，适合日间办公' },
  { id: 'system', label: '跟随系统', icon: Monitor, description: '自动适配系统主题设置' },
  { id: 'enterprise', label: '企业级', icon: Building2, description: '专业稳重，适合政务办公场景' },
]

const fontSizeOptions = [
  { id: 'small', label: '小' },
  { id: 'medium', label: '中' },
  { id: 'large', label: '大' },
]

export default function Settings() {
  const { theme, setTheme } = useTheme()
  const [activeSection, setActiveSection] = useState('appearance')
  const [fontSize, setFontSize] = useState('medium')
  const [animationsEnabled, setAnimationsEnabled] = useState(true)
  const [simpleMode, setSimpleMode] = useState(false)

  const renderContent = () => {
    switch (activeSection) {
      case 'appearance':
        return (
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-medium mb-4" style={{ color: 'var(--text-primary)' }}>主题模式</h3>
              <div className="grid grid-cols-2 gap-4">
                {themeOptions.map((option) => (
                  <motion.button
                    key={option.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setTheme(option.id as 'dark' | 'light' | 'eye-care' | 'government' | 'enterprise')}
                    className="p-4 rounded-xl border transition-all"
                    style={{
                      background: theme === option.id 
                        ? 'var(--color-primary-lighter)' 
                        : 'var(--bg-card)',
                      borderColor: theme === option.id 
                        ? 'var(--color-primary)' 
                        : 'var(--border-color)',
                    }}
                  >
                    <option.icon 
                      className="w-6 h-6 mx-auto mb-2" 
                      style={{ color: theme === option.id ? 'var(--color-primary)' : 'var(--text-muted)' }} 
                    />
                    <div 
                      className="text-sm text-center"
                      style={{ color: theme === option.id ? 'var(--color-primary)' : 'var(--text-secondary)' }}
                    >
                      {option.label}
                    </div>
                    <div 
                      className="text-xs text-center mt-1"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      {option.description}
                    </div>
                    {theme === option.id && (
                      <div className="flex justify-center mt-2">
                        <Check className="w-4 h-4" style={{ color: 'var(--color-primary)' }} />
                      </div>
                    )}
                  </motion.button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-4" style={{ color: 'var(--text-primary)' }}>动效设置</h3>
              <div className="glass-card p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium" style={{ color: 'var(--text-primary)' }}>启用动画效果</div>
                    <div className="text-sm" style={{ color: 'var(--text-muted)' }}>关闭可提升老旧设备性能</div>
                  </div>
                  <button
                    onClick={() => setAnimationsEnabled(!animationsEnabled)}
                    className="relative w-12 h-6 rounded-full transition-colors"
                    style={{
                      background: animationsEnabled ? 'var(--color-primary)' : 'var(--border-color)'
                    }}
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
              <h3 className="text-lg font-medium mb-4" style={{ color: 'var(--text-primary)' }}>字体大小</h3>
              <div className="flex items-center gap-4">
                {fontSizeOptions.map((option) => (
                  <motion.button
                    key={option.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setFontSize(option.id)}
                    className="flex-1 p-3 rounded-lg border transition-all"
                    style={{
                      background: fontSize === option.id 
                        ? 'var(--color-primary-lighter)' 
                        : 'var(--bg-card)',
                      borderColor: fontSize === option.id 
                        ? 'var(--color-primary)' 
                        : 'var(--border-color)',
                      color: fontSize === option.id 
                        ? 'var(--color-primary)' 
                        : 'var(--text-secondary)'
                    }}
                  >
                    {option.label}
                  </motion.button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-4" style={{ color: 'var(--text-primary)' }}>简洁模式</h3>
              <div className="glass-card p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium" style={{ color: 'var(--text-primary)' }}>启用简洁模式</div>
                    <div className="text-sm" style={{ color: 'var(--text-muted)' }}>减少视觉元素，提升专注度</div>
                  </div>
                  <button
                    onClick={() => setSimpleMode(!simpleMode)}
                    className="relative w-12 h-6 rounded-full transition-colors"
                    style={{
                      background: simpleMode ? 'var(--color-primary)' : 'var(--border-color)'
                    }}
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
                <div 
                  className="w-16 h-16 rounded-full flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--accent-secondary))' }}
                >
                  <User className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-medium" style={{ color: 'var(--text-primary)' }}>张明</h3>
                  <p style={{ color: 'var(--text-muted)' }}>交通规划部</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>用户名</label>
                  <input
                    type="text"
                    defaultValue="张明"
                    className="input-cyber"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>邮箱</label>
                  <input
                    type="email"
                    defaultValue="zhangming@transit.gov.cn"
                    className="input-cyber"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>部门</label>
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
              <h3 className="text-lg font-medium mb-4" style={{ color: 'var(--text-primary)' }}>我的订阅</h3>
              <div className="space-y-3">
                {[
                  { name: '交通分析智能体', icon: '🚦', subscribed: true },
                  { name: '报告生成智能体', icon: '📊', subscribed: true },
                  { name: '合规检查智能体', icon: '📋', subscribed: false },
                ].map((agent) => (
                  <div key={agent.name} className="glass-card p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-10 h-10 rounded-lg flex items-center justify-center text-xl"
                        style={{ background: 'var(--bg-tertiary)' }}
                      >
                        {agent.icon}
                      </div>
                      <span style={{ color: 'var(--text-primary)' }}>{agent.name}</span>
                    </div>
                    <button
                      className="px-3 py-1 rounded-lg text-sm"
                      style={{
                        background: agent.subscribed 
                          ? 'rgba(0, 181, 120, 0.1)' 
                          : 'var(--bg-tertiary)',
                        color: agent.subscribed 
                          ? 'var(--success-color)' 
                          : 'var(--text-muted)'
                      }}
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
              <h3 className="text-lg font-medium mb-4" style={{ color: 'var(--text-primary)' }}>用户管理</h3>
              <div className="glass-card overflow-hidden">
                <table className="w-full">
                  <thead style={{ background: 'var(--bg-tertiary)' }}>
                    <tr>
                      <th className="text-left p-4 text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>用户</th>
                      <th className="text-left p-4 text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>部门</th>
                      <th className="text-left p-4 text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>角色</th>
                      <th className="text-left p-4 text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>操作</th>
                    </tr>
                  </thead>
                  <tbody style={{ borderColor: 'var(--border-color)' }}>
                    {[
                      { name: '张明', dept: '交通规划部', role: '管理员' },
                      { name: '李华', dept: '运营管理部', role: '普通用户' },
                      { name: '王芳', dept: '安全监管部', role: '部门主管' },
                    ].map((user) => (
                      <tr 
                        key={user.name} 
                        className="hover:bg-opacity-50 transition-colors"
                        style={{ 
                          borderTop: '1px solid var(--border-color)',
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-tertiary)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                      >
                        <td className="p-4" style={{ color: 'var(--text-primary)' }}>{user.name}</td>
                        <td className="p-4" style={{ color: 'var(--text-secondary)' }}>{user.dept}</td>
                        <td className="p-4">
                          <span className="tag-cyber">{user.role}</span>
                        </td>
                        <td className="p-4">
                          <button 
                            className="text-sm hover:underline"
                            style={{ color: 'var(--color-primary)' }}
                          >
                            编辑
                          </button>
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
          <div className="flex items-center justify-center h-64" style={{ color: 'var(--text-muted)' }}>
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
          <h1 className="font-display text-3xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>系统设置</h1>
          <p style={{ color: 'var(--text-secondary)' }}>管理您的账户和系统偏好</p>
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
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all"
                  style={{
                    background: activeSection === section.id 
                      ? 'var(--color-primary-lighter)' 
                      : 'transparent',
                    color: activeSection === section.id 
                      ? 'var(--color-primary)' 
                      : 'var(--text-secondary)',
                    border: activeSection === section.id 
                      ? '1px solid var(--color-primary)' 
                      : '1px solid transparent',
                  }}
                  onMouseEnter={(e) => {
                    if (activeSection !== section.id) {
                      e.currentTarget.style.background = 'var(--bg-tertiary)'
                      e.currentTarget.style.color = 'var(--text-primary)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (activeSection !== section.id) {
                      e.currentTarget.style.background = 'transparent'
                      e.currentTarget.style.color = 'var(--text-secondary)'
                    }
                  }}
                >
                  <section.icon className="w-5 h-5" />
                  <span className="text-sm">{section.label}</span>
                  {section.admin && (
                    <span 
                      className="ml-auto text-xs px-1.5 py-0.5 rounded"
                      style={{ 
                        background: 'rgba(123, 97, 255, 0.1)', 
                        color: 'var(--accent-secondary)' 
                      }}
                    >
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
