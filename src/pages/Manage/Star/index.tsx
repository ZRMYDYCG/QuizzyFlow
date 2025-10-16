import { useTitle } from 'ahooks'
import { Empty, Spin, Typography } from 'antd'
import ListSearch from '@/components/list-search'
import QuestionsCard from '@/Manage/List/components/QuestionsCard'
import useLoadQuestionListData from '@/hooks/useLoadQuestionListData'
import ListPage from '@/components/list-page'

const { Title } = Typography

const Star = () => {
  useTitle('星标问卷')

  const { data = {}, loading } = useLoadQuestionListData({ isStar: true })
  const { list = [], total = 0 } = data

  return (
    <div className="bg-white rounded-lg shadow-sm min-h-full">
      {/*问卷列表头部*/}
      <div className="flex justify-between items-center p-6 border-b border-gray-200">
        <div>
          <Title level={3} className="!mb-0">星标问卷</Title>
          <p className="text-gray-500 text-sm mt-1">您标记为星标的重要问卷</p>
        </div>
        <div>
          {/*搜索框*/}
          <ListSearch />
        </div>
      </div>
      {/*问卷列表主体*/}
      <div className="p-6 min-h-[400px]">
        {loading && (
          <div className="flex justify-center py-20">
            <Spin />
          </div>
        )}
        {!loading && list.length === 0 && (
          <div className="py-20">
            <Empty description="暂无星标问卷" />
          </div>
        )}
        {list.length > 0 &&
          list.map((question: any) => {
            const { _id } = question
            return <QuestionsCard key={_id} {...question} />
          })}
      </div>
      {/*问卷列表底部*/}
      <div className="flex justify-center pb-6">
        <ListPage total={total} />
      </div>
    </div>
  )
}

export default Star
