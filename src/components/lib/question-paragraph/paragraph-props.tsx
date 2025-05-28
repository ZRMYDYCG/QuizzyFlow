import React, { FC, useEffect } from 'react'
import { Form, Input, Checkbox } from 'antd'
import { IQuestionParagraphProps } from './interface.ts'

const ParagraphProps: FC<IQuestionParagraphProps> = (
  props: IQuestionParagraphProps
) => {
  const [form] = Form.useForm()

  const { text, isCenter, onChange, disabled } = props

  useEffect(() => {
    form.setFieldsValue({ text, isCenter })
  }, [text, isCenter])

  function handleValuesChange() {
    if (onChange) {
      onChange(form.getFieldsValue())
    }
  }

  return (
    <Form
      layout="vertical"
      initialValues={{ text, isCenter }}
      disabled={disabled}
      onValuesChange={handleValuesChange}
      form={form}
    >
      <Form.Item
        label="段落内容"
        name="text"
        rules={[{ required: true, message: '请输入段落内容' }]}
      >
        <Input.TextArea />
      </Form.Item>
      <Form.Item label="居中显示" name="isCenter" valuePropName="checked">
        <Checkbox></Checkbox>
      </Form.Item>
    </Form>
  )
}

export default ParagraphProps
