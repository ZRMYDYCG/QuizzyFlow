import { useState, useEffect, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  loadTabsFromStorage, 
  saveTabsToStorage, 
  getPageTitle,
  isHomePath,
  type TabItem 
} from '../components/tab-nav'

/**
 * 标签页导航 Hook
 * 
 * 核心逻辑：
 * 1. 维护标签列表状态
 * 2. 路径变化时自动添加新标签
 * 3. 关闭标签时智能导航到合适的位置
 * 4. 所有操作持久化到 localStorage
 */
export const useTabNav = (currentPath: string) => {
  const navigate = useNavigate()
  const [tabs, setTabs] = useState<TabItem[]>(() => {
    // 初始化：从 localStorage 加载，确保首页存在
    const storedTabs = loadTabsFromStorage()
    const hasHome = storedTabs.some(tab => isHomePath(tab.path))
    
    if (!hasHome) {
      storedTabs.unshift({
        path: '/admin/dashboard',
        title: '仪表板',
        closable: false,
      })
    }
    
    return storedTabs
  })
  
  const prevPathRef = useRef(currentPath)

  /**
   * 监听路径变化，自动添加新标签
   */
  useEffect(() => {
    // 避免重复处理相同路径
    if (prevPathRef.current === currentPath) return
    prevPathRef.current = currentPath
    
    // 只处理 admin 路径
    if (!currentPath?.startsWith('/admin/')) return
    
    // 检查标签是否已存在
    const exists = tabs.some(tab => tab.path === currentPath)
    if (exists) return
    
    // 添加新标签
    const newTab: TabItem = {
      path: currentPath,
      title: getPageTitle(currentPath),
      closable: !isHomePath(currentPath),
    }
    
    const newTabs = [...tabs, newTab]
    setTabs(newTabs)
    saveTabsToStorage(newTabs)
  }, [currentPath, tabs])

  /**
   * 核心函数：更新标签列表并处理导航
   */
  const updateTabs = useCallback((
    newTabs: TabItem[],
    options?: {
      /** 如果当前标签被关闭，优先导航到此路径 */
      preferredPath?: string
      /** 强制导航到指定路径（无论当前标签是否被关闭） */
      forcePath?: string
    }
  ) => {
    setTabs(newTabs)
    saveTabsToStorage(newTabs)
    
    // 强制导航
    if (options?.forcePath) {
      navigate(options.forcePath)
      return
    }
    
    // 检查当前标签是否还存在
    const currentExists = newTabs.some(tab => tab.path === currentPath)
    if (currentExists) return
    
    // 当前标签被关闭，需要导航
    let targetPath: string
    
    if (options?.preferredPath && newTabs.some(tab => tab.path === options.preferredPath)) {
      // 使用指定的优先路径
      targetPath = options.preferredPath
    } else if (newTabs.length > 0) {
      // 导航到第一个标签
      targetPath = newTabs[0].path
    } else {
      // 没有标签了，导航到首页
      targetPath = '/admin/dashboard'
    }
    
    navigate(targetPath)
  }, [currentPath, navigate])

  /**
   * 点击标签 - 简单导航
   */
  const handleTabClick = useCallback((path: string) => {
    navigate(path)
  }, [navigate])

  /**
   * 关闭单个标签
   * 
   * 规则：
   * - 不可关闭的标签忽略
   * - 如果关闭的不是当前标签，直接关闭即可
   * - 如果关闭的是当前标签，优先导航到右侧，否则左侧
   */
  const handleTabClose = useCallback((closePath: string) => {
    const closeIndex = tabs.findIndex(tab => tab.path === closePath)
    if (closeIndex === -1) return
    
    const closeTab = tabs[closeIndex]
    if (closeTab.closable === false) return
    
    const newTabs = tabs.filter(tab => tab.path !== closePath)
    
    // 如果关闭的不是当前标签，不需要导航
    if (closePath !== currentPath) {
      setTabs(newTabs)
      saveTabsToStorage(newTabs)
      return
    }
    
    // 关闭的是当前标签，找到下一个目标
    let preferredPath: string | undefined
    
    // 优先右侧
    if (closeIndex < tabs.length - 1) {
      preferredPath = tabs[closeIndex + 1].path
    }
    // 其次左侧
    else if (closeIndex > 0) {
      preferredPath = tabs[closeIndex - 1].path
    }
    
    updateTabs(newTabs, { preferredPath })
  }, [tabs, currentPath, updateTabs])

  /**
   * 关闭其他标签
   * 
   * 保留：目标标签 + 所有不可关闭的标签
   */
  const handleCloseOthers = useCallback((keepPath: string) => {
    const newTabs = tabs.filter(
      tab => tab.path === keepPath || tab.closable === false
    )
    
    updateTabs(newTabs, { forcePath: keepPath })
  }, [tabs, updateTabs])

  /**
   * 关闭所有标签
   * 
   * 只保留不可关闭的标签
   */
  const handleCloseAll = useCallback(() => {
    const newTabs = tabs.filter(tab => tab.closable === false)
    
    updateTabs(newTabs, { forcePath: '/admin/dashboard' })
  }, [tabs, updateTabs])

  /**
   * 关闭左侧标签
   * 
   * 保留：左侧不可关闭的 + 目标及其右侧的所有标签
   */
  const handleCloseLeft = useCallback((targetPath: string) => {
    const targetIndex = tabs.findIndex(tab => tab.path === targetPath)
    if (targetIndex === -1) return
    
    const newTabs = [
      ...tabs.slice(0, targetIndex).filter(tab => tab.closable === false),
      ...tabs.slice(targetIndex),
    ]
    
    updateTabs(newTabs, { preferredPath: targetPath })
  }, [tabs, updateTabs])

  /**
   * 关闭右侧标签
   * 
   * 保留：目标及其左侧的所有标签 + 右侧不可关闭的
   */
  const handleCloseRight = useCallback((targetPath: string) => {
    const targetIndex = tabs.findIndex(tab => tab.path === targetPath)
    if (targetIndex === -1) return
    
    const newTabs = [
      ...tabs.slice(0, targetIndex + 1),
      ...tabs.slice(targetIndex + 1).filter(tab => tab.closable === false),
    ]
    
    updateTabs(newTabs, { preferredPath: targetPath })
  }, [tabs, updateTabs])

  return {
    tabs,
    handleTabClick,
    handleTabClose,
    handleCloseOthers,
    handleCloseAll,
    handleCloseLeft,
    handleCloseRight,
  }
}
