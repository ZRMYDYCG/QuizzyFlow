import { FC, useEffect } from 'react'
import { Form, Input, Checkbox, InputNumber } from 'antd'
import { IQuestionNPSProps } from './interface'

const NPSProps: FC<IQuestionNPSProps> = (props: IQuestionNPSProps) => {
  const { title, value, minLabel, maxLabel, showDescription, onChange, disabled } = props
  const [form] = Form.useForm()

  useEffect(() => {
    form.setFieldsValue({ title, value, minLabel, maxLabel, showDescription })
  }, [title, value, minLabel, maxLabel, showDescription])

  const handleValueChange = () => {
    if (onChange === null) return
    const newValues = form.getFieldsValue()
    onChange?.(newValues)
  }

  return (
    <Form
      layout="vertical"
      initialValues={{ title, value, minLabel, maxLabel, showDescription }}
      onValuesChange={handleValueChange}
      form={form}
      disabled={disabled}
    >
      <Form.Item
        name="title"
        label="标题"
        rules={[{ required: true, message: '请输入标题' }]}
      >
        <Input.TextArea rows={3} placeholder="请输入问题标题" />
      </Form.Item>

      <Form.Item name="minLabel" label="最小值标签（0分）">
        <Input placeholder="如：完全不可能" />
      </Form.Item>

      <Form.Item name="maxLabel" label="最大值标签（10分）">
        <Input placeholder="如：非常可能" />
      </Form.Item>

      <Form.Item name="value" label="默认值">
        <InputNumber min={0} max={10} className="w-full" placeholder="不设置则无默认值" />
      </Form.Item>

      <Form.Item name="showDescription" valuePropName="checked">
        <Checkbox>显示分类说明（贬损者/中立者/推荐者）</Checkbox>
      </Form.Item>

      <div className="p-3 bg-blue-50 rounded text-sm text-gray-600">
        <div className="font-semibold mb-2">NPS评分说明：</div>
        <ul className="list-disc list-inside space-y-1">
          <li>0-6分：贬损者 (Detractors)</li>
          <li>7-8分：中立者 (Passives)</li>
          <li>9-10分：推荐者 (Promoters)</li>
          <li>NPS = (推荐者% - 贬损者%) × 100</li>
        </ul>
      </div>
    </Form>
  )
}

export default NPSProps

