import React, { useEffect } from 'react'
import { Form, Input, Switch, Select } from 'antd'
import { IQuestionSearchInputProps } from './interface.ts'

const SearchInputProps: React.FC<IQuestionSearchInputProps> = (
  props: IQuestionSearchInputProps
) => {
  const { title, placeholder, enterButton, size, allowClear, onChange, disabled } = props
  const [form] = Form.useForm()

  useEffect(() => {
    form.setFieldsValue({ title, placeholder, enterButton, size, allowClear })
  }, [title, placeholder, enterButton, size, allowClear])

  function handleValueChange() {
    if (onChange) {
      onChange(form.getFieldsValue())
    }
  }

  return (
    <Form
      onChange={handleValueChange}
      layout="vertical"
      initialValues={{ title, placeholder, enterButton, size, allowClear }}
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
      <Form.Item label="搜索按钮文字" name="enterButton">
        <Input />
      </Form.Item>
      <Form.Item label="输入框大小" name="size">
        <Select>
          <Select.Option value="large">大</Select.Option>
          <Select.Option value="middle">中</Select.Option>
          <Select.Option value="small">小</Select.Option>
        </Select>
      </Form.Item>
      <Form.Item label="允许清除" name="allowClear" valuePropName="checked">
        <Switch />
      </Form.Item>
    </Form>
  )
}

export default SearchInputProps

