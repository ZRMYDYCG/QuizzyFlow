import { FC } from 'react'
import { Typography } from 'antd'
import {
  MessageOutlined,
  InfoCircleOutlined,
  WarningOutlined,
} from '@ant-design/icons'
import {
  IQuestionQuoteProps,
  QuestionQuoteDefaultProps,
} from './interface.ts'

const QuestionQuote: FC<IQuestionQuoteProps> = (
  props: IQuestionQuoteProps
) => {
  const {
    text = '',
    author = '',
    isItalic = true,
    iconType = 'quote',
    bgColor = '#f9f9f9',
    borderColor = '#1890ff',
  } = {
    ...QuestionQuoteDefaultProps,
    ...props,
  }

  const textList = text.split('\n')

  const renderIcon = () => {
    const iconStyle = { fontSize: '18px', color: borderColor, marginRight: '8px' }
    switch (iconType) {
      case 'quote':
        return <MessageOutlined style={iconStyle} />
      case 'info':
        return <InfoCircleOutlined style={iconStyle} />
      case 'warning':
        return <WarningOutlined style={iconStyle} />
      default:
        return null
    }
  }

  return (
    <div
      style={{
        backgroundColor: bgColor,
        borderLeft: `4px solid ${borderColor}`,
        padding: '16px 20px',
        margin: '8px 0',
        borderRadius: '4px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start' }}>
        {iconType !== 'none' && <div>{renderIcon()}</div>}
        <div style={{ flex: 1 }}>
          <Typography.Paragraph
            style={{
              fontStyle: isItalic ? 'italic' : 'normal',
              marginBottom: author ? '8px' : 0,
              fontSize: '15px',
              lineHeight: '1.6',
            }}
          >
            {textList.map((item, index) => (
              <span key={index}>
                {index > 0 && <br />}
                {item}
              </span>
            ))}
          </Typography.Paragraph>
          {author && (
            <Typography.Text
              style={{
                fontSize: '14px',
                color: '#666',
                display: 'block',
                textAlign: 'right',
              }}
            >
              — {author}
            </Typography.Text>
          )}
        </div>
      </div>
    </div>
  )
}

export default QuestionQuote

