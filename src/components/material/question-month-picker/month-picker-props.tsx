import React, { useEffect } from 'react'
import { Form, Input, Select } from 'antd'
import { IQuestionMonthPickerProps } from './interface.ts'

const MonthPickerProps: React.FC<IQuestionMonthPickerProps> = (
  props: IQuestionMonthPickerProps
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
          <Select.Option value="YYYY-MM">年-月 (YYYY-MM)</Select.Option>
          <Select.Option value="YYYY/MM">年/月 (YYYY/MM)</Select.Option>
          <Select.Option value="MM/YYYY">月/年 (MM/YYYY)</Select.Option>
          <Select.Option value="MMMM YYYY">月份名 年 (MMMM YYYY)</Select.Option>
        </Select>
      </Form.Item>
    </Form>
  )
}

export default MonthPickerProps

