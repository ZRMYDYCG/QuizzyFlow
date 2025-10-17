import React, { useEffect } from 'react'
import { Form, Input, Checkbox, Button, Space } from 'antd'
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons'
import { IQuestionTransferProps } from './interface.ts'

const TransferProps: React.FC<IQuestionTransferProps> = (
  props: IQuestionTransferProps
) => {
  const [form] = Form.useForm()
  const { dataSource, showSearch, titles, operations, disabled, onChange } =
    props

  useEffect(() => {
    form.setFieldsValue({
      dataSource,
      showSearch,
      titles,
      operations,
    })
  }, [dataSource, showSearch, titles, operations])

  function handleValueChange() {
    if (onChange) {
      const values = form.getFieldsValue()
      onChange(values as IQuestionTransferProps)
    }
  }

  return (
    <Form
      layout="vertical"
      initialValues={{
        dataSource,
        showSearch,
        titles,
        operations,
      }}
      form={form}
      onValuesChange={handleValueChange}
      disabled={disabled}
    >
      <Form.Item label="列表标题">
        <Space.Compact style={{ width: '100%' }}>
          <Form.Item
            name={['titles', 0]}
            noStyle
            rules={[{ required: true, message: '请输入源列表标题' }]}
          >
            <Input placeholder="源列表标题" />
          </Form.Item>
          <Form.Item
            name={['titles', 1]}
            noStyle
            rules={[{ required: true, message: '请输入目标列表标题' }]}
          >
            <Input placeholder="目标列表标题" />
          </Form.Item>
        </Space.Compact>
      </Form.Item>

      <Form.Item label="操作按钮文本">
        <Space.Compact style={{ width: '100%' }}>
          <Form.Item
            name={['operations', 0]}
            noStyle
            rules={[{ required: true, message: '请输入向右按钮文本' }]}
          >
            <Input placeholder="向右" />
          </Form.Item>
          <Form.Item
            name={['operations', 1]}
            noStyle
            rules={[{ required: true, message: '请输入向左按钮文本' }]}
          >
            <Input placeholder="向左" />
          </Form.Item>
        </Space.Compact>
      </Form.Item>

      <Form.Item label="数据源列表">
        <Form.List name="dataSource">
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
                      rules={[{ required: true, message: '请输入选项标题' }]}
                      style={{ marginBottom: 0 }}
                    >
                      <Input placeholder="选项标题" />
                    </Form.Item>
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
                      key: `${Date.now()}`,
                      title: `选项 ${fields.length + 1}`,
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

      <Form.Item label="支持搜索" name="showSearch" valuePropName="checked">
        <Checkbox>显示搜索框</Checkbox>
      </Form.Item>

      <div className="text-xs text-gray-500 mt-2 p-2 bg-blue-50 rounded">
        💡 提示：用户可以在两个列表之间移动选项
      </div>
    </Form>
  )
}

export default TransferProps

