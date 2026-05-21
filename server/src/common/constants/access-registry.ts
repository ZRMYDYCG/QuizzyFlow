import { ADMIN_ASSIGNABLE_PERMISSION_CODES } from './admin-assignable'

/**
 * 管理后台页面路由注册表（仅路由，与操作权限无关）
 */
export interface AdminRouteNode {
  path: string
  name: string
  children?: AdminRouteNode[]
}

export const ADMIN_ROUTE_REGISTRY: AdminRouteNode[] = [
  { path: '/admin/dashboard', name: '数据大盘' },
  { path: '/admin/users', name: '用户管理' },
  { path: '/admin/roles', name: '角色管理' },
  { path: '/admin/permissions', name: '权限目录' },
  { path: '/admin/questions', name: '问卷管理' },
  {
    path: '/admin/templates',
    name: '模板管理',
    children: [
      { path: '/admin/templates/list', name: '模板列表' },
      { path: '/admin/templates/review', name: '审核中心' },
      { path: '/admin/templates/categories', name: '分类管理' },
      { path: '/admin/templates/statistics', name: '统计数据' },
    ],
  },
  {
    path: '/admin/answers',
    name: '答卷管理',
    children: [
      { path: '/admin/answers/list', name: '答卷列表' },
      { path: '/admin/answers/statistics', name: '统计分析' },
    ],
  },
  {
    path: '/admin/moderation',
    name: '内容审核',
    children: [
      { path: '/admin/moderation/queue', name: '待审核队列' },
      { path: '/admin/moderation/sensitive-words', name: '敏感词管理' },
      { path: '/admin/moderation/statistics', name: '审核统计' },
    ],
  },
  {
    path: '/admin/feedback',
    name: '反馈管理',
    children: [
      { path: '/admin/feedback/list', name: '反馈列表' },
      { path: '/admin/feedback/statistics', name: '反馈统计' },
    ],
  },
  { path: '/admin/logs', name: '操作日志' },
  { path: '/admin/settings', name: '系统设置' },
]

/** @deprecated 使用 ADMIN_ROUTE_REGISTRY */
export const ADMIN_ACCESS_REGISTRY = ADMIN_ROUTE_REGISTRY

export type AccessRouteNode = AdminRouteNode

export function flattenAccessRoutes(
  nodes: AdminRouteNode[] = ADMIN_ROUTE_REGISTRY,
): AdminRouteNode[] {
  const result: AdminRouteNode[] = []
  const walk = (list: AdminRouteNode[]) => {
    for (const node of list) {
      result.push(node)
      if (node.children?.length) walk(node.children)
    }
  }
  walk(nodes)
  return result
}

export function findRouteNode(path: string): AdminRouteNode | undefined {
  return flattenAccessRoutes().find((r) => r.path === path)
}

/** 子路由继承父路由：若父路由已授权，子路由视为可访问 */
export function resolveAccessibleRoutes(grantedRoutes: string[]): Set<string> {
  const accessible = new Set<string>()
  const allRoutes = flattenAccessRoutes()

  for (const route of allRoutes) {
    const hasDirect = grantedRoutes.includes(route.path)
    const parentPath = route.path.substring(0, route.path.lastIndexOf('/'))
    const hasParent =
      parentPath.length > '/admin'.length && grantedRoutes.includes(parentPath)

    if (hasDirect || hasParent) {
      accessible.add(route.path)
    }
  }
  return accessible
}

export function validateGrantedAccess(
  grantedRoutes: string[],
  grantedPermissions: string[],
): { routes: string[]; buttons: string[] } {
  const validPaths = new Set(flattenAccessRoutes().map((r) => r.path))
  const validPermissions = new Set(ADMIN_ASSIGNABLE_PERMISSION_CODES)
  return {
    routes: grantedRoutes.filter((p) => validPaths.has(p)),
    buttons: grantedPermissions.filter((c) => validPermissions.has(c)),
  }
}
