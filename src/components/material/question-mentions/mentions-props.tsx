import React, { useEffect } from 'react'
import { Form, Input, Button, Space } from 'antd'
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons'
import { IQuestionMentionsProps } from './interface.ts'

const MentionsProps: React.FC<IQuestionMentionsProps> = (
  props: IQuestionMentionsProps
) => {
  const { title, placeholder, prefix, options, onChange, disabled } = props
  const [form] = Form.useForm()

  useEffect(() => {
    form.setFieldsValue({ title, placeholder, prefix, options })
  }, [title, placeholder, prefix, options])

  function handleValueChange() {
    if (onChange) {
      onChange(form.getFieldsValue())
    }
  }

  return (
    <Form
      onChange={handleValueChange}
      layout="vertical"
      initialValues={{ title, placeholder, prefix, options }}
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
        <Input />
      </Form.Item>
      <Form.Item label="触发字符" name="prefix">
        <Input placeholder="例如: @" />
      </Form.Item>
      
      <Form.List name="options">
        {(fields, { add, remove }) => (
          <>
            <div className="mb-2 font-medium">选项列表</div>
            {fields.map((field, index) => (
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

export default MentionsProps

