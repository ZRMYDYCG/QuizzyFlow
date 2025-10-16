import { FC } from 'react'
import { Form, Input, Select, Switch } from 'antd'
import { IQuestionResultProps } from './interface'

const QuestionResultProps: FC<IQuestionResultProps> = (props) => {
  const { status, title, subTitle, showButton, buttonText } = props

  return (
    <Form layout="vertical" initialValues={{ status, title, subTitle, showButton, buttonText }}>
      <Form.Item label="状态" name="status">
        <Select>
          <Select.Option value="success">成功</Select.Option>
          <Select.Option value="error">错误</Select.Option>
          <Select.Option value="info">信息</Select.Option>
          <Select.Option value="warning">警告</Select.Option>
          <Select.Option value="404">404</Select.Option>
          <Select.Option value="403">403</Select.Option>
          <Select.Option value="500">500</Select.Option>
        </Select>
      </Form.Item>

      <Form.Item label="标题" name="title">
        <Input placeholder="请输入标题" />
      </Form.Item>

      <Form.Item label="副标题" name="subTitle">
        <Input.TextArea rows={2} placeholder="请输入副标题" />
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

export default QuestionResultProps

