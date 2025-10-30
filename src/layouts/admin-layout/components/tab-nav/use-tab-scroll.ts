import { useEffect, RefObject } from 'react'

/**
 * 自动滚动到激活标签的 Hook
 * 
 * @param scrollContainerRef 滚动容器的 ref
 * @param currentPath 当前激活的路径
 */
export const useTabScroll = (
  scrollContainerRef: RefObject<HTMLDivElement>,
  currentPath: string
) => {
  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return

    const activeTab = container.querySelector(
      `[data-path="${currentPath}"]`
    ) as HTMLElement
    
    if (activeTab) {
      const containerRect = container.getBoundingClientRect()
      const tabRect = activeTab.getBoundingClientRect()

      // 如果标签不在可视区域内，滚动到它
      if (tabRect.left < containerRect.left) {
        container.scrollLeft -= containerRect.left - tabRect.left + 20
      } else if (tabRect.right > containerRect.right) {
        container.scrollLeft += tabRect.right - containerRect.right + 20
      }
    }
  }, [scrollContainerRef, currentPath])
}