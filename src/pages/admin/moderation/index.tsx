/**
 * 管理后台 - 内容审核中心主布局
 * 通过侧边栏嵌套菜单进行导航
 */
import React from 'react'
import { Outlet } from 'react-router-dom'

const ModerationLayout: React.FC = () => {
  return <Outlet />
}

export default ModerationLayout

