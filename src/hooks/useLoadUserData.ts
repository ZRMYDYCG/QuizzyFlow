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
  const { token, username } = useGetUserInfo()

  const { run: fetchUserInfo, loading } = useRequest(
    async () => {
      console.log('📡 useLoadUserData: 开始调用 getUserProfile API')
      const userInfo = await getUserProfile()
      console.log('📡 useLoadUserData: API 返回成功', {
        username: userInfo.username,
        role: userInfo.role
      })
      return userInfo
    },
    {
      manual: true,
      onSuccess: (userInfo: any) => {
        const token = localStorage.getItem('token') || ''
        console.log('📡 useLoadUserData: onSuccess - 更新 Redux')
        
        // 存储用户信息到 Redux（包含所有字段）
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
        
        console.log('📡 useLoadUserData: Redux 更新完成')
      },
      onError: (error: any) => {
        console.error('❌ useLoadUserData: API 调用失败', error)
        // Token 无效，清除登录状态
        localStorage.removeItem('token')
        dispatch(logoutReducer())
      },
    }
  )

  useEffect(() => {
    const savedToken = localStorage.getItem('token')
    
    console.log('📡 useLoadUserData: 初始化检查')
    console.log('  - localStorage token:', !!savedToken)
    console.log('  - Redux token:', !!token)
    console.log('  - Redux username:', username || '未加载')
    
    // 只有当 localStorage 有 token 但 Redux 没有时才加载
    if (savedToken && !token) {
      console.log('📡 useLoadUserData: 触发 fetchUserInfo')
      fetchUserInfo()
    } else {
      console.log('📡 useLoadUserData: 无需加载')
    }
  }, []) // 只在挂载时执行一次

  // 关键修复：只要 Redux 有 username，就认为数据已加载完成
  const waitingUserData = loading || (!!token && !username)
  
  console.log('📡 useLoadUserData: 状态返回')
  console.log('  - loading (API请求中):', loading)
  console.log('  - token 存在:', !!token)
  console.log('  - username 存在:', !!username)
  console.log('  - waitingUserData:', waitingUserData)
  
  return { waitingUserData }
}
