import { useEffect } from 'react'
import { useGetUserInfo } from './useGetUserInfo'
import { useLocation, useNavigate } from 'react-router-dom'

export const useNavPage = (waitingUserData: boolean) => {
  const { username } = useGetUserInfo()
  const { pathname } = useLocation()
  const navigate = useNavigate()
  
  // 无需认证的路径
  const isNoAuthPath = ['/', '/login', '/register', '/forgot-password', '/terms', '/privacy']
  
  // 发布页面路径模式（允许公开访问已发布的问卷）
  const isPublishPath = pathname.startsWith('/question/publish/')
  
  // admin 路径由 AdminLayout 自己处理权限，不在这里拦截
  const isAdminPath = pathname.startsWith('/admin')

  useEffect(() => {
    console.log('🔒 useNavPage 检查:', { pathname, username: username || '未登录', waitingUserData, isAdminPath })
    
    if (waitingUserData) {
      console.log('  → 等待用户数据加载...')
      return
    }

    if (username) {
      if (pathname === '/login' || pathname === '/register') {
        console.log('  → 已登录用户访问登录/注册页，重定向到 /manage/list')
        navigate('/manage/list')
      }
      return
    }
    
    // 如果是 admin 路径，不在这里拦截（让 AdminLayout 处理）
    if (isAdminPath) {
      console.log('  → admin 路径，交给 AdminLayout 处理')
      return
    }
    
    // 如果是无需认证的路径或发布页面，允许访问
    if (isNoAuthPath.includes(pathname) || isPublishPath) {
      console.log('  → 无需认证的路径，允许访问')
      return
    } else {
      console.log('  → 需要认证但未登录，重定向到 /login')
      navigate('/login')
    }
  }, [username, pathname, waitingUserData, isPublishPath, isAdminPath])
}
