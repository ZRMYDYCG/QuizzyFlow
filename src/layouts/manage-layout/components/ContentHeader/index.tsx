import { Button, Spin, Avatar, Dropdown } from 'antd'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { UserOutlined, LogoutOutlined, SettingOutlined } from '@ant-design/icons'
import useLoadUserData from '../../../../hooks/useLoadUserData.ts'
import { logoutReducer } from '../../../../store/modules/user.ts'
import useGetUserInfo from '../../../../hooks/useGetUserInfo.ts'
import type { MenuProps } from 'antd'

const ContentHeader = () => {
  const { username, nickname } = useGetUserInfo()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { waitingUserData } = useLoadUserData()

  const logout = () => {
    navigate('/login')
    localStorage.removeItem('token')
    dispatch(logoutReducer())
  }

  const menuItems: MenuProps['items'] = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '个人中心',
      onClick: () => {
        // navigate('/profile')
      },
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: '设置',
      onClick: () => {
        // navigate('/settings')
      },
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      onClick: logout,
      danger: true,
    },
  ]

  return (
    <div className="h-[64px] bg-white border-b border-gray-200 flex items-center justify-between px-6 shadow-sm">
      {/* 面包屑或页面标题区域（预留） */}
      <div className="flex items-center gap-4">
        <span className="text-gray-400 text-sm">管理后台</span>
      </div>

      {/* 右侧用户区域 */}
      <div className="flex items-center gap-4">
        {waitingUserData ? (
          <Spin size="small" />
        ) : (
          <Dropdown menu={{ items: menuItems }} placement="bottomRight" arrow>
            <div className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 px-4 py-2 rounded-lg transition-all">
              <div className="flex flex-col items-end">
                <span className="text-sm font-medium text-gray-800">
                  {nickname || username}
                </span>
                <span className="text-xs text-gray-400">管理员</span>
              </div>
              <Avatar
                src="https://pica.zhimg.com/v2-e2a7c3693c58a1e5ea1ad900155a8c34_r.jpg"
                size="large"
                icon={<UserOutlined />}
                className="ring-2 ring-gray-100"
              />
            </div>
          </Dropdown>
        )}
      </div>
    </div>
  )
}

export default ContentHeader

