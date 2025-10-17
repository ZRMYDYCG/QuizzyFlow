import React, { useEffect } from 'react'
import { Form, Input, Checkbox, Button, Space } from 'antd'
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons'
import { IQuestionAutocompleteProps } from './interface.ts'

const AutocompleteProps: React.FC<IQuestionAutocompleteProps> = (
  props: IQuestionAutocompleteProps
) => {
  const [form] = Form.useForm()
  const { placeholder, options, filterOption, disabled, allowClear, onChange } =
    props

  useEffect(() => {
    form.setFieldsValue({
      placeholder,
      options,
      filterOption,
      allowClear,
    })
  }, [placeholder, options, filterOption, allowClear])

  function handleValueChange() {
    if (onChange) {
      const values = form.getFieldsValue()
      onChange(values as IQuestionAutocompleteProps)
    }
  }

  return (
    <Form
      layout="vertical"
      initialValues={{
        placeholder,
        options,
        filterOption,
        allowClear,
      }}
      form={form}
      onValuesChange={handleValueChange}
      disabled={disabled}
    >
      <Form.Item
        label="占位符"
        name="placeholder"
        rules={[{ required: true, message: '请输入占位符！' }]}
      >
        <Input placeholder="请输入占位符" />
      </Form.Item>

      <Form.Item label="建议选项列表">
        <Form.List name="options">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <Space
                  key={key}
                  style={{
                    display: 'flex',
                    marginBottom: 8,
                  }}
                  align="baseline"
                >
                  <Form.Item
                    {...restField}
                    name={[name, 'label']}
                    rules={[{ required: true, message: '请输入选项文本' }]}
                    style={{ marginBottom: 0, flex: 1 }}
                  >
                    <Input placeholder="选项文本" />
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    name={[name, 'value']}
                    rules={[{ required: true, message: '请输入选项值' }]}
                    style={{ marginBottom: 0, flex: 1 }}
                  >
                    <Input placeholder="选项值" />
                  </Form.Item>
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
                      value: `option${fields.length + 1}`,
                      label: `选项${fields.length + 1}`,
                    })
                  }
                  block
                  icon={<PlusOutlined />}
                >
                  添加选项
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
      </Form.Item>

      <Form.Item label="自动筛选" name="filterOption" valuePropName="checked">
        <Checkbox>根据输入自动筛选选项</Checkbox>
      </Form.Item>

      <Form.Item label="支持清除" name="allowClear" valuePropName="checked">
        <Checkbox>允许清除输入内容</Checkbox>
      </Form.Item>

      <div className="text-xs text-gray-500 mt-2 p-2 bg-blue-50 rounded">
        💡 提示：用户输入时会自动显示匹配的建议选项
      </div>
    </Form>
  )
}

export default AutocompleteProps

