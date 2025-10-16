import { FC } from 'react'
import { Form, Input, Select, Switch } from 'antd'
import { IQuestionEmptyProps } from './interface'

const QuestionEmptyProps: FC<IQuestionEmptyProps> = (props) => {
  const { description, imageStyle, showButton, buttonText } = props

  return (
    <Form layout="vertical" initialValues={{ description, imageStyle, showButton, buttonText }}>
      <Form.Item label="描述文字" name="description">
        <Input placeholder="请输入描述文字" />
      </Form.Item>

      <Form.Item label="图片样式" name="imageStyle">
        <Select>
          <Select.Option value="default">默认</Select.Option>
          <Select.Option value="simple">简约</Select.Option>
        </Select>
      </Form.Item>

      <Form.Item label="显示按钮" name="showButton" valuePropName="checked">
        <Switch />
      </Form.Item>

      <Form.Item label="按钮文字" name="buttonText">
        <Input placeholder="按钮文字" />
      </Form.Item>
    </Form>
  )
}

export default QuestionEmptyProps

