import React, { useEffect } from 'react'
import { Form, Input } from 'antd'
import { IQuestionInputProps } from './interface'

const InputProps: React.FC<IQuestionInputProps> = (
  props: IQuestionInputProps
) => {
  const { title, placeholder, onChange } = props
  const [form] = Form.useForm()

  useEffect(() => {
    form.setFieldsValue({ title, placeholder })
  }, [title, placeholder])

  function handleValueChange() {
    if (onChange) {
      onChange(form.getFieldsValue())
    }
  }

  return (
    <Form onChange={handleValueChange} layout="vertical" initialValues={{ title, placeholder }} form={form}>
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
    </Form>
  )
}

export default InputProps
