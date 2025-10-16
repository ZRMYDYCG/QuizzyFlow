import { FC } from 'react'
import { Steps } from 'antd'
import {
  IQuestionStepsProps,
  QuestionStepsDefaultProps,
} from './interface.ts'

const QuestionSteps: FC<IQuestionStepsProps> = (
  props: IQuestionStepsProps
) => {
  const {
    steps = [],
    current = 0,
    direction = 'vertical',
    size = 'default',
  } = {
    ...QuestionStepsDefaultProps,
    ...props,
  }

  const items = steps.map((step, index) => ({
    title: step.title,
    description: step.description,
  }))

  return (
    <div style={{ 
      width: '100%', 
      maxWidth: direction === 'horizontal' ? '100%' : 600,
      padding: '16px 0',
      overflow: direction === 'horizontal' ? 'auto' : 'visible'
    }}>
      <Steps
        current={current}
        direction={direction}
        size={size}
        items={items}
      />
    </div>
  )
}

export default QuestionSteps

