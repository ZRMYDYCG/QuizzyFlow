import { FC, useEffect } from 'react'
import { Form, Input, Button, Space, Select, Checkbox } from 'antd'
import { IQuestionEmojiPickerProps } from './interface'
import { nanoid } from 'nanoid'
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons'

const EmojiPickerProps: FC<IQuestionEmojiPickerProps> = (props: IQuestionEmojiPickerProps) => {
  const { title, options = [], size, allowMultiple, onChange, disabled } = props
  const [form] = Form.useForm()

  useEffect(() => {
    form.setFieldsValue({ title, options, size, allowMultiple })
  }, [title, options, size, allowMultiple])

  const handleValueChange = () => {
    if (onChange === null) return
    const newValues = form.getFieldsValue()
    const { options = [] } = newValues

    // 为没有 value 的选项生成 ID
    options.forEach((item: any) => {
      if (!item.value) {
        item.value = nanoid(5)
      }
    })

    onChange?.(newValues)
  }

  return (
    <Form
      layout="vertical"
      initialValues={{ title, options, size, allowMultiple }}
      onValuesChange={handleValueChange}
      form={form}
      disabled={disabled}
    >
      <Form.Item
        name="title"
        label="标题"
        rules={[{ required: true, message: '请输入标题' }]}
      >
        <Input placeholder="请输入问题标题" />
      </Form.Item>

      <Form.Item name="size" label="表情大小">
        <Select>
          <Select.Option value="small">小</Select.Option>
          <Select.Option value="medium">中</Select.Option>
          <Select.Option value="large">大</Select.Option>
        </Select>
      </Form.Item>

      <Form.Item label="表情选项">
        <Form.List name="options">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name }, index) => {
                return (
                  <Space key={key} align="baseline" className="w-full mb-2">
                    <Form.Item
                      name={[name, 'emoji']}
                      rules={[{ required: true, message: '请输入表情' }]}
                      className="mb-0"
                      style={{ width: 80 }}
                    >
                      <Input placeholder="😊" className="text-center text-2xl" maxLength={2} />
                    </Form.Item>
                    <Form.Item
                      name={[name, 'label']}
                      rules={[{ required: true, message: '请输入标签' }]}
                      className="mb-0 flex-1"
                    >
                      <Input placeholder="如：开心" />
                    </Form.Item>
                    {index > 1 && (
                      <MinusCircleOutlined
                        onClick={() => remove(name)}
                        className="text-red-500 cursor-pointer"
                      />
                    )}
                  </Space>
                )
              })}
              <Form.Item className="mb-0">
                <Button
                  type="link"
                  onClick={() => add({ emoji: '', label: '', value: '' })}
                  icon={<PlusOutlined />}
                  block
                >
                  添加表情
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
      </Form.Item>

      <Form.Item name="allowMultiple" valuePropName="checked">
        <Checkbox>允许多选</Checkbox>
      </Form.Item>

      <div className="p-3 bg-blue-50 rounded text-sm text-gray-600">
        <div className="font-semibold mb-2">常用表情参考：</div>
        <div className="space-y-1">
          <div>😍 😊 😄 😃 😁 😆 - 开心系列</div>
          <div>😐 😑 😶 🙄 - 中立系列</div>
          <div>😢 😭 😔 😞 😟 - 难过系列</div>
          <div>😡 😠 🤬 😤 - 生气系列</div>
          <div>❤️ 👍 👎 ⭐ 💯 - 符号系列</div>
        </div>
      </div>
    </Form>
  )
}

export default EmojiPickerProps

