import React from 'react'
import { useTheme } from '@/contexts/ThemeContext'

const ClassifyTitle: React.FC<{ groupName: string }> = ({ groupName }) => {
  const { theme } = useTheme()
  
  return (
    <div className="flex items-center mb-3">
      <span className="w-1 h-4 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full mr-2" />
      <span className={`text-sm font-semibold ${theme === 'dark' ? 'text-slate-200' : 'text-gray-900'}`}>
        {groupName}
      </span>
    </div>
  )
}

export default ClassifyTitle
