import React, { FC, useEffect } from 'react'
import { Form, Input, Select, Slider, Radio, Checkbox, Button, Space, Card } from 'antd'
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons'
import { IQuestionMarqueeProps, IMarqueeMessage } from './interface.ts'

const MarqueeProps: FC<IQuestionMarqueeProps> = (
  props: IQuestionMarqueeProps
) => {
  const [form] = Form.useForm()

  const {
    messages,
    direction,
    speed,
    pauseOnHover,
    loop,
    backgroundColor,
    textColor,
    showIcon,
    onChange,
    disabled,
  } = props

  useEffect(() => {
    form.setFieldsValue({
      messages,
      direction,
      speed,
      pauseOnHover,
      loop,
      backgroundColor,
      textColor,
      showIcon,
    })
  }, [messages, direction, speed, pauseOnHover, loop, backgroundColor, textColor, showIcon])

  function handleValuesChange() {
    if (onChange) {
      onChange(form.getFieldsValue())
    }
  }

  return (
    <Form
      layout="vertical"
      initialValues={{
        messages,
        direction,
        speed,
        pauseOnHover,
        loop,
        backgroundColor,
        textColor,
        showIcon,
      }}
      disabled={disabled}
      onValuesChange={handleValuesChange}
      form={form}
    >
      <Form.List name="messages">
        {(fields, { add, remove }) => (
          <>
            <Form.Item label="通知消息列表">
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
                      name={[field.name, 'id']}
                      hidden
                    >
                      <Input />
                    </Form.Item>
                    <Form.Item
                      {...field}
                      name={[field.name, 'text']}
                      label={`消息 ${index + 1}`}
                      rules={[{ required: true, message: '请输入消息内容' }]}
                      style={{ marginBottom: 0 }}
                    >
                      <Input.TextArea rows={2} placeholder="输入通知消息内容" />
                    </Form.Item>
                  </Card>
                ))}
                <Button
                  type="dashed"
                  onClick={() => add({ id: Date.now().toString(), text: '新消息' })}
                  block
                  icon={<PlusOutlined />}
                >
                  添加消息
                </Button>
              </Space>
            </Form.Item>
          </>
        )}
      </Form.List>

      <Form.Item label="滚动方向" name="direction">
        <Radio.Group>
          <Radio value="horizontal">横向滚动</Radio>
          <Radio value="vertical">纵向滚动</Radio>
        </Radio.Group>
      </Form.Item>

      <Form.Item label="滚动速度" name="speed">
        <Slider min={1} max={10} marks={{ 1: '慢', 5: '中', 10: '快' }} />
      </Form.Item>

      <Form.Item label="悬停暂停" name="pauseOnHover" valuePropName="checked">
        <Checkbox>鼠标悬停时暂停滚动</Checkbox>
      </Form.Item>

      <Form.Item label="循环播放" name="loop" valuePropName="checked">
        <Checkbox>无限循环滚动</Checkbox>
      </Form.Item>

      <Form.Item label="背景颜色" name="backgroundColor">
        <Input type="color" style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item label="文字颜色" name="textColor">
        <Input type="color" style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item label="显示图标" name="showIcon" valuePropName="checked">
        <Checkbox>显示喇叭图标</Checkbox>
      </Form.Item>
    </Form>
  )
}

export default MarqueeProps

