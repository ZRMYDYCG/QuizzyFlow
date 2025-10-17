import { Outlet } from 'react-router-dom'
import Sidebar from './components/sidebar/index.tsx'
import ContentHeader from './components/content-header/index.tsx'
import useNavPage from '../../hooks/useNavPage.ts'
import useLoadUserData from '../../hooks/useLoadUserData.ts'

const ManageLayout = () => {
  const { waitingUserData } = useLoadUserData()
  useNavPage(waitingUserData)

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* 左侧固定侧边栏 */}
      <div className="w-[240px] flex-shrink-0">
        <Sidebar />
      </div>

      {/* 右侧内容区 */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* 顶部导航栏 */}
        <ContentHeader />

        {/* 主内容区域 */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ManageLayout
