import { AIAction } from '../types'
import { formatActionDescription } from '../services/responseParser'

const TYPE_LABELS: Record<string, string> = {
  'question-input': '单行输入',
  'question-textarea': '多行输入',
  'question-number-input': '数字输入',
  'question-radio': '单选题',
  'question-checkbox': '多选题',
  'question-select': '下拉选择',
  'question-rate': '评分题',
  'question-slider': '滑动条',
  'question-date': '日期选择',
}

export interface ActionFormField {
  label: string
  value: string
  multiline?: boolean
}

export interface ActionFormModel {
  key: string
  title: string
  typeLabel: string
  status: 'applied' | 'pending' | 'info'
  fields: ActionFormField[]
  isExecutable: boolean
}

function getTypeLabel(type?: string) {
  if (!type) return '未知题型'
  return TYPE_LABELS[type] || type
}

function formatOptions(options: unknown): string {
  if (!Array.isArray(options)) return ''
  return options
    .map((item) => {
      if (typeof item === 'string') return item
      if (item && typeof item === 'object' && 'text' in item) {
        return String((item as { text?: string }).text ?? '')
      }
      return JSON.stringify(item)
    })
    .filter(Boolean)
    .join('、')
}

export function buildActionFormModel(action: AIAction, index: number): ActionFormModel {
  const key = action.id ?? `action-${index}`
  const data = action.data ?? {}

  if (action.type === 'suggest_improvement') {
    const suggestions = Array.isArray(data.suggestions) ? data.suggestions : []
    return {
      key,
      title: action.description || '优化建议',
      typeLabel: '建议',
      status: 'info',
      isExecutable: false,
      fields: suggestions.length
        ? suggestions.map((s: string, i: number) => ({
            label: `建议 ${i + 1}`,
            value: String(s),
            multiline: true,
          }))
        : [{ label: '说明', value: data.summary || '暂无具体建议', multiline: true }],
    }
  }

  if (action.type === 'delete_component') {
    return {
      key,
      title: action.description || formatActionDescription(action),
      typeLabel: '删除',
      status: action.applied ? 'applied' : 'pending',
      isExecutable: true,
      fields: [{ label: '组件 ID', value: String(data.fe_id ?? '—') }],
    }
  }

  const type = data.type as string | undefined
  const props = (data.props ?? {}) as Record<string, unknown>
  const shortTitle = String(
    props.title ?? data.title ?? action.description ?? formatActionDescription(action),
  )
  const fields: ActionFormField[] = [
    { label: '题型', value: getTypeLabel(type) },
    {
      label: '题目标题',
      value: String(props.title ?? data.title ?? '—'),
    },
  ]

  if (type === 'question-radio' && props.options) {
    fields.push({ label: '选项', value: formatOptions(props.options) })
  }
  if (type === 'question-checkbox' && props.list) {
    fields.push({ label: '选项', value: formatOptions(props.list) })
  }
  if (type === 'question-select' && props.options) {
    fields.push({ label: '选项', value: formatOptions(props.options) })
  }
  if (props.placeholder) {
    fields.push({ label: '占位', value: String(props.placeholder) })
  }
  if (data.fe_id) {
    fields.push({ label: 'ID', value: String(data.fe_id) })
  }

  return {
    key,
    title: shortTitle,
    typeLabel: getTypeLabel(type),
    status: action.applied ? 'applied' : 'pending',
    isExecutable: action.type !== 'suggest_improvement',
    fields,
  }
}
