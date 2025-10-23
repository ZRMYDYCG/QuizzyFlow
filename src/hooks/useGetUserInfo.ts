import { useSelector } from 'react-redux'
import { stateType } from '../store'
import { IUserState } from '../store/modules/user.ts'

const useGetUserInfo = () => {
  const user = useSelector<stateType>((state) => state.user) as IUserState
  
  return {
    ...user,
    // 便捷的 token 检查
    isLoggedIn: !!user.token,
  }
}

export default useGetUserInfo
