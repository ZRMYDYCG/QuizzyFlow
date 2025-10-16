import { FC, CSSProperties } from 'react'
import { Divider } from 'antd'
import {
  IQuestionDividerProps,
  QuestionDividerDefaultProps,
} from './interface.ts'

const QuestionDivider: FC<IQuestionDividerProps> = (
  props: IQuestionDividerProps
) => {
  const {
    lineType = 'solid',
    text = '',
    textPosition = 'center',
    thickness = 1,
    color = '#d9d9d9',
    enableGradient = false,
    gradientStartColor = '#1890ff',
    gradientEndColor = '#722ed1',
  } = {
    ...QuestionDividerDefaultProps,
    ...props,
  }

  const lineStyle: CSSProperties = {
    borderTopWidth: `${thickness}px`,
    borderTopStyle: lineType,
  }

  // 如果启用渐变效果
  if (enableGradient) {
    lineStyle.borderImage = `linear-gradient(to right, ${gradientStartColor}, ${gradientEndColor}) 1`
    lineStyle.borderTopColor = 'transparent'
  } else {
    lineStyle.borderTopColor = color
  }

  return (
    <Divider
      plain={!!text}
      orientation={text ? textPosition : 'center'}
      style={{
        margin: '16px 0',
        ...lineStyle,
      }}
    >
      {text}
    </Divider>
  )
}

export default QuestionDivider

