import { nanoid } from 'nanoid'
import { getComponentConfigByType } from '@/components/material'
import type { QuestionComponentType } from '@/store/modules/question-component'
import type { MaterialComboDef } from './types'

/** 将物料组合预设转为可插入画布的组件列表 */
export function buildComponentsFromCombo(
  combo: MaterialComboDef
): QuestionComponentType[] {
  return combo.items
    .map((item) => {
      const config = getComponentConfigByType(item.type)
      if (!config) return null

      return {
        fe_id: nanoid(),
        type: item.type,
        title: item.title ?? config.title,
        isLocked: false,
        props: {
          ...config.defaultProps,
          ...item.props,
        },
      } as QuestionComponentType
    })
    .filter((c): c is QuestionComponentType => c !== null)
}
