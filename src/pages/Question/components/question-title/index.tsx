import React from 'react'
import type { IQuestionTitleProps } from './interface.ts'
import { QuestionTitleDefaultData } from './interface.ts'
import { Typography } from 'antd'

const QuestionTitle: React.FC<IQuestionTitleProps> = (
  props: IQuestionTitleProps
) => {
  const { text, level, isCenter, color } = {
    ...QuestionTitleDefaultData,
    ...props,
  }
  const { Title } = Typography

  const genFontSize = (level: number) => {
    switch (level) {
      case 1:
        return '36px'
      case 2:
        return '32px'
      case 3:
        return '28px'
      case 4:
        return '24px'
      case 5:
        return '20px'
      default:
        return '20px'
    }
  }

  return (
    <Title
      level={level}
      style={{
        textAlign: isCenter ? 'center' : 'left',
        fontSize: genFontSize(level as number),
        color: color || 'inherit',
      }}
    >
      {text}
    </Title>
  )
}

export default QuestionTitle
