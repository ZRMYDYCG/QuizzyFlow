import React, { useEffect } from 'react'
import type { IQuestionInfoProps } from './interface.ts'
import { Form, Input } from 'antd'

const InfoProps: React.FC = (props: IQuestionInfoProps) => {
  const { title, desc, onChange, disabled } = props
  const handleValuesChange = () => {
    if (onChange) {
      onChange(form.getFieldsValue())
    }
  }

  const [form] = Form.useForm()

  useEffect(() => {
    form.setFieldsValue({ title, desc })
  }, [title, desc])

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={{ title, desc }}
      disabled={disabled}
      onValuesChange={handleValuesChange}
    >
      <Form.Item
        label="标题"
        name="title"
        rules={[{ required: true, message: '请输入问卷标题' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item label="描述" name="desc">
        <Input.TextArea />
      </Form.Item>
    </Form>
  )
}

export default InfoProps
