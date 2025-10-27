import React from 'react'
import { Menu, X } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'

interface MobileMenuButtonProps {
  isOpen: boolean
  onClick: () => void
}

/**
 * 移动端菜单按钮
 */
const MobileMenuButton: React.FC<MobileMenuButtonProps> = ({ isOpen, onClick }) => {
  const { theme } = useTheme()

  return (
    <button
      className={`
        mobile-menu-button
        ${theme === 'dark' ? 'text-slate-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'}
      `}
      onClick={onClick}
      aria-label={isOpen ? '关闭菜单' : '打开菜单'}
    >
      {isOpen ? (
        <X className="w-6 h-6" strokeWidth={2} />
      ) : (
        <Menu className="w-6 h-6" strokeWidth={2} />
      )}
    </button>
  )
}

export default MobileMenuButton

