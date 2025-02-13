import { Button, Spin } from 'antd'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import useLoadUserData from '../../../../hooks/useLoadUserData.ts'
import { logoutReducer } from '../../../../store/modules/user.ts'
import useGetUserInfo from '../../../../hooks/useGetUserInfo.ts'

const Header = () => {
  const { username, nickname } = useGetUserInfo()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { waitingUserData } = useLoadUserData()

  const logout = () => {
    navigate('/login')
    localStorage.removeItem('token')
    dispatch(logoutReducer())
  }

  const UserInfo = () => {
    return (
      <>
        {waitingUserData ? (
          <Spin size="small" />
        ) : (
          <div className="flex items-center">
            <span className="mr-2">{nickname || username}</span>
            <div className="w-[40px] h-[40px] shadow-sm rounded-full overflow-hidden">
              <img
                src="https://pica.zhimg.com/v2-e2a7c3693c58a1e5ea1ad900155a8c34_r.jpg"
                alt="avatar"
                className="w-full h-full object-cover"
              />
            </div>
            <Button type="text" onClick={logout}>
              退出
            </Button>
          </div>
        )}
      </>
    )
  }

  // const Login = () => {
  //     return (
  //         <Button type="primary" onClick={() => {navigate('/login')}}>登录</Button>
  //     )
  // }

  return (
    <div className="flex justify-between items-center py-2 px-4 md:px-[50px] shadow">
      <div className="flex items-center">
        <img src="/public/vite.svg" alt="logo" className="h-12" />
        <span className="ml-2 text-lg">一刻问卷星</span>
      </div>
      <UserInfo />
    </div>
  )
}

export default Header
