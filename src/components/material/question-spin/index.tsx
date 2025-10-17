import React from 'react'
import type { IQuestionSpinProps } from './interface.ts'
import { QuestionSpinDefaultData } from './interface.ts'
import { Spin } from 'antd'

const QuestionSpin: React.FC<IQuestionSpinProps> = (
  props: IQuestionSpinProps
) => {
  const { size, tip, spinning, delay } = {
    ...QuestionSpinDefaultData,
    ...props,
  }

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <Spin size={size} tip={tip} spinning={spinning} delay={delay} />
    </div>
  )
}

export default QuestionSpin

