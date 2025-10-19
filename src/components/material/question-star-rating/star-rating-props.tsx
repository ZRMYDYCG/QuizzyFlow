import { FC, useEffect } from 'react'
import { Form, Input, InputNumber, Checkbox, Button, Space } from 'antd'
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons'
import { IQuestionStarRatingProps } from './interface'

const StarRatingProps: FC<IQuestionStarRatingProps> = (props: IQuestionStarRatingProps) => {
  const {
    title,
    count,
    value,
    allowHalf,
    allowClear,
    showValue,
    descriptions = [],
    onChange,
    disabled,
  } = props
  const [form] = Form.useForm()

  useEffect(() => {
    form.setFieldsValue({ title, count, value, allowHalf, allowClear, showValue, descriptions })
  }, [title, count, value, allowHalf, allowClear, showValue, descriptions])

  const handleValueChange = () => {
    if (onChange === null) return
    const newValues = form.getFieldsValue()
    onChange?.(newValues)
  }

  return (
    <Form
      layout="vertical"
      initialValues={{ title, count, value, allowHalf, allowClear, showValue, descriptions }}
      onValuesChange={handleValueChange}
      form={form}
      disabled={disabled}
    >
      <Form.Item
        name="title"
        label="标题"
        rules={[{ required: true, message: '请输入标题' }]}
      >
        <Input placeholder="请为我们评分" />
      </Form.Item>

      <Form.Item name="count" label="星星数量">
        <InputNumber min={3} max={10} className="w-full" />
      </Form.Item>

      <Form.Item name="value" label="默认评分">
        <InputNumber min={0} max={10} step={0.5} className="w-full" />
      </Form.Item>

      <Form.Item name="allowHalf" valuePropName="checked">
        <Checkbox>允许半星评分</Checkbox>
      </Form.Item>

      <Form.Item name="allowClear" valuePropName="checked">
        <Checkbox>允许清除评分</Checkbox>
      </Form.Item>

      <Form.Item name="showValue" valuePropName="checked">
        <Checkbox>显示分值</Checkbox>
      </Form.Item>

      <Form.Item label="等级描述（可选）">
        <Form.List name="descriptions">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name }, index) => (
                <Space key={key} align="baseline" className="w-full mb-2">
                  <span className="text-gray-500">{index + 1}星:</span>
                  <Form.Item name={name} className="mb-0 flex-1">
                    <Input placeholder={`如：${ index === 0 ? '很差' : index === 4 ? '非常满意' : '一般'}`} />
                  </Form.Item>
                  {fields.length > 1 && (
                    <MinusCircleOutlined
                      onClick={() => remove(name)}
                      className="text-red-500 cursor-pointer"
                    />
                  )}
                </Space>
              ))}
              {fields.length < 10 && (
                <Form.Item className="mb-0">
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    icon={<PlusOutlined />}
                    block
                    size="small"
                  >
                    添加描述
                  </Button>
                </Form.Item>
              )}
            </>
          )}
        </Form.List>
      </Form.Item>

      <div className="p-3 bg-blue-50 rounded text-sm text-gray-600">
        <div className="font-semibold mb-2">使用场景：</div>
        <ul className="list-disc list-inside space-y-1">
          <li>产品/服务满意度评价</li>
          <li>用户体验评分</li>
          <li>内容质量评级</li>
          <li>推荐度调查</li>
        </ul>
      </div>
    </Form>
  )
}

export default StarRatingProps

