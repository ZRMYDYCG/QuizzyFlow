import React, { FC, useEffect } from 'react'
import { Form, Input, Select, Checkbox, Button, Space, Card } from 'antd'
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons'
import { IQuestionTableProps } from './interface.ts'

const TableProps: FC<IQuestionTableProps> = (props: IQuestionTableProps) => {
  const [form] = Form.useForm()

  const {
    columns,
    dataSource,
    bordered,
    striped,
    showHeader,
    size,
    onChange,
    disabled,
  } = props

  useEffect(() => {
    form.setFieldsValue({
      columns,
      dataSource,
      bordered,
      striped,
      showHeader,
      size,
    })
  }, [columns, dataSource, bordered, striped, showHeader, size])

  function handleValuesChange() {
    if (onChange) {
      onChange(form.getFieldsValue())
    }
  }

  return (
    <Form
      layout="vertical"
      initialValues={{
        columns,
        dataSource,
        bordered,
        striped,
        showHeader,
        size,
      }}
      disabled={disabled}
      onValuesChange={handleValuesChange}
      form={form}
    >
      <Form.List name="columns">
        {(fields, { add, remove }) => (
          <>
            <Form.Item label="表头列">
              <Space direction="vertical" style={{ width: '100%' }}>
                {fields.map((field) => (
                  <Card
                    key={field.key}
                    size="small"
                    extra={
                      fields.length > 1 && (
                        <Button
                          type="text"
                          size="small"
                          danger
                          icon={<DeleteOutlined />}
                          onClick={() => remove(field.name)}
                        />
                      )
                    }
                  >
                    <Form.Item
                      {...field}
                      name={[field.name, 'title']}
                      label="列标题"
                      rules={[{ required: true }]}
                      style={{ marginBottom: 0 }}
                    >
                      <Input placeholder="列标题" />
                    </Form.Item>
                  </Card>
                ))}
                <Button
                  type="dashed"
                  onClick={() => add({ title: '新列' })}
                  block
                  icon={<PlusOutlined />}
                >
                  添加列
                </Button>
              </Space>
            </Form.Item>
          </>
        )}
      </Form.List>

      <Form.List name="dataSource">
        {(fields, { add, remove }) => (
          <>
            <Form.Item label="数据行">
              <Space direction="vertical" style={{ width: '100%' }}>
                {fields.map((field) => (
                  <Card
                    key={field.key}
                    size="small"
                    extra={
                      <Button
                        type="text"
                        size="small"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => remove(field.name)}
                      />
                    }
                  >
                    <Form.Item
                      {...field}
                      name={field.name}
                      label={`行 ${field.name + 1}`}
                      style={{ marginBottom: 0 }}
                    >
                      <Input placeholder="用逗号分隔各列数据，如：数据1,数据2,数据3" />
                    </Form.Item>
                  </Card>
                ))}
                <Button
                  type="dashed"
                  onClick={() => add('')}
                  block
                  icon={<PlusOutlined />}
                >
                  添加行
                </Button>
              </Space>
            </Form.Item>
          </>
        )}
      </Form.List>

      <Form.Item label="表格尺寸" name="size">
        <Select>
          <Select.Option value="small">小</Select.Option>
          <Select.Option value="middle">中</Select.Option>
          <Select.Option value="large">大</Select.Option>
        </Select>
      </Form.Item>

      <Form.Item label="显示边框" name="bordered" valuePropName="checked">
        <Checkbox>显示边框</Checkbox>
      </Form.Item>

      <Form.Item label="斑马纹" name="striped" valuePropName="checked">
        <Checkbox>交替行背景色</Checkbox>
      </Form.Item>

      <Form.Item label="显示表头" name="showHeader" valuePropName="checked">
        <Checkbox>显示表头</Checkbox>
      </Form.Item>
    </Form>
  )
}

export default TableProps

