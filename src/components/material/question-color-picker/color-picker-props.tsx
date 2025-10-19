import { FC, useEffect } from 'react'
import { Form, Input, Checkbox, Button, Space, ColorPicker } from 'antd'
import type { Color } from 'antd/es/color-picker'
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons'
import { IQuestionColorPickerProps } from './interface'

const ColorPickerProps: FC<IQuestionColorPickerProps> = (props: IQuestionColorPickerProps) => {
  const { title, value, showText, allowClear, presets = [], onChange, disabled } = props
  const [form] = Form.useForm()

  useEffect(() => {
    form.setFieldsValue({ title, value, showText, allowClear, presets })
  }, [title, value, showText, allowClear, presets])

  const handleValueChange = () => {
    if (onChange === null) return
    const newValues = form.getFieldsValue()
    
    // 处理颜色值
    if (typeof newValues.value === 'object') {
      newValues.value = (newValues.value as Color).toHexString()
    }
    
    onChange?.(newValues)
  }

  return (
    <Form
      layout="vertical"
      initialValues={{ title, value, showText, allowClear, presets }}
      onValuesChange={handleValueChange}
      form={form}
      disabled={disabled}
    >
      <Form.Item
        name="title"
        label="标题"
        rules={[{ required: true, message: '请输入标题' }]}
      >
        <Input placeholder="请选择您喜欢的颜色" />
      </Form.Item>

      <Form.Item name="value" label="默认颜色">
        <ColorPicker showText />
      </Form.Item>

      <Form.Item name="showText" valuePropName="checked">
        <Checkbox>显示颜色值文本</Checkbox>
      </Form.Item>

      <Form.Item name="allowClear" valuePropName="checked">
        <Checkbox>允许清除颜色</Checkbox>
      </Form.Item>

      <Form.Item label="预设颜色">
        <Form.List name="presets">
          {(fields, { add, remove }) => (
            <>
              <div className="grid grid-cols-2 gap-2">
                {fields.map(({ key, name }) => (
                  <Space key={key} align="baseline">
                    <Form.Item name={name} className="mb-0 flex-1">
                      <Input placeholder="#1890ff" maxLength={7} />
                    </Form.Item>
                    {fields.length > 4 && (
                      <MinusCircleOutlined
                        onClick={() => remove(name)}
                        className="text-red-500 cursor-pointer"
                      />
                    )}
                  </Space>
                ))}
              </div>
              {fields.length < 24 && (
                <Button
                  type="dashed"
                  onClick={() => add('#000000')}
                  icon={<PlusOutlined />}
                  size="small"
                  block
                  className="mt-2"
                >
                  添加预设颜色
                </Button>
              )}
            </>
          )}
        </Form.List>
      </Form.Item>

      <div className="p-3 bg-blue-50 rounded text-sm text-gray-600">
        <div className="font-semibold mb-2">适用场景：</div>
        <ul className="list-disc list-inside space-y-1">
          <li>品牌色彩偏好调研</li>
          <li>UI/UX 设计反馈</li>
          <li>产品配色选择</li>
          <li>视觉风格调查</li>
        </ul>
      </div>
    </Form>
  )
}

export default ColorPickerProps

