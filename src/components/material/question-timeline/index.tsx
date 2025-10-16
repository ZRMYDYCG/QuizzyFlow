import React, { FC } from 'react'
import { Timeline } from 'antd'
import { IQuestionTimelineProps, QuestionTimelineDefaultProps } from './interface'

const QuestionTimeline: React.FC<IQuestionTimelineProps> = (props) => {
  const {
    items,
    mode = 'left',
    pending = false,
    reverse = false,
  } = {
    ...QuestionTimelineDefaultProps,
    ...props,
  }

  return (
    <div style={{ width: '100%', maxWidth: 600, padding: '16px 0' }}>
      <Timeline
        mode={mode}
        pending={pending ? '进行中...' : undefined}
        reverse={reverse}
        items={items}
      />
    </div>
  )
}

export default QuestionTimeline

