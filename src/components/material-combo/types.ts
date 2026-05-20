import type { ComponentPropsType } from '@/components/material'

/** 组合内单个物料定义 */
export interface MaterialComboItemDef {
  type: string
  /** 图层名称，默认取物料注册名 */
  title?: string
  /** 覆盖默认 props */
  props?: Partial<ComponentPropsType>
}

/** 物料组合预设 */
export interface MaterialComboDef {
  id: string
  name: string
  description: string
  category: string
  items: MaterialComboItemDef[]
}

export interface MaterialComboGroup {
  groupName: string
  combos: MaterialComboDef[]
}
