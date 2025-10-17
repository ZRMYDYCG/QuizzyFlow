import React from 'react'
import type { IQuestionTooltipProps } from './interface.ts'
import { QuestionTooltipDefaultData } from './interface.ts'
import { Tooltip } from 'antd'

const QuestionTooltip: React.FC<IQuestionTooltipProps> = (
  props: IQuestionTooltipProps
) => {
  const { title, text, placement, trigger, color } = {
    ...QuestionTooltipDefaultData,
    ...props,
  }

  return (
    <Tooltip
      title={title}
      placement={placement}
      trigger={trigger}
      color={color || undefined}
    >
      <span style={{ cursor: 'pointer', textDecoration: 'underline dotted' }}>
        {text}
      </span>
    </Tooltip>
  )
}

export default QuestionTooltip

