import React, { useEffect } from 'react'
import { useState } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface Props {
  total: number
}

const ListPage: React.FC<Props> = (props) => {
  const { total } = props
  const [current, setCurrent] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const [searchParams] = useSearchParams()

  useEffect(() => {
    const page = parseInt(searchParams.get('page') || '1')
    const size = parseInt(searchParams.get('pageSize') || '10')
    setCurrent(page)
    setPageSize(size)
  }, [searchParams])

  const navigate = useNavigate()
  const { pathname } = useLocation()

  const totalPages = Math.ceil(total / pageSize)

  const pageChange = (page: number) => {
    if (page < 1 || page > totalPages) return
    setCurrent(page)
    searchParams.set('page', page.toString())
    searchParams.set('pageSize', pageSize.toString())

    navigate({
      pathname: pathname,
      search: searchParams.toString(),
    })
  }

  if (totalPages <= 1) return null

  const renderPageNumbers = () => {
    const pages = []
    const showPages = 5
    let startPage = Math.max(1, current - 2)
    let endPage = Math.min(totalPages, startPage + showPages - 1)

    if (endPage - startPage < showPages - 1) {
      startPage = Math.max(1, endPage - showPages + 1)
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => pageChange(i)}
          className={`
            px-4 py-2 text-sm font-medium rounded-lg transition-all
            ${
              current === i
                ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/50'
                : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/50 hover:text-white border border-slate-700/50'
            }
          `}
        >
          {i}
        </button>
      )
    }
    return pages
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => pageChange(current - 1)}
        disabled={current === 1}
        className="p-2 rounded-lg bg-slate-800/50 text-slate-300 hover:bg-slate-700/50 hover:text-white border border-slate-700/50 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      {renderPageNumbers()}

      <button
        onClick={() => pageChange(current + 1)}
        disabled={current === totalPages}
        className="p-2 rounded-lg bg-slate-800/50 text-slate-300 hover:bg-slate-700/50 hover:text-white border border-slate-700/50 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      <div className="ml-4 text-sm text-slate-500">
        共 {totalPages} 页 / {total} 条
      </div>
    </div>
  )
}

export default ListPage
