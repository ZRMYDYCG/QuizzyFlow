import { FC, useEffect } from 'react'
import { Form, Input, Checkbox, Button, Space, InputNumber, Select } from 'antd'
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons'
import { IQuestionWordCloudProps } from './interface'
import { nanoid } from 'nanoid'

const WordCloudProps: FC<IQuestionWordCloudProps> = (props: IQuestionWordCloudProps) => {
  const { title, tags = [], isMultiple, maxSelections, onChange, disabled } = props
  const [form] = Form.useForm()

  useEffect(() => {
    form.setFieldsValue({ title, tags, isMultiple, maxSelections })
  }, [title, tags, isMultiple, maxSelections])

  const handleValueChange = () => {
    if (onChange === null) return
    const newValues = form.getFieldsValue()
    const { tags = [] } = newValues

    tags.forEach((item: any) => {
      if (!item.value) {
        item.value = nanoid(5)
      }
    })

    onChange?.(newValues)
  }

  return (
    <Form
      layout="vertical"
      initialValues={{ title, tags, isMultiple, maxSelections }}
      onValuesChange={handleValueChange}
      form={form}
      disabled={disabled}
    >
      <Form.Item
        name="title"
        label="标题"
        rules={[{ required: true, message: '请输入标题' }]}
      >
        <Input placeholder="请选择与您相关的标签" />
      </Form.Item>

      <Form.Item label="标签列表">
        <Form.List name="tags">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name }, index) => (
                <div key={key} className="mb-3 p-3 border border-gray-200 rounded">
                  <Space direction="vertical" className="w-full">
                    <Space align="baseline" className="w-full">
                      <Form.Item
                        name={[name, 'text']}
                        label="标签文字"
                        rules={[{ required: true, message: '请输入标签' }]}
                        className="mb-0 flex-1"
                      >
                        <Input placeholder="如：科技" />
                      </Form.Item>
                      <Form.Item
                        name={[name, 'weight']}
                        label="权重 (1-5)"
                        className="mb-0"
                        style={{ width: 100 }}
                      >
                        <InputNumber min={1} max={5} placeholder="3" />
                      </Form.Item>
                    </Space>
                    {index > 2 && (
                      <Button
                        type="text"
                        danger
                        onClick={() => remove(name)}
                        icon={<MinusCircleOutlined />}
                        size="small"
                      >
                        删除标签
                      </Button>
                    )}
                  </Space>
                </div>
              ))}
              <Button
                type="dashed"
                onClick={() => add({ text: '', value: '', weight: 3 })}
                icon={<PlusOutlined />}
                block
              >
                添加标签
              </Button>
            </>
          )}
        </Form.List>
      </Form.Item>

      <Form.Item name="isMultiple" valuePropName="checked">
        <Checkbox>允许多选</Checkbox>
      </Form.Item>

      <Form.Item name="maxSelections" label="最多可选数量（多选时有效）">
        <InputNumber min={1} max={20} className="w-full" placeholder="不限制" />
      </Form.Item>

      <div className="p-3 bg-blue-50 rounded text-sm text-gray-600">
        <div className="font-semibold mb-2">适用场景：</div>
        <ul className="list-disc list-inside space-y-1">
          <li>兴趣标签选择</li>
          <li>技能标签投票</li>
          <li>关键词调查</li>
          <li>用户画像收集</li>
        </ul>
        <div className="mt-2">
          <strong>权重说明：</strong>数值越大，标签显示越大（1-5）
        </div>
      </div>
    </Form>
  )
}

export default WordCloudProps

