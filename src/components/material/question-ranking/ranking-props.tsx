import { FC, useEffect } from 'react'
import { Form, Input, Checkbox, Button, Space } from 'antd'
import { IQuestionRankingProps } from './interface'
import { nanoid } from 'nanoid'
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons'

const RankingProps: FC<IQuestionRankingProps> = (props: IQuestionRankingProps) => {
  const { title, options = [], showNumbers, description, onChange, disabled } = props
  const [form] = Form.useForm()

  useEffect(() => {
    form.setFieldsValue({ title, options, showNumbers, description })
  }, [title, options, showNumbers, description])

  const handleValueChange = () => {
    if (onChange === null) return
    const newValues = form.getFieldsValue()
    const { options = [] } = newValues

    // 为没有 value 的选项生成 ID，并设置 order
    options.forEach((item: any, index: number) => {
      if (!item.value) {
        item.value = nanoid(5)
      }
      item.order = index + 1
    })

    onChange?.(newValues)
  }

  return (
    <Form
      layout="vertical"
      initialValues={{ title, options, showNumbers, description }}
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

      <Form.Item name="description" label="说明文字">
        <Input placeholder="如：拖动选项可调整排序" />
      </Form.Item>

      <Form.Item label="排序选项">
        <Form.List name="options">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name }, index) => {
                return (
                  <Space key={key} align="baseline" className="w-full mb-2">
                    <span className="text-gray-500 min-w-[24px]">{index + 1}.</span>
                    <Form.Item
                      name={[name, 'text']}
                      rules={[{ required: true, message: '请输入选项内容' }]}
                      className="mb-0 flex-1"
                    >
                      <Input placeholder="请输入选项内容" />
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
                  onClick={() => add({ text: '', value: '', order: fields.length + 1 })}
                  icon={<PlusOutlined />}
                  block
                >
                  添加选项
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
      </Form.Item>

      <Form.Item name="showNumbers" valuePropName="checked">
        <Checkbox>显示序号</Checkbox>
      </Form.Item>

      <div className="p-3 bg-blue-50 rounded text-sm text-gray-600">
        <div className="font-semibold mb-1">提示：</div>
        <div>用户可以通过拖拽来调整选项的排序顺序</div>
      </div>
    </Form>
  )
}

export default RankingProps

