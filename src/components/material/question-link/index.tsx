import React from 'react'
import type { IQuestionLinkProps } from './interface.ts'
import { QuestionLinkDefaultData } from './interface.ts'
import { Typography } from 'antd'

const { Link } = Typography

const QuestionLink: React.FC<IQuestionLinkProps> = (
  props: IQuestionLinkProps
) => {
  const { text, href, target, underline, disabled, type } = {
    ...QuestionLinkDefaultData,
    ...props,
  }

  // 根据类型设置不同的样式
  const getTypeStyle = () => {
    const baseStyle: React.CSSProperties = {
      textDecoration: underline ? 'underline' : 'none',
    }

    switch (type) {
      case 'primary':
        return { ...baseStyle, color: '#1890ff' }
      case 'success':
        return { ...baseStyle, color: '#52c41a' }
      case 'warning':
        return { ...baseStyle, color: '#faad14' }
      case 'danger':
        return { ...baseStyle, color: '#ff4d4f' }
      default:
        return baseStyle
    }
  }

  return (
    <Link
      href={href}
      target={target}
      disabled={disabled}
      style={getTypeStyle()}
      underline={underline}
    >
      {text}
    </Link>
  )
}

export default QuestionLink

