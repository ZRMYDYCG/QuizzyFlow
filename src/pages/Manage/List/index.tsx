import QuestionsCard from './components/QuestionsCard'
import { useDebounceFn, useRequest, useTitle } from 'ahooks'
import { getQuestionList } from '@/api/modules/question'
import { useEffect, useRef, useState, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Loader2, Inbox } from 'lucide-react'
import useGetUserInfo from '@/hooks/useGetUserInfo'

const List = () => {
  useTitle('问卷列表')
  const [searchParams] = useSearchParams()
  const keyword = searchParams.get('keyword') || ''
  const { username, nickname } = useGetUserInfo()

  const [started, setStarted] = useState(false)
  const [list, setList] = useState([])
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const haveMoreData = total > list.length

  const containerRef = useRef<HTMLDivElement>(null)

  const { run: load, loading } = useRequest(
    async () => {
      return await getQuestionList({ page, pageSize: 10, keyword })
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
  }, [keyword])

  const LoadingMoreContentElement = useMemo(() => {
    if (!started || loading) {
      return (
        <div className="flex items-center justify-center gap-2 text-slate-400 py-8">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>加载中...</span>
        </div>
      )
    }
    if (total === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-16 text-slate-500">
          <Inbox className="w-16 h-16 mb-4 text-slate-600" />
          <p className="text-lg font-medium">暂无数据</p>
          <p className="text-sm text-slate-600 mt-1">创建您的第一个问卷吧</p>
        </div>
      )
    }
    if (!haveMoreData) {
      return (
        <div className="text-center text-slate-600 py-4 text-sm">
          - 已加载全部 {total} 个问卷 -
        </div>
      )
    }
  }, [started, loading, haveMoreData, total])

  const greeting = useMemo(() => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 18) return 'Good afternoon'
    return 'Good evening'
  }, [])

  return (
    <div className="min-h-full">
      {/* 问候语区域 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          {greeting}, {nickname || username}!
        </h1>
        <p className="text-slate-500 text-sm italic">
          "The final wisdom of life requires not the annulment of incongruity but the achievement of serenity within and above it." - Reinhold Niebuhr
        </p>
      </div>

      {/* 问卷列表 */}
      <div>
        {list.length > 0 &&
          list.map((question: any) => {
            const { _id } = question
            return <QuestionsCard key={_id} {...question} />
          })}
      </div>

      {/* 加载更多 */}
      <div className="text-center">
        <div ref={containerRef}>{LoadingMoreContentElement}</div>
      </div>
    </div>
  )
}

export default List
