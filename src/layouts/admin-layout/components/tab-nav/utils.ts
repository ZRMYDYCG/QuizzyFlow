import type { TabItem } from './types'

/** 本地存储 key */
const STORAGE_KEY = 'admin_tabs_cache'

/** 从本地存储加载标签页 */
export const loadTabsFromStorage = (): TabItem[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.error('Failed to load tabs:', error)
    return []
  }
}

/** 保存标签页到本地存储 */
export const saveTabsToStorage = (tabs: TabItem[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tabs))
  } catch (error) {
    console.error('Failed to save tabs:', error)
  }
}

/** 根据路径获取页面标题 */
export const getPageTitle = (path: string): string => {
  const titleMap: Record<string, string> = {
    '/admin/dashboard': '仪表板',
    '/admin/users': '用户管理',
    '/admin/roles': '角色管理',
    '/admin/permissions': '权限管理',
    '/admin/questions': '问卷管理',
    '/admin/logs': '操作日志',
    '/admin/settings': '系统设置',
  }
  return titleMap[path] || '未知页面'
}

/** 检查路径是否为首页 */
export const isHomePath = (path: string): boolean => {
  return path === '/admin/dashboard'
}

/** 获取当前标签的索引 */
export const getCurrentTabIndex = (tabs: TabItem[], path: string): number => {
  return tabs.findIndex((tab) => tab.path === path)
}