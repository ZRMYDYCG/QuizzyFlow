import React, { FC, useEffect } from 'react'
import { Form, Input, Checkbox, Select } from 'antd'
import { IQuestionAlertProps } from './interface.ts'

const AlertProps: FC<IQuestionAlertProps> = (props: IQuestionAlertProps) => {
  const [form] = Form.useForm()

  const {
    message,
    description,
    type,
    showIcon,
    closable,
    bordered,
    onChange,
    disabled,
  } = props

  useEffect(() => {
    form.setFieldsValue({
      message,
      description,
      type,
      showIcon,
      closable,
      bordered,
    })
  }, [message, description, type, showIcon, closable, bordered])

  function handleValuesChange() {
    if (onChange) {
      onChange(form.getFieldsValue())
    }
  }

  return (
    <Form
      layout="vertical"
      initialValues={{
        message,
        description,
        type,
        showIcon,
        closable,
        bordered,
      }}
      disabled={disabled}
      onValuesChange={handleValuesChange}
      form={form}
    >
      <Form.Item
        label="提示标题"
        name="message"
        rules={[{ required: true, message: '请输入提示标题' }]}
      >
        <Input placeholder="输入提示标题" />
      </Form.Item>

      <Form.Item label="详细描述" name="description">
        <Input.TextArea
          rows={4}
          placeholder="输入详细描述（可选，支持多行）"
        />
      </Form.Item>

      <Form.Item label="提示类型" name="type">
        <Select>
          <Select.Option value="success">成功 (Success)</Select.Option>
          <Select.Option value="info">信息 (Info)</Select.Option>
          <Select.Option value="warning">警告 (Warning)</Select.Option>
          <Select.Option value="error">错误 (Error)</Select.Option>
        </Select>
      </Form.Item>

      <Form.Item label="显示图标" name="showIcon" valuePropName="checked">
        <Checkbox />
      </Form.Item>

      <Form.Item label="可关闭" name="closable" valuePropName="checked">
        <Checkbox>允许用户关闭提示</Checkbox>
      </Form.Item>

      <Form.Item label="显示边框" name="bordered" valuePropName="checked">
        <Checkbox />
      </Form.Item>
    </Form>
  )
}

export default AlertProps

