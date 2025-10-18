import React from 'react'
import { useTheme } from '../contexts/ThemeContext'
import { Sun, Moon } from 'lucide-react'

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className={`relative w-8 h-8 rounded-lg flex items-center justify-center transition-all group ${
        theme === 'dark' 
          ? 'bg-[#2a2a2f] hover:bg-[#35353a]' 
          : 'bg-gray-100 hover:bg-gray-200'
      }`}
      title={theme === 'dark' ? '切换到亮色模式' : '切换到深色模式'}
    >
      {/* 太阳图标 (亮色模式) */}
      <Sun 
        className={`w-4 h-4 absolute transition-all duration-300 ${
          theme === 'light' 
            ? 'opacity-100 rotate-0 scale-100 text-amber-500' 
            : 'opacity-0 rotate-90 scale-50 text-slate-400'
        }`}
        strokeWidth={2}
      />
      
      {/* 月亮图标 (深色模式) */}
      <Moon 
        className={`w-4 h-4 absolute transition-all duration-300 ${
          theme === 'dark' 
            ? 'opacity-100 rotate-0 scale-100 text-blue-400' 
            : 'opacity-0 -rotate-90 scale-50 text-slate-400'
        }`}
        strokeWidth={2}
      />
    </button>
  )
}

export default ThemeToggle

