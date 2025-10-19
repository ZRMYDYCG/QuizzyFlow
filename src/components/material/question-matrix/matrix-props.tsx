import { FC, useEffect } from 'react'
import { Form, Input, Checkbox, Button, Space } from 'antd'
import { IQuestionMatrixProps } from './interface'
import { nanoid } from 'nanoid'
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons'

const MatrixProps: FC<IQuestionMatrixProps> = (props: IQuestionMatrixProps) => {
  const { title, rows = [], columns = [], isMultiple, onChange, disabled } = props
  const [form] = Form.useForm()

  useEffect(() => {
    form.setFieldsValue({ title, rows, columns, isMultiple })
  }, [title, rows, columns, isMultiple])

  const handleValueChange = () => {
    if (onChange === null) return
    const newValues = form.getFieldsValue()
    const { rows = [], columns = [] } = newValues

    // 为没有 value 的项目生成 ID
    rows.forEach((item: any) => {
      if (item.value) return
      item.value = nanoid(5)
    })

    columns.forEach((item: any) => {
      if (item.value) return
      item.value = nanoid(5)
    })

    onChange?.(newValues)
  }

  return (
    <Form
      layout="vertical"
      initialValues={{ title, rows, columns, isMultiple }}
      onValuesChange={handleValueChange}
      form={form}
      disabled={disabled}
    >
      <Form.Item
        name="title"
        label="标题"
        rules={[{ required: true, message: '请输入标题' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item label="行项目（评价对象）">
        <Form.List name="rows">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name }, index) => {
                return (
                  <Space key={key} align="baseline" className="w-full mb-2">
                    <Form.Item
                      name={[name, 'text']}
                      rules={[{ required: true, message: '请输入行标题' }]}
                      className="mb-0 flex-1"
                    >
                      <Input placeholder="如：产品质量" />
                    </Form.Item>
                    {index > 0 && (
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
                  onClick={() => add({ text: '', value: '' })}
                  icon={<PlusOutlined />}
                  block
                >
                  添加行
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
      </Form.Item>

      <Form.Item label="列选项（评价等级）">
        <Form.List name="columns">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name }, index) => {
                return (
                  <Space key={key} align="baseline" className="w-full mb-2">
                    <Form.Item
                      name={[name, 'text']}
                      rules={[{ required: true, message: '请输入列标题' }]}
                      className="mb-0 flex-1"
                    >
                      <Input placeholder="如：非常满意" />
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
                  onClick={() => add({ text: '', value: '' })}
                  icon={<PlusOutlined />}
                  block
                >
                  添加列
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
      </Form.Item>

      <Form.Item name="isMultiple" valuePropName="checked">
        <Checkbox>允许多选（每行可选择多个选项）</Checkbox>
      </Form.Item>
    </Form>
  )
}

export default MatrixProps

