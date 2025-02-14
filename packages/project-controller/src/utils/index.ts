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
export function getNextSelectedId(fe_id: string, componentList: any[]) {
  const index = componentList.findIndex((item: any) => item.fe_id === fe_id)
  if (index < 0) return ''

  let newSelectedId = ''
  const length = componentList.length
  if (length <= 1) {
    newSelectedId = ''
  } else {
    if (index + 1 === length) {
      // 删除最后一个, 选中前一个
      newSelectedId = componentList[index - 1].fe_id
    } else {
      // 删除的不是最后一个, 选中下一个
      newSelectedId = componentList[index + 1].fe_id
    }
  }
  return newSelectedId
}
