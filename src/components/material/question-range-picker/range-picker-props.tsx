import React, { useEffect } from 'react'
import { Form, Input, Switch, Select } from 'antd'
import { IQuestionRangePickerProps } from './interface.ts'

const RangePickerProps: React.FC<IQuestionRangePickerProps> = (
  props: IQuestionRangePickerProps
) => {
  const { title, placeholder, format, showTime, onChange, disabled } = props
  const [form] = Form.useForm()

  useEffect(() => {
    form.setFieldsValue({ 
      title, 
      startPlaceholder: placeholder?.[0],
      endPlaceholder: placeholder?.[1],
      format, 
      showTime 
    })
  }, [title, placeholder, format, showTime])

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
        showTime 
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
      <Form.Item label="开始日期提示" name="startPlaceholder">
        <Input />
      </Form.Item>
      <Form.Item label="结束日期提示" name="endPlaceholder">
        <Input />
      </Form.Item>
      <Form.Item label="日期格式" name="format">
        <Select>
          <Select.Option value="YYYY-MM-DD">年-月-日 (YYYY-MM-DD)</Select.Option>
          <Select.Option value="YYYY/MM/DD">年/月/日 (YYYY/MM/DD)</Select.Option>
          <Select.Option value="YYYY-MM-DD HH:mm:ss">年-月-日 时:分:秒</Select.Option>
          <Select.Option value="MM-DD-YYYY">月-日-年 (MM-DD-YYYY)</Select.Option>
        </Select>
      </Form.Item>
      <Form.Item label="显示时间选择" name="showTime" valuePropName="checked">
        <Switch />
      </Form.Item>
    </Form>
  )
}

export default RangePickerProps

