import React, { useEffect } from 'react'
import { Form, Input, Checkbox, Select, message } from 'antd'
import { IQuestionTitleProps } from './interface'

const TitleProps: React.FC<IQuestionTitleProps> = (
  props: IQuestionTitleProps
) => {
  const [form] = Form.useForm()
  const { text, level, isCenter, animateType, onChange, disabled } = props

  useEffect(() => {
    form.setFieldsValue({ text, level, isCenter, animateType })
  }, [text, level, isCenter, animateType])

  function handleValueChange() {
    if (onChange) {
      const values = form.getFieldsValue()
      if (values.text && values.text.length > 50) {
        message.warning('标题内容过长，请控制在50字以内')
        return
      }
      onChange(values)
    }
  }

  return (
    <Form
      layout="vertical"
      initialValues={{ text, level, isCenter, animateType }}
      form={form}
      onValuesChange={handleValueChange}
      disabled={disabled}
    >
      <Form.Item
        label="标题内容"
        name="text"
        rules={[
          { required: true, message: '请输入标题内容！' },
          { max: 50, message: '标题内容过长，请控制在50字以内' },
        ]}
      >
        <Input.TextArea />
      </Form.Item>
      <Form.Item label="层级" name="level">
        <Select
          options={[
            { label: 1, value: 1 },
            { label: 2, value: 2 },
            { label: 3, value: 3 },
            { label: 4, value: 4 },
            { label: 5, value: 5 },
          ]}
        ></Select>
      </Form.Item>
      <Form.Item label="居中显示" name="isCenter" valuePropName="checked">
        <Checkbox></Checkbox>
      </Form.Item>
      <Form.Item label="自定义颜色" name="color">
        <Input className="w-16 h-8 border rounded" type="color" />
      </Form.Item>
      <Form.Item label="动画类型" name="animateType">
        <Select
          options={[
            { label: '无动画', value: 'none' },
            { label: '抖动效果', value: 'shake' },
            { label: '浮动效果', value: 'float' },
          ]}
        />
      </Form.Item>
    </Form>
  )
}

export default TitleProps
