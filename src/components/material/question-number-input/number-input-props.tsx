import React, { useEffect } from 'react'
import { Form, Input, InputNumber } from 'antd'
import { IQuestionNumberInputProps } from './interface.ts'

const NumberInputProps: React.FC<IQuestionNumberInputProps> = (
  props: IQuestionNumberInputProps
) => {
  const { title, placeholder, min, max, step, precision, onChange, disabled } = props
  const [form] = Form.useForm()

  useEffect(() => {
    form.setFieldsValue({ title, placeholder, min, max, step, precision })
  }, [title, placeholder, min, max, step, precision])

  function handleValueChange() {
    if (onChange) {
      onChange(form.getFieldsValue())
    }
  }

  return (
    <Form
      onChange={handleValueChange}
      layout="vertical"
      initialValues={{ title, placeholder, min, max, step, precision }}
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
      <Form.Item label="最小值" name="min">
        <InputNumber className="w-full" />
      </Form.Item>
      <Form.Item label="最大值" name="max">
        <InputNumber className="w-full" />
      </Form.Item>
      <Form.Item label="步长" name="step">
        <InputNumber className="w-full" min={0.01} step={0.1} />
      </Form.Item>
      <Form.Item label="精度（小数位数）" name="precision">
        <InputNumber className="w-full" min={0} max={10} />
      </Form.Item>
    </Form>
  )
}

export default NumberInputProps

