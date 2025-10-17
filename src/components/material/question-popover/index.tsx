import React from 'react'
import type { IQuestionPopoverProps } from './interface.ts'
import { QuestionPopoverDefaultData } from './interface.ts'
import { Popover, Button } from 'antd'

const QuestionPopover: React.FC<IQuestionPopoverProps> = (
  props: IQuestionPopoverProps
) => {
  const { title, content, trigger, placement, buttonText } = {
    ...QuestionPopoverDefaultData,
    ...props,
  }

  return (
    <Popover
      title={title}
      content={content}
      trigger={trigger}
      placement={placement}
    >
      <Button type="link">{buttonText}</Button>
    </Popover>
  )
}

export default QuestionPopover

