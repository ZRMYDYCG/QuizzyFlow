import React, { useEffect } from 'react'
import { Form, Input, InputNumber, Button, Space, Input as AntInput } from 'antd'
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons'
import { IQuestionMentionTextareaProps } from './interface.ts'

const { TextArea } = AntInput

const MentionTextareaProps: React.FC<IQuestionMentionTextareaProps> = (
  props: IQuestionMentionTextareaProps
) => {
  const { title, placeholder, rows, prefix, options, maxLength, onChange, disabled } = props
  const [form] = Form.useForm()

  useEffect(() => {
    form.setFieldsValue({
      title,
      placeholder,
      rows,
      prefixStr: Array.isArray(prefix) ? prefix.join(',') : prefix,
      options,
      maxLength,
    })
  }, [title, placeholder, rows, prefix, options, maxLength])

  function handleValueChange() {
    if (onChange) {
      const values = form.getFieldsValue()
      onChange({
        ...values,
        prefix: values.prefixStr ? values.prefixStr.split(',').map((p: string) => p.trim()) : '@',
      })
    }
  }

  return (
    <Form
      onChange={handleValueChange}
      layout="vertical"
      initialValues={{
        title,
        placeholder,
        rows,
        prefixStr: Array.isArray(prefix) ? prefix.join(',') : prefix,
        options,
        maxLength,
      }}
      form={form}
      disabled={disabled}
    >
      <Form.Item
        name="title"
        label="标题"
        rules={[{ required: true, message: '请输入标题' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item label="Placeholder" name="placeholder">
        <TextArea rows={2} />
      </Form.Item>
      <Form.Item label="行数" name="rows">
        <InputNumber className="w-full" min={2} max={20} />
      </Form.Item>
      <Form.Item label="触发字符（用逗号分隔）" name="prefixStr">
        <Input placeholder="例如: @,#" />
      </Form.Item>
      <Form.Item label="最大长度" name="maxLength">
        <InputNumber className="w-full" min={1} max={5000} />
      </Form.Item>

      <Form.List name="options">
        {(fields, { add, remove }) => (
          <>
            <div className="mb-2 font-medium">选项列表</div>
            {fields.map((field) => (
              <Space key={field.key} align="baseline" className="mb-2 w-full">
                <Form.Item
                  {...field}
                  name={[field.name, 'value']}
                  rules={[{ required: true, message: '请输入值' }]}
                  className="mb-0"
                >
                  <Input placeholder="值" style={{ width: 100 }} />
                </Form.Item>
                <Form.Item
                  {...field}
                  name={[field.name, 'label']}
                  rules={[{ required: true, message: '请输入标签' }]}
                  className="mb-0"
                >
                  <Input placeholder="标签" style={{ width: 120 }} />
                </Form.Item>
                <MinusCircleOutlined onClick={() => remove(field.name)} />
              </Space>
            ))}
            <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
              添加选项
            </Button>
          </>
        )}
      </Form.List>
    </Form>
  )
}

export default MentionTextareaProps

