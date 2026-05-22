import { customAlphabet } from 'nanoid'
import {
  getMaterialByType,
  SUPPORTED_COMPONENT_TYPES,
} from '../shared/material-library'

const generateFeId = customAlphabet('abcdefghijklmnopqrstuvwxyz0123456789', 8)

export interface ProposedComponentPayload {
  fe_id: string
  type: string
  title: string
  props: Record<string, unknown>
  isLocked: boolean
  isHidden: boolean
}

export function normalizeProposedComponent(input: {
  type: string
  title: string
  props?: Record<string, unknown>
  fe_id?: string
}): { ok: true; data: ProposedComponentPayload } | { ok: false; error: string } {
  const material = getMaterialByType(input.type)
  if (!material) {
    return {
      ok: false,
      error: `不支持的组件类型: ${input.type}。可用: ${SUPPORTED_COMPONENT_TYPES.join(', ')}`,
    }
  }

  if (!input.title?.trim()) {
    return { ok: false, error: '缺少 title' }
  }

  const fe_id =
    input.fe_id?.startsWith('c_') ? input.fe_id : `c_${generateFeId()}`

  const props: Record<string, unknown> = {
    ...material.defaultProps,
    ...(input.props ?? {}),
    title: (input.props?.title as string) ?? input.title,
  }

  if (input.type === 'question-radio' && !Array.isArray(props.options)) {
    return { ok: false, error: 'question-radio 需要 props.options 数组' }
  }
  if (input.type === 'question-checkbox' && !Array.isArray(props.list)) {
    return { ok: false, error: 'question-checkbox 需要 props.list 数组' }
  }

  return {
    ok: true,
    data: {
      fe_id,
      type: input.type,
      title: input.title,
      props,
      isLocked: false,
      isHidden: false,
    },
  }
}
