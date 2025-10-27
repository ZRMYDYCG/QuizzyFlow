import React, { useMemo } from 'react'
import { useLocation, Link } from 'react-router-dom'
import { ChevronRight, Home } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'

/**
 * 面包屑项配置
 */
export interface BreadcrumbItem {
  path: string
  title: string
  icon?: React.ReactNode
}

/**
 * 面包屑路由映射配置
 * 支持无限层级嵌套
 */
const breadcrumbNameMap: Record<string, string> = {
  '/admin': '管理后台',
  '/admin/dashboard': '数据大盘',
  '/admin/users': '用户管理',
  '/admin/roles': '角色管理',
  '/admin/permissions': '权限管理',
  '/admin/questions': '问卷管理',
  '/admin/logs': '操作日志',
  '/admin/settings': '系统设置',
  '/admin/settings/basic': '基本设置',
  '/admin/settings/security': '安全设置',
  '/admin/settings/notification': '通知设置',
}

/**
 * 管理后台面包屑组件
 * 支持无限递归层级
 */
const AdminBreadcrumb: React.FC = () => {
  const location = useLocation()
  const { theme } = useTheme()

  // 根据当前路径生成面包屑数据
  const breadcrumbs = useMemo(() => {
    const pathSnippets = location.pathname.split('/').filter((i) => i)
    const items: BreadcrumbItem[] = []

    // 始终添加管理员端
    items.push({
      path: '/admin/dashboard',
      title: '管理员端',
      icon: <Home className="w-3.5 h-3.5" strokeWidth={2} />,
    })

    // 递归生成面包屑路径
    let currentPath = ''
    pathSnippets.forEach((snippet, index) => {
      currentPath += `/${snippet}`
      
      // 如果当前路径在配置中，则添加到面包屑
      if (breadcrumbNameMap[currentPath]) {
        // 跳过第一个 /admin，因为已经有首页了
        if (currentPath !== '/admin') {
          items.push({
            path: currentPath,
            title: breadcrumbNameMap[currentPath],
          })
        }
      }
    })

    return items
  }, [location.pathname])

  // 如果只有首页，不显示面包屑
  if (breadcrumbs.length <= 1) {
    return null
  }

  return (
    <nav className="flex items-center gap-1.5 ml-2 overflow-hidden">
      {breadcrumbs.map((item, index) => {
        const isLast = index === breadcrumbs.length - 1
        const isFirst = index === 0

        return (
          <div key={item.path} className="flex items-center gap-1.5">
            {/* 分隔符 */}
            {!isFirst && (
              <ChevronRight 
                className={`w-3.5 h-3.5 flex-shrink-0 ${
                  theme === 'dark' ? 'text-slate-500' : 'text-gray-400'
                }`}
                strokeWidth={2}
              />
            )}

            {/* 面包屑项 */}
            {isLast ? (
              // 当前页面 - 不可点击
              <div
                className={`
                  flex items-center gap-1.5 text-sm font-medium whitespace-nowrap
                  ${theme === 'dark' ? 'text-slate-300' : 'text-gray-700'}
                `}
              >
                {item.icon}
                <span className="hidden md:inline">{item.title}</span>
              </div>
            ) : (
              // 父级页面 - 可点击
              <Link
                to={item.path}
                className={`
                  flex items-center gap-1.5 text-sm whitespace-nowrap transition-colors
                  ${theme === 'dark' 
                    ? 'text-slate-400 hover:text-slate-200' 
                    : 'text-gray-500 hover:text-gray-700'
                  }
                `}
              >
                {item.icon}
                <span className="hidden md:inline">{item.title}</span>
              </Link>
            )}
          </div>
        )
      })}
    </nav>
  )
}

export default AdminBreadcrumb

