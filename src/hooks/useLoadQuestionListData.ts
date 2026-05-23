import { useEffect, useState } from 'react'
import { useRequest } from 'ahooks'
import { getQuestionList } from '../api/modules/question.ts'
import { useSearchParams } from 'react-router-dom'

interface Options {
  keyword: string
  isStar: boolean
  isDeleted: boolean
  type?: string
  page: number
  pageSize: number
}

const DEFAULT_PAGE_SIZE = 10

export function useLoadQuestionListData(options: Partial<Options> = {}) {
  const { isStar = false, isDeleted = false, type } = options
  const [searchParams] = useSearchParams()
  const keyword = searchParams.get('keyword') || ''

  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE)

  useEffect(() => {
    setPage(1)
  }, [keyword, isStar, isDeleted, type])

  const { data, loading, error, refresh } = useRequest(
    async () => {
      return await getQuestionList({
        keyword,
        page,
        pageSize,
        ...(isStar ? { isStar: true } : {}),
        ...(isDeleted ? { isDeleted: true } : {}),
        ...(type ? { type } : {}),
      })
    },
    { refreshDeps: [keyword, page, pageSize, isStar, isDeleted, type] }
  )

  const list = data?.list ?? []
  const total = data?.total ?? 0

  const handlePageChange = (nextPage: number) => {
    setPage(nextPage)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handlePageSizeChange = (_current: number, size: number) => {
    setPage(1)
    setPageSize(size)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return {
    data,
    list,
    total,
    loading,
    error,
    refresh,
    page,
    pageSize,
    setPage,
    setPageSize,
    handlePageChange,
    handlePageSizeChange,
  }
}

export default useLoadQuestionListData
