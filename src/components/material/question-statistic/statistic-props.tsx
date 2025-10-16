import { FC } from 'react'
import { Form, Input, InputNumber, Select } from 'antd'
import { IQuestionStatisticProps } from './interface'

const QuestionStatisticProps: FC<IQuestionStatisticProps> = (props) => {
  const { title, value, prefix, suffix, precision, groupSeparator, valueStyle } = props

  return (
    <Form layout="vertical" initialValues={{ title, value, prefix, suffix, precision, groupSeparator, valueStyle }}>
      <Form.Item label="标题" name="title">
        <Input placeholder="请输入标题" />
      </Form.Item>

      <Form.Item label="数值" name="value">
        <InputNumber style={{ width: '100%' }} placeholder="请输入数值" />
      </Form.Item>

      <Form.Item label="前缀" name="prefix">
        <Input placeholder="如：￥" />
      </Form.Item>

      <Form.Item label="后缀" name="suffix">
        <Input placeholder="如：元、人、次" />
      </Form.Item>

      <Form.Item label="小数精度" name="precision">
        <InputNumber min={0} max={10} style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item label="千分位分隔符" name="groupSeparator">
        <Input placeholder="如：," />
      </Form.Item>

      <Form.Item label="数值样式" name="valueStyle">
        <Select>
          <Select.Option value="default">默认</Select.Option>
          <Select.Option value="success">成功（绿色）</Select.Option>
          <Select.Option value="warning">警告（橙色）</Select.Option>
          <Select.Option value="danger">危险（红色）</Select.Option>
        </Select>
      </Form.Item>
    </Form>
  )
}

export default QuestionStatisticProps

