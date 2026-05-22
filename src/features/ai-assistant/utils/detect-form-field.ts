/**
 * 识别属性面板内输入框对应的字段（组件 props / 页面设置）
 */

import type { QuestionComponentType } from '@/store/modules/question-component'
import type { IPageInfo } from '@/store/modules/pageinfo-reducer'

export type FieldScope = 'component' | 'page'

export interface ResolvedField {
  scope: FieldScope
  /** props 字段名或 pageInfo 字段名 */
  field: string
  /** Form.List 选项下标 */
  optionIndex?: number
  /** options 子字段 text | value */
  optionKey?: 'text' | 'value'
}

const LABEL_FIELD_MAP: Record<string, string> = {
  标题: 'title',
  Placeholder: 'placeholder',
  placeholder: 'placeholder',
  问卷标题: 'title',
  问卷描述: 'desc',
  描述: 'desc',
}

function parseOptionFieldId(id: string): Pick<ResolvedField, 'optionIndex' | 'optionKey'> | null {
  const match = id.match(/^options_(\d+)_(text|value)$/)
  if (!match) return null
  return {
    optionIndex: Number(match[1]),
    optionKey: match[2] as 'text' | 'value',
  }
}

export function resolveFormField(
  input: HTMLInputElement | HTMLTextAreaElement,
  options: {
    selectedComponent: QuestionComponentType | null
    pageInfo: IPageInfo
  },
): ResolvedField | null {
  const { selectedComponent, pageInfo } = options
  const inPageForm = !!input.closest('[data-page-setting-form]')

  let id = input.id || ''
  const labelEl = input.closest('.ant-form-item')?.querySelector('label')
  const htmlFor = labelEl?.getAttribute('for')
  if (htmlFor) id = htmlFor

  const optionPart = parseOptionFieldId(id)

  if (inPageForm) {
    if (id === 'title' || pageInfo.title === input.value) {
      return { scope: 'page', field: 'title' }
    }
    if (id === 'desc' || pageInfo.desc === input.value) {
      return { scope: 'page', field: 'desc' }
    }
    const label = input.closest('.ant-form-item')?.querySelector('label')?.textContent?.trim()
    if (label && LABEL_FIELD_MAP[label]) {
      return { scope: 'page', field: LABEL_FIELD_MAP[label] }
    }
    return null
  }

  if (!selectedComponent) return null

  if (optionPart) {
    return {
      scope: 'component',
      field: 'options',
      ...optionPart,
    }
  }

  if (id && !id.includes(' ') && LABEL_FIELD_MAP[id] === undefined) {
    const known = ['title', 'placeholder', 'desc', 'text']
    if (known.includes(id)) {
      return { scope: 'component', field: id === 'text' ? 'title' : id }
    }
    if (id.startsWith('options')) {
      return { scope: 'component', field: 'options', ...optionPart }
    }
  }

  const label = input.closest('.ant-form-item')?.querySelector('label')?.textContent?.trim()
  if (label && LABEL_FIELD_MAP[label]) {
    const field = LABEL_FIELD_MAP[label]
    return { scope: 'component', field: field === 'desc' ? 'desc' : field }
  }

  const value = input.value
  const props = selectedComponent.props as Record<string, unknown>

  if (props?.title === value || selectedComponent.title === value) {
    return { scope: 'component', field: 'title' }
  }

  for (const [key, val] of Object.entries(props)) {
    if (val === value && typeof val === 'string') {
      return { scope: 'component', field: key }
    }
  }

  if (Array.isArray(props?.options)) {
    for (let i = 0; i < (props.options as Array<{ text?: string; value?: string }>).length; i++) {
      const opt = (props.options as Array<{ text?: string; value?: string }>)[i]
      if (opt.text === value) {
        return { scope: 'component', field: 'options', optionIndex: i, optionKey: 'text' }
      }
      if (String(opt.value) === value) {
        return { scope: 'component', field: 'options', optionIndex: i, optionKey: 'value' }
      }
    }
  }

  if (Array.isArray(props?.list)) {
    for (let i = 0; i < (props.list as Array<{ text?: string }>).length; i++) {
      const item = (props.list as Array<{ text?: string }>)[i]
      if (item.text === value) {
        return { scope: 'component', field: 'list', optionIndex: i, optionKey: 'text' }
      }
    }
  }

  return null
}

export function applyTextToValue(
  currentValue: string,
  start: number,
  end: number,
  aiText: string,
  action: string,
): string {
  const before = currentValue.slice(0, start)
  const after = currentValue.slice(end)

  if (action === 'continue') {
    return before + aiText + after
  }

  return before + aiText + after
}
