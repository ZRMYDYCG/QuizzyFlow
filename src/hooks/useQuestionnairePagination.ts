import { useEffect, useState } from 'react'
import type { IPageInfo } from '@/store/modules/pageinfo-reducer'
import {
  clampPage,
  getPaginationConfig,
  getTotalPages,
  sliceByPage,
} from '@/utils/question-pagination'

export function useQuestionnairePagination<T>(
  items: T[],
  pageInfo: Pick<IPageInfo, 'paginationEnabled' | 'itemsPerPage'>
) {
  const { enabled, perPage } = getPaginationConfig(pageInfo)
  const totalPages = getTotalPages(items.length, perPage)
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    setCurrentPage((page) => clampPage(page, totalPages))
  }, [totalPages, perPage, enabled])

  const displayItems = enabled ? sliceByPage(items, currentPage, perPage) : items

  return {
    paginationEnabled: enabled,
    itemsPerPage: perPage,
    currentPage,
    setCurrentPage,
    totalPages,
    totalItems: items.length,
    displayItems,
  }
}
