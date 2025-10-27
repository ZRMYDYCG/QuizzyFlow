import React from 'react'
import { Drawer } from 'antd'
import type { NotificationDrawerProps } from '../types'

/**
 * 通知抽屉组件
 */
const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  visible,
  onClose,
}) => {
  return (
    <Drawer
      title="通知"
      placement="right"
      onClose={onClose}
      open={visible}
      width={400}
    >
      <div className="text-center text-gray-400 py-8">暂无新通知</div>
    </Drawer>
  )
}

export default NotificationDrawer

