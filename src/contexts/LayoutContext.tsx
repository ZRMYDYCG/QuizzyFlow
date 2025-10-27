import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react'
import type { LayoutConfig } from '@/types/layout'
import { DEFAULT_LAYOUT_CONFIG } from '@/types/layout'

const STORAGE_KEY = 'quizzy_layout_config'

/**
 * 布局上下文类型
 */
interface LayoutContextType {
  /** 当前配置 */
  config: LayoutConfig
  
  /** 更新配置（部分更新） */
  updateConfig: (partial: Partial<LayoutConfig>) => void
  
  /** 重置为默认配置 */
  resetConfig: () => void
  
  /** 导出配置为 JSON 字符串 */
  exportConfig: () => string
  
  /** 从 JSON 字符串导入配置 */
  importConfig: (jsonString: string) => boolean
  
  /** 切换侧边栏折叠状态 */
  toggleSidebar: () => void
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined)

/**
 * 从 localStorage 加载配置
 */
const loadConfigFromStorage = (): LayoutConfig => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      // 合并默认配置，确保新增字段有默认值
      return { ...DEFAULT_LAYOUT_CONFIG, ...parsed }
    }
  } catch (error) {
    console.error('Failed to load layout config:', error)
  }
  return DEFAULT_LAYOUT_CONFIG
}

/**
 * 保存配置到 localStorage
 */
const saveConfigToStorage = (config: LayoutConfig): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config))
  } catch (error) {
    console.error('Failed to save layout config:', error)
  }
}

/**
 * 布局配置 Provider
 */
export const LayoutProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<LayoutConfig>(loadConfigFromStorage)

  // 配置变化时持久化到 localStorage
  useEffect(() => {
    saveConfigToStorage(config)
  }, [config])

  // 应用 CSS 变量 - 使用 useMemo 避免不必要的计算
  const cssVariables = useMemo(() => {
    let maxWidth = '100%'
    switch (config.containerWidth) {
      case 'fixed-1200':
        maxWidth = '1200px'
        break
      case 'fixed-1400':
        maxWidth = '1400px'
        break
      case 'fixed-1600':
        maxWidth = '1600px'
        break
    }
    return {
      '--sidebar-width': `${config.sidebarWidth}px`,
      '--sidebar-collapsed-width': '80px',
      '--tab-width': `${config.tabWidth}px`,
      '--transition-duration': `${config.transitionDuration}ms`,
      '--primary-color': config.primaryColor,
      '--container-max-width': maxWidth,
    }
  }, [config.sidebarWidth, config.tabWidth, config.transitionDuration, config.primaryColor, config.containerWidth])

  // 应用 CSS 变量
  useEffect(() => {
    const root = document.documentElement
    
    // 批量设置 CSS 变量以提升性能
    Object.entries(cssVariables).forEach(([key, value]) => {
      root.style.setProperty(key, value as string)
    })
    
    // 色弱模式
    if (config.colorWeaknessMode) {
      document.documentElement.classList.add('color-weakness')
    } else {
      document.documentElement.classList.remove('color-weakness')
    }
  }, [config.colorWeaknessMode, cssVariables])

  /**
   * 更新配置（部分更新）
   */
  const updateConfig = useCallback((partial: Partial<LayoutConfig>) => {
    setConfig(prev => ({ ...prev, ...partial }))
  }, [])

  /**
   * 重置配置
   */
  const resetConfig = useCallback(() => {
    setConfig(DEFAULT_LAYOUT_CONFIG)
  }, [])

  /**
   * 导出配置
   */
  const exportConfig = useCallback(() => {
    return JSON.stringify(config, null, 2)
  }, [config])

  /**
   * 导入配置
   */
  const importConfig = useCallback((jsonString: string): boolean => {
    try {
      const imported = JSON.parse(jsonString)
      // 验证基本结构
      if (typeof imported === 'object' && imported !== null) {
        setConfig({ ...DEFAULT_LAYOUT_CONFIG, ...imported })
        return true
      }
      return false
    } catch (error) {
      console.error('Failed to import config:', error)
      return false
    }
  }, [])

  /**
   * 切换侧边栏折叠状态
   */
  const toggleSidebar = useCallback(() => {
    setConfig(prev => ({ ...prev, sidebarCollapsed: !prev.sidebarCollapsed }))
  }, [])

  const value: LayoutContextType = {
    config,
    updateConfig,
    resetConfig,
    exportConfig,
    importConfig,
    toggleSidebar,
  }

  return (
    <LayoutContext.Provider value={value}>
      {children}
    </LayoutContext.Provider>
  )
}

/**
 * 使用布局配置的 Hook
 */
export const useLayoutConfig = () => {
  const context = useContext(LayoutContext)
  if (context === undefined) {
    throw new Error('useLayoutConfig must be used within a LayoutProvider')
  }
  return context
}

