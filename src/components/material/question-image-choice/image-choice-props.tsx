import { FC, useEffect } from 'react'
import { Form, Input, Checkbox, Button, Space, InputNumber, Select } from 'antd'
import { IQuestionImageChoiceProps } from './interface'
import { nanoid } from 'nanoid'
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons'

const ImageChoiceProps: FC<IQuestionImageChoiceProps> = (props: IQuestionImageChoiceProps) => {
  const { title, options = [], isMultiple, columns, showLabel, onChange, disabled } = props
  const [form] = Form.useForm()

  useEffect(() => {
    form.setFieldsValue({ title, options, isMultiple, columns, showLabel })
  }, [title, options, isMultiple, columns, showLabel])

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
      initialValues={{ title, options, isMultiple, columns, showLabel }}
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

      <Form.Item name="columns" label="每行列数">
        <Select>
          <Select.Option value={1}>1列</Select.Option>
          <Select.Option value={2}>2列</Select.Option>
          <Select.Option value={3}>3列</Select.Option>
          <Select.Option value={4}>4列</Select.Option>
          <Select.Option value={5}>5列</Select.Option>
        </Select>
      </Form.Item>

      <Form.Item label="图片选项">
        <Form.List name="options">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name }, index) => {
                return (
                  <div key={key} className="mb-3 p-3 border border-gray-200 rounded">
                    <Space direction="vertical" className="w-full">
                      <Form.Item
                        name={[name, 'imageUrl']}
                        label="图片URL"
                        rules={[{ required: true, message: '请输入图片URL' }]}
                        className="mb-2"
                      >
                        <Input placeholder="https://example.com/image.jpg" />
                      </Form.Item>
                      <Form.Item
                        name={[name, 'label']}
                        label="标签文字"
                        className="mb-2"
                      >
                        <Input placeholder="选项说明文字" />
                      </Form.Item>
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
                )
              })}
              <Form.Item className="mb-0">
                <Button
                  type="dashed"
                  onClick={() => add({ imageUrl: '', label: '', value: '' })}
                  icon={<PlusOutlined />}
                  block
                >
                  添加图片选项
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
      </Form.Item>

      <Form.Item name="isMultiple" valuePropName="checked">
        <Checkbox>允许多选</Checkbox>
      </Form.Item>

      <Form.Item name="showLabel" valuePropName="checked">
        <Checkbox>显示标签文字</Checkbox>
      </Form.Item>

      <div className="p-3 bg-blue-50 rounded text-sm text-gray-600">
        <div className="font-semibold mb-1">图片建议：</div>
        <ul className="list-disc list-inside space-y-1">
          <li>推荐尺寸：300x200 或 4:3 比例</li>
          <li>支持 JPG、PNG、GIF 格式</li>
          <li>建议使用图床或 CDN</li>
          <li>图片会自动懒加载优化性能</li>
        </ul>
      </div>
    </Form>
  )
}

export default ImageChoiceProps

