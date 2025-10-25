import React, { useEffect } from 'react'
import { Form, Input, InputNumber, Switch, Select } from 'antd'
import { IQuestionOtpInputProps } from './interface.ts'

const OtpInputProps: React.FC<IQuestionOtpInputProps> = (
  props: IQuestionOtpInputProps
) => {
  const { title, length, masked, size, onChange, disabled } = props
  const [form] = Form.useForm()

  useEffect(() => {
    form.setFieldsValue({ title, length, masked, size })
  }, [title, length, masked, size])

  function handleValueChange() {
    if (onChange) {
      onChange(form.getFieldsValue())
    }
  }

  return (
    <Form
      onChange={handleValueChange}
      layout="vertical"
      initialValues={{ title, length, masked, size }}
      form={form}
      disabled={disabled}
    >
      <Form.Item
        name="title"
        label="标题"
        rules={[{ required: true, message: '请输入标题' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item label="验证码长度" name="length">
        <InputNumber className="w-full" min={4} max={8} />
      </Form.Item>
      <Form.Item label="输入框大小" name="size">
        <Select>
          <Select.Option value="large">大</Select.Option>
          <Select.Option value="middle">中</Select.Option>
          <Select.Option value="small">小</Select.Option>
        </Select>
      </Form.Item>
      <Form.Item label="显示为密码" name="masked" valuePropName="checked">
        <Switch />
      </Form.Item>
    </Form>
  )
}

export default OtpInputProps

