import { Outlet, NavLink, useLocation } from 'react-router-dom'
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
  Landmark
} from 'lucide-react'
import { useState } from 'react'
import { useTheme } from '../contexts/ThemeContext'

const navItems = [
  { path: '/', icon: Home, label: '智能体工作台' },
  { path: '/marketplace', icon: Store, label: '智能体超市' },
  { path: '/knowledge-base', icon: Database, label: '知识库' },
]

export default function Layout() {
  const location = useLocation()
  const { theme, setTheme } = useTheme()
  const [showThemeMenu, setShowThemeMenu] = useState(false)

  const themeOptions = [
    { id: 'dark', label: '深色模式', icon: Moon },
    { id: 'light', label: '浅色模式', icon: Sun },
    { id: 'eye-care', label: '护眼模式', icon: Eye },
    { id: 'government', label: '政务风格', icon: Landmark },
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
                    className={({ isActive }) =>
                      `group flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300`
                    }
                    style={({ isActive }) => ({
                      background: isActive ? 'rgba(0, 229, 255, 0.1)' : 'transparent',
                      border: isActive ? '1px solid var(--border-hover)' : '1px solid transparent',
                      color: isActive ? 'var(--accent-primary)' : 'var(--text-secondary)'
                    })}
                  >
                    {({ isActive }) => (
                      <>
                        <item.icon className="w-4 h-4" />
                        <span className="text-sm font-medium" style={{ color: isActive ? 'var(--accent-primary)' : 'var(--text-primary)' }}>{item.label}</span>
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
                 <Landmark className="w-5 h-5" style={{ color: 'var(--text-secondary)' }} />}
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
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border"
              style={{ background: 'linear-gradient(to right, rgba(0, 229, 255, 0.2), rgba(123, 97, 255, 0.2))', borderColor: 'var(--border-hover)' }}
            >
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[var(--accent-secondary)] to-[var(--accent-primary)] flex items-center justify-center">
                <User className="w-3 h-3 text-white" />
              </div>
              <span className="text-sm" style={{ color: 'var(--text-primary)' }}>张明</span>
              <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(255,255,255,0.1)', color: 'var(--text-muted)' }}>交通规划部</span>
            </motion.button>

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
            <span className="font-mono">Build: 2024.01.15</span>
            <span>|</span>
            <span>内网部署</span>
          </div>
        </motion.footer>
      </div>
    </div>
  )
}
