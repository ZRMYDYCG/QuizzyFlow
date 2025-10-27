import React from 'react'
import { Drawer } from 'antd'
import { useTheme } from '@/contexts/ThemeContext'
import type { NotificationDrawerProps } from '../types'

/**
 * 通知抽屉组件
 */
const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  visible,
  onClose,
}) => {
  const { theme } = useTheme()

  return (
    <Drawer
      title="通知"
      placement="right"
      onClose={onClose}
      open={visible}
      width={400}
    >
      <div className={`text-center py-8 ${theme === 'dark' ? 'text-slate-400' : 'text-gray-400'}`}>
        暂无新通知
      </div>
    </Drawer>
  )
}

export default NotificationDrawer

