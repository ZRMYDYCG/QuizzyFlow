import { FC } from 'react'
import { Form, Switch, Input } from 'antd'
import { IQuestionTreeProps } from './interface'

const { TextArea } = Input

const QuestionTreeProps: FC<IQuestionTreeProps> = (props) => {
  const { showLine, showIcon, defaultExpandAll, checkable, selectable } = props

  return (
    <Form layout="vertical" initialValues={{ showLine, showIcon, defaultExpandAll, checkable, selectable }}>
      <Form.Item label="显示连接线" name="showLine" valuePropName="checked">
        <Switch />
      </Form.Item>

      <Form.Item label="显示图标" name="showIcon" valuePropName="checked">
        <Switch />
      </Form.Item>

      <Form.Item label="默认展开所有" name="defaultExpandAll" valuePropName="checked">
        <Switch />
      </Form.Item>

      <Form.Item label="可选择（复选框）" name="checkable" valuePropName="checked">
        <Switch />
      </Form.Item>

      <Form.Item label="可选中" name="selectable" valuePropName="checked">
        <Switch />
      </Form.Item>

      <Form.Item label="树形数据 (JSON)" help="请输入有效的 JSON 格式">
        <TextArea 
          rows={8} 
          placeholder='[{"title":"节点1","key":"0-0","children":[{"title":"子节点","key":"0-0-0"}]}]'
        />
      </Form.Item>
    </Form>
  )
}

export default QuestionTreeProps

