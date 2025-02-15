import { FC, useEffect } from 'react'
import { Form, Input, Checkbox } from 'antd'
import { QuestionParagraphProps } from './interface.ts'

const ParagraphProps: FC<QuestionParagraphProps> = (
  props: QuestionParagraphProps
) => {
  const { text, isCenter, onChange, disabled } = props

  const [form] = Form.useForm()

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
    >
      <Form.Item
        label="段落内容"
        name="text"
        rules={[{ required: true, message: '请输入段落内容' }]}
      >
        <Input.TextArea />
      </Form.Item>
      <Form.Item name="isCenter">
        <Checkbox>居中显示</Checkbox>
      </Form.Item>
    </Form>
  )
}

export default ParagraphProps
