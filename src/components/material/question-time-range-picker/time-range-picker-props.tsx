import React, { useEffect } from 'react'
import { Form, Input, Switch, Select } from 'antd'
import { IQuestionTimeRangePickerProps } from './interface.ts'

const TimeRangePickerProps: React.FC<IQuestionTimeRangePickerProps> = (
  props: IQuestionTimeRangePickerProps
) => {
  const { title, placeholder, format, use12Hours, onChange, disabled } = props
  const [form] = Form.useForm()

  useEffect(() => {
    form.setFieldsValue({ 
      title,
      startPlaceholder: placeholder?.[0],
      endPlaceholder: placeholder?.[1],
      format, 
      use12Hours 
    })
  }, [title, placeholder, format, use12Hours])

  function handleValueChange() {
    if (onChange) {
      const values = form.getFieldsValue()
      onChange({
        ...values,
        placeholder: [values.startPlaceholder, values.endPlaceholder]
      })
    }
  }

  return (
    <Form
      onChange={handleValueChange}
      layout="vertical"
      initialValues={{ 
        title,
        startPlaceholder: placeholder?.[0],
        endPlaceholder: placeholder?.[1],
        format, 
        use12Hours 
      }}
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
      <Form.Item label="开始时间提示" name="startPlaceholder">
        <Input />
      </Form.Item>
      <Form.Item label="结束时间提示" name="endPlaceholder">
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

export default TimeRangePickerProps

