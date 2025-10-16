import { FC } from 'react'
import { Form, Input, Select, Radio } from 'antd'
import { IQuestionStatCardProps } from './interface'

const { TextArea } = Input

const QuestionStatCardProps: FC<IQuestionStatCardProps> = (props) => {
  const { title, value, prefix, suffix, subtitle, trend, trendValue, color } = props

  return (
    <Form layout="vertical" initialValues={{ title, value, prefix, suffix, subtitle, trend, trendValue, color }}>
      <Form.Item label="标题" name="title">
        <Input placeholder="请输入标题" />
      </Form.Item>

      <Form.Item label="数值" name="value">
        <Input placeholder="请输入数值" />
      </Form.Item>

      <Form.Item label="前缀" name="prefix">
        <Input placeholder="如：￥" />
      </Form.Item>

      <Form.Item label="后缀" name="suffix">
        <Input placeholder="如：%、次" />
      </Form.Item>

      <Form.Item label="副标题" name="subtitle">
        <Input placeholder="请输入副标题说明" />
      </Form.Item>

      <Form.Item label="趋势" name="trend">
        <Radio.Group>
          <Radio value="up">上升</Radio>
          <Radio value="down">下降</Radio>
          <Radio value="none">无</Radio>
        </Radio.Group>
      </Form.Item>

      <Form.Item label="趋势值" name="trendValue">
        <Input placeholder="如：+12.5%" />
      </Form.Item>

      <Form.Item label="主题颜色" name="color">
        <Select>
          <Select.Option value="#1890ff">蓝色</Select.Option>
          <Select.Option value="#52c41a">绿色</Select.Option>
          <Select.Option value="#fa8c16">橙色</Select.Option>
          <Select.Option value="#f5222d">红色</Select.Option>
          <Select.Option value="#722ed1">紫色</Select.Option>
          <Select.Option value="#13c2c2">青色</Select.Option>
        </Select>
      </Form.Item>
    </Form>
  )
}

export default QuestionStatCardProps

