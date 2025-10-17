import React, { useEffect } from 'react'
import { Form, Input, InputNumber, Select, Checkbox, Button, Space } from 'antd'
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons'
import { IQuestionAnchorProps } from './interface.ts'

const AnchorProps: React.FC<IQuestionAnchorProps> = (
  props: IQuestionAnchorProps
) => {
  const [form] = Form.useForm()
  const { items, direction, affix, offsetTop, disabled, onChange } = props

  useEffect(() => {
    form.setFieldsValue({
      items,
      direction,
      affix,
      offsetTop,
    })
  }, [items, direction, affix, offsetTop])

  function handleValueChange() {
    if (onChange) {
      const values = form.getFieldsValue()
      onChange(values as IQuestionAnchorProps)
    }
  }

  return (
    <Form
      layout="vertical"
      initialValues={{
        items,
        direction,
        affix,
        offsetTop,
      }}
      form={form}
      onValuesChange={handleValueChange}
      disabled={disabled}
    >
      <Form.Item label="布局方向" name="direction">
        <Select
          options={[
            { label: '垂直', value: 'vertical' },
            { label: '水平', value: 'horizontal' },
          ]}
        />
      </Form.Item>

      <Form.Item label="固定定位" name="affix" valuePropName="checked">
        <Checkbox>固定在可视区域</Checkbox>
      </Form.Item>

      <Form.Item
        label="距离顶部偏移量(px)"
        name="offsetTop"
        tooltip="仅在固定定位时有效"
      >
        <InputNumber min={0} placeholder="例如: 100" style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item label="锚点列表">
        <Form.List name="items">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <Space
                  key={key}
                  style={{
                    display: 'flex',
                    marginBottom: 8,
                    padding: 12,
                    background: '#f5f5f5',
                    borderRadius: 4,
                  }}
                  align="start"
                >
                  <div style={{ flex: 1 }}>
                    <Form.Item
                      {...restField}
                      name={[name, 'title']}
                      rules={[{ required: true, message: '请输入锚点标题' }]}
                      style={{ marginBottom: 8 }}
                    >
                      <Input placeholder="锚点标题" />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, 'href']}
                      rules={[
                        { required: true, message: '请输入锚点链接' },
                        {
                          pattern: /^#\w+$/,
                          message: '锚点链接格式应为 #id',
                        },
                      ]}
                      style={{ marginBottom: 0 }}
                    >
                      <Input placeholder="例如: #section1" />
                    </Form.Item>
                  </div>
                  <Button
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => remove(name)}
                  />
                </Space>
              ))}
              <Form.Item>
                <Button
                  type="dashed"
                  onClick={() =>
                    add({
                      key: `${Date.now()}`,
                      title: '新锚点',
                      href: `#section${fields.length + 1}`,
                    })
                  }
                  block
                  icon={<PlusOutlined />}
                >
                  添加锚点
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
      </Form.Item>

      <div className="text-xs text-gray-500 mt-2 p-2 bg-blue-50 rounded">
        💡 提示：锚点链接需要对应页面中已存在的元素 ID
      </div>
    </Form>
  )
}

export default AnchorProps

