import React, { useEffect } from 'react'
import { Form, Input, Select, Checkbox } from 'antd'
import { IQuestionCascaderProps } from './interface.ts'

const CascaderProps: React.FC<IQuestionCascaderProps> = (
  props: IQuestionCascaderProps
) => {
  const [form] = Form.useForm()
  const {
    placeholder,
    expandTrigger,
    changeOnSelect,
    showSearch,
    multiple,
    disabled,
    onChange,
  } = props

  useEffect(() => {
    form.setFieldsValue({
      placeholder,
      expandTrigger,
      changeOnSelect,
      showSearch,
      multiple,
    })
  }, [placeholder, expandTrigger, changeOnSelect, showSearch, multiple])

  function handleValueChange() {
    if (onChange) {
      const values = form.getFieldsValue()
      onChange(values as IQuestionCascaderProps)
    }
  }

  return (
    <Form
      layout="vertical"
      initialValues={{
        placeholder,
        expandTrigger,
        changeOnSelect,
        showSearch,
        multiple,
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

      <Form.Item label="展开方式" name="expandTrigger">
        <Select
          options={[
            { label: '点击展开', value: 'click' },
            { label: '悬停展开', value: 'hover' },
          ]}
        />
      </Form.Item>

      <Form.Item label="选择即改变" name="changeOnSelect" valuePropName="checked">
        <Checkbox>选择任意一级时改变值</Checkbox>
      </Form.Item>

      <Form.Item label="支持搜索" name="showSearch" valuePropName="checked">
        <Checkbox>支持搜索功能</Checkbox>
      </Form.Item>

      <Form.Item label="多选模式" name="multiple" valuePropName="checked">
        <Checkbox>允许多选</Checkbox>
      </Form.Item>

      <div className="text-xs text-gray-500 mt-2 p-2 bg-blue-50 rounded">
        💡 提示：选项数据需要在代码中配置，支持多级嵌套结构
      </div>
    </Form>
  )
}

export default CascaderProps

