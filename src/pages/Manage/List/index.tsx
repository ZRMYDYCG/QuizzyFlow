import QuestionsCard from './components/QuestionsCard'
import { useDebounceFn, useRequest, useTitle } from 'ahooks'
import { getQuestionList } from '@/api/modules/question'
import { Empty, Spin, Typography } from 'antd'
import ListSearch from '@/components/list-search'
import { useEffect, useRef, useState, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'

const { Title } = Typography

const List = () => {
  useTitle('问卷列表')
  const [searchParams] = useSearchParams()
  const keyword = searchParams.get('keyword') || ''

  const [started, setStarted] = useState(false) // 是否已经开始加载（处理防抖的延迟时间）
  const [list, setList] = useState([]) // 全部的列表数据
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const haveMoreData = total > list.length

  const containerRef = useRef<HTMLDivElement>(null)

  // 真正加载
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

  // 尝试加载
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

  // 页面加载或searchParams变化时, 获取问卷列表数据
  useEffect(() => {
    tryLoadMore()
  }, [searchParams])

  // 页面滚动时, 尝试加载更多数据
  useEffect(() => {
    if (!haveMoreData) {
      window.addEventListener('scroll', tryLoadMore)
    }

    // 组件销毁及searchParams变化之前解绑事件
    return () => {
      window.removeEventListener('scroll', tryLoadMore)
    }
  }, [searchParams])

  // 重置
  useEffect(() => {
    setStarted(false)
    setPage(1)
    setTotal(0)
    setList([])
  }, [keyword])

  const LoadingMoreContentElement = useMemo(() => {
    if (!started || loading) return <Spin />
    if (total === 0) return <Empty description="暂无数据" />
    if (!haveMoreData) return <>--没有更多了--</>
  }, [started, loading, haveMoreData])

  return (
    <div className="bg-white rounded-lg shadow-sm min-h-full">
      {/*问卷列表头部*/}
      <div className="flex justify-between items-center p-6 border-b border-gray-200">
        <div>
          <Title level={3} className="!mb-0">问卷列表</Title>
          <p className="text-gray-500 text-sm mt-1">管理您的所有问卷</p>
        </div>
        <div>
          {/*搜索框*/}
          <ListSearch />
        </div>
      </div>
      {/*问卷列表主体*/}
      <div className="p-6">
        {list.length > 0 &&
          list.map((question: any) => {
            const { _id } = question
            return <QuestionsCard key={_id} {...question} />
          })}
      </div>
      {/*问卷列表底部*/}
      <div className="text-center pb-6">
        <div ref={containerRef}>{LoadingMoreContentElement}</div>
      </div>
    </div>
  )
}

export default List
