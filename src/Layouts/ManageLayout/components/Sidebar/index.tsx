import { Menu, Button } from 'antd'
import {
  PlusOutlined,
  BranchesOutlined,
  StarOutlined,
  DeleteOutlined,
} from '@ant-design/icons'
import { useNavigate, useLocation } from 'react-router-dom'
import { createQuestion } from '../../../../api/modules/question.ts'
import { useRequest } from 'ahooks'
import type { MenuProps } from 'antd'
import { message } from 'antd'

type MenuItem = Required<MenuProps>['items'][number]

const Sidebar = () => {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const { loading, run: handleCreate } = useRequest(createQuestion, {
    manual: true,
    onSuccess: async (res) => {
      const { id } = res || {}
      if (id) {
        navigate(`/question/edit/${id}`)
        message.success('创建成功')
      }
    },
  })

  // 根据当前路径确定选中的菜单项
  const getSelectedKey = () => {
    if (pathname.startsWith('/manage/list')) return 'list'
    if (pathname.startsWith('/manage/star')) return 'star'
    if (pathname.startsWith('/manage/trash')) return 'trash'
    return 'list'
  }

  const menuItems: MenuItem[] = [
    {
      key: 'list',
      icon: <BranchesOutlined />,
      label: '我的问卷',
      onClick: () => navigate('/manage/list'),
    },
    {
      key: 'star',
      icon: <StarOutlined />,
      label: '星标问卷',
      onClick: () => navigate('/manage/star'),
    },
    {
      key: 'trash',
      icon: <DeleteOutlined />,
      label: '回收站',
      onClick: () => navigate('/manage/trash'),
    },
  ]

  return (
    <div className="h-screen bg-gradient-to-b from-gray-50 to-white border-r border-gray-200 flex flex-col shadow-sm">
      {/* Logo 区域 */}
      <div className="h-[64px] flex items-center px-6 border-b border-gray-200 bg-white">
        <img src="/public/vite.svg" alt="logo" className="h-8" />
        <span className="ml-2 text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          QuizzyFlow
        </span>
      </div>

      {/* 新建按钮 */}
      <div className="p-4">
        <Button
          type="primary"
          size="large"
          icon={<PlusOutlined />}
          onClick={handleCreate}
          disabled={loading}
          className="w-full !h-11 !rounded-lg !bg-gradient-to-r !from-blue-500 !to-blue-600 hover:!from-blue-600 hover:!to-blue-700 !shadow-md hover:!shadow-lg !transition-all"
          block
        >
          新建问卷
        </Button>
      </div>

      {/* 菜单 */}
      <div className="flex-1 overflow-y-auto px-2">
        <Menu
          mode="inline"
          selectedKeys={[getSelectedKey()]}
          items={menuItems}
          className="border-0 !bg-transparent"
          style={{
            '--antd-menu-item-selected-bg': '#eff6ff',
            '--antd-menu-item-selected-color': '#2563eb',
          } as any}
        />
      </div>

      {/* 底部信息 */}
      <div className="p-4 border-t border-gray-200 text-center text-xs text-gray-400 bg-white">
        <div>© 2025 QuizzyFlow</div>
        <div className="mt-1 text-[10px]">v1.0.0</div>
      </div>
    </div>
  )
}

export default Sidebar

