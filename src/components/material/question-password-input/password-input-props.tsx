import React, { useEffect } from 'react'
import { Form, Input, Switch, InputNumber } from 'antd'
import { IQuestionPasswordInputProps } from './interface.ts'

const PasswordInputProps: React.FC<IQuestionPasswordInputProps> = (
  props: IQuestionPasswordInputProps
) => {
  const { title, placeholder, visibilityToggle, maxLength, onChange, disabled } = props
  const [form] = Form.useForm()

  useEffect(() => {
    form.setFieldsValue({ title, placeholder, visibilityToggle, maxLength })
  }, [title, placeholder, visibilityToggle, maxLength])

  function handleValueChange() {
    if (onChange) {
      onChange(form.getFieldsValue())
    }
  }

  return (
    <Form
      onChange={handleValueChange}
      layout="vertical"
      initialValues={{ title, placeholder, visibilityToggle, maxLength }}
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
      <Form.Item label="显示密码可见性切换" name="visibilityToggle" valuePropName="checked">
        <Switch />
      </Form.Item>
      <Form.Item label="最大长度" name="maxLength">
        <InputNumber className="w-full" min={1} max={200} />
      </Form.Item>
    </Form>
  )
}

export default PasswordInputProps

