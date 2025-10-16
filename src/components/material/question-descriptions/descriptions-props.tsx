import { FC } from 'react'
import { Form, Input, Select, Switch, Button, Space } from 'antd'
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons'
import { IQuestionDescriptionsProps } from './interface'

const QuestionDescriptionsProps: FC<IQuestionDescriptionsProps> = (props) => {
  const { title, items, column, bordered, size, layout } = props

  return (
    <Form layout="vertical" initialValues={{ title, items, column, bordered, size, layout }}>
      <Form.Item label="标题" name="title">
        <Input placeholder="描述列表标题" />
      </Form.Item>

      <Form.Item label="列数" name="column">
        <Select>
          <Select.Option value={1}>1列</Select.Option>
          <Select.Option value={2}>2列</Select.Option>
          <Select.Option value={3}>3列</Select.Option>
        </Select>
      </Form.Item>

      <Form.Item label="显示边框" name="bordered" valuePropName="checked">
        <Switch />
      </Form.Item>

      <Form.Item label="尺寸" name="size">
        <Select>
          <Select.Option value="small">小</Select.Option>
          <Select.Option value="default">默认</Select.Option>
          <Select.Option value="middle">中等</Select.Option>
        </Select>
      </Form.Item>

      <Form.Item label="布局" name="layout">
        <Select>
          <Select.Option value="horizontal">水平</Select.Option>
          <Select.Option value="vertical">垂直</Select.Option>
        </Select>
      </Form.Item>

      <Form.List name="items">
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }) => (
              <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                <Form.Item {...restField} name={[name, 'label']} style={{ marginBottom: 0, width: 120 }}>
                  <Input placeholder="标签" />
                </Form.Item>
                <Form.Item {...restField} name={[name, 'content']} style={{ marginBottom: 0, flex: 1 }}>
                  <Input placeholder="内容" />
                </Form.Item>
                <MinusCircleOutlined onClick={() => remove(name)} />
              </Space>
            ))}
            <Form.Item>
              <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                添加描述项
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>
    </Form>
  )
}

export default QuestionDescriptionsProps

