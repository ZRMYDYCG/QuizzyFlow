import React, { useEffect } from 'react'
import { Form, Input, Select, Checkbox } from 'antd'
import { IQuestionLinkProps } from './interface.ts'

const LinkProps: React.FC<IQuestionLinkProps> = (
  props: IQuestionLinkProps
) => {
  const [form] = Form.useForm()
  const { text, href, target, underline, disabled, type, onChange } = props

  useEffect(() => {
    form.setFieldsValue({
      text,
      href,
      target,
      underline,
      disabled,
      type,
    })
  }, [text, href, target, underline, disabled, type])

  function handleValueChange() {
    if (onChange) {
      const values = form.getFieldsValue()
      onChange(values as IQuestionLinkProps)
    }
  }

  return (
    <Form
      layout="vertical"
      initialValues={{
        text,
        href,
        target,
        underline,
        disabled,
        type,
      }}
      form={form}
      onValuesChange={handleValueChange}
      disabled={disabled}
    >
      <Form.Item
        label="链接文本"
        name="text"
        rules={[
          { required: true, message: '请输入链接文本！' },
          { max: 50, message: '链接文本过长，请控制在50字以内' },
        ]}
      >
        <Input placeholder="请输入链接文本" />
      </Form.Item>

      <Form.Item
        label="链接地址"
        name="href"
        rules={[
          { required: true, message: '请输入链接地址！' },
          {
            pattern: /^(https?:\/\/|\/)/,
            message: '请输入有效的链接地址（以 http://, https:// 或 / 开头）',
          },
        ]}
      >
        <Input placeholder="例如: https://example.com 或 /home" />
      </Form.Item>

      <Form.Item label="打开方式" name="target">
        <Select
          options={[
            { label: '新窗口打开', value: '_blank' },
            { label: '当前窗口打开', value: '_self' },
          ]}
        />
      </Form.Item>

      <Form.Item label="链接类型" name="type">
        <Select
          options={[
            { label: '默认', value: 'default' },
            { label: '主要', value: 'primary' },
            { label: '成功', value: 'success' },
            { label: '警告', value: 'warning' },
            { label: '危险', value: 'danger' },
          ]}
        />
      </Form.Item>

      <Form.Item label="显示下划线" name="underline" valuePropName="checked">
        <Checkbox>显示文本下划线</Checkbox>
      </Form.Item>

      <Form.Item label="禁用状态" name="disabled" valuePropName="checked">
        <Checkbox>禁用链接</Checkbox>
      </Form.Item>
    </Form>
  )
}

export default LinkProps

