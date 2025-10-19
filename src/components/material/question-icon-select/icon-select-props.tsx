import { FC, useEffect } from 'react'
import { Form, Input, InputNumber, Checkbox, Button, Space } from 'antd'
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons'
import { IQuestionIconSelectProps } from './interface'
import { nanoid } from 'nanoid'

const IconSelectProps: FC<IQuestionIconSelectProps> = (props: IQuestionIconSelectProps) => {
  const { title, options = [], isMultiple, iconSize, onChange, disabled } = props
  const [form] = Form.useForm()

  useEffect(() => {
    form.setFieldsValue({ title, options, isMultiple, iconSize })
  }, [title, options, isMultiple, iconSize])

  const handleValueChange = () => {
    if (onChange === null) return
    const newValues = form.getFieldsValue()
    const { options = [] } = newValues

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
      initialValues={{ title, options, isMultiple, iconSize }}
      onValuesChange={handleValueChange}
      form={form}
      disabled={disabled}
    >
      <Form.Item
        name="title"
        label="标题"
        rules={[{ required: true, message: '请输入标题' }]}
      >
        <Input placeholder="请选择您的兴趣爱好" />
      </Form.Item>

      <Form.Item name="iconSize" label="图标大小（像素）">
        <InputNumber min={24} max={96} className="w-full" />
      </Form.Item>

      <Form.Item label="图标选项">
        <Form.List name="options">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name }, index) => (
                <div key={key} className="mb-3 p-3 border border-gray-200 rounded">
                  <Space direction="vertical" className="w-full">
                    <Space align="baseline" className="w-full">
                      <Form.Item
                        name={[name, 'icon']}
                        label="图标"
                        rules={[{ required: true, message: '请输入图标' }]}
                        className="mb-0"
                        style={{ width: 80 }}
                      >
                        <Input placeholder="🎵" className="text-center text-2xl" maxLength={2} />
                      </Form.Item>
                      <Form.Item
                        name={[name, 'label']}
                        label="标签"
                        rules={[{ required: true, message: '请输入标签' }]}
                        className="mb-0 flex-1"
                      >
                        <Input placeholder="如：音乐" />
                      </Form.Item>
                    </Space>
                    {index > 0 && (
                      <Button
                        type="text"
                        danger
                        onClick={() => remove(name)}
                        icon={<MinusCircleOutlined />}
                        size="small"
                      >
                        删除此选项
                      </Button>
                    )}
                  </Space>
                </div>
              ))}
              <Form.Item className="mb-0">
                <Button
                  type="dashed"
                  onClick={() => add({ icon: '', label: '', value: '' })}
                  icon={<PlusOutlined />}
                  block
                >
                  添加图标选项
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
      </Form.Item>

      <Form.Item name="isMultiple" valuePropName="checked">
        <Checkbox>允许多选</Checkbox>
      </Form.Item>

      <div className="p-3 bg-blue-50 rounded text-sm text-gray-600">
        <div className="font-semibold mb-2">常用图标参考：</div>
        <div className="space-y-1">
          <div>🎵🎸🎹🎤 - 音乐类</div>
          <div>⚽🏀🏈⛷️ - 运动类</div>
          <div>📚📖✏️📝 - 学习类</div>
          <div>✈️🚗🚢🏖️ - 旅行类</div>
          <div>🍕🍔🍜🍰 - 美食类</div>
        </div>
      </div>
    </Form>
  )
}

export default IconSelectProps

