import React from 'react'
import type { IMobileOverlayProps } from '../types'

const MobileOverlay: React.FC<IMobileOverlayProps> = ({ 
  mobileSidebarOpen, 
  onClose 
}) => {
  if (!mobileSidebarOpen) return null

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden animate-in fade-in-0 duration-300"
      onClick={onClose}
    />
  )
}

export default MobileOverlay