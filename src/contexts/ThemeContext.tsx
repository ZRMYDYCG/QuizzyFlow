import React, { createContext, useContext, useState, useEffect } from 'react'

type Theme = 'light' | 'dark'
type ThemeMode = 'light' | 'dark' | 'system'

interface ThemeColor {
  primary: string
  primaryHover: string
  primaryActive: string
  success: string
  warning: string
  error: string
  info: string
  bg: string
  bgSecondary: string
  text: string
  textSecondary: string
  border: string
}

interface ThemeContextType {
  theme: Theme
  themeMode: ThemeMode
  toggleTheme: () => void
  setTheme: (theme: Theme) => void
  setThemeMode: (mode: ThemeMode) => void
  primaryColor: string
  setPrimaryColor: (color: string) => void
  themeColors: ThemeColor
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

// 根据主色生成配套色系
const generateThemeColors = (primaryColor: string, isDark: boolean): ThemeColor => {
  // 辅助函数：调整颜色亮度
  const adjustBrightness = (hex: string, percent: number): string => {
    const num = parseInt(hex.replace('#', ''), 16)
    const r = Math.min(255, Math.max(0, (num >> 16) + percent))
    const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00ff) + percent))
    const b = Math.min(255, Math.max(0, (num & 0x0000ff) + percent))
    return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`
  }

  return {
    primary: primaryColor,
    primaryHover: adjustBrightness(primaryColor, isDark ? 30 : -20),
    primaryActive: adjustBrightness(primaryColor, isDark ? 50 : -40),
    success: '#52c41a',
    warning: '#faad14',
    error: '#f5222d',
    info: primaryColor,
    bg: isDark ? '#0f0f1a' : '#ffffff',
    bgSecondary: isDark ? '#1a1d29' : '#f5f5f5',
    text: isDark ? '#ffffff' : '#000000',
    textSecondary: isDark ? '#8f8f8f' : '#666666',
    border: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
  }
}

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [themeMode, setThemeModeState] = useState<ThemeMode>(() => {
    const savedMode = localStorage.getItem('quizzy-theme-mode') as ThemeMode
    return savedMode || 'dark'
  })

  // 获取系统主题偏好
  const getSystemTheme = (): Theme => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }
    return 'light'
  }

  // 实际应用的主题
  const [theme, setThemeState] = useState<Theme>(() => {
    if (themeMode === 'system') {
      return getSystemTheme()
    }
    return themeMode as Theme
  })

  const [primaryColor, setPrimaryColorState] = useState<string>(() => {
    const savedColor = localStorage.getItem('quizzy-primary-color')
    return savedColor || '#3b82f6' // 默认蓝色
  })

  const [themeColors, setThemeColors] = useState<ThemeColor>(() => 
    generateThemeColors(primaryColor, theme === 'dark')
  )

  // 监听系统主题变化
  useEffect(() => {
    if (themeMode !== 'system') return

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = (e: MediaQueryListEvent) => {
      setThemeState(e.matches ? 'dark' : 'light')
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [themeMode])

  // themeMode 改变时更新实际主题
  useEffect(() => {
    localStorage.setItem('quizzy-theme-mode', themeMode)
    
    if (themeMode === 'system') {
      setThemeState(getSystemTheme())
    } else {
      setThemeState(themeMode as Theme)
    }
  }, [themeMode])

  // 主题改变时保存到 localStorage 并更新主题色
  useEffect(() => {
    localStorage.setItem('quizzy-theme', theme)
    
    // 更新 html 元素的 data-theme 属性
    document.documentElement.setAttribute('data-theme', theme)
    
    // 添加或移除 dark 类
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }

    // 重新生成主题色
    setThemeColors(generateThemeColors(primaryColor, theme === 'dark'))
  }, [theme, primaryColor])

  // 主色改变时应用 CSS 变量
  useEffect(() => {
    localStorage.setItem('quizzy-primary-color', primaryColor)
    
    const root = document.documentElement
    root.style.setProperty('--color-primary', themeColors.primary)
    root.style.setProperty('--color-primary-hover', themeColors.primaryHover)
    root.style.setProperty('--color-primary-active', themeColors.primaryActive)
    root.style.setProperty('--color-success', themeColors.success)
    root.style.setProperty('--color-warning', themeColors.warning)
    root.style.setProperty('--color-error', themeColors.error)
    root.style.setProperty('--color-info', themeColors.info)
    root.style.setProperty('--color-bg', themeColors.bg)
    root.style.setProperty('--color-bg-secondary', themeColors.bgSecondary)
    root.style.setProperty('--color-text', themeColors.text)
    root.style.setProperty('--color-text-secondary', themeColors.textSecondary)
    root.style.setProperty('--color-border', themeColors.border)
  }, [themeColors, primaryColor])

  const toggleTheme = () => {
    const newMode: ThemeMode = themeMode === 'light' ? 'dark' : themeMode === 'dark' ? 'system' : 'light'
    setThemeModeState(newMode)
  }

  const setTheme = (newTheme: Theme) => {
    setThemeModeState(newTheme)
    setThemeState(newTheme)
  }

  const setThemeMode = (mode: ThemeMode) => {
    setThemeModeState(mode)
  }

  const setPrimaryColor = (color: string) => {
    setPrimaryColorState(color)
  }

  return (
    <ThemeContext.Provider 
      value={{ 
        theme, 
        themeMode,
        toggleTheme, 
        setTheme, 
        setThemeMode,
        primaryColor, 
        setPrimaryColor,
        themeColors 
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

