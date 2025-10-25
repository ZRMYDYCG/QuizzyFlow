import React, { useEffect } from 'react'
import { Form, Input, Switch, Select, Button, Space } from 'antd'
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons'
import { IQuestionSegmentedProps } from './interface.ts'

const SegmentedProps: React.FC<IQuestionSegmentedProps> = (
  props: IQuestionSegmentedProps
) => {
  const { title, options, block, size, onChange, disabled } = props
  const [form] = Form.useForm()

  useEffect(() => {
    form.setFieldsValue({ title, options, block, size })
  }, [title, options, block, size])

  function handleValueChange() {
    if (onChange) {
      onChange(form.getFieldsValue())
    }
  }

  return (
    <Form
      onChange={handleValueChange}
      layout="vertical"
      initialValues={{ title, options, block, size }}
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

      <Form.List name="options">
        {(fields, { add, remove }) => (
          <>
            <div className="mb-2 font-medium">选项列表</div>
            {fields.map((field) => (
              <Space key={field.key} align="baseline" className="mb-2 w-full">
                <Form.Item
                  {...field}
                  name={[field.name, 'label']}
                  rules={[{ required: true, message: '请输入标签' }]}
                  className="mb-0"
                >
                  <Input placeholder="标签" style={{ width: 120 }} />
                </Form.Item>
                <Form.Item
                  {...field}
                  name={[field.name, 'value']}
                  rules={[{ required: true, message: '请输入值' }]}
                  className="mb-0"
                >
                  <Input placeholder="值" style={{ width: 100 }} />
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

      <Form.Item label="尺寸" name="size">
        <Select>
          <Select.Option value="large">大</Select.Option>
          <Select.Option value="middle">中</Select.Option>
          <Select.Option value="small">小</Select.Option>
        </Select>
      </Form.Item>
      <Form.Item label="块级显示" name="block" valuePropName="checked">
        <Switch />
      </Form.Item>
    </Form>
  )
}

export default SegmentedProps

