import { useState, useEffect } from 'react'

/**
 * 响应式断点定义
 */
export const BREAKPOINTS = {
  xs: 0,      // 极小屏幕（手机竖屏）
  sm: 640,    // 小屏幕（手机横屏）
  md: 768,    // 中等屏幕（平板竖屏）
  lg: 1024,   // 大屏幕（平板横屏/小笔记本）
  xl: 1280,   // 超大屏幕（桌面）
  xxl: 1536,  // 超超大屏幕（大桌面）
} as const

/**
 * 当前屏幕尺寸类型
 */
export type ScreenSize = keyof typeof BREAKPOINTS

/**
 * 响应式状态接口
 */
export interface ResponsiveState {
  isMobile: boolean      // 是否为移动端（< 768px）
  isTablet: boolean      // 是否为平板（768px - 1024px）
  isDesktop: boolean     // 是否为桌面（>= 1024px）
  screenSize: ScreenSize // 当前屏幕尺寸
  width: number          // 当前窗口宽度
  height: number         // 当前窗口高度
}

/**
 * 获取当前屏幕尺寸类型
 */
const getScreenSize = (width: number): ScreenSize => {
  if (width >= BREAKPOINTS.xxl) return 'xxl'
  if (width >= BREAKPOINTS.xl) return 'xl'
  if (width >= BREAKPOINTS.lg) return 'lg'
  if (width >= BREAKPOINTS.md) return 'md'
  if (width >= BREAKPOINTS.sm) return 'sm'
  return 'xs'
}

/**
 * 获取响应式状态
 */
const getResponsiveState = (width: number, height: number): ResponsiveState => {
  const screenSize = getScreenSize(width)
  
  return {
    isMobile: width < BREAKPOINTS.md,
    isTablet: width >= BREAKPOINTS.md && width < BREAKPOINTS.lg,
    isDesktop: width >= BREAKPOINTS.lg,
    screenSize,
    width,
    height,
  }
}

/**
 * 响应式断点 Hook
 * 
 * 使用示例：
 * ```tsx
 * const { isMobile, isTablet, isDesktop, screenSize } = useResponsive()
 * 
 * if (isMobile) {
 *   return <MobileLayout />
 * }
 * 
 * return <DesktopLayout />
 * ```
 */
export const useResponsive = (): ResponsiveState => {
  const [state, setState] = useState<ResponsiveState>(() =>
    getResponsiveState(window.innerWidth, window.innerHeight)
  )

  useEffect(() => {
    const handleResize = () => {
      setState(getResponsiveState(window.innerWidth, window.innerHeight))
    }

    // 使用防抖优化性能
    let timeoutId: NodeJS.Timeout
    const debouncedResize = () => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(handleResize, 150)
    }

    window.addEventListener('resize', debouncedResize)
    
    return () => {
      clearTimeout(timeoutId)
      window.removeEventListener('resize', debouncedResize)
    }
  }, [])

  return state
}

/**
 * 检查是否为移动端的简单 Hook
 */
export const useIsMobile = (): boolean => {
  const { isMobile } = useResponsive()
  return isMobile
}

/**
 * 检查是否匹配指定断点
 */
export const useMediaQuery = (minWidth: number): boolean => {
  const [matches, setMatches] = useState(() => window.innerWidth >= minWidth)

  useEffect(() => {
    const handleResize = () => {
      setMatches(window.innerWidth >= minWidth)
    }

    let timeoutId: NodeJS.Timeout
    const debouncedResize = () => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(handleResize, 150)
    }

    window.addEventListener('resize', debouncedResize)
    
    return () => {
      clearTimeout(timeoutId)
      window.removeEventListener('resize', debouncedResize)
    }
  }, [minWidth])

  return matches
}

