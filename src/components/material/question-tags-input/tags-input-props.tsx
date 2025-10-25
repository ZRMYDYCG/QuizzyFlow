import React, { useEffect } from 'react'
import { Form, Input, InputNumber } from 'antd'
import { IQuestionTagsInputProps } from './interface.ts'

const TagsInputProps: React.FC<IQuestionTagsInputProps> = (
  props: IQuestionTagsInputProps
) => {
  const { title, placeholder, maxTags, onChange, disabled } = props
  const [form] = Form.useForm()

  useEffect(() => {
    form.setFieldsValue({ title, placeholder, maxTags })
  }, [title, placeholder, maxTags])

  function handleValueChange() {
    if (onChange) {
      onChange(form.getFieldsValue())
    }
  }

  return (
    <Form
      onChange={handleValueChange}
      layout="vertical"
      initialValues={{ title, placeholder, maxTags }}
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
      <Form.Item label="最大标签数量" name="maxTags">
        <InputNumber className="w-full" min={1} max={50} />
      </Form.Item>
    </Form>
  )
}

export default TagsInputProps

