import { LinkageEventType, LinkageActionType } from './types'

/** 支持作为联动源（发出 change 事件）的物料类型 */
export const LINKAGE_SOURCE_TYPES = new Set([
  'question-input',
  'question-textarea',
  'question-radio',
  'question-checkbox',
  'question-select',
  'question-rate',
  'question-date',
  'question-cascader',
  'question-autocomplete',
  'question-tree-select',
  'question-time-picker',
  'question-number-input',
  'question-password-input',
  'question-email-input',
  'question-phone-input',
  'question-url-input',
  'question-range-picker',
  'question-time-range-picker',
  'question-mentions',
  'question-week-picker',
  'question-month-picker',
  'question-year-picker',
  'question-mention-textarea',
])

export function canBeLinkageSource(type: string): boolean {
  return LINKAGE_SOURCE_TYPES.has(type)
}

export const LINKAGE_EVENT_OPTIONS: { value: LinkageEventType; label: string }[] = [
  { value: 'change', label: '值变化时' },
]

export const LINKAGE_CONDITION_OPTIONS = [
  { value: 'always', label: '任意值（始终触发）' },
  { value: 'eq', label: '等于' },
  { value: 'neq', label: '不等于' },
  { value: 'in', label: '属于列表' },
  { value: 'empty', label: '为空' },
  { value: 'notEmpty', label: '不为空' },
] as const

export const LINKAGE_ACTION_OPTIONS: { value: LinkageActionType; label: string }[] = [
  { value: 'show', label: '显示目标物料' },
  { value: 'hide', label: '隐藏目标物料' },
  { value: 'setDisabled', label: '禁用目标物料' },
  { value: 'setEnabled', label: '启用目标物料' },
  { value: 'clearValue', label: '清空目标物料的值' },
]
