import React, { FC, useEffect } from 'react'
import { Form, Input, InputNumber, Select, Checkbox } from 'antd'
import { IQuestionImageProps } from './interface.ts'

const ImageProps: FC<IQuestionImageProps> = (props: IQuestionImageProps) => {
  const [form] = Form.useForm()

  const {
    src,
    alt,
    width,
    height,
    borderRadius,
    bordered,
    borderColor,
    fit,
    preview,
    onChange,
    disabled,
  } = props

  useEffect(() => {
    form.setFieldsValue({
      src,
      alt,
      width,
      height,
      borderRadius,
      bordered,
      borderColor,
      fit,
      preview,
    })
  }, [src, alt, width, height, borderRadius, bordered, borderColor, fit, preview])

  function handleValuesChange() {
    if (onChange) {
      onChange(form.getFieldsValue())
    }
  }

  const showBorderColor = Form.useWatch('bordered', form)

  return (
    <Form
      layout="vertical"
      initialValues={{
        src,
        alt,
        width,
        height,
        borderRadius,
        bordered,
        borderColor,
        fit,
        preview,
      }}
      disabled={disabled}
      onValuesChange={handleValuesChange}
      form={form}
    >
      <Form.Item
        label="图片URL"
        name="src"
        rules={[{ required: true, message: '请输入图片URL' }]}
      >
        <Input.TextArea rows={2} placeholder="https://example.com/image.jpg" />
      </Form.Item>

      <Form.Item label="图片描述" name="alt">
        <Input placeholder="图片的替代文本" />
      </Form.Item>

      <Form.Item label="宽度" name="width">
        <InputNumber min={50} max={1200} style={{ width: '100%' }} addonAfter="px" />
      </Form.Item>

      <Form.Item label="高度" name="height">
        <InputNumber min={50} max={800} style={{ width: '100%' }} addonAfter="px" />
      </Form.Item>

      <Form.Item label="圆角" name="borderRadius">
        <InputNumber min={0} max={50} style={{ width: '100%' }} addonAfter="px" />
      </Form.Item>

      <Form.Item label="填充方式" name="fit">
        <Select>
          <Select.Option value="fill">拉伸填充</Select.Option>
          <Select.Option value="contain">完整显示</Select.Option>
          <Select.Option value="cover">裁剪填充</Select.Option>
          <Select.Option value="none">原始尺寸</Select.Option>
          <Select.Option value="scale-down">缩小适应</Select.Option>
        </Select>
      </Form.Item>

      <Form.Item label="显示边框" name="bordered" valuePropName="checked">
        <Checkbox>显示边框</Checkbox>
      </Form.Item>

      {showBorderColor && (
        <Form.Item label="边框颜色" name="borderColor">
          <Input type="color" style={{ width: '100%' }} />
        </Form.Item>
      )}

      <Form.Item label="点击预览" name="preview" valuePropName="checked">
        <Checkbox>允许点击放大预览</Checkbox>
      </Form.Item>
    </Form>
  )
}

export default ImageProps

