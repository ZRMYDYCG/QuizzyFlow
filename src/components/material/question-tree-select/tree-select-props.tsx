import React, { useEffect } from 'react'
import { Form, Input, Switch, Input as AntInput } from 'antd'
import { IQuestionTreeSelectProps } from './interface.ts'

const { TextArea } = AntInput

const TreeSelectProps: React.FC<IQuestionTreeSelectProps> = (
  props: IQuestionTreeSelectProps
) => {
  const { title, placeholder, treeData, multiple, showSearch, onChange, disabled } = props
  const [form] = Form.useForm()

  useEffect(() => {
    form.setFieldsValue({
      title,
      placeholder,
      treeDataJson: JSON.stringify(treeData, null, 2),
      multiple,
      showSearch,
    })
  }, [title, placeholder, treeData, multiple, showSearch])

  function handleValueChange() {
    if (onChange) {
      const values = form.getFieldsValue()
      try {
        const parsedTreeData = JSON.parse(values.treeDataJson || '[]')
        onChange({
          ...values,
          treeData: parsedTreeData,
        })
      } catch (e) {
        // 如果JSON解析失败，保持原值
        onChange(values)
      }
    }
  }

  return (
    <Form
      onChange={handleValueChange}
      layout="vertical"
      initialValues={{
        title,
        placeholder,
        treeDataJson: JSON.stringify(treeData, null, 2),
        multiple,
        showSearch,
      }}
      form={form}
      disabled={disabled}
    >
      <Form.Item
        name="title"
        label="标题"
        rules={[{ required: true, message: '请输入标题' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item label="Placeholder" name="placeholder">
        <Input />
      </Form.Item>
      <Form.Item label="树形数据 (JSON)" name="treeDataJson">
        <TextArea
          rows={8}
          placeholder='[{"value":"1","title":"节点1","children":[...]}]'
        />
      </Form.Item>
      <Form.Item label="多选模式" name="multiple" valuePropName="checked">
        <Switch />
      </Form.Item>
      <Form.Item label="显示搜索" name="showSearch" valuePropName="checked">
        <Switch />
      </Form.Item>
    </Form>
  )
}

export default TreeSelectProps

