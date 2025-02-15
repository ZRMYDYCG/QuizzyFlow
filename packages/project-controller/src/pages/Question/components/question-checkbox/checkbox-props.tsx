import { FC } from 'react'
import { Form, Input, Checkbox } from 'antd'
import { IQuestionCheckboxProps } from './interface.ts'

const CheckboxProps: FC<IQuestionCheckboxProps> = (
  props: IQuestionCheckboxProps
) => {
  const { title, isVertical, disabled, onChange, list = [] } = props
  const [form] = Form.useForm()

  const handleValuesChange = () => {
    if (onChange) {
    }
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

      <Form.Item name="isVertical" valuePropName="checked">
        <Checkbox>竖向排列</Checkbox>
      </Form.Item>
    </Form>
  )
}

export default CheckboxProps
