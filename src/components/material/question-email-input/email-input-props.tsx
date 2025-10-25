import React, { useEffect } from 'react'
import { Form, Input, Switch } from 'antd'
import { IQuestionEmailInputProps } from './interface.ts'

const EmailInputProps: React.FC<IQuestionEmailInputProps> = (
  props: IQuestionEmailInputProps
) => {
  const { title, placeholder, showValidation, onChange, disabled } = props
  const [form] = Form.useForm()

  useEffect(() => {
    form.setFieldsValue({ title, placeholder, showValidation })
  }, [title, placeholder, showValidation])

  function handleValueChange() {
    if (onChange) {
      onChange(form.getFieldsValue())
    }
  }

  return (
    <Form
      onChange={handleValueChange}
      layout="vertical"
      initialValues={{ title, placeholder, showValidation }}
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
      <Form.Item label="Placeholder" name="placeholder">
        <Input />
      </Form.Item>
      <Form.Item label="显示验证状态" name="showValidation" valuePropName="checked">
        <Switch />
      </Form.Item>
    </Form>
  )
}

export default EmailInputProps

