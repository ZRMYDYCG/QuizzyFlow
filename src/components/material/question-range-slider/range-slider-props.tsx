import React, { useEffect } from 'react'
import { Form, Input, InputNumber, Switch } from 'antd'
import { IQuestionRangeSliderProps } from './interface.ts'

const RangeSliderProps: React.FC<IQuestionRangeSliderProps> = (
  props: IQuestionRangeSliderProps
) => {
  const { title, min, max, step, marks, onChange, disabled } = props
  const [form] = Form.useForm()

  useEffect(() => {
    form.setFieldsValue({ title, min, max, step, marks })
  }, [title, min, max, step, marks])

  function handleValueChange() {
    if (onChange) {
      onChange(form.getFieldsValue())
    }
  }

  return (
    <Form
      onChange={handleValueChange}
      layout="vertical"
      initialValues={{ title, min, max, step, marks }}
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
      <Form.Item label="最小值" name="min">
        <InputNumber className="w-full" />
      </Form.Item>
      <Form.Item label="最大值" name="max">
        <InputNumber className="w-full" />
      </Form.Item>
      <Form.Item label="步长" name="step">
        <InputNumber className="w-full" min={0.01} step={0.1} />
      </Form.Item>
      <Form.Item label="显示刻度" name="marks" valuePropName="checked">
        <Switch />
      </Form.Item>
    </Form>
  )
}

export default RangeSliderProps

