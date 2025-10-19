import { FC, useEffect } from 'react'
import { Form, Input, InputNumber, ColorPicker } from 'antd'
import type { Color } from 'antd/es/color-picker'
import { IQuestionSignatureProps } from './interface'

const SignatureProps: FC<IQuestionSignatureProps> = (props: IQuestionSignatureProps) => {
  const {
    title,
    width,
    height,
    backgroundColor,
    penColor,
    penWidth,
    onChange,
    disabled,
  } = props
  const [form] = Form.useForm()

  useEffect(() => {
    form.setFieldsValue({ title, width, height, backgroundColor, penColor, penWidth })
  }, [title, width, height, backgroundColor, penColor, penWidth])

  const handleValueChange = () => {
    if (onChange === null) return
    const newValues = form.getFieldsValue()
    
    // 处理颜色值
    if (typeof newValues.backgroundColor === 'object') {
      newValues.backgroundColor = (newValues.backgroundColor as Color).toHexString()
    }
    if (typeof newValues.penColor === 'object') {
      newValues.penColor = (newValues.penColor as Color).toHexString()
    }
    
    onChange?.(newValues)
  }

  return (
    <Form
      layout="vertical"
      initialValues={{ title, width, height, backgroundColor, penColor, penWidth }}
      onValuesChange={handleValueChange}
      form={form}
      disabled={disabled}
    >
      <Form.Item
        name="title"
        label="标题"
        rules={[{ required: true, message: '请输入标题' }]}
      >
        <Input placeholder="请在下方签名" />
      </Form.Item>

      <Form.Item name="width" label="画布宽度（像素）">
        <InputNumber min={200} max={1200} className="w-full" />
      </Form.Item>

      <Form.Item name="height" label="画布高度（像素）">
        <InputNumber min={100} max={600} className="w-full" />
      </Form.Item>

      <Form.Item name="backgroundColor" label="背景颜色">
        <ColorPicker showText />
      </Form.Item>

      <Form.Item name="penColor" label="笔迹颜色">
        <ColorPicker showText />
      </Form.Item>

      <Form.Item name="penWidth" label="笔迹粗细">
        <InputNumber min={1} max={10} className="w-full" />
      </Form.Item>

      <div className="p-3 bg-blue-50 rounded text-sm text-gray-600">
        <div className="font-semibold mb-2">适用场景：</div>
        <ul className="list-disc list-inside space-y-1">
          <li>合同协议签署</li>
          <li>电子签名确认</li>
          <li>授权书签名</li>
          <li>知情同意书</li>
        </ul>
      </div>
    </Form>
  )
}

export default SignatureProps

