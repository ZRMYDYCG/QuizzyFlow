import { useMemo } from 'react'
import type { MenuProps } from 'antd'
import { usePermission } from './usePermission'

type MenuItem = NonNullable<MenuProps['items']>[number]

function filterMenuByRoute(
  items: MenuProps['items'],
  hasRoute: (path: string) => boolean
): MenuProps['items'] {
  if (!items) return []

  return items
    .map((item) => {
      if (!item || typeof item !== 'object' || !('key' in item)) {
        return item
      }

      const menuItem = item as MenuItem & {
        key?: string
        children?: MenuProps['items']
      }

      if (menuItem.children?.length) {
        const children = filterMenuByRoute(menuItem.children, hasRoute)
        if (!children?.length) return null
        return { ...menuItem, children }
      }

      const path = String(menuItem.key)
      return hasRoute(path) ? menuItem : null
    })
    .filter(Boolean) as MenuProps['items']
}

/**
 * 按用户已授权路由过滤管理后台菜单
 */
export function useAdminMenu(items: MenuProps['items']): MenuProps['items'] {
  const { hasRoute, isSuperAdmin } = usePermission()

  return useMemo(() => {
    if (isSuperAdmin()) return items
    return filterMenuByRoute(items, hasRoute)
  }, [items, hasRoute, isSuperAdmin])
}
