import React, { FC, useEffect } from 'react'
import { Form, Input, Select, InputNumber, Checkbox, Space } from 'antd'
import { IQuestionDividerProps } from './interface.ts'

const DividerProps: FC<IQuestionDividerProps> = (
  props: IQuestionDividerProps
) => {
  const [form] = Form.useForm()

  const {
    lineType,
    text,
    textPosition,
    thickness,
    color,
    enableGradient,
    gradientStartColor,
    gradientEndColor,
    onChange,
    disabled,
  } = props

  useEffect(() => {
    form.setFieldsValue({
      lineType,
      text,
      textPosition,
      thickness,
      color,
      enableGradient,
      gradientStartColor,
      gradientEndColor,
    })
  }, [
    lineType,
    text,
    textPosition,
    thickness,
    color,
    enableGradient,
    gradientStartColor,
    gradientEndColor,
  ])

  function handleValuesChange() {
    if (onChange) {
      onChange(form.getFieldsValue())
    }
  }

  const showGradientFields = Form.useWatch('enableGradient', form)

  return (
    <Form
      layout="vertical"
      initialValues={{
        lineType,
        text,
        textPosition,
        thickness,
        color,
        enableGradient,
        gradientStartColor,
        gradientEndColor,
      }}
      disabled={disabled}
      onValuesChange={handleValuesChange}
      form={form}
    >
      <Form.Item label="线条类型" name="lineType">
        <Select>
          <Select.Option value="solid">实线</Select.Option>
          <Select.Option value="dashed">虚线</Select.Option>
          <Select.Option value="dotted">点线</Select.Option>
        </Select>
      </Form.Item>

      <Form.Item label="文字说明" name="text">
        <Input placeholder="可选，分隔线上显示的文字" />
      </Form.Item>

      <Form.Item label="文字位置" name="textPosition">
        <Select>
          <Select.Option value="left">左侧</Select.Option>
          <Select.Option value="center">居中</Select.Option>
          <Select.Option value="right">右侧</Select.Option>
        </Select>
      </Form.Item>

      <Form.Item label="线条粗细" name="thickness">
        <InputNumber min={1} max={10} style={{ width: '100%' }} addonAfter="px" />
      </Form.Item>

      <Form.Item label="启用渐变效果" name="enableGradient" valuePropName="checked">
        <Checkbox>使用渐变色</Checkbox>
      </Form.Item>

      {!showGradientFields ? (
        <Form.Item label="线条颜色" name="color">
          <Input type="color" style={{ width: '100%' }} />
        </Form.Item>
      ) : (
        <Space direction="vertical" style={{ width: '100%' }}>
          <Form.Item label="渐变起始色" name="gradientStartColor" style={{ marginBottom: 8 }}>
            <Input type="color" style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item label="渐变结束色" name="gradientEndColor" style={{ marginBottom: 0 }}>
            <Input type="color" style={{ width: '100%' }} />
          </Form.Item>
        </Space>
      )}
    </Form>
  )
}

export default DividerProps

