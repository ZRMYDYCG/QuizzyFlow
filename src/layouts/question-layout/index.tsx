import { Outlet } from 'react-router-dom'
import useLoadUserData from '../../hooks/useLoadUserData.ts'
import useNavPage from '../../hooks/useNavPage.ts'
import { Spin } from 'antd'

const QuestionLayout = () => {
  const { waitingUserData } = useLoadUserData()
  useNavPage(waitingUserData)
  return (
    <div 
      className="h-screen"
      style={{
        backgroundImage: `
          linear-gradient(rgba(0, 0, 0, 0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0, 0, 0, 0.03) 1px, transparent 1px)
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
