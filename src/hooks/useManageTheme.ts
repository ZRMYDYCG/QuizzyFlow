import { useTheme } from '../contexts/ThemeContext'

/**
 * 管理页面主题工具 Hook
 * 提供统一的主题类名
 */
export const useManageTheme = () => {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  return {
    theme,
    isDark,
    
    // 卡片样式
    card: {
      bg: isDark ? 'bg-gradient-to-br from-slate-800/80 to-slate-800/40' : 'bg-white',
      border: isDark ? 'border-slate-700/50' : 'border-gray-200',
      hover: isDark ? 'hover:border-blue-500/50' : 'hover:border-blue-400',
    },
    
    // 表格样式
    table: {
      bg: isDark ? 'bg-slate-800/30' : 'bg-white',
      border: isDark ? 'border-slate-700/50' : 'border-gray-200',
      rowBg: isDark ? 'bg-slate-800/30' : 'bg-gray-50',
      rowHover: isDark ? 'hover:bg-slate-800/30' : 'hover:bg-gray-50',
      headerBg: isDark ? 'bg-slate-800/50' : 'bg-gray-50',
    },
    
    // 文字颜色
    text: {
      primary: isDark ? 'text-slate-100' : 'text-gray-900',
      secondary: isDark ? 'text-slate-400' : 'text-gray-600',
      tertiary: isDark ? 'text-slate-500' : 'text-gray-400',
      label: isDark ? 'text-slate-400' : 'text-gray-500',
    },
    
    // 按钮样式
    button: {
      default: isDark 
        ? 'bg-slate-700/50 text-slate-300 hover:bg-slate-700' 
        : 'bg-gray-100 text-gray-700 hover:bg-gray-200',
    },
    
    // Dialog/Modal 样式
    dialog: {
      bg: isDark ? 'bg-slate-800' : 'bg-white',
      border: isDark ? 'border-slate-700' : 'border-gray-200',
      title: isDark ? 'text-slate-200' : 'text-gray-900',
      description: isDark ? 'text-slate-400' : 'text-gray-600',
    },
    
    // 分隔线
    divider: isDark ? 'border-slate-700/30' : 'border-gray-200',
  }
}

