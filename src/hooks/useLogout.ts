import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { logoutReducer } from '@/store/modules/user'
import { resetAdminState } from '@/store/modules/admin'
import { message } from 'antd'

/**
 * 退出登录 Hook
 * 统一处理所有退出登录逻辑
 */
export const useLogout = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  /**
   * 执行退出登录
   */
  const logout = () => {
    // 1. 清除 localStorage 中的 token
    localStorage.removeItem('token')
    
    // 2. 清除 Redux store 中的用户数据
    dispatch(logoutReducer())
    
    // 3. 清除 Redux store 中的管理员数据
    dispatch(resetAdminState())
    
    // 4. 提示用户
    message.success('已退出登录')
    
    // 5. 跳转到登录页
    navigate('/login', { replace: true })
  }

  return { logout }
}

export default useLogout

