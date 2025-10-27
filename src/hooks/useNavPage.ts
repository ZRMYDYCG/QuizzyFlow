import { useEffect } from 'react'
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
  
  // 无需认证的公开路径
  const publicPaths = ['/', '/login', '/register', '/forgot-password', '/terms', '/privacy', '/debug-auth']
  
  // 发布页面路径（允许公开访问）
  const isPublishPath = pathname.startsWith('/question/publish/')
  
  // admin 路径（需要管理员权限）
  const isAdminPath = pathname.startsWith('/admin')
  
  // 判断是否为管理员
  const isAdmin = role === ROLES.ADMIN || role === ROLES.SUPER_ADMIN

  useEffect(() => {
    // 等待用户数据加载完成
    if (waitingUserData) {
      return
    }

    // ========== 未登录用户处理 ==========
    if (!token || !username) {
      // 访问 admin 路径，重定向到登录页
      if (isAdminPath) {
        navigate('/login', { replace: true })
        return
      }
      
      // 访问需要认证的路径，重定向到登录页
      if (!publicPaths.includes(pathname) && !isPublishPath) {
        navigate('/login', { replace: true })
      }
      return
    }

    // ========== 已登录用户处理 ==========
    
    // 访问登录/注册页，重定向到对应页面
    if (pathname === '/login' || pathname === '/register') {
      // 管理员重定向到管理后台
      if (isAdmin) {
        navigate('/admin/dashboard', { replace: true })
      } else {
        // 普通用户重定向到问卷列表
        navigate('/manage/list', { replace: true })
      }
      return
    }
    
    // 访问 admin 路径，检查权限
    if (isAdminPath) {
      // 不是管理员，重定向到问卷列表
      if (!isAdmin) {
        navigate('/manage/list', { replace: true })
        return
      }
      // 是管理员，允许访问
    }
    
  }, [username, token, role, pathname, waitingUserData, isPublishPath, isAdminPath, isAdmin, navigate])
}
