import { FC } from 'react'
import { Form, Select, Switch, Button, Input, Space } from 'antd'
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons'
import { IQuestionTimelineProps } from './interface'

const QuestionTimelineProps: FC<IQuestionTimelineProps> = (props) => {
  const { items, mode, pending, reverse } = props

  return (
    <Form layout="vertical" initialValues={{ items, mode, pending, reverse }}>
      <Form.Item label="布局模式" name="mode">
        <Select>
          <Select.Option value="left">左侧</Select.Option>
          <Select.Option value="right">右侧</Select.Option>
          <Select.Option value="alternate">交替</Select.Option>
        </Select>
      </Form.Item>

      <Form.Item label="显示待办" name="pending" valuePropName="checked">
        <Switch />
      </Form.Item>

      <Form.Item label="倒序显示" name="reverse" valuePropName="checked">
        <Switch />
      </Form.Item>

      <Form.List name="items">
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }) => (
              <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                <Form.Item {...restField} name={[name, 'label']} style={{ marginBottom: 0, width: 100 }}>
                  <Input placeholder="时间" />
                </Form.Item>
                <Form.Item {...restField} name={[name, 'children']} style={{ marginBottom: 0, flex: 1 }}>
                  <Input placeholder="内容" />
                </Form.Item>
                <Form.Item {...restField} name={[name, 'color']} style={{ marginBottom: 0, width: 100 }}>
                  <Select placeholder="颜色">
                    <Select.Option value="blue">蓝色</Select.Option>
                    <Select.Option value="green">绿色</Select.Option>
                    <Select.Option value="red">红色</Select.Option>
                    <Select.Option value="gray">灰色</Select.Option>
                  </Select>
                </Form.Item>
                <MinusCircleOutlined onClick={() => remove(name)} />
              </Space>
            ))}
            <Form.Item>
              <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                添加时间节点
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>
    </Form>
  )
}

export default QuestionTimelineProps

