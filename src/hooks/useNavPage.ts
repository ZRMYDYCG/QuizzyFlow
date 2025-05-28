import { useEffect } from 'react'
import useGetUserInfo from './useGetUserInfo.ts'
import { useLocation, useNavigate } from 'react-router-dom'

const useNavPage = (waitingUserData: boolean) => {
  const { username } = useGetUserInfo()
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const isNoAuthPath = ['/', '/login', '/register']

  useEffect(() => {
    if (waitingUserData) return

    if (username) {
      if (pathname === '/login' || pathname === '/register') {
        navigate('/manage/list')
      }
      return
    }
    if (isNoAuthPath.includes(pathname)) {
      return
    } else {
      navigate('/login')
    }
  }, [username, pathname, waitingUserData])
}

export default useNavPage
