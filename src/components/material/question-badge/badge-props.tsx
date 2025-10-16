import React, { FC, useEffect } from 'react'
import { Form, Select, Radio, Checkbox, Button, Input, Space, Card } from 'antd'
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons'
import { IQuestionBadgeProps, IBadgeItem } from './interface.ts'

const BadgeProps: FC<IQuestionBadgeProps> = (props: IQuestionBadgeProps) => {
  const [form] = Form.useForm()

  const {
    badges,
    preset,
    shape,
    size,
    showIcon,
    onChange,
    disabled,
  } = props

  useEffect(() => {
    form.setFieldsValue({
      badges,
      preset,
      shape,
      size,
      showIcon,
    })
  }, [badges, preset, shape, size, showIcon])

  function handleValuesChange() {
    if (onChange) {
      onChange(form.getFieldsValue())
    }
  }

  const currentPreset = Form.useWatch('preset', form)

  return (
    <Form
      layout="vertical"
      initialValues={{
        badges,
        preset,
        shape,
        size,
        showIcon,
      }}
      disabled={disabled}
      onValuesChange={handleValuesChange}
      form={form}
    >
      <Form.Item label="预设样式" name="preset">
        <Select>
          <Select.Option value="custom">自定义</Select.Option>
          <Select.Option value="difficulty">难度标签</Select.Option>
          <Select.Option value="type">类型标签</Select.Option>
        </Select>
      </Form.Item>

      {currentPreset === 'custom' && (
        <Form.List name="badges">
          {(fields, { add, remove }) => (
            <>
              <Form.Item label="标签列表">
                <Space direction="vertical" style={{ width: '100%' }}>
                  {fields.map((field, index) => (
                    <Card
                      key={field.key}
                      size="small"
                      style={{ marginBottom: 8 }}
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
                        name={[field.name, 'text']}
                        label="文本"
                        rules={[{ required: true, message: '请输入标签文本' }]}
                        style={{ marginBottom: 8 }}
                      >
                        <Input placeholder="标签文本" />
                      </Form.Item>
                      <Form.Item
                        {...field}
                        name={[field.name, 'color']}
                        label="颜色"
                        style={{ marginBottom: 8 }}
                      >
                        <Input type="color" />
                      </Form.Item>
                      <Form.Item
                        {...field}
                        name={[field.name, 'icon']}
                        label="图标(emoji)"
                        style={{ marginBottom: 0 }}
                      >
                        <Input placeholder="如: 😊 ⭐ 📝" maxLength={2} />
                      </Form.Item>
                    </Card>
                  ))}
                  <Button
                    type="dashed"
                    onClick={() => add({ text: '新标签', color: '#1890ff' })}
                    block
                    icon={<PlusOutlined />}
                  >
                    添加标签
                  </Button>
                </Space>
              </Form.Item>
            </>
          )}
        </Form.List>
      )}

      <Form.Item label="形状" name="shape">
        <Radio.Group>
          <Radio value="default">默认</Radio>
          <Radio value="round">圆角</Radio>
        </Radio.Group>
      </Form.Item>

      <Form.Item label="大小" name="size">
        <Radio.Group>
          <Radio value="small">小</Radio>
          <Radio value="default">默认</Radio>
          <Radio value="large">大</Radio>
        </Radio.Group>
      </Form.Item>

      <Form.Item label="显示图标" name="showIcon" valuePropName="checked">
        <Checkbox>显示图标</Checkbox>
      </Form.Item>
    </Form>
  )
}

export default BadgeProps

