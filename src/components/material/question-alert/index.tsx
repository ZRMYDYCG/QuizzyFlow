import { FC, useState } from 'react'
import { Alert } from 'antd'
import {
  IQuestionAlertProps,
  QuestionAlertDefaultProps,
} from './interface.ts'

const QuestionAlert: FC<IQuestionAlertProps> = (
  props: IQuestionAlertProps
) => {
  const {
    message = '',
    description = '',
    type = 'info',
    showIcon = true,
    closable = false,
    bordered = true,
  } = {
    ...QuestionAlertDefaultProps,
    ...props,
  }

  const [visible, setVisible] = useState(true)

  // 如果组件被关闭，不渲染
  if (!visible && closable) {
    return null
  }

  const handleClose = () => {
    setVisible(false)
  }

  // 处理描述文本的换行
  const descriptionLines = description ? description.split('\n') : []
  const hasDescription = description && description.trim() !== ''

  return (
    <div style={{ margin: '12px 0' }}>
      <Alert
        message={message}
        description={
          hasDescription ? (
            <div>
              {descriptionLines.map((line, index) => (
                <div key={index}>
                  {line || <br />}
                </div>
              ))}
            </div>
          ) : undefined
        }
        type={type}
        showIcon={showIcon}
        closable={closable}
        onClose={handleClose}
        banner={!bordered}
        style={{
          borderRadius: bordered ? '6px' : '0',
        }}
      />
    </div>
  )
}

export default QuestionAlert

