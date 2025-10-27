import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Result, Button } from 'antd'
import { useGetUserInfo } from '@/hooks/useGetUserInfo'

/**
 * 403 禁止访问页面
 */
const Forbidden: React.FC = () => {
  const navigate = useNavigate()
  const { username, role } = useGetUserInfo()

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Result
        status="403"
        title="403"
        subTitle="抱歉，您没有权限访问此页面。"
        extra={
          <div className="space-x-3">
            <Button type="primary" onClick={() => navigate('/manage/list')}>
              返回问卷管理
            </Button>
            <Button onClick={() => navigate(-1)}>
              返回上一页
            </Button>
          </div>
        }
      >
        {username && (
          <div className="text-gray-500 text-sm mt-4">
            当前用户：{username} | 角色：{role || 'user'}
          </div>
        )}
      </Result>
    </div>
  )
}

export default Forbidden

