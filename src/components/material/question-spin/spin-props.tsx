import React, { useEffect } from 'react'
import { Form, Input, Select, Checkbox, InputNumber } from 'antd'
import { IQuestionSpinProps } from './interface.ts'

const SpinProps: React.FC<IQuestionSpinProps> = (props: IQuestionSpinProps) => {
  const [form] = Form.useForm()
  const { size, tip, spinning, delay, disabled, onChange } = props

  useEffect(() => {
    form.setFieldsValue({
      size,
      tip,
      spinning,
      delay,
    })
  }, [size, tip, spinning, delay])

  function handleValueChange() {
    if (onChange) {
      const values = form.getFieldsValue()
      onChange(values as IQuestionSpinProps)
    }
  }

  return (
    <Form
      layout="vertical"
      initialValues={{
        size,
        tip,
        spinning,
        delay,
      }}
      form={form}
      onValuesChange={handleValueChange}
      disabled={disabled}
    >
      <Form.Item label="尺寸" name="size">
        <Select
          options={[
            { label: '小', value: 'small' },
            { label: '中', value: 'default' },
            { label: '大', value: 'large' },
          ]}
        />
      </Form.Item>

      <Form.Item label="加载文案" name="tip">
        <Input placeholder="请输入加载文案" />
      </Form.Item>

      <Form.Item label="延迟显示(ms)" name="delay" tooltip="延迟多少毫秒后显示加载动画">
        <InputNumber min={0} placeholder="例如: 500" style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item label="显示状态" name="spinning" valuePropName="checked">
        <Checkbox>显示加载动画</Checkbox>
      </Form.Item>

      <div className="text-xs text-gray-500 mt-2 p-2 bg-blue-50 rounded">
        💡 提示：用于页面和区块的加载中状态
      </div>
    </Form>
  )
}

export default SpinProps

