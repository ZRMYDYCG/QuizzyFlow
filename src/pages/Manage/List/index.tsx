import QuestionsCard from './components/QuestionsCard'
import QuestionListView from './components/QuestionListView'
import QuestionTableView from './components/QuestionTableView'
import ViewSwitcher, { ViewMode } from './components/ViewSwitcher'
import TypeFilter from './components/TypeFilter'
import { useDebounceFn, useRequest, useTitle } from 'ahooks'
import { getQuestionList } from '@/api/modules/question'
import { useEffect, useRef, useState, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Loader2, Inbox } from 'lucide-react'
import useGetUserInfo from '@/hooks/useGetUserInfo'
import { useTheme } from '@/contexts/ThemeContext'

const List = () => {
  useTitle('问卷列表')
  const [searchParams] = useSearchParams()
  const keyword = searchParams.get('keyword') || ''
  const { username, nickname } = useGetUserInfo()
  const { theme } = useTheme()

  const [started, setStarted] = useState(false)
  const [list, setList] = useState([])
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const haveMoreData = total > list.length

  // 视图模式状态 - 从 localStorage 读取，默认列表视图
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    const saved = localStorage.getItem('questionListViewMode')
    return (saved as ViewMode) || 'list'
  })

  // 类型筛选状态
  const [typeFilter, setTypeFilter] = useState<string | undefined>(undefined)

  // 保存视图偏好到 localStorage
  const handleViewChange = (mode: ViewMode) => {
    setViewMode(mode)
    localStorage.setItem('questionListViewMode', mode)
  }

  const containerRef = useRef<HTMLDivElement>(null)

  const { run: load, loading } = useRequest(
    async () => {
      const params: any = { 
        page, 
        pageSize: 10, 
        keyword,
        isDeleted: false // 明确过滤已删除的问卷
      }
      // 添加类型筛选参数
      if (typeFilter) {
        params.type = typeFilter
      }
      return await getQuestionList(params)
    },
    {
      manual: true,
      onSuccess(result) {
        const { list: newList = [], total = 0 } = result
        setList(list.concat(newList))
        setTotal(total)
        setPage(page + 1)
      },
    }
  )

  // 刷新列表函数
  const refreshList = () => {
    setStarted(false)
    setPage(1)
    setTotal(0)
    setList([])
    // 触发重新加载
    setTimeout(() => {
      tryLoadMore()
    }, 100)
  }

  const { run: tryLoadMore } = useDebounceFn(
    () => {
      const container = containerRef.current
      if (container === null) return
      const domRect = container.getBoundingClientRect()
      if (domRect === null) return
      const { bottom } = domRect
      if (bottom <= document.documentElement.clientHeight) {
        load()
        setStarted(true)
      }
    },
    { wait: 500 }
  )

  useEffect(() => {
    tryLoadMore()
  }, [searchParams])

  useEffect(() => {
    if (!haveMoreData) {
      window.addEventListener('scroll', tryLoadMore)
    }
    return () => {
      window.removeEventListener('scroll', tryLoadMore)
    }
  }, [searchParams])

  useEffect(() => {
    setStarted(false)
    setPage(1)
    setTotal(0)
    setList([])
  }, [keyword, typeFilter])

  const LoadingMoreContentElement = useMemo(() => {
    if (!started || loading) {
      return (
        <div className={`flex items-center justify-center gap-2 py-8 ${
          theme === 'dark' ? 'text-slate-400' : 'text-gray-500'
        }`}>
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>加载中...</span>
        </div>
      )
    }
    if (total === 0) {
      return (
        <div className={`flex flex-col items-center justify-center py-16 ${
          theme === 'dark' ? 'text-slate-500' : 'text-gray-500'
        }`}>
          <Inbox className={`w-16 h-16 mb-4 ${
            theme === 'dark' ? 'text-slate-600' : 'text-gray-400'
          }`} />
          <p className="text-lg font-medium">暂无数据</p>
          <p className={`text-sm mt-1 ${
            theme === 'dark' ? 'text-slate-600' : 'text-gray-400'
          }`}>创建您的第一个问卷吧</p>
        </div>
      )
    }
    if (!haveMoreData) {
      return (
        <div className={`text-center py-4 text-sm ${
          theme === 'dark' ? 'text-slate-600' : 'text-gray-400'
        }`}>
          - 已加载全部 {total} 个问卷 -
        </div>
      )
    }
  }, [started, loading, haveMoreData, total, theme])

  const greeting = useMemo(() => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 18) return 'Good afternoon'
    return 'Good evening'
  }, [])

  return (
    <div className="min-h-full">
      <div className="mb-4 md:mb-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
          {/* 左侧：视图切换器 */}
          <div className="flex-shrink-0">
            <ViewSwitcher currentView={viewMode} onViewChange={handleViewChange} />
          </div>
          
          {/* 右侧：类型筛选 */}
          <div className="flex-shrink-0">
            <TypeFilter 
              value={typeFilter}
              onChange={(value) => {
                setTypeFilter(value)
                refreshList()
              }}
            />
          </div>
        </div>
      </div>

      {/* 问卷列表 - 根据视图模式渲染不同的组件 */}
      <div>
        {list.length > 0 && (
          <>
            {viewMode === 'card' && (
              <div className="space-y-3 md:space-y-4">
                {list.map((question: any) => {
                  const { _id } = question
                  return <QuestionsCard key={_id} {...question} onDelete={refreshList} />
                })}
              </div>
            )}
            {viewMode === 'list' && <QuestionListView questions={list} onDelete={refreshList} />}
            {viewMode === 'table' && <QuestionTableView questions={list} onDelete={refreshList} />}
          </>
        )}
      </div>

      {/* 加载更多 */}
      <div className="text-center">
        <div ref={containerRef}>{LoadingMoreContentElement}</div>
      </div>
    </div>
  )
}

export default List
