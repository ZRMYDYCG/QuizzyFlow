import React, { FC, useEffect } from 'react'
import { Form, Input, InputNumber, Select, Button, Space, Card } from 'antd'
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons'
import { IQuestionStepsProps } from './interface.ts'

const StepsProps: FC<IQuestionStepsProps> = (props: IQuestionStepsProps) => {
  const [form] = Form.useForm()

  const {
    steps,
    current,
    direction,
    size,
    onChange,
    disabled,
  } = props

  useEffect(() => {
    form.setFieldsValue({
      steps,
      current,
      direction,
      size,
    })
  }, [steps, current, direction, size])

  function handleValuesChange() {
    if (onChange) {
      onChange(form.getFieldsValue())
    }
  }

  return (
    <Form
      layout="vertical"
      initialValues={{
        steps,
        current,
        direction,
        size,
      }}
      disabled={disabled}
      onValuesChange={handleValuesChange}
      form={form}
    >
      <Form.List name="steps">
        {(fields, { add, remove }) => (
          <>
            <Form.Item label="步骤列表">
              <Space direction="vertical" style={{ width: '100%' }}>
                {fields.map((field, index) => (
                  <Card
                    key={field.key}
                    size="small"
                    title={`步骤 ${index + 1}`}
                    extra={
                      fields.length > 1 && (
                        <Button
                          type="text"
                          size="small"
                          danger
                          icon={<DeleteOutlined />}
                          onClick={() => remove(field.name)}
                        />
                      )
                    }
                  >
                    <Form.Item
                      {...field}
                      name={[field.name, 'title']}
                      label="标题"
                      rules={[{ required: true, message: '请输入步骤标题' }]}
                      style={{ marginBottom: 8 }}
                    >
                      <Input placeholder="步骤标题" />
                    </Form.Item>
                    <Form.Item
                      {...field}
                      name={[field.name, 'description']}
                      label="描述"
                      style={{ marginBottom: 0 }}
                    >
                      <Input.TextArea rows={2} placeholder="步骤说明（可选）" />
                    </Form.Item>
                  </Card>
                ))}
                <Button
                  type="dashed"
                  onClick={() => add({ title: '新步骤', description: '' })}
                  block
                  icon={<PlusOutlined />}
                >
                  添加步骤
                </Button>
              </Space>
            </Form.Item>
          </>
        )}
      </Form.List>

      <Form.Item label="当前步骤" name="current">
        <InputNumber min={0} style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item label="方向" name="direction">
        <Select>
          <Select.Option value="horizontal">横向</Select.Option>
          <Select.Option value="vertical">纵向</Select.Option>
        </Select>
      </Form.Item>

      <Form.Item label="尺寸" name="size">
        <Select>
          <Select.Option value="default">默认</Select.Option>
          <Select.Option value="small">小</Select.Option>
        </Select>
      </Form.Item>
    </Form>
  )
}

export default StepsProps

