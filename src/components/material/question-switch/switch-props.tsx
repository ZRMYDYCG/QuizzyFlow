import React, { useEffect } from 'react'
import { Form, Input, Switch } from 'antd'
import { IQuestionSwitchProps } from './interface.ts'

const SwitchProps: React.FC<IQuestionSwitchProps> = (
  props: IQuestionSwitchProps
) => {
  const { title, defaultChecked, checkedText, unCheckedText, loading, onChange, disabled } = props
  const [form] = Form.useForm()

  useEffect(() => {
    form.setFieldsValue({ title, defaultChecked, checkedText, unCheckedText, loading })
  }, [title, defaultChecked, checkedText, unCheckedText, loading])

  function handleValueChange() {
    if (onChange) {
      onChange(form.getFieldsValue())
    }
  }

  return (
    <Form
      onChange={handleValueChange}
      layout="vertical"
      initialValues={{ title, defaultChecked, checkedText, unCheckedText, loading }}
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
      <Form.Item label="选中时的文字" name="checkedText">
        <Input />
      </Form.Item>
      <Form.Item label="未选中时的文字" name="unCheckedText">
        <Input />
      </Form.Item>
      <Form.Item label="默认选中" name="defaultChecked" valuePropName="checked">
        <Switch />
      </Form.Item>
      <Form.Item label="加载中状态" name="loading" valuePropName="checked">
        <Switch />
      </Form.Item>
    </Form>
  )
}

export default SwitchProps

