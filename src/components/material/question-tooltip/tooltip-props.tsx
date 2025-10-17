import React, { useEffect } from 'react'
import { Form, Input, Select } from 'antd'
import { IQuestionTooltipProps } from './interface.ts'

const TooltipProps: React.FC<IQuestionTooltipProps> = (
  props: IQuestionTooltipProps
) => {
  const [form] = Form.useForm()
  const { title, text, placement, trigger, color, disabled, onChange } = props

  useEffect(() => {
    form.setFieldsValue({
      title,
      text,
      placement,
      trigger,
      color,
    })
  }, [title, text, placement, trigger, color])

  function handleValueChange() {
    if (onChange) {
      const values = form.getFieldsValue()
      onChange(values as IQuestionTooltipProps)
    }
  }

  return (
    <Form
      layout="vertical"
      initialValues={{
        title,
        text,
        placement,
        trigger,
        color,
      }}
      form={form}
      onValuesChange={handleValueChange}
      disabled={disabled}
    >
      <Form.Item
        label="提示文本"
        name="title"
        rules={[{ required: true, message: '请输入提示文本！' }]}
      >
        <Input.TextArea rows={3} placeholder="请输入提示文本" />
      </Form.Item>

      <Form.Item
        label="触发文本"
        name="text"
        rules={[{ required: true, message: '请输入触发文本！' }]}
      >
        <Input placeholder="请输入触发文本" />
      </Form.Item>

      <Form.Item label="弹出位置" name="placement">
        <Select
          options={[
            { label: '上方', value: 'top' },
            { label: '下方', value: 'bottom' },
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

      <Form.Item label="背景颜色" name="color" tooltip="留空使用默认颜色">
        <Input className="w-16 h-8 border rounded" type="color" />
      </Form.Item>
    </Form>
  )
}

export default TooltipProps

