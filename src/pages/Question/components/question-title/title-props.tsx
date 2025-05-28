import React, { useEffect } from 'react'
import { Form, Input, Checkbox, Select } from 'antd'
import { IQuestionTitleProps } from './interface'

const TitleProps: React.FC<IQuestionTitleProps> = (
  props: IQuestionTitleProps
) => {
  const [form] = Form.useForm()
  const { text, level, isCenter, onChange, disabled } = props

  useEffect(() => {
    form.setFieldsValue({ text, level, isCenter })
  }, [text, level, isCenter])

  function handleValueChange() {
    if (onChange) {
      onChange(form.getFieldsValue())
    }
  }

  return (
    <Form
      layout="vertical"
      initialValues={{ text, level, isCenter }}
      form={form}
      onValuesChange={handleValueChange}
      disabled={disabled}
    >
      <Form.Item
        label="标题内容"
        name="text"
        rules={[{ required: true, message: '请输入标题内容！' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item label="层级" name="level">
        <Select
          options={[
            { label: 1, value: 1 },
            { label: 2, value: 2 },
            { label: 3, value: 3 },
          ]}
        ></Select>
      </Form.Item>
      <Form.Item label="居中显示" name="isCenter" valuePropName="checked">
        <Checkbox></Checkbox>
      </Form.Item>
    </Form>
  )
}

export default TitleProps
