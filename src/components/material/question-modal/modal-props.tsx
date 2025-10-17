import React, { useEffect } from 'react'
import { Form, Input, Checkbox, InputNumber, Switch } from 'antd'
import { IQuestionModalProps } from './interface.ts'

const ModalProps: React.FC<IQuestionModalProps> = (
  props: IQuestionModalProps
) => {
  const [form] = Form.useForm()
  const { title, content, footer, width, centered, okText, cancelText, closable, disabled, onChange } = props

  useEffect(() => {
    form.setFieldsValue({
      title,
      content,
      footer,
      width,
      centered,
      okText,
      cancelText,
      closable,
    })
  }, [title, content, footer, width, centered, okText, cancelText, closable])

  function handleValueChange() {
    if (onChange) {
      const values = form.getFieldsValue()
      onChange(values as IQuestionModalProps)
    }
  }

  return (
    <Form
      layout="vertical"
      initialValues={{
        title,
        content,
        footer,
        width,
        centered,
        okText,
        cancelText,
        closable,
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

      <Form.Item label="显示底部按钮" name="footer" valuePropName="checked">
        <Checkbox>显示默认底部按钮</Checkbox>
      </Form.Item>

      <Form.Item label="宽度(px)" name="width">
        <InputNumber min={200} style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item label="垂直居中" name="centered" valuePropName="checked">
        <Switch />
      </Form.Item>

      <Form.Item label="确定按钮文本" name="okText">
        <Input placeholder="确定" />
      </Form.Item>

      <Form.Item label="取消按钮文本" name="cancelText">
        <Input placeholder="取消" />
      </Form.Item>

      <Form.Item label="显示关闭按钮" name="closable" valuePropName="checked">
        <Checkbox>右上角是否显示关闭按钮</Checkbox>
      </Form.Item>
    </Form>
  )
}

export default ModalProps


