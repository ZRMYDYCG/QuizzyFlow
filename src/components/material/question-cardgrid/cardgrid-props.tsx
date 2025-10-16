import { FC } from 'react'
import { Form, Select, Switch, Button, Input, Space } from 'antd'
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons'
import { IQuestionCardGridProps } from './interface'

const QuestionCardGridProps: FC<IQuestionCardGridProps> = (props) => {
  const { items, columns, hoverable, bordered } = props

  return (
    <Form layout="vertical" initialValues={{ items, columns, hoverable, bordered }}>
      <Form.Item label="列数" name="columns">
        <Select>
          <Select.Option value={2}>2列</Select.Option>
          <Select.Option value={3}>3列</Select.Option>
          <Select.Option value={4}>4列</Select.Option>
        </Select>
      </Form.Item>

      <Form.Item label="悬浮效果" name="hoverable" valuePropName="checked">
        <Switch />
      </Form.Item>

      <Form.Item label="显示边框" name="bordered" valuePropName="checked">
        <Switch />
      </Form.Item>

      <Form.List name="items">
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }) => (
              <div key={key} style={{ marginBottom: 16, padding: 16, border: '1px solid #f0f0f0', borderRadius: 4 }}>
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Form.Item {...restField} name={[name, 'title']} label="标题" style={{ marginBottom: 8 }}>
                    <Input placeholder="卡片标题" />
                  </Form.Item>
                  <Form.Item {...restField} name={[name, 'description']} label="描述" style={{ marginBottom: 8 }}>
                    <Input.TextArea rows={2} placeholder="卡片描述" />
                  </Form.Item>
                  <Form.Item {...restField} name={[name, 'image']} label="图片链接" style={{ marginBottom: 8 }}>
                    <Input placeholder="图片 URL" />
                  </Form.Item>
                  <Button type="link" danger onClick={() => remove(name)} icon={<MinusCircleOutlined />}>
                    删除此卡片
                  </Button>
                </Space>
              </div>
            ))}
            <Form.Item>
              <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                添加卡片
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>
    </Form>
  )
}

export default QuestionCardGridProps

