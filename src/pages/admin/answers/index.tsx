/**
 * 管理后台 - 答卷管理主布局
 * 通过侧边栏嵌套菜单进行导航
 */
import React from 'react'
import { Outlet } from 'react-router-dom'

const AnswersLayout: React.FC = () => {
  return <Outlet />
}

export default AnswersLayout

