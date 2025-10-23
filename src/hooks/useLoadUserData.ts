import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useRequest } from 'ahooks'
import { getUserInfo } from '@/api/modules/user'
import { loginReducer, logoutReducer } from '@/store/modules/user'
import useGetUserInfo from './useGetUserInfo'

/**
 * 用户数据加载 Hook
 * 在应用启动时自动检查 token 并加载用户信息
 */
const useLoadUserData = () => {
  const dispatch = useDispatch()
  const { token } = useGetUserInfo()

  const { run: fetchUserInfo } = useRequest(
    async () => {
      const userInfo = await getUserInfo()
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
            token,
          })
        )
      },
      onError: () => {
        // Token 无效，清除登录状态
        localStorage.removeItem('token')
        dispatch(logoutReducer())
      },
    }
  )

  useEffect(() => {
    // 检查是否有 token
    const savedToken = localStorage.getItem('token')
    
    if (savedToken && !token) {
      // 有 token 但 Redux 中没有用户信息，需要获取
      fetchUserInfo()
    }
  }, [])

  return {}
}

export default useLoadUserData
