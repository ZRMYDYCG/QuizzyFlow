import { useEffect } from 'react'
import useGetUserInfo from './useGetUserInfo.ts'
import { useLocation, useNavigate } from 'react-router-dom'

const useNavPage = (waitingUserData: boolean) => {
  const { username } = useGetUserInfo()
  const { pathname } = useLocation()
  const navigate = useNavigate()
  
  // 无需认证的路径
  const isNoAuthPath = ['/', '/login', '/register', '/forgot-password', '/terms', '/privacy']
  
  // 发布页面路径模式（允许公开访问已发布的问卷）
  const isPublishPath = pathname.startsWith('/question/publish/')

  useEffect(() => {
    if (waitingUserData) return

    if (username) {
      if (pathname === '/login' || pathname === '/register') {
        navigate('/manage/list')
      }
      return
    }
    
    // 如果是无需认证的路径或发布页面，允许访问
    if (isNoAuthPath.includes(pathname) || isPublishPath) {
      return
    } else {
      navigate('/login')
    }
  }, [username, pathname, waitingUserData, isPublishPath])
}

export default useNavPage
