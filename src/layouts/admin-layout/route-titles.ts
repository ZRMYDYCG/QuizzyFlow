import type { MenuProps } from 'antd'
import { sideMenuItems } from './config'

/** 从菜单项递归收集 path -> title */
function collectMenuTitles(
  items: MenuProps['items'],
  map: Record<string, string>
): void {
  items?.forEach((item) => {
    if (!item || typeof item !== 'object' || !('key' in item)) return

    const key = String(item.key)
    if (key.startsWith('/admin') && typeof item.label === 'string') {
      map[key] = item.label
    }

    if ('children' in item && item.children) {
      collectMenuTitles(item.children, map)
    }
  })
}

/** 非菜单路由（面包屑子路径等） */
const extraRouteTitles: Record<string, string> = {
  '/admin': '管理后台',
  '/admin/settings/basic': '基本设置',
  '/admin/settings/security': '安全设置',
  '/admin/settings/notification': '通知设置',
}

const adminRouteTitleMap: Record<string, string> = {}
collectMenuTitles(sideMenuItems, adminRouteTitleMap)
Object.assign(adminRouteTitleMap, extraRouteTitles)

/**
 * 根据路径获取管理后台页面标题（菜单、面包屑、标签页共用）
 */
export function getAdminRouteTitle(path: string): string {
  if (adminRouteTitleMap[path]) {
    return adminRouteTitleMap[path]
  }

  // 逐级回退父路径，例如 /admin/templates/list/xxx -> 模板列表
  const segments = path.split('/').filter(Boolean)
  for (let i = segments.length; i >= 2; i--) {
    const parentPath = `/${segments.slice(0, i).join('/')}`
    if (adminRouteTitleMap[parentPath]) {
      return adminRouteTitleMap[parentPath]
    }
  }

  return '未知页面'
}

/** 面包屑使用的完整路由标题映射 */
export const adminBreadcrumbTitleMap: Record<string, string> = {
  ...adminRouteTitleMap,
}
