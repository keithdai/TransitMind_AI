import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Home, 
  Store, 
  Database, 
  Settings, 
  Bell, 
  User,
  Sparkles,
  Moon,
  Sun,
  Eye,
  Zap,
  Landmark,
  Code2,
  LogOut,
  Building2,
  Wand2
} from 'lucide-react'
import { useState } from 'react'
import { useTheme } from '../contexts/ThemeContext'
import { useAuth } from '../contexts/AuthContext'

const navItems = [
  { path: '/', icon: Home, label: '智能体工作台' },
  { path: '/marketplace', icon: Store, label: '智能体市场' },
  { path: '/knowledge-base', icon: Database, label: '知识库' },
  { path: '/developer', icon: Code2, label: '智能体自定义' },
  { path: '/developer/skills', icon: Wand2, label: 'SKILL 工作室' },
]

function EnterpriseLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const { theme, setTheme } = useTheme()
  const { logout } = useAuth()
  const [showThemeMenu, setShowThemeMenu] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)

  const themeOptions = [
    { id: 'dark', label: '深色模式', icon: Moon },
    { id: 'light', label: '浅色模式', icon: Sun },
    { id: 'eye-care', label: '护眼模式', icon: Eye },
    { id: 'government', label: '政务风格', icon: Landmark },
    { id: 'enterprise', label: '企业风格', icon: Building2 },
  ] as const

  return (
    <div className="min-h-screen flex" style={{ background: '#F7F9FC' }}>
      <aside 
        className="w-[220px] flex flex-col border-r fixed left-0 top-0 bottom-0 z-20"
        style={{ 
          background: '#FFFFFF',
          borderColor: '#F0F5FE'
        }}
      >
        <div className="h-[64px] flex items-center px-5 border-b" style={{ borderColor: '#F0F5FE', background: '#FFFFFF' }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #1459FA 0%, #0032A6 100%)' }}>
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-base" style={{ color: '#1D2129' }}>TransitMind</h1>
              <p className="text-xs" style={{ color: '#86909C' }}>AI Portal</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 py-4 px-3">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className="flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-all duration-200"
              style={({ isActive }) => ({
                background: isActive ? '#E8F3FF' : 'transparent',
                color: isActive ? '#1459FA' : '#4E5969',
                fontWeight: isActive ? 500 : 400,
                borderRight: isActive ? '3px solid #1459FA' : '3px solid transparent',
              })}
            >
              {({ isActive }) => (
                <>
                  <item.icon className="w-5 h-5" style={{ color: isActive ? '#1459FA' : '#86909C' }} />
                  <span className="text-sm">{item.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="p-3 border-t" style={{ borderColor: '#F0F5FE' }}>
          <NavLink
            to="/settings"
            className="flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200"
            style={({ isActive }) => ({
              background: isActive ? '#E8F3FF' : 'transparent',
              color: isActive ? '#1459FA' : '#4E5969',
              borderRight: isActive ? '3px solid #1459FA' : '3px solid transparent',
            })}
          >
            {({ isActive }) => (
              <>
                <Settings className="w-5 h-5" style={{ color: isActive ? '#1459FA' : '#86909C' }} />
                <span className="text-sm">系统设置</span>
              </>
            )}
          </NavLink>
        </div>
      </aside>

      <div className="flex-1 ml-[220px] flex flex-col min-h-screen">
        <header 
          className="h-[64px] flex items-center justify-between px-8 border-b fixed top-0 right-0 left-[220px] z-10"
          style={{ 
            background: '#FFFFFF',
            borderColor: '#F0F5FE'
          }}
        >
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full text-xs" style={{ background: '#E8FFEA', color: '#00B578', border: '1px solid #9CE6A0' }}>
            <Zap className="w-3.5 h-3.5" />
            <span>系统在线</span>
            <span className="font-mono opacity-60">12ms</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <button
                onClick={() => setShowThemeMenu(!showThemeMenu)}
                className="p-2 rounded-lg transition-colors"
                style={{ color: '#86909C' }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#F0F5FE'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                {theme === 'dark' ? <Moon className="w-5 h-5" /> :
                 theme === 'light' ? <Sun className="w-5 h-5" /> :
                 theme === 'eye-care' ? <Eye className="w-5 h-5" /> :
                 theme === 'government' ? <Landmark className="w-5 h-5" /> :
                 <Building2 className="w-5 h-5" />}
              </button>
              
              <AnimatePresence>
                {showThemeMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 top-14 p-2 min-w-[160px] z-50 rounded-lg border"
                    style={{ background: '#FFFFFF', borderColor: '#E5E6EB', boxShadow: '0 4px 12px rgba(0, 50, 166, 0.1)' }}
                  >
                    {themeOptions.map((option) => (
                      <button
                        key={option.id}
                        onClick={() => { setTheme(option.id); setShowThemeMenu(false) }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-colors"
                        style={{ 
                          background: theme === option.id ? '#E8F3FF' : 'transparent',
                          color: theme === option.id ? '#1459FA' : '#4E5969'
                        }}
                      >
                        <option.icon className="w-4 h-4" />
                        <span>{option.label}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button className="relative p-2 rounded-lg transition-colors" style={{ color: '#86909C' }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#F0F5FE'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
              <Bell className="w-5 h-5" />
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full text-xs flex items-center justify-center text-white" style={{ background: '#F53F3F' }}>
                3
              </span>
            </button>
            
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors"
                style={{ borderColor: '#1459FA', background: '#E8F3FF', color: '#1459FA' }}
              >
                <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: '#1459FA' }}>
                  <User className="w-3 h-3 text-white" />
                </div>
                <span className="text-sm font-medium" style={{ color: '#1D2129' }}>张明</span>
                <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: '#CFE3FE', color: '#1459FA' }}>交通规划部</span>
              </button>
              
              <AnimatePresence>
                {showUserMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 top-14 p-2 min-w-[160px] z-50 rounded-lg border"
                    style={{ background: '#FFFFFF', borderColor: '#E5E6EB', boxShadow: '0 4px 12px rgba(0, 50, 166, 0.1)' }}
                  >
                    <button
                      onClick={() => { 
                        logout()
                        navigate('/login')
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-colors"
                      style={{ color: '#F53F3F' }}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#FFECE8'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      <LogOut className="w-4 h-4" />
                      <span>退出登录</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto mt-[64px] p-6" style={{ background: '#F7F9FC' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>

        <footer 
          className="h-10 flex items-center justify-center text-xs border-t"
          style={{ 
            borderColor: '#F0F5FE',
            background: '#FFFFFF',
            color: '#86909C'
          }}
        >
          <span>深城交研究院研发</span>
        </footer>
      </div>
    </div>
  )
}

function DefaultLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const { theme, setTheme } = useTheme()
  const { logout } = useAuth()
  const [showThemeMenu, setShowThemeMenu] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)

  const themeOptions = [
    { id: 'dark', label: '深色模式', icon: Moon },
    { id: 'light', label: '浅色模式', icon: Sun },
    { id: 'eye-care', label: '护眼模式', icon: Eye },
    { id: 'government', label: '政务风格', icon: Landmark },
    { id: 'enterprise', label: '企业风格', icon: Building2 },
  ] as const

  return (
    <div className="min-h-screen grid-bg radial-gradient-bg relative overflow-hidden" style={{ background: 'var(--bg-primary)' }}>
      <div className="scanline" />
      
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="particle"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 20}s`,
            animationDuration: `${15 + Math.random() * 10}s`,
          }}
        />
      ))}

      <div className="side-glow-left" />
      <div className="side-glow-right" />
      
      <div className="corner-decoration corner-decoration-tl" />
      <div className="corner-decoration corner-decoration-tr" />
      <div className="corner-decoration corner-decoration-bl" />
      <div className="corner-decoration corner-decoration-br" />
      
      <div className="data-stream data-stream-left" />
      <div className="data-stream data-stream-right" />
      
      <div className="pulse-ring pulse-ring-left" />
      <div className="pulse-ring pulse-ring-right" />
      
      <svg className="floating-hex floating-hex-1" width="24" height="28" viewBox="0 0 24 28">
        <path d="M12 0L24 7V21L12 28L0 21V7L12 0Z" fill="none" stroke="var(--accent-primary)" strokeWidth="1" />
      </svg>
      <svg className="floating-hex floating-hex-2" width="24" height="28" viewBox="0 0 24 28">
        <path d="M12 0L24 7V21L12 28L0 21V7L12 0Z" fill="none" stroke="var(--accent-secondary)" strokeWidth="1" />
      </svg>

      <div className="relative z-10 flex flex-col min-h-screen">
        <motion.header
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="h-16 border-b flex items-center justify-between px-6"
          style={{ 
            borderColor: 'var(--border-color)',
            background: 'var(--bg-card)'
          }}
        >
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] flex items-center justify-center">
                  <Sparkles className="w-5 h-5" style={{ color: 'var(--bg-primary)' }} />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 animate-pulse" style={{ borderColor: 'var(--bg-card)' }} />
              </div>
              <div>
                <h1 className="font-display text-lg font-bold" style={{ color: 'var(--text-primary)' }}>TransitMind</h1>
                <p className="text-xs font-mono" style={{ color: 'var(--accent-primary)' }}>AI Portal v1.0</p>
              </div>
            </div>

            <nav className="flex items-center gap-1">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.path}
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <NavLink
                    to={item.path}
                    className={() =>
                      `group flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300`
                    }
                    style={({ isActive }) => ({
                      background: isActive ? 'rgba(0, 229, 255, 0.1)' : 'transparent',
                      border: isActive ? '1px solid var(--border-hover)' : '1px solid transparent',
                      color: isActive ? 'var(--accent-primary)' : 'var(--text-secondary)'
                    })}
                  >
                    {() => (
                      <>
                        <item.icon className="w-4 h-4" />
                        <span className="text-sm font-medium">{item.label}</span>
                      </>
                    )}
                  </NavLink>
                </motion.div>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs" style={{ background: 'rgba(34, 197, 94, 0.1)', color: '#22c55e' }}>
              <Zap className="w-3 h-3" />
              <span>系统在线</span>
              <span className="font-mono opacity-60">12ms</span>
            </div>

            <div className="h-6 w-px" style={{ background: 'var(--border-color)' }} />

            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowThemeMenu(!showThemeMenu)}
                className="p-2 rounded-lg border transition-colors"
                style={{ background: 'rgba(255,255,255,0.05)', borderColor: 'var(--border-color)' }}
              >
                {theme === 'dark' ? <Moon className="w-5 h-5" style={{ color: 'var(--text-secondary)' }} /> :
                 theme === 'light' ? <Sun className="w-5 h-5" style={{ color: 'var(--text-secondary)' }} /> :
                 theme === 'eye-care' ? <Eye className="w-5 h-5" style={{ color: 'var(--text-secondary)' }} /> :
                 theme === 'government' ? <Landmark className="w-5 h-5" style={{ color: 'var(--text-secondary)' }} /> :
                 <Building2 className="w-5 h-5" style={{ color: 'var(--text-secondary)' }} />}
              </motion.button>
              
              <AnimatePresence>
                {showThemeMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 top-12 glass-panel p-2 min-w-[140px] z-50"
                  >
                    {themeOptions.map((option) => (
                      <button
                        key={option.id}
                        onClick={() => { setTheme(option.id); setShowThemeMenu(false) }}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors"
                        style={{ 
                          background: theme === option.id ? 'rgba(0, 229, 255, 0.1)' : 'transparent',
                          color: theme === option.id ? 'var(--accent-primary)' : 'var(--text-secondary)'
                        }}
                      >
                        <option.icon className="w-4 h-4" />
                        <span>{option.label}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative p-2 rounded-lg border transition-colors"
              style={{ background: 'rgba(255,255,255,0.05)', borderColor: 'var(--border-color)' }}
            >
              <Bell className="w-5 h-5" style={{ color: 'var(--text-secondary)' }} />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-xs flex items-center justify-center text-white">
                3
              </span>
            </motion.button>
            
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border"
                style={{ background: 'linear-gradient(to right, rgba(0, 229, 255, 0.2), rgba(123, 97, 255, 0.2))', borderColor: 'var(--border-hover)' }}
              >
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[var(--accent-secondary)] to-[var(--accent-primary)] flex items-center justify-center">
                  <User className="w-3 h-3 text-white" />
                </div>
                <span className="text-sm" style={{ color: 'var(--text-primary)' }}>张明</span>
                <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(255,255,255,0.1)', color: 'var(--text-muted)' }}>交通规划部</span>
              </motion.button>
              
              <AnimatePresence>
                {showUserMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 top-14 glass-panel p-2 min-w-[140px] z-50"
                  >
                    <button
                      onClick={() => { 
                        logout()
                        navigate('/login')
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors"
                      style={{ 
                        background: 'rgba(239, 68, 68, 0.1)',
                        color: '#ef4444'
                      }}
                    >
                      <LogOut className="w-4 h-4" />
                      <span>退出登录</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <NavLink to="/settings">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded-lg border transition-colors"
                style={{ background: 'rgba(255,255,255,0.05)', borderColor: 'var(--border-color)' }}
              >
                <Settings className="w-5 h-5" style={{ color: 'var(--text-secondary)' }} />
              </motion.button>
            </NavLink>
          </div>
        </motion.header>

        <main className="flex-1 overflow-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>

        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="h-8 border-t flex items-center justify-between px-6 text-xs"
          style={{ 
            borderColor: 'var(--border-color)',
            background: 'var(--bg-card)',
            color: 'var(--text-muted)'
          }}
        >
          <div className="flex items-center gap-4">
            <span>TransitMind AI Portal v1.0.0</span>
            <span>|</span>
            <span>交通智能化管理平台</span>
          </div>
          <div className="flex items-center gap-4">
            <span>深城交研究院研发</span>
            <span>|</span>
            <span className="font-mono">Build: 2024.01.15</span>
            <span>|</span>
            <span>内网部署</span>
          </div>
        </motion.footer>
      </div>
    </div>
  )
}

export default function Layout() {
  const { theme } = useTheme()
  const isEnterprise = theme === 'enterprise'

  return isEnterprise ? <EnterpriseLayout /> : <DefaultLayout />
}
