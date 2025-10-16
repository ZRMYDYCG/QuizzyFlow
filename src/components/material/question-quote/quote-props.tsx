import React, { FC, useEffect } from 'react'
import { Form, Input, Checkbox, Select, ColorPicker } from 'antd'
import type { ColorPickerProps } from 'antd'
import { IQuestionQuoteProps } from './interface.ts'

const QuoteProps: FC<IQuestionQuoteProps> = (props: IQuestionQuoteProps) => {
  const [form] = Form.useForm()

  const { text, author, isItalic, iconType, bgColor, borderColor, onChange, disabled } = props

  useEffect(() => {
    form.setFieldsValue({ text, author, isItalic, iconType, bgColor, borderColor })
  }, [text, author, isItalic, iconType, bgColor, borderColor])

  function handleValuesChange() {
    if (onChange) {
      const values = form.getFieldsValue()
      // 处理颜色选择器的值
      if (typeof values.bgColor === 'object' && values.bgColor?.toHexString) {
        values.bgColor = values.bgColor.toHexString()
      }
      if (typeof values.borderColor === 'object' && values.borderColor?.toHexString) {
        values.borderColor = values.borderColor.toHexString()
      }
      onChange(values)
    }
  }

  return (
    <Form
      layout="vertical"
      initialValues={{ text, author, isItalic, iconType, bgColor, borderColor }}
      disabled={disabled}
      onValuesChange={handleValuesChange}
      form={form}
    >
      <Form.Item
        label="引用内容"
        name="text"
        rules={[{ required: true, message: '请输入引用内容' }]}
      >
        <Input.TextArea rows={4} placeholder="输入引用文本" />
      </Form.Item>

      <Form.Item label="作者署名" name="author">
        <Input placeholder="输入作者名称（可选）" />
      </Form.Item>

      <Form.Item label="图标类型" name="iconType">
        <Select>
          <Select.Option value="quote">引号</Select.Option>
          <Select.Option value="info">信息</Select.Option>
          <Select.Option value="warning">警告</Select.Option>
          <Select.Option value="none">无图标</Select.Option>
        </Select>
      </Form.Item>

      <Form.Item label="背景颜色" name="bgColor">
        <ColorPicker
          showText
          format="hex"
          presets={[
            {
              label: '常用颜色',
              colors: [
                '#f9f9f9',
                '#f0f5ff',
                '#fff7e6',
                '#fff1f0',
                '#f6ffed',
                '#e6f7ff',
              ],
            },
          ]}
        />
      </Form.Item>

      <Form.Item label="边框颜色" name="borderColor">
        <ColorPicker
          showText
          format="hex"
          presets={[
            {
              label: '常用颜色',
              colors: [
                '#1890ff',
                '#52c41a',
                '#faad14',
                '#f5222d',
                '#722ed1',
                '#13c2c2',
              ],
            },
          ]}
        />
      </Form.Item>

      <Form.Item label="斜体显示" name="isItalic" valuePropName="checked">
        <Checkbox />
      </Form.Item>
    </Form>
  )
}

export default QuoteProps

