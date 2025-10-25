/**
 * 主题样式辅助工具
 * 用于快速生成带主题色的样式
 */

/**
 * 生成主题色的半透明背景颜色
 * @param color 主题色 hex 值
 * @param opacity 透明度 (0-100)
 */
export const getThemeColorWithOpacity = (color: string, opacity: number): string => {
  return `${color}${Math.round(opacity * 2.55).toString(16).padStart(2, '0')}`
}

/**
 * 生成带主题色的按钮 hover 样式
 */
export const getThemeButtonHoverStyles = (primaryColor: string) => ({
  onMouseEnter: (e: React.MouseEvent<HTMLElement>) => {
    e.currentTarget.style.color = primaryColor
    e.currentTarget.style.backgroundColor = primaryColor + '15'
  },
  onMouseLeave: (e: React.MouseEvent<HTMLElement>) => {
    e.currentTarget.style.color = '#94a3b8'
    e.currentTarget.style.backgroundColor = 'transparent'
  }
})

/**
 * 生成带主题色的边框 hover 样式
 */
export const getThemeBorderHoverStyles = (primaryColor: string, isDark: boolean) => ({
  onMouseEnter: (e: React.MouseEvent<HTMLElement>) => {
    e.currentTarget.style.borderColor = primaryColor + (isDark ? '50' : '40')
  },
  onMouseLeave: (e: React.MouseEvent<HTMLElement>) => {
    e.currentTarget.style.borderColor = isDark ? '' : primaryColor + '20'
  }
})

/**
 * 生成带主题色的文字 hover 样式
 */
export const getThemeTextHoverStyles = (primaryColor: string) => ({
  onMouseEnter: (e: React.MouseEvent<HTMLElement>) => {
    e.currentTarget.style.color = primaryColor
  },
  onMouseLeave: (e: React.MouseEvent<HTMLElement>) => {
    e.currentTarget.style.color = ''
  }
})

/**
 * 生成带主题色的统计卡片样式
 */
export const getThemeStatCardStyles = (primaryColor: string) => ({
  backgroundColor: primaryColor + '15',
  borderColor: primaryColor + '30',
  color: primaryColor
})

/**
 * 生成带主题色的渐变背景
 */
export const getThemeGradient = (primaryColor: string, secondaryColor?: string) => {
  const secondary = secondaryColor || primaryColor
  return `linear-gradient(135deg, ${primaryColor}, ${secondary})`
}

/**
 * 生成带主题色的激活状态样式
 */
export const getThemeActiveStyles = (primaryColor: string) => ({
  background: `linear-gradient(135deg, ${primaryColor}15, ${primaryColor}25)`,
  borderLeft: `3px solid ${primaryColor}`,
  color: primaryColor
})

