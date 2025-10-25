import { Spin, Result, Button, Drawer } from 'antd'
import { MenuOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { useTitle, useResponsive } from 'ahooks'
import { useState } from 'react'
import useLoadQuestionData from '@/hooks/useLoadQuestionData'
import useGetPageInfo from '@/hooks/useGetPageInfo'
import StatisticsHeader from './components/statistics-header'
import ComponentsList from './components/components-list'
import StatisticsTable from './components/statistics-table'
import { useStatisticsState } from './hooks/useStatisticsState'

const Statistics = () => {
  const { loading } = useLoadQuestionData()
  const { isPublished } = useGetPageInfo()
  const navigate = useNavigate()
  const responsive = useResponsive()
  const isMobile = !responsive.md // md 断点以下为移动端
  
  const [drawerVisible, setDrawerVisible] = useState(false)
  
  const {
    selectedComponentId,
    selectedComponentType,
    setSelectedComponent,
  } = useStatisticsState()

  useTitle('问卷统计')

  // 移动端选择组件后关闭抽屉
  const handleMobileComponentSelect = (fe_id: string, type: string) => {
    setSelectedComponent(fe_id, type)
    if (isMobile) {
      setDrawerVisible(false)
    }
  }

  // Show loading state
  if (loading) {
    return (
      <div className="h-full w-full flex justify-center items-center">
        <Spin size="large" tip="加载中..." />
      </div>
    )
  }

  // Show unpublished state
  if (!isPublished) {
    return (
      <div className="h-full w-full flex justify-center items-center -mt-[100px] p-4">
        <Result
          status="warning"
          title="该问卷尚未发布"
          subTitle="请等待管理员审核通过后再查看统计信息"
          extra={
            <Button type="primary" onClick={() => navigate(-1)}>
              返回上一页
            </Button>
          }
        />
      </div>
    )
  }

  return (
    <div className="h-screen w-full flex flex-col bg-gray-50">
      <StatisticsHeader />
      
      {/* 移动端：组件列表菜单按钮 */}
      {isMobile && (
        <div className="bg-white border-b border-gray-200 px-4 py-2">
          <Button 
            icon={<MenuOutlined />} 
            onClick={() => setDrawerVisible(true)}
            block
          >
            查看问卷组件列表
          </Button>
        </div>
      )}
      
      <div className="flex-1 py-3 md:py-[12px] overflow-hidden">
        <div className="flex h-full mx-2 md:mx-[24px] gap-2 md:gap-6">
          {/* PC端：侧边栏 */}
          {!isMobile && (
            <aside className="w-[350px] flex-shrink-0 h-full overflow-y-auto rounded-lg">
              <ComponentsList
                selectedComponentId={selectedComponentId}
                selectedComponentType={selectedComponentType}
                setSelectedComponent={setSelectedComponent}
              />
            </aside>
          )}

          {/* 移动端：抽屉 */}
          {isMobile && (
            <Drawer
              title="问卷组件"
              placement="left"
              onClose={() => setDrawerVisible(false)}
              open={drawerVisible}
              width="85%"
              styles={{
                body: { padding: 0 }
              }}
            >
              <ComponentsList
                selectedComponentId={selectedComponentId}
                selectedComponentType={selectedComponentType}
                setSelectedComponent={handleMobileComponentSelect}
              />
            </Drawer>
          )}

          {/* 主内容区 */}
          <main className="flex-1 min-w-0 h-full bg-white py-3 px-2 md:py-[12px] md:px-[18px] rounded-lg shadow-sm overflow-hidden">
            <StatisticsTable
              selectedComponentId={selectedComponentId}
              selectedComponentType={selectedComponentType}
              setSelectedComponent={setSelectedComponent}
            />
          </main>
        </div>
      </div>
    </div>
  )
}

export default Statistics
