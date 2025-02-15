import { FC, useEffect } from 'react'
import { Form, Radio, Input, Checkbox, Select } from 'antd'
import { IQuestionRadioProps } from './interface.ts'

const RadioProps: FC<IQuestionRadioProps> = (props: IQuestionRadioProps) => {
  const { title, isVertical, value, options = [], onChange, disabled } = props
  const [form] = Form.useForm()

  useEffect(() => {
    form.setFieldsValue({ title, value, options, isVertical })
  }, [title, value, options, isVertical])

  const handleValueChange = () => {
    if (onChange) {
      onChange(form.getFieldsValue())
    }
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
