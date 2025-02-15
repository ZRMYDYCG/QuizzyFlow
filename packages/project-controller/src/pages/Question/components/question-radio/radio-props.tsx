import { FC, useEffect } from 'react'
import { Form, Radio, Input, Checkbox, Select, Button, Space } from 'antd'
import { IQuestionRadioProps } from './interface.ts'
import { nanoid } from 'nanoid'
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons'

const RadioProps: FC<IQuestionRadioProps> = (props: IQuestionRadioProps) => {
  const { title, isVertical, value, options = [], onChange, disabled } = props
  const [form] = Form.useForm()

  useEffect(() => {
    form.setFieldsValue({ title, value, options, isVertical })
  }, [title, value, options, isVertical])

  const handleValueChange = () => {
    if (onChange === null) return
    const newValues = form.getFieldsValue()
    const { options = [] } = newValues

    options.forEach((item: any) => {
      if (item.value) return
      item.value = nanoid(5)
    })

    onChange?.(newValues)
  }

  return (
    <Form
      layout="vertical"
      initialValues={{ title, value, options, isVertical }}
      onValuesChange={handleValueChange}
      form={form}
    >
      <Form.Item
        name="title"
        label="标题"
        rules={[{ required: true, message: '请输入标题' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item label="选项">
        <Form.List name="options">
          {(fields, { add, remove }) => (
            <>
              {/*遍历所有选项*/}
              {fields.map(({ key, name }, index) => {
                return (
                  <Space key={key} align="baseline">
                    <Form.Item
                      name={[name, 'text']}
                      rules={[
                        { required: true, message: '请输入选项内容' },
                        {
                          validator: (_, value) => {
                            const { options = [] } = form.getFieldsValue()

                            let number = 0

                            options.forEach((item: any) => {
                              if (item.text === value) {
                                number++ // 记录相同发的个数
                              }
                            })
                            if (number === 1) return Promise.resolve()
                            return Promise.reject(new Error('选项内容不能重复'))
                          },
                        },
                      ]}
                    >
                      <Input placeholder="请输入选项内容" />
                    </Form.Item>
                    {/* 删除按钮 */}
                    {index > 1 && (
                      <MinusCircleOutlined onClick={() => remove(name)} />
                    )}
                  </Space>
                )
              })}
              {/*添加选项*/}
              <Form.Item>
                <Button
                  type="link"
                  onClick={() => add({ text: '', value: '' })}
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
      <Form.Item label="默认选中" name="value">
        <Select
          value={value}
          options={options.map(({ text, value }) => {
            return { label: text, value }
          })}
        ></Select>
      </Form.Item>
      <Form.Item name="isVertical" valuePropName="checked">
        <Checkbox>垂直排列</Checkbox>
      </Form.Item>
    </Form>
  )
}

export default RadioProps
