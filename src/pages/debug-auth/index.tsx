import React from 'react'
import { Card, Descriptions, Tag, Button } from 'antd'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import type { stateType } from '@/store'
import { usePermission } from '@/hooks/usePermission'
import { useLogout } from '@/hooks/useLogout'

/**
 * 调试页面 - 查看当前用户权限信息
 */
const DebugAuth: React.FC = () => {
  const user = useSelector((state: stateType) => state.user)
  const admin = useSelector((state: stateType) => state.admin)
  const { isAdmin, isSuperAdmin, hasRole } = usePermission()
  const navigate = useNavigate()
  const { logout } = useLogout()

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">用户权限调试信息</h1>
      
      <Card title="用户基本信息" className="mb-4">
        <Descriptions column={2} bordered>
          <Descriptions.Item label="用户ID">{user._id || '-'}</Descriptions.Item>
          <Descriptions.Item label="用户名">{user.username || '-'}</Descriptions.Item>
          <Descriptions.Item label="昵称">{user.nickname || '-'}</Descriptions.Item>
          <Descriptions.Item label="Token">
            {user.token ? `${user.token.substring(0, 20)}...` : '无'}
          </Descriptions.Item>
          <Descriptions.Item label="角色">
            <Tag color="blue">{user.role || 'user'}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="是否被封禁">
            <Tag color={user.isBanned ? 'red' : 'green'}>
              {user.isBanned ? '是' : '否'}
            </Tag>
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Card title="权限检查结果" className="mb-4">
        <Descriptions column={1} bordered>
          <Descriptions.Item label="isAdmin()">
            <Tag color={isAdmin() ? 'success' : 'error'}>
              {isAdmin() ? '是管理员' : '不是管理员'}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="isSuperAdmin()">
            <Tag color={isSuperAdmin() ? 'success' : 'error'}>
              {isSuperAdmin() ? '是超级管理员' : '不是超级管理员'}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="当前角色检查">
            user: {hasRole('user') ? '✅' : '❌'} | 
            admin: {hasRole('admin') ? '✅' : '❌'} | 
            super_admin: {hasRole('super_admin') ? '✅' : '❌'}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Card title="Admin Store 信息" className="mb-4">
        <Descriptions column={1} bordered>
          <Descriptions.Item label="角色">
            {admin.role}
          </Descriptions.Item>
          <Descriptions.Item label="权限数量">
            {admin.permissions.length}
          </Descriptions.Item>
          <Descriptions.Item label="自定义权限数量">
            {admin.customPermissions.length}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <div className="space-x-4">
        <Button type="primary" onClick={() => navigate('/admin/dashboard')}>
          尝试访问管理后台
        </Button>
        <Button onClick={() => navigate('/manage/list')}>
          返回用户中心
        </Button>
        <Button danger onClick={logout}>
          退出并重新登录
        </Button>
      </div>

      <Card title="解决方案" className="mt-4" type="inner">
        <div className="space-y-2 text-sm">
          <p><strong>如果看不到 role 字段或 role 为 'user'：</strong></p>
          <ol className="list-decimal ml-6 space-y-1">
            <li>点击上方"退出并重新登录"按钮</li>
            <li>使用 admin@quizzyflow.com / admin123456 重新登录</li>
            <li>再次访问此页面查看 role 是否为 'super_admin'</li>
            <li>如果还是不对，运行后端初始化脚本: <code>npm run init:rbac</code></li>
          </ol>
        </div>
      </Card>
    </div>
  )
}

export default DebugAuth

