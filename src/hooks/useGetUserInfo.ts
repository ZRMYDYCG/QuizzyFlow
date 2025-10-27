import { useSelector } from 'react-redux'
import type { stateType } from '@/store'
import type { IUserState } from '@/store/modules/user'

/**
 * 获取用户信息 Hook
 * 从 Redux store 中获取当前用户信息
 */
export const useGetUserInfo = () => {
  const user = useSelector<stateType>((state) => state.user) as IUserState
  
  return {
    ...user,
    isLoggedIn: !!user.token,
  }
}

