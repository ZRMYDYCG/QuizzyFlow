import React, { useEffect } from 'react'
import { Form, Input, Switch, Select } from 'antd'
import { IQuestionPhoneInputProps } from './interface.ts'

const PhoneInputProps: React.FC<IQuestionPhoneInputProps> = (
  props: IQuestionPhoneInputProps
) => {
  const { title, placeholder, countryCode, showCountryCode, onChange, disabled } = props
  const [form] = Form.useForm()

  useEffect(() => {
    form.setFieldsValue({ title, placeholder, countryCode, showCountryCode })
  }, [title, placeholder, countryCode, showCountryCode])

  function handleValueChange() {
    if (onChange) {
      onChange(form.getFieldsValue())
    }
  }

  return (
    <Form
      onChange={handleValueChange}
      layout="vertical"
      initialValues={{ title, placeholder, countryCode, showCountryCode }}
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
      <Form.Item label="显示国家代码" name="showCountryCode" valuePropName="checked">
        <Switch />
      </Form.Item>
      <Form.Item label="默认国家代码" name="countryCode">
        <Select>
          <Select.Option value="+86">+86 (中国)</Select.Option>
          <Select.Option value="+1">+1 (美国/加拿大)</Select.Option>
          <Select.Option value="+44">+44 (英国)</Select.Option>
          <Select.Option value="+81">+81 (日本)</Select.Option>
          <Select.Option value="+82">+82 (韩国)</Select.Option>
        </Select>
      </Form.Item>
    </Form>
  )
}

export default PhoneInputProps

