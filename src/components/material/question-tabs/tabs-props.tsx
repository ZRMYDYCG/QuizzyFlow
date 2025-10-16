import { FC } from 'react'
import { Form, Select, Button, Input, Space } from 'antd'
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons'
import { IQuestionTabsProps } from './interface'

const { TextArea } = Input

const QuestionTabsProps: FC<IQuestionTabsProps> = (props) => {
  const { items, tabPosition, size, type } = props

  return (
    <Form layout="vertical" initialValues={{ items, tabPosition, size, type }}>
      <Form.Item label="标签位置" name="tabPosition">
        <Select>
          <Select.Option value="top">顶部</Select.Option>
          <Select.Option value="bottom">底部</Select.Option>
          <Select.Option value="left">左侧</Select.Option>
          <Select.Option value="right">右侧</Select.Option>
        </Select>
      </Form.Item>

      <Form.Item label="尺寸" name="size">
        <Select>
          <Select.Option value="small">小</Select.Option>
          <Select.Option value="middle">中</Select.Option>
          <Select.Option value="large">大</Select.Option>
        </Select>
      </Form.Item>

      <Form.Item label="类型" name="type">
        <Select>
          <Select.Option value="line">线条</Select.Option>
          <Select.Option value="card">卡片</Select.Option>
        </Select>
      </Form.Item>

      <Form.List name="items">
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }) => (
              <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                <Form.Item {...restField} name={[name, 'label']} style={{ marginBottom: 0, width: 120 }}>
                  <Input placeholder="标签名" />
                </Form.Item>
                <Form.Item {...restField} name={[name, 'children']} style={{ marginBottom: 0, flex: 1 }}>
                  <Input placeholder="内容" />
                </Form.Item>
                <MinusCircleOutlined onClick={() => remove(name)} />
              </Space>
            ))}
            <Form.Item>
              <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                添加标签页
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>
    </Form>
  )
}

export default QuestionTabsProps

