import React, { useEffect } from 'react'
import { Form, Input, Select } from 'antd'
import { IQuestionWeekPickerProps } from './interface.ts'

const WeekPickerProps: React.FC<IQuestionWeekPickerProps> = (
  props: IQuestionWeekPickerProps
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
          <Select.Option value="YYYY-wo">年-第几周 (YYYY-wo)</Select.Option>
          <Select.Option value="YYYY-ww">年-周数 (YYYY-ww)</Select.Option>
          <Select.Option value="wo">第几周 (wo)</Select.Option>
        </Select>
      </Form.Item>
    </Form>
  )
}

export default WeekPickerProps

