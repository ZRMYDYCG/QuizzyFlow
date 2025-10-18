import { useTitle } from 'ahooks'
import ListSearch from '@/components/list-search'
import QuestionsCard from '../List/components/QuestionsCard'
import useLoadQuestionListData from '@/hooks/useLoadQuestionListData'
import ListPage from '@/components/list-page'
import { Loader2, Star as StarIcon } from 'lucide-react'

const Star = () => {
  useTitle('星标问卷')

  const { data = {}, loading } = useLoadQuestionListData({ isStar: true })
  const { list = [], total = 0 } = data

  return (
    <div className="min-h-full">
      {/* 头部 */}
      <div className="mb-6 p-6 rounded-xl bg-gradient-to-br from-slate-800/50 to-slate-800/30 border border-slate-700/50 backdrop-blur-sm">
        <div className="flex justify-between items-center">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-2xl font-bold text-slate-200">星标问卷</h2>
              <StarIcon className="w-6 h-6 text-yellow-400 fill-yellow-400" />
            </div>
            <p className="text-slate-400 text-sm">
              您标记为星标的重要问卷 · 共 {total} 个
            </p>
          </div>
          <div>
            <ListSearch />
          </div>
        </div>
      </div>

      {/* 问卷列表 */}
      <div className="min-h-[400px]">
        {loading && (
          <div className="flex items-center justify-center gap-2 text-slate-400 py-20">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span>加载中...</span>
          </div>
        )}
        {!loading && list.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-slate-500">
            <StarIcon className="w-20 h-20 mb-4 text-slate-600" />
            <p className="text-lg font-medium">暂无星标问卷</p>
            <p className="text-sm text-slate-600 mt-1">为重要问卷添加星标以便快速访问</p>
          </div>
        )}
        {list.length > 0 &&
          list.map((question: any) => {
            const { _id } = question
            return <QuestionsCard key={_id} {...question} />
          })}
      </div>

      {/* 分页 */}
      {list.length > 0 && (
        <div className="flex justify-center py-6">
          <ListPage total={total} />
        </div>
      )}
    </div>
  )
}

export default Star
