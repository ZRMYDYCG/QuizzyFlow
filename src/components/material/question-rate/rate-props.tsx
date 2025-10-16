import React, { FC, useEffect } from 'react'
import { Form, Input, InputNumber, Checkbox } from 'antd'
import { IQuestionRateProps } from './interface.ts'

const RateProps: FC<IQuestionRateProps> = (props: IQuestionRateProps) => {
  const [form] = Form.useForm()

  const {
    count,
    allowHalf,
    allowClear,
    color,
    defaultValue,
    label,
    showValue,
    onChange,
    disabled,
  } = props

  useEffect(() => {
    form.setFieldsValue({
      count,
      allowHalf,
      allowClear,
      color,
      defaultValue,
      label,
      showValue,
    })
  }, [count, allowHalf, allowClear, color, defaultValue, label, showValue])

  function handleValuesChange() {
    if (onChange) {
      onChange(form.getFieldsValue())
    }
  }

  return (
    <Form
      layout="vertical"
      initialValues={{
        count,
        allowHalf,
        allowClear,
        color,
        defaultValue,
        label,
        showValue,
      }}
      disabled={disabled}
      onValuesChange={handleValuesChange}
      form={form}
    >
      <Form.Item label="标签文字" name="label">
        <Input placeholder="请评分" />
      </Form.Item>

      <Form.Item label="星星数量" name="count">
        <InputNumber min={3} max={10} style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item label="默认评分" name="defaultValue">
        <InputNumber min={0} max={10} style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item label="星星颜色" name="color">
        <Input type="color" style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item label="半星评分" name="allowHalf" valuePropName="checked">
        <Checkbox>允许半星评分</Checkbox>
      </Form.Item>

      <Form.Item label="允许清除" name="allowClear" valuePropName="checked">
        <Checkbox>允许清除评分</Checkbox>
      </Form.Item>

      <Form.Item label="显示数值" name="showValue" valuePropName="checked">
        <Checkbox>显示评分数值</Checkbox>
      </Form.Item>
    </Form>
  )
}

export default RateProps

