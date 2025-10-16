import { FC, useState } from 'react'
import { Typography, Button, message } from 'antd'
import { CopyOutlined, CheckOutlined } from '@ant-design/icons'
import {
  IQuestionCodeProps,
  QuestionCodeDefaultProps,
} from './interface.ts'

const QuestionCode: FC<IQuestionCodeProps> = (props: IQuestionCodeProps) => {
  const {
    code = '',
    language = 'javascript',
    showLineNumbers = true,
    theme = 'light',
    title = '',
    showCopyButton = true,
  } = {
    ...QuestionCodeDefaultProps,
    ...props,
  }

  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      message.success('代码已复制到剪贴板')
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      message.error('复制失败，请手动复制')
    }
  }

  const codeLines = code.split('\n')

  const isDark = theme === 'dark'
  const bgColor = isDark ? '#1e1e1e' : '#f5f5f5'
  const textColor = isDark ? '#d4d4d4' : '#333333'
  const lineNumberColor = isDark ? '#858585' : '#999999'
  const borderColor = isDark ? '#3e3e3e' : '#e1e1e1'
  const headerBgColor = isDark ? '#2d2d2d' : '#ebebeb'

  return (
    <div
      style={{
        margin: '12px 0',
        border: `1px solid ${borderColor}`,
        borderRadius: '6px',
        overflow: 'hidden',
        backgroundColor: bgColor,
      }}
    >
      {/* 标题栏 */}
      {(title || showCopyButton) && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '8px 12px',
            backgroundColor: headerBgColor,
            borderBottom: `1px solid ${borderColor}`,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {title && (
              <Typography.Text
                style={{
                  fontSize: '13px',
                  fontWeight: 500,
                  color: textColor,
                }}
              >
                {title}
              </Typography.Text>
            )}
            <Typography.Text
              style={{
                fontSize: '12px',
                color: lineNumberColor,
                textTransform: 'uppercase',
              }}
            >
              {language}
            </Typography.Text>
          </div>
          {showCopyButton && (
            <Button
              type="text"
              size="small"
              icon={copied ? <CheckOutlined /> : <CopyOutlined />}
              onClick={handleCopy}
              style={{
                color: copied ? '#52c41a' : textColor,
                fontSize: '12px',
              }}
            >
              {copied ? '已复制' : '复制'}
            </Button>
          )}
        </div>
      )}

      {/* 代码区域 */}
      <div
        style={{
          padding: '12px 0',
          overflowX: 'auto',
          maxHeight: '500px',
          overflowY: 'auto',
        }}
      >
        <pre
          style={{
            margin: 0,
            padding: 0,
            fontSize: '14px',
            lineHeight: '1.6',
            fontFamily:
              'Consolas, Monaco, "Courier New", monospace',
            color: textColor,
          }}
        >
          {codeLines.map((line, index) => (
            <div
              key={index}
              style={{
                display: 'flex',
                minHeight: '22px',
              }}
            >
              {showLineNumbers && (
                <span
                  style={{
                    display: 'inline-block',
                    width: '40px',
                    flexShrink: 0,
                    textAlign: 'right',
                    paddingRight: '12px',
                    paddingLeft: '12px',
                    color: lineNumberColor,
                    userSelect: 'none',
                    fontSize: '13px',
                  }}
                >
                  {index + 1}
                </span>
              )}
              <span
                style={{
                  paddingRight: '12px',
                  paddingLeft: showLineNumbers ? '0' : '12px',
                  whiteSpace: 'pre',
                }}
              >
                {line || ' '}
              </span>
            </div>
          ))}
        </pre>
      </div>
    </div>
  )
}

export default QuestionCode

