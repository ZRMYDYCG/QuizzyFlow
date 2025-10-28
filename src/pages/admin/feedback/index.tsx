/**
 * 管理后台 - 反馈管理主布局
 * 通过侧边栏嵌套菜单进行导航
 */
import React from 'react'
import { Outlet } from 'react-router-dom'

const FeedbackLayout: React.FC = () => {
  return <Outlet />
}

export default FeedbackLayout

