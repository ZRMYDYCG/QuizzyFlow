import React, { FC, useEffect } from 'react'
import { Form, Input, InputNumber, Checkbox } from 'antd'
import { IQuestionSliderProps } from './interface.ts'

const SliderProps: FC<IQuestionSliderProps> = (props: IQuestionSliderProps) => {
  const [form] = Form.useForm()

  const {
    min,
    max,
    step,
    defaultValue,
    range,
    marks,
    label,
    showValue,
    onChange,
    disabled,
  } = props

  useEffect(() => {
    form.setFieldsValue({
      min,
      max,
      step,
      defaultValue,
      range,
      marks,
      label,
      showValue,
    })
  }, [min, max, step, defaultValue, range, marks, label, showValue])

  function handleValuesChange() {
    if (onChange) {
      onChange(form.getFieldsValue())
    }
  }

  return (
    <Form
      layout="vertical"
      initialValues={{
        min,
        max,
        step,
        defaultValue,
        range,
        marks,
        label,
        showValue,
      }}
      disabled={disabled}
      onValuesChange={handleValuesChange}
      form={form}
    >
      <Form.Item label="标签文字" name="label">
        <Input placeholder="请选择数值" />
      </Form.Item>

      <Form.Item label="最小值" name="min">
        <InputNumber style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item label="最大值" name="max">
        <InputNumber style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item label="步长" name="step">
        <InputNumber min={1} style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item label="默认值" name="defaultValue">
        <InputNumber style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item label="范围选择" name="range" valuePropName="checked">
        <Checkbox>启用双滑块范围选择</Checkbox>
      </Form.Item>

      <Form.Item label="显示刻度" name="marks" valuePropName="checked">
        <Checkbox>显示刻度标记</Checkbox>
      </Form.Item>

      <Form.Item label="显示数值" name="showValue" valuePropName="checked">
        <Checkbox>显示当前数值</Checkbox>
      </Form.Item>
    </Form>
  )
}

export default SliderProps

