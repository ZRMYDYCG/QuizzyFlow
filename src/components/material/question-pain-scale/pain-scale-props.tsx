import { FC, useEffect } from 'react'
import { Form, Input, Checkbox, InputNumber } from 'antd'
import { IQuestionPainScaleProps } from './interface'

const PainScaleProps: FC<IQuestionPainScaleProps> = (props: IQuestionPainScaleProps) => {
  const { title, value, showFaces, showDescription, onChange, disabled } = props
  const [form] = Form.useForm()

  useEffect(() => {
    form.setFieldsValue({ title, value, showFaces, showDescription })
  }, [title, value, showFaces, showDescription])

  const handleValueChange = () => {
    if (onChange === null) return
    const newValues = form.getFieldsValue()
    onChange?.(newValues)
  }

  return (
    <Form
      layout="vertical"
      initialValues={{ title, value, showFaces, showDescription }}
      onValuesChange={handleValueChange}
      form={form}
      disabled={disabled}
    >
      <Form.Item
        name="title"
        label="标题"
        rules={[{ required: true, message: '请输入标题' }]}
      >
        <Input placeholder="请评估您当前的疼痛程度" />
      </Form.Item>

      <Form.Item name="value" label="默认值（0-10）">
        <InputNumber min={0} max={10} className="w-full" />
      </Form.Item>

      <Form.Item name="showFaces" valuePropName="checked">
        <Checkbox>显示表情符号</Checkbox>
      </Form.Item>

      <Form.Item name="showDescription" valuePropName="checked">
        <Checkbox>显示疼痛等级说明</Checkbox>
      </Form.Item>

      <div className="p-3 bg-blue-50 rounded text-sm text-gray-600">
        <div className="font-semibold mb-2">医疗疼痛评估标准：</div>
        <ul className="list-disc list-inside space-y-1">
          <li>WHO 疼痛评分标准</li>
          <li>视觉模拟评分法（VAS）</li>
          <li>数字评分法（NRS）</li>
          <li>适用于疼痛管理和临床评估</li>
        </ul>
      </div>

      <div className="p-3 bg-yellow-50 rounded text-sm text-gray-600 mt-3">
        <div className="font-semibold mb-2">注意事项：</div>
        <ul className="list-disc list-inside space-y-1">
          <li>此量表仅供参考，不能替代医学诊断</li>
          <li>如有严重疼痛，请及时就医</li>
        </ul>
      </div>
    </Form>
  )
}

export default PainScaleProps

