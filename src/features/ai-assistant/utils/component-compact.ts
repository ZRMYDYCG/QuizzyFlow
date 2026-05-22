/**
 * 问卷组件 JSON 压缩，减少发给 AI 的 token 消耗
 */

import type { AttachedComponentRef } from '../types'
import { getComponentDefinition } from './templateSchema'

function isEmptyValue(value: unknown): boolean {
  if (value === null || value === undefined || value === '') return true
  if (Array.isArray(value) && value.length === 0) return true
  return false
}

function deepEqual(a: unknown, b: unknown): boolean {
  return JSON.stringify(a) === JSON.stringify(b)
}

/** 压缩选项类字段（options / list） */
function compactChoiceItems(items: unknown): unknown {
  if (!Array.isArray(items)) return items
  return items.map((item) => {
    if (typeof item !== 'object' || item === null) return item
    const row = item as Record<string, unknown>
    const text = row.text ?? row.label
    const value = row.value ?? text
    const extraKeys = Object.keys(row).filter(
      (k) => !['text', 'label', 'value'].includes(k),
    )
    if (extraKeys.length === 0 && (text != null || value != null)) {
      return { t: text, v: value }
    }
    return item
  })
}

/** 压缩 props：去掉空值、与默认值相同的字段 */
export function compactProps(
  type: string,
  props: Record<string, unknown> | undefined,
): Record<string, unknown> | undefined {
  if (!props) return undefined

  const defaults = getComponentDefinition(type)?.defaultProps ?? {}
  const result: Record<string, unknown> = {}

  for (const [key, value] of Object.entries(props)) {
    if (isEmptyValue(value)) continue
    if (deepEqual(value, defaults[key])) continue

    if (key === 'options' || key === 'list') {
      const compacted = compactChoiceItems(value)
      if (!isEmptyValue(compacted)) {
        result[key] = compacted
      }
      continue
    }

    result[key] = value
  }

  return Object.keys(result).length > 0 ? result : undefined
}

export function compactComponentForAI(component: {
  fe_id: string
  type: string
  title: string
  props?: Record<string, unknown>
}): AttachedComponentRef {
  const props = compactProps(component.type, component.props ?? {})
  const displayTitle =
    (typeof props?.title === 'string' ? props.title : undefined) ||
    component.title ||
    component.type

  return {
    fe_id: component.fe_id,
    type: component.type,
    title: displayTitle,
    ...(props ? { props } : {}),
  }
}

export function getAttachedComponentLabel(item: AttachedComponentRef): string {
  return item.title || item.type
}

export function parseDraggedComponent(
  data: string,
): AttachedComponentRef | null {
  if (!data?.trim()) return null
  try {
    const parsed = JSON.parse(data) as AttachedComponentRef
    if (!parsed?.fe_id || !parsed?.type) return null
    return compactComponentForAI(parsed)
  } catch {
    return null
  }
}
