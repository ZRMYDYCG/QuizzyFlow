import React, { useEffect } from 'react'
import { Form, Input, Select } from 'antd'
import { IQuestionPopoverProps } from './interface.ts'

const PopoverProps: React.FC<IQuestionPopoverProps> = (
  props: IQuestionPopoverProps
) => {
  const [form] = Form.useForm()
  const { title, content, trigger, placement, buttonText, disabled, onChange } =
    props

  useEffect(() => {
    form.setFieldsValue({
      title,
      content,
      trigger,
      placement,
      buttonText,
    })
  }, [title, content, trigger, placement, buttonText])

  function handleValueChange() {
    if (onChange) {
      const values = form.getFieldsValue()
      onChange(values as IQuestionPopoverProps)
    }
  }

  return (
    <Form
      layout="vertical"
      initialValues={{
        title,
        content,
        trigger,
        placement,
        buttonText,
      }}
      form={form}
      onValuesChange={handleValueChange}
      disabled={disabled}
    >
      <Form.Item
        label="卡片标题"
        name="title"
        rules={[{ required: true, message: '请输入卡片标题！' }]}
      >
        <Input placeholder="请输入卡片标题" />
      </Form.Item>

      <Form.Item
        label="卡片内容"
        name="content"
        rules={[{ required: true, message: '请输入卡片内容！' }]}
      >
        <Input.TextArea rows={4} placeholder="请输入卡片内容" />
      </Form.Item>

      <Form.Item
        label="触发按钮文本"
        name="buttonText"
        rules={[{ required: true, message: '请输入触发按钮文本！' }]}
      >
        <Input placeholder="请输入触发按钮文本" />
      </Form.Item>

      <Form.Item label="弹出位置" name="placement">
        <Select
          options={[
            { label: '上方', value: 'top' },
            { label: '上左', value: 'topLeft' },
            { label: '上右', value: 'topRight' },
            { label: '下方', value: 'bottom' },
            { label: '下左', value: 'bottomLeft' },
            { label: '下右', value: 'bottomRight' },
            { label: '左侧', value: 'left' },
            { label: '右侧', value: 'right' },
          ]}
        />
      </Form.Item>

      <Form.Item label="触发方式" name="trigger">
        <Select
          options={[
            { label: '鼠标悬停', value: 'hover' },
            { label: '鼠标点击', value: 'click' },
            { label: '获得焦点', value: 'focus' },
          ]}
        />
      </Form.Item>
    </Form>
  )
}

export default PopoverProps

