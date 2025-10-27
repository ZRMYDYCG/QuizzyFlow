import React from 'react'
import { Result, Button } from 'antd'
import { useNavigate } from 'react-router-dom'

const AdminNotFound: React.FC = () => {
  const navigate = useNavigate()

  return (
    <Result
      status="404"
      title="404"
      subTitle="抱歉，您访问的管理后台页面不存在"
      extra={
        <div className="space-x-2">
          <Button type="primary" onClick={() => navigate('/admin/dashboard')}>
            返回首页
          </Button>
          <Button onClick={() => navigate(-1)}>
            返回上一页
          </Button>
        </div>
      }
    />
  )
}

export default AdminNotFound

