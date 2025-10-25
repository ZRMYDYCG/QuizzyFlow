import React, { useEffect } from 'react'
import { Form, Input, Select } from 'antd'
import { IQuestionYearPickerProps } from './interface.ts'

const YearPickerProps: React.FC<IQuestionYearPickerProps> = (
  props: IQuestionYearPickerProps
) => {
  const { title, placeholder, format, onChange, disabled } = props
  const [form] = Form.useForm()

  useEffect(() => {
    form.setFieldsValue({ title, placeholder, format })
  }, [title, placeholder, format])

  function handleValueChange() {
    if (onChange) {
      onChange(form.getFieldsValue())
    }
  }

  return (
    <Form
      onChange={handleValueChange}
      layout="vertical"
      initialValues={{ title, placeholder, format }}
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
      <Form.Item label="日期格式" name="format">
        <Select>
          <Select.Option value="YYYY">年 (YYYY)</Select.Option>
          <Select.Option value="YY">年 (YY)</Select.Option>
        </Select>
      </Form.Item>
    </Form>
  )
}

export default YearPickerProps

