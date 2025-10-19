import { FC, useEffect } from 'react'
import { Form, Input, Checkbox } from 'antd'
import { IQuestionConsentProps } from './interface'

const ConsentProps: FC<IQuestionConsentProps> = (props: IQuestionConsentProps) => {
  const { title, content, linkText, linkUrl, required, onChange, disabled } = props
  const [form] = Form.useForm()

  useEffect(() => {
    form.setFieldsValue({ title, content, linkText, linkUrl, required })
  }, [title, content, linkText, linkUrl, required])

  const handleValueChange = () => {
    if (onChange === null) return
    const newValues = form.getFieldsValue()
    onChange?.(newValues)
  }

  return (
    <Form
      layout="vertical"
      initialValues={{ title, content, linkText, linkUrl, required }}
      onValuesChange={handleValueChange}
      form={form}
      disabled={disabled}
    >
      <Form.Item name="title" label="标题">
        <Input placeholder="隐私政策与用户协议" />
      </Form.Item>

      <Form.Item
        name="content"
        label="协议说明文字"
        rules={[{ required: true, message: '请输入说明文字' }]}
      >
        <Input placeholder="我已阅读并同意" />
      </Form.Item>

      <Form.Item
        name="linkText"
        label="链接文字"
        rules={[{ required: true, message: '请输入链接文字' }]}
      >
        <Input placeholder="《隐私政策》和《用户协议》" />
      </Form.Item>

      <Form.Item name="linkUrl" label="链接地址">
        <Input placeholder="https://example.com/privacy" />
      </Form.Item>

      <Form.Item name="required" valuePropName="checked">
        <Checkbox>必须同意才能继续（GDPR合规）</Checkbox>
      </Form.Item>

      <div className="p-3 bg-blue-50 rounded text-sm text-gray-600">
        <div className="font-semibold mb-2">GDPR合规要点：</div>
        <ul className="list-disc list-inside space-y-1">
          <li>明确告知用户数据使用方式</li>
          <li>提供完整的隐私政策链接</li>
          <li>用户主动同意，不能预选</li>
          <li>可随时撤回同意</li>
        </ul>
      </div>
    </Form>
  )
}

export default ConsentProps

