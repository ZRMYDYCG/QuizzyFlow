import { FC } from 'react'
import { Progress, Space, Typography } from 'antd'
import {
  IQuestionProgressProps,
  QuestionProgressDefaultProps,
} from './interface.ts'

const { Text } = Typography

const QuestionProgress: FC<IQuestionProgressProps> = (
  props: IQuestionProgressProps
) => {
  const {
    percent = 60,
    type = 'line',
    status = 'normal',
    strokeColor = '#1890ff',
    showInfo = true,
    label = '完成进度',
  } = {
    ...QuestionProgressDefaultProps,
    ...props,
  }

  return (
    <Space direction="vertical" size={12} style={{ width: '100%', maxWidth: 500 }}>
      {label && <Text>{label}</Text>}
      <Progress
        percent={percent}
        type={type}
        status={status}
        strokeColor={strokeColor}
        showInfo={showInfo}
      />
    </Space>
  )
}

export default QuestionProgress

