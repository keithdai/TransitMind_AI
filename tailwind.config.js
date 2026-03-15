/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'deep-space': {
          900: '#0a0e1a',
          800: '#0f1629',
          700: '#151d35',
          600: '#1a2442',
        },
        'aurora': {
          cyan: '#00e5ff',
          blue: '#00b4d8',
          purple: '#7b61ff',
        },
        'neural': {
          blue: '#2563eb',
          glow: '#3b82f6',
        }
      },
      fontFamily: {
        'display': ['Orbitron', 'sans-serif'],
        'body': ['Exo 2', 'sans-serif'],
        'mono': ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'float': 'float 6s ease-in-out infinite',
        'scan': 'scan 8s linear infinite',
        'data-flow': 'dataFlow 3s linear infinite',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(0, 229, 255, 0.3)' },
          '100%': { boxShadow: '0 0 40px rgba(0, 229, 255, 0.6)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
        dataFlow: {
          '0%': { strokeDashoffset: '100' },
          '100%': { strokeDashoffset: '0' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'grid-pattern': 'linear-gradient(rgba(0, 229, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 229, 255, 0.03) 1px, transparent 1px)',
      },
    },
  },
  plugins: [],
}
