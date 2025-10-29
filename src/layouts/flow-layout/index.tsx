import { FC } from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import { useGetUserInfo } from '@/hooks/useGetUserInfo'

const FlowLayout: FC = () => {
  const { token } = useGetUserInfo()

  if (!token) {
    return <Navigate to="/login" replace />
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <main className="flex-1 overflow-hidden">
        <Outlet />
      </main>
    </div>
  )
}

export default FlowLayout

