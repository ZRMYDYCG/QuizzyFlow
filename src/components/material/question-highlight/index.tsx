import { FC } from 'react'
import { Typography } from 'antd'
import {
  IQuestionHighlightProps,
  QuestionHighlightDefaultProps,
} from './interface.ts'
import './highlight.css'

const { Text } = Typography

const QuestionHighlight: FC<IQuestionHighlightProps> = (
  props: IQuestionHighlightProps
) => {
  const {
    text = '这是高亮文本',
    backgroundColor = '#fff566',
    textColor = '#000000',
    bold = false,
    italic = false,
    underline = false,
    strikethrough = false,
    animation = 'none',
  } = {
    ...QuestionHighlightDefaultProps,
    ...props,
  }

  const getTextDecoration = () => {
    const decorations = []
    if (underline) decorations.push('underline')
    if (strikethrough) decorations.push('line-through')
    return decorations.length > 0 ? decorations.join(' ') : 'none'
  }

  const animationClass = animation !== 'none' ? `highlight-${animation}` : ''

  return (
    <Text
      className={animationClass}
      style={{
        backgroundColor,
        color: textColor,
        fontWeight: bold ? 'bold' : 'normal',
        fontStyle: italic ? 'italic' : 'normal',
        textDecoration: getTextDecoration(),
        padding: '2px 6px',
        borderRadius: '3px',
        display: 'inline-block',
      }}
    >
      {text}
    </Text>
  )
}

export default QuestionHighlight

