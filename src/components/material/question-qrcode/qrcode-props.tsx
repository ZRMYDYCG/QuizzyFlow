import React, { useEffect } from 'react'
import {
  Form,
  Input,
  InputNumber,
  Select,
  Checkbox,
  ColorPicker,
  Radio,
  Space,
} from 'antd'
import type { Color } from 'antd/es/color-picker'
import { IQuestionQRCodeProps } from './interface.ts'

const QRCodeProps: React.FC<IQuestionQRCodeProps> = (
  props: IQuestionQRCodeProps
) => {
  const [form] = Form.useForm()
  const {
    value,
    size,
    level,
    bgColor,
    fgColor,
    includeMargin,
    logo,
    logoSize,
    align,
    description,
    onChange,
  } = props

  useEffect(() => {
    form.setFieldsValue({
      value,
      size,
      level,
      bgColor,
      fgColor,
      includeMargin,
      logo,
      logoSize,
      align,
      description,
    })
  }, [
    value,
    size,
    level,
    bgColor,
    fgColor,
    includeMargin,
    logo,
    logoSize,
    align,
    description,
  ])

  function handleValueChange() {
    if (onChange) {
      const values = form.getFieldsValue()
      // 处理颜色值
      if (values.bgColor && typeof values.bgColor === 'object') {
        values.bgColor = (values.bgColor as Color).toHexString()
      }
      if (values.fgColor && typeof values.fgColor === 'object') {
        values.fgColor = (values.fgColor as Color).toHexString()
      }
      onChange(values as IQuestionQRCodeProps)
    }
  }

  return (
    <Form
      layout="vertical"
      initialValues={{
        value,
        size,
        level,
        bgColor,
        fgColor,
        includeMargin,
        logo,
        logoSize,
        align,
        description,
      }}
      form={form}
      onValuesChange={handleValueChange}
    >
      <Form.Item
        label="二维码内容"
        name="value"
        rules={[{ required: true, message: '请输入二维码内容' }]}
      >
        <Input.TextArea
          placeholder="请输入二维码内容（如链接、文本等）"
          rows={3}
        />
      </Form.Item>

      <Form.Item label="描述文字" name="description">
        <Input placeholder="如：扫描二维码查看详情" />
      </Form.Item>

      <Form.Item label="尺寸" name="size">
        <InputNumber
          min={100}
          max={500}
          step={10}
          style={{ width: '100%' }}
          addonAfter="px"
        />
      </Form.Item>

      <Form.Item label="容错级别" name="level">
        <Select>
          <Select.Option value="L">L (低) - 7%容错</Select.Option>
          <Select.Option value="M">M (中) - 15%容错</Select.Option>
          <Select.Option value="Q">Q (较高) - 25%容错</Select.Option>
          <Select.Option value="H">H (高) - 30%容错</Select.Option>
        </Select>
      </Form.Item>

      <Form.Item label="颜色设置">
        <Space direction="vertical" style={{ width: '100%' }}>
          <Form.Item label="前景色（二维码颜色）" name="fgColor" noStyle>
            <ColorPicker
              showText
              format="hex"
              style={{ width: '100%' }}
              presets={[
                {
                  label: '常用',
                  colors: [
                    '#000000',
                    '#1890ff',
                    '#52c41a',
                    '#faad14',
                    '#f5222d',
                    '#722ed1',
                  ],
                },
              ]}
            />
          </Form.Item>
          <Form.Item label="背景色" name="bgColor" noStyle>
            <ColorPicker
              showText
              format="hex"
              style={{ width: '100%' }}
              presets={[
                {
                  label: '常用',
                  colors: [
                    '#FFFFFF',
                    '#F0F0F0',
                    '#E6F7FF',
                    '#F6FFED',
                    '#FFFBE6',
                  ],
                },
              ]}
            />
          </Form.Item>
        </Space>
      </Form.Item>

      <Form.Item label="中心Logo" name="logo">
        <Input placeholder="Logo图片URL" />
      </Form.Item>

      {logo && (
        <Form.Item label="Logo尺寸" name="logoSize">
          <InputNumber
            min={20}
            max={100}
            step={5}
            style={{ width: '100%' }}
            addonAfter="px"
          />
        </Form.Item>
      )}

      <Form.Item label="对齐方式" name="align">
        <Radio.Group>
          <Radio.Button value="left">左对齐</Radio.Button>
          <Radio.Button value="center">居中</Radio.Button>
          <Radio.Button value="right">右对齐</Radio.Button>
        </Radio.Group>
      </Form.Item>

      <Form.Item name="includeMargin" valuePropName="checked">
        <Checkbox>包含边距</Checkbox>
      </Form.Item>

      <div className="text-xs text-gray-500 mt-2 p-2 bg-blue-50 rounded">
        💡 提示：
        <ul className="list-disc list-inside mt-1">
          <li>容错级别越高，二维码越复杂，但可容忍更多损坏</li>
          <li>添加Logo时建议使用Q或H容错级别</li>
          <li>确保前景色和背景色有足够的对比度</li>
        </ul>
      </div>
    </Form>
  )
}

export default QRCodeProps

