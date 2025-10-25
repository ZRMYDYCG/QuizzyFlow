import React, { useEffect } from 'react'
import { Form, Input, Switch, Select } from 'antd'
import { IQuestionTimePickerProps } from './interface.ts'

const TimePickerProps: React.FC<IQuestionTimePickerProps> = (
  props: IQuestionTimePickerProps
) => {
  const { title, placeholder, format, use12Hours, onChange, disabled } = props
  const [form] = Form.useForm()

  useEffect(() => {
    form.setFieldsValue({ title, placeholder, format, use12Hours })
  }, [title, placeholder, format, use12Hours])

  function handleValueChange() {
    if (onChange) {
      onChange(form.getFieldsValue())
    }
  }

  return (
    <Form
      onChange={handleValueChange}
      layout="vertical"
      initialValues={{ title, placeholder, format, use12Hours }}
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
      <Form.Item label="时间格式" name="format">
        <Select>
          <Select.Option value="HH:mm:ss">24小时制 (HH:mm:ss)</Select.Option>
          <Select.Option value="HH:mm">24小时制 (HH:mm)</Select.Option>
          <Select.Option value="hh:mm:ss A">12小时制 (hh:mm:ss A)</Select.Option>
          <Select.Option value="hh:mm A">12小时制 (hh:mm A)</Select.Option>
        </Select>
      </Form.Item>
      <Form.Item label="使用12小时制" name="use12Hours" valuePropName="checked">
        <Switch />
      </Form.Item>
    </Form>
  )
}

export default TimePickerProps

