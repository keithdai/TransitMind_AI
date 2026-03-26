import { useState } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, User, Lock, ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()
  const { theme } = useTheme()

  const isEnterprise = theme === 'enterprise'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    await new Promise(resolve => setTimeout(resolve, 800))
    
    login()
    navigate('/')
  }

  const renderSciFiBackground = () => (
    <>
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
    </>
  )

  const renderEnterpriseBackground = () => (
    <div 
      className="absolute inset-0"
      style={{
        background: 'linear-gradient(135deg, #F7F9FC 0%, #E8F3FF 100%)',
      }}
    />
  )

  return (
    <div className={`min-h-screen relative overflow-hidden flex items-center justify-center ${isEnterprise ? '' : 'grid-bg radial-gradient-bg'}`} style={{ background: isEnterprise ? undefined : 'var(--bg-primary)' }}>
      {isEnterprise ? renderEnterpriseBackground() : renderSciFiBackground()}

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md px-6"
      >
        <div 
          className={`p-8 ${isEnterprise ? '' : 'glass-panel'}`}
          style={isEnterprise ? {
            background: '#FFFFFF',
            borderRadius: '8px',
            boxShadow: '0 2px 12px rgba(0, 50, 166, 0.08)',
            border: '1px solid #F0F5FE',
          } : undefined}
        >
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-8"
          >
            <div className="flex justify-center mb-4">
              <div className="relative">
                <div 
                  className="w-16 h-16 rounded-2xl flex items-center justify-center"
                  style={isEnterprise ? {
                    background: 'linear-gradient(135deg, #1459FA 0%, #0032A6 100%)',
                  } : {
                    background: 'linear-gradient(to bottom right, var(--accent-primary), var(--accent-secondary))',
                  }}
                >
                  <Sparkles className="w-8 h-8" style={{ color: isEnterprise ? '#FFFFFF' : 'var(--bg-primary)' }} />
                </div>
                {!isEnterprise && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 animate-pulse" style={{ borderColor: 'var(--bg-card)' }} />
                )}
              </div>
            </div>
            
            <h1 
              className="font-display text-3xl font-bold mb-2" 
              style={{ color: isEnterprise ? '#1D2129' : 'var(--text-primary)' }}
            >
              TransitMind AI
            </h1>
            <p 
              className="text-sm" 
              style={{ color: isEnterprise ? '#1459FA' : 'var(--accent-primary)' }}
            >
              政务智能体平台
            </p>
          </motion.div>

          <motion.form
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            <div>
              <label 
                className="block text-sm font-medium mb-2" 
                style={{ color: isEnterprise ? '#1D2129' : 'var(--text-secondary)' }}
              >
                用户名
              </label>
              <div className="relative">
                <User 
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" 
                  style={{ color: isEnterprise ? '#86909C' : 'var(--text-muted)' }} 
                />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="请输入用户名"
                  className={isEnterprise ? 'pl-12' : 'input-cyber pl-12'}
                  style={isEnterprise ? {
                    width: '100%',
                    height: '32px',
                    padding: '4px 12px 4px 48px',
                    border: '1px solid #E5E6EB',
                    borderRadius: '4px',
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'border-color 0.2s, box-shadow 0.2s',
                    background: '#FFFFFF',
                    color: '#1D2129',
                  } : undefined}
                  onFocus={(e) => {
                    if (isEnterprise) {
                      e.target.style.borderColor = '#1459FA'
                      e.target.style.boxShadow = '0 0 0 2px rgba(20, 89, 250, 0.1)'
                    }
                  }}
                  onBlur={(e) => {
                    if (isEnterprise) {
                      e.target.style.borderColor = '#E5E6EB'
                      e.target.style.boxShadow = 'none'
                    }
                  }}
                />
              </div>
            </div>

            <div>
              <label 
                className="block text-sm font-medium mb-2" 
                style={{ color: isEnterprise ? '#1D2129' : 'var(--text-secondary)' }}
              >
                密码
              </label>
              <div className="relative">
                <Lock 
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" 
                  style={{ color: isEnterprise ? '#86909C' : 'var(--text-muted)' }} 
                />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="请输入密码"
                  className={isEnterprise ? 'pl-12' : 'input-cyber pl-12'}
                  style={isEnterprise ? {
                    width: '100%',
                    height: '32px',
                    padding: '4px 12px 4px 48px',
                    border: '1px solid #E5E6EB',
                    borderRadius: '4px',
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'border-color 0.2s, box-shadow 0.2s',
                    background: '#FFFFFF',
                    color: '#1D2129',
                  } : undefined}
                  onFocus={(e) => {
                    if (isEnterprise) {
                      e.target.style.borderColor = '#1459FA'
                      e.target.style.boxShadow = '0 0 0 2px rgba(20, 89, 250, 0.1)'
                    }
                  }}
                  onBlur={(e) => {
                    if (isEnterprise) {
                      e.target.style.borderColor = '#E5E6EB'
                      e.target.style.boxShadow = 'none'
                    }
                  }}
                />
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full flex items-center justify-center gap-2 py-3 disabled:opacity-70 ${isEnterprise ? '' : 'cyber-button-primary'}`}
              style={isEnterprise ? {
                background: '#1459FA',
                color: '#FFFFFF',
                borderRadius: '4px',
                fontWeight: 500,
                fontSize: '14px',
                border: 'none',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                padding: '8px 20px',
              } : undefined}
            >
              {isLoading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                />
              ) : (
                <>
                  <span>登 录</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </motion.button>
          </motion.form>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-6 text-center"
          >
            <p 
              className="text-xs" 
              style={{ color: isEnterprise ? '#86909C' : 'var(--text-muted)' }}
            >
              内网部署 · 安全可控
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center mt-6"
        >
          <p 
            className="text-sm" 
            style={{ color: isEnterprise ? '#86909C' : 'var(--text-muted)' }}
          >
            深城交研究院研发
          </p>
        </motion.div>
      </motion.div>
    </div>
  )
}
