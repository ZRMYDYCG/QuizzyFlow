import { Spin, Result, Button } from 'antd'
import { useNavigate } from 'react-router-dom'
import { useTitle } from 'ahooks'
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
  const {
    selectedComponentId,
    selectedComponentType,
    setSelectedComponent,
  } = useStatisticsState()

  useTitle('问卷统计')

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
      <div className="h-full w-full flex justify-center items-center -mt-[100px]">
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
    <div className="h-screen w-full flex flex-col bg-gray-500/40">
      <StatisticsHeader />
      <div className="flex-1 py-[12px] overflow-hidden">
        <div className="flex h-full mx-[24px] gap-6">
          {/* Components sidebar */}
          <aside className="w-[350px] flex-shrink-0 h-full overflow-y-auto">
            <ComponentsList
              selectedComponentId={selectedComponentId}
              selectedComponentType={selectedComponentType}
              setSelectedComponent={setSelectedComponent}
            />
          </aside>

          {/* Main content area */}
          <main className="flex-1 min-w-0 h-full bg-white py-[12px] px-[18px] rounded-lg shadow-sm">
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
