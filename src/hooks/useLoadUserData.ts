import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useRequest } from 'ahooks'
import { getUserProfile } from '@/api/modules/user'
import { loginReducer, logoutReducer } from '@/store/modules/user'
import { setUserPermissions } from '@/store/modules/admin'
import { useGetUserInfo } from './useGetUserInfo'

/**
 * 用户数据加载 Hook
 * 在应用启动时自动检查 token 并加载用户信息
 */
export const useLoadUserData = () => {
  const dispatch = useDispatch()
  const { token } = useGetUserInfo()

  const { run: fetchUserInfo, loading } = useRequest(
    async () => {
      const userInfo = await getUserProfile()
      return userInfo
    },
    {
      manual: true,
      onSuccess: (userInfo: any) => {
        const token = localStorage.getItem('token') || ''
        
        // 存储用户信息到 Redux
        dispatch(
          loginReducer({
            _id: userInfo._id,
            username: userInfo.username,
            nickname: userInfo.nickname,
            isActive: userInfo.isActive,
            lastLoginAt: userInfo.lastLoginAt,
            createdAt: userInfo.createdAt,
            updatedAt: userInfo.updatedAt,
            avatar: userInfo.avatar || '',
            bio: userInfo.bio || '',
            phone: userInfo.phone || '',
            preferences: userInfo.preferences || {
              theme: 'light',
              language: 'zh-CN',
              editorSettings: {
                autoSave: true,
                autoSaveInterval: 30,
                defaultScale: 1,
                showGrid: true,
                showRulers: true,
              },
              listView: 'card',
            },
            role: userInfo.role || 'user',
            customPermissions: userInfo.customPermissions || [],
            isBanned: userInfo.isBanned || false,
            token,
          })
        )
        
        // 如果是管理员，加载权限信息到 admin store
        if (userInfo.role === 'admin' || userInfo.role === 'super_admin') {
          dispatch(
            setUserPermissions({
              role: userInfo.role,
              permissions: [],
              customPermissions: userInfo.customPermissions || [],
            })
          )
        }
      },
      onError: (error: Error) => {
        // Token 无效或用户已被删除/封禁，清除登录状态
        localStorage.removeItem('token')
        dispatch(logoutReducer())
        if (error.message && !window.location.pathname.startsWith('/login')) {
          console.warn('用户会话已失效:', error.message)
        }
      },
    }
  )

  useEffect(() => {
    const savedToken = localStorage.getItem('token')
    
    // 如果 localStorage 有 token 但 Redux 没有，则加载用户数据
    if (savedToken && !token) {
      fetchUserInfo()
    }
  }, [])

  const savedToken = localStorage.getItem('token')
  const waitingUserData = loading || (!!savedToken && !token)
  
  return { waitingUserData }
}
