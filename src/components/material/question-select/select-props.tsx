import React, { useEffect } from 'react'
import { Form, Input, Select, Checkbox, InputNumber, Button, Space } from 'antd'
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons'
import { IQuestionSelectProps } from './interface.ts'

const SelectProps: React.FC<IQuestionSelectProps> = (
  props: IQuestionSelectProps
) => {
  const [form] = Form.useForm()
  const {
    placeholder,
    options,
    mode,
    allowClear,
    showSearch,
    disabled,
    size,
    maxTagCount,
    onChange,
  } = props

  useEffect(() => {
    form.setFieldsValue({
      placeholder,
      options,
      mode,
      allowClear,
      showSearch,
      size,
      maxTagCount,
    })
  }, [placeholder, options, mode, allowClear, showSearch, size, maxTagCount])

  function handleValueChange() {
    if (onChange) {
      const values = form.getFieldsValue()
      onChange(values as IQuestionSelectProps)
    }
  }

  return (
    <Form
      layout="vertical"
      initialValues={{
        placeholder,
        options,
        mode,
        allowClear,
        showSearch,
        size,
        maxTagCount,
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

      <Form.Item label="选择模式" name="mode">
        <Select
          options={[
            { label: '单选', value: 'default' },
            { label: '多选', value: 'multiple' },
            { label: '标签模式', value: 'tags' },
          ]}
        />
      </Form.Item>

      <Form.Item label="尺寸" name="size">
        <Select
          options={[
            { label: '大', value: 'large' },
            { label: '中', value: 'middle' },
            { label: '小', value: 'small' },
          ]}
        />
      </Form.Item>

      <Form.Item label="最多显示标签数" name="maxTagCount">
        <InputNumber min={1} placeholder="仅在多选模式下有效" style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item label="选项列表">
        <Form.List name="options">
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
                    <Space direction="vertical" style={{ width: '100%' }}>
                      <Form.Item
                        {...restField}
                        name={[name, 'label']}
                        rules={[{ required: true, message: '请输入选项文本' }]}
                        style={{ marginBottom: 8 }}
                      >
                        <Input placeholder="选项文本" />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, 'value']}
                        rules={[{ required: true, message: '请输入选项值' }]}
                        style={{ marginBottom: 0 }}
                      >
                        <Input placeholder="选项值" />
                      </Form.Item>
                    </Space>
                  </div>
                  <Space direction="vertical">
                    <Form.Item
                      {...restField}
                      name={[name, 'disabled']}
                      valuePropName="checked"
                      style={{ marginBottom: 0 }}
                    >
                      <Checkbox>禁用</Checkbox>
                    </Form.Item>
                    <Button
                      type="text"
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => remove(name)}
                    />
                  </Space>
                </Space>
              ))}
              <Form.Item>
                <Button
                  type="dashed"
                  onClick={() =>
                    add({
                      value: `option${fields.length + 1}`,
                      label: `选项${fields.length + 1}`,
                      disabled: false,
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

      <Form.Item label="支持清除" name="allowClear" valuePropName="checked">
        <Checkbox>允许清除选中项</Checkbox>
      </Form.Item>

      <Form.Item label="支持搜索" name="showSearch" valuePropName="checked">
        <Checkbox>支持搜索功能</Checkbox>
      </Form.Item>
    </Form>
  )
}

export default SelectProps

