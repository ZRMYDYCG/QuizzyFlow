import { useEffect, useRef } from 'react'
import { useGetUserInfo } from './useGetUserInfo'
import { useLocation, useNavigate } from 'react-router-dom'
import { ROLES } from '@/constants/roles'

/**
 * 路由导航守卫 Hook
 * 统一处理所有路由级别的权限拦截和重定向
 */
export const useNavPage = (waitingUserData: boolean) => {
  const { username, token, role } = useGetUserInfo()
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const lastPathRef = useRef<string>('')

  useEffect(() => {
    // 防止重复拦截同一个路径
    if (lastPathRef.current === pathname) {
      return
    }
    lastPathRef.current = pathname

    // 等待用户数据加载完成
    if (waitingUserData) {
      return
    }

    // 无需认证的公开路径（这些路径任何人都可以访问）
    const publicPaths = [
      '/',
      '/login',
      '/register',
      '/forgot-password',
      '/terms',
      '/privacy',
      '/debug-auth',
      '/403',
      '/404',
    ]

    // 检查是否为公开路径
    const isPublicPath = publicPaths.includes(pathname)
    
    // 发布页面路径（允许公开访问，含旧版 /question/:id 短链）
    const legacyPublishMatch = pathname.match(/^\/question\/([^/]+)$/)
    const isLegacyPublishPath =
      legacyPublishMatch !== null &&
      !['edit', 'statistics', 'publish', 'static'].includes(legacyPublishMatch[1])
    const isPublishPath =
      pathname.startsWith('/question/publish/') || isLegacyPublishPath
    
    // admin 路径（需要管理员权限）
    const isAdminPath = pathname.startsWith('/admin')
    
    // 判断是否为管理员
    const isAdmin = role === ROLES.ADMIN || role === ROLES.SUPER_ADMIN

    // ========== 公开路径，直接放行 ==========
    if (isPublicPath || isPublishPath) {
      // 已登录用户访问登录/注册页，重定向
      if ((pathname === '/login' || pathname === '/register') && token && username) {
        if (isAdmin) {
          navigate('/admin/dashboard', { replace: true })
        } else {
          navigate('/manage/list', { replace: true })
        }
      }
      return
    }

    // ========== 需要认证的路径 ==========
    
    // 未登录，重定向到登录页
    if (!token || !username) {
      console.log('🔒 未登录，重定向到登录页', { pathname })
      navigate('/login', { replace: true })
      return
    }
    
  }, [username, token, role, pathname, waitingUserData, navigate])
}
