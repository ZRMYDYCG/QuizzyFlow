import type { IPageInfo } from '@/store/modules/pageinfo-reducer'

export const DEFAULT_ITEMS_PER_PAGE = 5

export function getPaginationConfig(pageInfo: Pick<IPageInfo, 'paginationEnabled' | 'itemsPerPage'>) {
  const enabled = Boolean(pageInfo.paginationEnabled)
  const perPage = Math.max(
    1,
    Math.min(50, pageInfo.itemsPerPage ?? DEFAULT_ITEMS_PER_PAGE)
  )
  return { enabled, perPage }
}

export function getTotalPages(itemCount: number, perPage: number): number {
  if (itemCount <= 0) return 1
  return Math.ceil(itemCount / perPage)
}

export function sliceByPage<T>(items: T[], page: number, perPage: number): T[] {
  const start = (page - 1) * perPage
  return items.slice(start, start + perPage)
}

export function clampPage(page: number, totalPages: number): number {
  return Math.max(1, Math.min(page, totalPages))
}
