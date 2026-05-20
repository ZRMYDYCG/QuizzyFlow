import type { QuestionComponentType } from '@/store/modules/question-component'
import type {
  LinkageCondition,
  LinkageRuntimeState,
  MaterialLinkageRule,
} from './types'

function isEmptyValue(value: unknown): boolean {
  if (value === undefined || value === null || value === '') return true
  if (Array.isArray(value) && value.length === 0) return true
  return false
}

function normalizeCompareValue(value: unknown): string {
  if (value === undefined || value === null) return ''
  if (typeof value === 'object' && value !== null && 'format' in value) {
    try {
      return String((value as { format: (f: string) => string }).format('YYYY-MM-DD'))
    } catch {
      return String(value)
    }
  }
  return String(value)
}

export function matchLinkageCondition(
  condition: LinkageCondition,
  sourceValue: unknown
): boolean {
  const { operator, value: expected } = condition

  switch (operator) {
    case 'always':
      return true
    case 'empty':
      return isEmptyValue(sourceValue)
    case 'notEmpty':
      return !isEmptyValue(sourceValue)
    case 'eq':
      return normalizeCompareValue(sourceValue) === normalizeCompareValue(expected)
    case 'neq':
      return normalizeCompareValue(sourceValue) !== normalizeCompareValue(expected)
    case 'in': {
      const list = Array.isArray(expected)
        ? expected
        : expected !== undefined && expected !== null
          ? [expected]
          : []
      const current = normalizeCompareValue(sourceValue)
      return list.some((item) => normalizeCompareValue(item) === current)
    }
    default:
      return false
  }
}

/**
 * 根据当前各源物料的值，重新计算所有目标的显示/禁用/清空状态。
 * 多条规则按配置顺序依次应用，后执行的规则覆盖先前的同类设置。
 */
export function computeLinkageRuntimeState(
  componentList: QuestionComponentType[],
  linkages: MaterialLinkageRule[],
  values: Record<string, unknown>
): LinkageRuntimeState {
  const hiddenById: Record<string, boolean> = {}
  const disabledById: Record<string, boolean> = {}
  const clearValueIds = new Set<string>()

  for (const component of componentList) {
    hiddenById[component.fe_id] = !!component.isHidden
    disabledById[component.fe_id] = !!component.props?.disabled
  }

  const activeRules = linkages.filter((r) => r.enabled && r.actions.length > 0)

  for (const rule of activeRules) {
    const sourceValue = values[rule.sourceComponentId]
    if (!matchLinkageCondition(rule.condition, sourceValue)) continue

    for (const { targetComponentId, action } of rule.actions) {
      if (!targetComponentId) continue
      switch (action) {
        case 'show':
          hiddenById[targetComponentId] = false
          break
        case 'hide':
          hiddenById[targetComponentId] = true
          break
        case 'setDisabled':
          disabledById[targetComponentId] = true
          break
        case 'setEnabled':
          disabledById[targetComponentId] = false
          break
        case 'clearValue':
          clearValueIds.add(targetComponentId)
          break
        default:
          break
      }
    }
  }

  return { hiddenById, disabledById, clearValueIds }
}
