import QuestionsCard from './components/QuestionsCard'
import QuestionListView from './components/QuestionListView'
import QuestionTableView from './components/QuestionTableView'
import ViewSwitcher, { ViewMode } from './components/ViewSwitcher'
import TypeFilter from './components/TypeFilter'
import QuestionListPagination from './components/QuestionListPagination'
import { useTitle } from 'ahooks'
import { useState } from 'react'
import { Loader2, Inbox } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'
import useLoadQuestionListData from '@/hooks/useLoadQuestionListData'

const List = () => {
  useTitle('问卷列表')
  const { theme } = useTheme()

  const [typeFilter, setTypeFilter] = useState<string | undefined>(undefined)

  const {
    list,
    total,
    loading,
    refresh,
    page,
    pageSize,
    handlePageChange,
    handlePageSizeChange,
  } = useLoadQuestionListData({ type: typeFilter })

  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    const saved = localStorage.getItem('questionListViewMode')
    return (saved as ViewMode) || 'list'
  })

  const handleViewChange = (mode: ViewMode) => {
    setViewMode(mode)
    localStorage.setItem('questionListViewMode', mode)
  }

  return (
    <div className="min-h-full">
      <div className="mb-4 md:mb-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
          <div className="flex-shrink-0">
            <ViewSwitcher currentView={viewMode} onViewChange={handleViewChange} />
          </div>

          <div className="flex-shrink-0">
            <TypeFilter
              value={typeFilter}
              onChange={(value) => setTypeFilter(value || undefined)}
            />
          </div>
        </div>
      </div>

      {loading && list.length === 0 ? (
        <div
          className={`flex items-center justify-center gap-2 py-20 ${
            theme === 'dark' ? 'text-slate-400' : 'text-gray-500'
          }`}
        >
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>加载中...</span>
        </div>
      ) : null}

      {!loading && total === 0 ? (
        <div
          className={`flex flex-col items-center justify-center py-16 ${
            theme === 'dark' ? 'text-slate-500' : 'text-gray-500'
          }`}
        >
          <Inbox
            className={`w-16 h-16 mb-4 ${
              theme === 'dark' ? 'text-slate-600' : 'text-gray-400'
            }`}
          />
          <p className="text-lg font-medium">
            {typeFilter ? '没有符合筛选条件的问卷' : '暂无数据'}
          </p>
          <p
            className={`text-sm mt-1 ${
              theme === 'dark' ? 'text-slate-600' : 'text-gray-400'
            }`}
          >
            {typeFilter
              ? '可尝试切换其他类型，或在编辑器中保存问卷类型后重试'
              : '创建您的第一个问卷吧'}
          </p>
        </div>
      ) : null}

      {list.length > 0 ? (
        <>
          {viewMode === 'card' && (
            <div className="space-y-3 md:space-y-4">
              {list.map((question: any) => (
                <QuestionsCard
                  key={question._id}
                  {...question}
                  onDelete={refresh}
                />
              ))}
            </div>
          )}
          {viewMode === 'list' && (
            <QuestionListView questions={list} onDelete={refresh} />
          )}
          {viewMode === 'table' && (
            <QuestionTableView questions={list} onDelete={refresh} />
          )}

          <QuestionListPagination
            total={total}
            page={page}
            pageSize={pageSize}
            onChange={handlePageChange}
            onShowSizeChange={handlePageSizeChange}
          />
        </>
      ) : null}
    </div>
  )
}

export default List
