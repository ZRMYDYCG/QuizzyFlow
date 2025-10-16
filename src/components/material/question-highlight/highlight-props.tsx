import React, { FC, useEffect } from 'react'
import { Form, Input, Select, Checkbox, Space } from 'antd'
import { IQuestionHighlightProps } from './interface.ts'

const HighlightProps: FC<IQuestionHighlightProps> = (
  props: IQuestionHighlightProps
) => {
  const [form] = Form.useForm()

  const {
    text,
    backgroundColor,
    textColor,
    bold,
    italic,
    underline,
    strikethrough,
    animation,
    onChange,
    disabled,
  } = props

  useEffect(() => {
    form.setFieldsValue({
      text,
      backgroundColor,
      textColor,
      bold,
      italic,
      underline,
      strikethrough,
      animation,
    })
  }, [text, backgroundColor, textColor, bold, italic, underline, strikethrough, animation])

  function handleValuesChange() {
    if (onChange) {
      onChange(form.getFieldsValue())
    }
  }

  return (
    <Form
      layout="vertical"
      initialValues={{
        text,
        backgroundColor,
        textColor,
        bold,
        italic,
        underline,
        strikethrough,
        animation,
      }}
      disabled={disabled}
      onValuesChange={handleValuesChange}
      form={form}
    >
      <Form.Item
        label="高亮文本"
        name="text"
        rules={[{ required: true, message: '请输入高亮文本' }]}
      >
        <Input.TextArea rows={2} placeholder="这是高亮文本" />
      </Form.Item>

      <Form.Item label="背景颜色" name="backgroundColor">
        <Input type="color" style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item label="文字颜色" name="textColor">
        <Input type="color" style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item label="文本样式">
        <Space direction="vertical">
          <Form.Item name="bold" valuePropName="checked" style={{ marginBottom: 0 }}>
            <Checkbox>加粗</Checkbox>
          </Form.Item>
          <Form.Item name="italic" valuePropName="checked" style={{ marginBottom: 0 }}>
            <Checkbox>斜体</Checkbox>
          </Form.Item>
          <Form.Item name="underline" valuePropName="checked" style={{ marginBottom: 0 }}>
            <Checkbox>下划线</Checkbox>
          </Form.Item>
          <Form.Item name="strikethrough" valuePropName="checked" style={{ marginBottom: 0 }}>
            <Checkbox>删除线</Checkbox>
          </Form.Item>
        </Space>
      </Form.Item>

      <Form.Item label="动画效果" name="animation">
        <Select>
          <Select.Option value="none">无动画</Select.Option>
          <Select.Option value="blink">闪烁</Select.Option>
          <Select.Option value="breath">呼吸</Select.Option>
        </Select>
      </Form.Item>
    </Form>
  )
}

export default HighlightProps

