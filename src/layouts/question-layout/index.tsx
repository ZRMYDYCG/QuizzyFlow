import { Outlet } from 'react-router-dom'
import { useLoadUserData } from '../../hooks/useLoadUserData'
import { useNavPage } from '../../hooks/useNavPage'
import { useTheme } from '@/contexts/ThemeContext'
import { Spin } from 'antd'

const QuestionLayout = () => {
  const { waitingUserData } = useLoadUserData()
  useNavPage(waitingUserData)
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const gridLine = isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)'

  return (
    <div
      className={`h-screen ${isDark ? 'bg-[#141418]' : ''}`}
      style={{
        backgroundImage: `
          linear-gradient(${gridLine} 1px, transparent 1px),
          linear-gradient(90deg, ${gridLine} 1px, transparent 1px)
        `,
        backgroundSize: '20px 20px',
        backgroundPosition: 'center center',
      }}
    >
      {waitingUserData ? (
        <Spin className="flex justify-center items-center h-full" />
      ) : (
        <Outlet />
      )}
    </div>
  )
}

export default QuestionLayout
