import React from 'react'
import { getComponentConfigByType } from '@/components/material'
import UnsupportedComponent from '@/components/material/unsupported-component'
import type { QuestionComponentType } from '@/store/modules/question-component'
import { useMaterialLinkage } from './MaterialLinkageProvider'
import { isInteractiveComponent } from './interactive-types'

interface LinkedComponentRendererProps {
  component: QuestionComponentType
  /** 无联动上下文时的回退：是否答题模式 */
  isAnswerMode?: boolean
  answerValues?: Record<string, unknown>
  onAnswerChange?: (componentId: string, value: unknown) => void
}

export const LinkedComponentRenderer: React.FC<LinkedComponentRendererProps> = ({
  component,
  isAnswerMode: fallbackAnswerMode = false,
  answerValues: fallbackValues = {},
  onAnswerChange: fallbackOnChange,
}) => {
  const linkage = useMaterialLinkage()
  const { type, props, title, fe_id, isHidden } = component
  const componentConfig = getComponentConfigByType(type)

  if (!componentConfig) {
    return <UnsupportedComponent type={type} title={title} />
  }

  const { component: Component } = componentConfig
  const isAnswerMode = linkage?.isAnswerMode ?? fallbackAnswerMode
  const values = linkage?.values ?? fallbackValues
  const onChangeHandler = linkage?.emitChange ?? fallbackOnChange

  const visible = linkage
    ? linkage.isComponentVisible(fe_id, isHidden)
    : !isHidden

  if (!visible) return null

  const disabled = linkage
    ? linkage.isComponentDisabled(fe_id, !!props?.disabled)
    : !!props?.disabled

  const currentValue = values[fe_id]

  if (isAnswerMode && isInteractiveComponent(type)) {
    const ComponentToRender = Component as React.ComponentType<Record<string, unknown>>
    return (
      <ComponentToRender
        {...props}
        disabled={disabled}
        value={currentValue}
        onChange={(value: unknown) => onChangeHandler?.(fe_id, value)}
      />
    )
  }

  const ComponentToRender = Component as React.ComponentType<Record<string, unknown>>
  return <ComponentToRender {...props} disabled={!isAnswerMode || disabled} />
}
