import { FC, useEffect } from 'react'
import { Form, Input, Checkbox, Button, Space } from 'antd'
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons'
import { IQuestionComparisonProps } from './interface'

const ComparisonProps: FC<IQuestionComparisonProps> = (props: IQuestionComparisonProps) => {
  const { title, optionA, optionB, showImages, showFeatures, onChange, disabled } = props
  const [form] = Form.useForm()

  useEffect(() => {
    form.setFieldsValue({ title, optionA, optionB, showImages, showFeatures })
  }, [title, optionA, optionB, showImages, showFeatures])

  const handleValueChange = () => {
    if (onChange === null) return
    const newValues = form.getFieldsValue()
    onChange?.(newValues)
  }

  return (
    <Form
      layout="vertical"
      initialValues={{ title, optionA, optionB, showImages, showFeatures }}
      onValuesChange={handleValueChange}
      form={form}
      disabled={disabled}
    >
      <Form.Item
        name="title"
        label="标题"
        rules={[{ required: true, message: '请输入标题' }]}
      >
        <Input placeholder="请选择您更喜欢的方案" />
      </Form.Item>

      {/* 方案 A */}
      <div className="p-4 bg-blue-50 rounded-lg mb-4">
        <Typography.Title level={5} className="mb-3">方案 A</Typography.Title>
        
        <Form.Item name={['optionA', 'title']} label="标题">
          <Input placeholder="方案 A" />
        </Form.Item>

        <Form.Item name={['optionA', 'description']} label="描述">
          <Input.TextArea rows={2} placeholder="经典设计方案" />
        </Form.Item>

        <Form.Item name={['optionA', 'imageUrl']} label="图片URL">
          <Input placeholder="https://example.com/image-a.jpg" />
        </Form.Item>

        <Form.Item label="特性列表">
          <Form.List name={['optionA', 'features']}>
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name }) => (
                  <Space key={key} className="w-full mb-2">
                    <Form.Item name={name} className="mb-0 flex-1">
                      <Input placeholder="功能特性" />
                    </Form.Item>
                    {fields.length > 1 && (
                      <MinusCircleOutlined
                        onClick={() => remove(name)}
                        className="text-red-500 cursor-pointer"
                      />
                    )}
                  </Space>
                ))}
                <Button
                  type="dashed"
                  onClick={() => add()}
                  icon={<PlusOutlined />}
                  size="small"
                  block
                >
                  添加特性
                </Button>
              </>
            )}
          </Form.List>
        </Form.Item>
      </div>

      {/* 方案 B */}
      <div className="p-4 bg-green-50 rounded-lg mb-4">
        <Typography.Title level={5} className="mb-3">方案 B</Typography.Title>
        
        <Form.Item name={['optionB', 'title']} label="标题">
          <Input placeholder="方案 B" />
        </Form.Item>

        <Form.Item name={['optionB', 'description']} label="描述">
          <Input.TextArea rows={2} placeholder="创新设计方案" />
        </Form.Item>

        <Form.Item name={['optionB', 'imageUrl']} label="图片URL">
          <Input placeholder="https://example.com/image-b.jpg" />
        </Form.Item>

        <Form.Item label="特性列表">
          <Form.List name={['optionB', 'features']}>
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name }) => (
                  <Space key={key} className="w-full mb-2">
                    <Form.Item name={name} className="mb-0 flex-1">
                      <Input placeholder="功能特性" />
                    </Form.Item>
                    {fields.length > 1 && (
                      <MinusCircleOutlined
                        onClick={() => remove(name)}
                        className="text-red-500 cursor-pointer"
                      />
                    )}
                  </Space>
                ))}
                <Button
                  type="dashed"
                  onClick={() => add()}
                  icon={<PlusOutlined />}
                  size="small"
                  block
                >
                  添加特性
                </Button>
              </>
            )}
          </Form.List>
        </Form.Item>
      </div>

      <Form.Item name="showImages" valuePropName="checked">
        <Checkbox>显示图片</Checkbox>
      </Form.Item>

      <Form.Item name="showFeatures" valuePropName="checked">
        <Checkbox>显示特性列表</Checkbox>
      </Form.Item>

      <div className="p-3 bg-blue-50 rounded text-sm text-gray-600">
        <div className="font-semibold mb-2">适用场景：</div>
        <ul className="list-disc list-inside space-y-1">
          <li>AB测试 - 产品设计对比</li>
          <li>方案选择 - 用户偏好调研</li>
          <li>竞品对比 - 市场调查</li>
          <li>决策支持 - 两难选择</li>
        </ul>
      </div>
    </Form>
  )
}

// 需要导入 Typography
import { Typography } from 'antd'

export default ComparisonProps

