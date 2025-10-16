import { FC } from 'react'
import { Form, Switch, InputNumber } from 'antd'
import { IQuestionSkeletonProps } from './interface'

const QuestionSkeletonProps: FC<IQuestionSkeletonProps> = (props) => {
  const { active, avatar, paragraph, rows, showTitle, round } = props

  return (
    <Form layout="vertical" initialValues={{ active, avatar, paragraph, rows, showTitle, round }}>
      <Form.Item label="动画效果" name="active" valuePropName="checked">
        <Switch />
      </Form.Item>

      <Form.Item label="显示头像" name="avatar" valuePropName="checked">
        <Switch />
      </Form.Item>

      <Form.Item label="显示标题" name="showTitle" valuePropName="checked">
        <Switch />
      </Form.Item>

      <Form.Item label="显示段落" name="paragraph" valuePropName="checked">
        <Switch />
      </Form.Item>

      <Form.Item label="段落行数" name="rows">
        <InputNumber min={1} max={10} style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item label="圆角样式" name="round" valuePropName="checked">
        <Switch />
      </Form.Item>
    </Form>
  )
}

export default QuestionSkeletonProps

