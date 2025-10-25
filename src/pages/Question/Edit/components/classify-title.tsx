import React from 'react'
import { useTheme } from '@/contexts/ThemeContext'

const ClassifyTitle: React.FC<{ groupName: string }> = ({ groupName }) => {
  const { theme, primaryColor, themeColors } = useTheme()
  
  return (
    <div className="flex items-center mb-3">
      <span 
        className="w-1 h-4 rounded-full mr-2" 
        style={{
          background: `linear-gradient(to bottom, ${primaryColor}, ${themeColors.primaryActive})`
        }}
      />
      <span className={`text-sm font-semibold ${theme === 'dark' ? 'text-slate-200' : 'text-gray-900'}`}>
        {groupName}
      </span>
    </div>
  )
}

export default ClassifyTitle
