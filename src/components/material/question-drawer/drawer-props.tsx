import React, { useEffect } from 'react'
import { Form, Input, Select, Checkbox, InputNumber } from 'antd'
import { IQuestionDrawerProps } from './interface.ts'

const DrawerProps: React.FC<IQuestionDrawerProps> = (
  props: IQuestionDrawerProps
) => {
  const [form] = Form.useForm()
  const { title, content, placement, width, height, closable, mask, maskClosable, disabled, onChange } = props

  useEffect(() => {
    form.setFieldsValue({
      title,
      content,
      placement,
      width,
      height,
      closable,
      mask,
      maskClosable,
    })
  }, [title, content, placement, width, height, closable, mask, maskClosable])

  function handleValueChange() {
    if (onChange) {
      const values = form.getFieldsValue()
      onChange(values as IQuestionDrawerProps)
    }
  }

  return (
    <Form
      layout="vertical"
      initialValues={{
        title,
        content,
        placement,
        width,
        height,
        closable,
        mask,
        maskClosable,
      }}
      form={form}
      onValuesChange={handleValueChange}
      disabled={disabled}
    >
      <Form.Item label="标题" name="title" rules={[{ required: true, message: '请输入标题！' }]}>
        <Input placeholder="请输入标题" />
      </Form.Item>

      <Form.Item label="内容" name="content" rules={[{ required: true, message: '请输入内容！' }]}>
        <Input.TextArea rows={4} placeholder="请输入内容" />
      </Form.Item>

      <Form.Item label="位置" name="placement">
        <Select
          options={[
            { label: '上', value: 'top' },
            { label: '右', value: 'right' },
            { label: '下', value: 'bottom' },
            { label: '左', value: 'left' },
          ]}
        />
      </Form.Item>

      <Form.Item label="宽度(px)" name="width">
        <InputNumber min={200} style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item label="高度(px)" name="height">
        <InputNumber min={100} style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item label="显示关闭按钮" name="closable" valuePropName="checked">
        <Checkbox>右上角显示关闭按钮</Checkbox>
      </Form.Item>

      <Form.Item label="显示遮罩" name="mask" valuePropName="checked">
        <Checkbox>显示背景遮罩</Checkbox>
      </Form.Item>

      <Form.Item label="点击遮罩关闭" name="maskClosable" valuePropName="checked">
        <Checkbox>点击遮罩关闭抽屉</Checkbox>
      </Form.Item>
    </Form>
  )
}

export default DrawerProps


