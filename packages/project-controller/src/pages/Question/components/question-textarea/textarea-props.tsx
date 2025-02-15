import React, { useEffect } from 'react'
import { Form, Input } from 'antd'
import { IQuestionTextareaProps } from './interface'

const { TextArea } = Input

const InputProps: React.FC<IQuestionTextareaProps> = (
  props: IQuestionTextareaProps
) => {
  const { title, placeholder, onChange, disabled } = props
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
    <Form
      onChange={handleValueChange}
      layout="vertical"
      initialValues={{ title, placeholder }}
      form={form}
      disabled={disabled}
    >
      <Form.Item
        name="title"
        label="标题"
        rules={[{ required: true, message: '请输入标题' }]}
      >
        <TextArea />
      </Form.Item>
      <Form.Item label="Placeholder" name="placeholder">
        <TextArea />
      </Form.Item>
    </Form>
  )
}

export default InputProps
