import React from 'react'
import { Badge } from 'antd'
import {
  AppstoreAddOutlined,
  FileTextOutlined,
  EditOutlined,
  BgColorsOutlined,
} from '@ant-design/icons'
import { useDispatch, useSelector } from 'react-redux'
import { toggleMobilePanel, MobileActivePanel } from '@/store/modules/editor-layout'
import { stateType } from '@/store'
import { useTheme } from '@/contexts/ThemeContext'
import useGetComponentInfo from '@/hooks/useGetComponentInfo'

/**
 * 移动端底部导航栏
 * 用于在移动端切换不同的面板
 */
const MobileBottomNav: React.FC = () => {
  const dispatch = useDispatch()
  const { theme } = useTheme()
  const { mobileActivePanel } = useSelector((state: stateType) => state.editorLayout)
  const { selectedId, componentList } = useGetComponentInfo()

  const isDark = theme === 'dark'

  // 导航项配置
  const navItems: Array<{
    key: MobileActivePanel
    icon: React.ReactNode
    label: string
    badge?: number
  }> = [
    {
      key: 'left',
      icon: <AppstoreAddOutlined className="text-xl" />,
      label: '组件库',
      badge: componentList.length,
    },
    {
      key: 'toolbar',
      icon: <EditOutlined className="text-xl" />,
      label: '编辑',
    },
    {
      key: 'right',
      icon: <FileTextOutlined className="text-xl" />,
      label: selectedId ? '属性' : '设置',
    },
  ]

  const handleNavClick = (key: MobileActivePanel) => {
    dispatch(toggleMobilePanel(key))
  }

  return (
    <div
      className={`
        fixed bottom-0 left-0 right-0 z-50
        h-16 border-t
        ${isDark ? 'bg-[#1e1e23] border-white/10' : 'bg-white border-gray-200'}
        safe-area-pb
      `}
      style={{
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      <div className="flex items-center justify-around h-full px-2">
        {navItems.map((item) => {
          const isActive = mobileActivePanel === item.key

          return (
            <button
              key={item.key}
              onClick={() => handleNavClick(item.key)}
              className={`
                flex flex-col items-center justify-center
                flex-1 h-full
                transition-colors duration-200
                ${
                  isActive
                    ? isDark
                      ? 'text-blue-400'
                      : 'text-blue-500'
                    : isDark
                    ? 'text-gray-400'
                    : 'text-gray-600'
                }
                hover:bg-opacity-10
                ${isActive ? 'hover:bg-blue-500' : 'hover:bg-gray-500'}
                active:scale-95
                relative
              `}
            >
              {/* 激活指示器 */}
              {isActive && (
                <div
                  className={`
                    absolute top-0 left-1/2 -translate-x-1/2
                    w-8 h-1 rounded-b-full
                    ${isDark ? 'bg-blue-400' : 'bg-blue-500'}
                  `}
                />
              )}

              {/* 图标 */}
              <div className="mb-1">
                {item.badge !== undefined && item.badge > 0 ? (
                  <Badge
                    count={item.badge}
                    size="small"
                    overflowCount={99}
                    offset={[2, -2]}
                  >
                    {item.icon}
                  </Badge>
                ) : (
                  item.icon
                )}
              </div>

              {/* 标签 */}
              <span
                className={`
                  text-xs font-medium
                  ${isActive ? 'font-semibold' : ''}
                `}
              >
                {item.label}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default MobileBottomNav

