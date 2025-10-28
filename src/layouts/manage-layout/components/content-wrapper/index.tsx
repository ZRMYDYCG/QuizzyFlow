import React from 'react'
import { Outlet } from 'react-router-dom'
import type { IContentWrapperProps } from '../../types'
import { LAYOUT_CONFIG } from '../../config'

const ContentWrapper: React.FC<IContentWrapperProps> = ({ 
  sidebarCollapsed 
}) => {
  return (
    <div 
      className={`
        flex-1 overflow-hidden transition-all duration-300
        p-3
        ${sidebarCollapsed ? LAYOUT_CONFIG.spacing.collapsed : LAYOUT_CONFIG.spacing.expanded}
      `}
    >
      <div className="h-full bg-white dark:bg-[#1e1e23] rounded-xl md:rounded-2xl border border-gray-200 dark:border-white/5 flex flex-col overflow-hidden transition-all duration-300">
        <Outlet />
      </div>
    </div>
  )
}

export default ContentWrapper