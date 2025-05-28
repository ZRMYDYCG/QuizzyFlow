import { FC } from 'react'
import { Form, Input, Checkbox, Space, Button } from 'antd'
import { nanoid } from 'nanoid'
import { IQuestionCheckboxProps } from './interface.ts'
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons'

const CheckboxProps: FC<IQuestionCheckboxProps> = (
  props: IQuestionCheckboxProps
) => {
  const { title, isVertical, disabled, onChange, list = [] } = props
  const [form] = Form.useForm()

  const handleValuesChange = () => {
    if (onChange === null) return
    const newValues = form.getFieldsValue()

    if (newValues.list) {
      newValues.list = newValues.list.filter(
        (item: any) => !(item.text === null)
      )
    }

    const { list = [] } = newValues

    list.forEach((item: any) => {
      if (item.value) return
      item.value = nanoid(5)
    })

    onChange?.(newValues)
  }
  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={{ title, isVertical, list }}
      disabled={disabled}
      onValuesChange={handleValuesChange}
    >
      <Form.Item
        label="标题"
        name="title"
        rules={[{ required: true, message: '请输入标题' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item label="选项">
        <Form.List name="list">
          {(fields, { add, remove }) => (
            <>
              {/*遍历所有选项*/}
              {fields.map(({ key, name }, index) => {
                return (
                  <Space key={key} align="baseline">
                    {/*当前选项是否选中*/}
                    <Form.Item name={[name, 'checked']} valuePropName="checked">
                      <Checkbox />
                    </Form.Item>
                    <Form.Item
                      name={[name, 'text']}
                      rules={[
                        { required: true, message: '请输入选项内容' },
                        {
                          validator: (_, value) => {
                            const { list = [] } = form.getFieldsValue()

                            let number = 0

                            list.forEach((item: any) => {
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
                    {index > 0 && (
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
      <Form.Item name="isVertical" valuePropName="checked">
        <Checkbox>竖向排列</Checkbox>
      </Form.Item>
    </Form>
  )
}

export default CheckboxProps
