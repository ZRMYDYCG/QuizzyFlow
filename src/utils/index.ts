import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * @description 合并多个 className
 * */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * @description 重新计算当前选中的组件 ID
 * */
export function getNextSelectedId(
  fe_id: string,
  componentList: any[],
  filterCallback: (component: any) => boolean
) {
  const filteredComponents = componentList.filter(filterCallback)

  if (filteredComponents.length === 0) {
    return '' // 如果没有符合条件的控件，返回空字符串
  }

  const currentIndex = componentList.findIndex(
    (component) => component.fe_id === fe_id
  )
  if (currentIndex < 0) {
    return filteredComponents[0].fe_id // 如果当前选中 ID 不存在，返回第一个符合条件的控件
  }

  // 根据当前索引，在过滤后的列表中找到新的 selectedId
  const componentIds = filteredComponents.map((component) => component.fe_id)
  // 尝试保持相同索引的位置，如果索引超出范围，则返回最后一个
  return componentIds[currentIndex] ?? componentIds[componentIds.length - 1]
}
