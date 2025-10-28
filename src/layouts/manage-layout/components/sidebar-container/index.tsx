import React from 'react'
import Sidebar from '../sidebar'
import type { ISidebarContainerProps } from '../../types'

const SidebarContainer: React.FC<ISidebarContainerProps> = ({
  sidebarCollapsed,
  mobileSidebarOpen,
}) => {
  return (
    <div 
      className={`
        md:flex-shrink-0 md:transition-all md:duration-300
        ${sidebarCollapsed ? 'md:w-0' : 'md:w-[200px]'}
        fixed md:relative z-50 md:z-auto h-full
        transition-transform duration-300 ease-in-out
        ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        shadow-2xl md:shadow-none
      `}
    >
      <div className={`h-full w-full ${sidebarCollapsed ? 'md:invisible' : 'md:visible'}`}>
        <Sidebar />
      </div>
    </div>
  )
}

export default SidebarContainer