import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { logoutReducer } from '@/store/modules/user'
import { message } from 'antd'

/**
 * 登出 Hook
 */
export const useLogout = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const logout = () => {
    // 1. 清除 localStorage
    localStorage.removeItem('token')
    
    // 2. 清除 Redux store
    dispatch(logoutReducer())
    
    // 3. 提示用户
    message.success('已退出登录')
    
    // 4. 跳转到登录页
    navigate('/login', { replace: true })
  }

  return { logout }
}

export default useLogout

