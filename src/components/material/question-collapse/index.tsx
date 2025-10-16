import { FC, useState } from 'react'
import { Card, Typography, Space, Button } from 'antd'
import { DownOutlined, UpOutlined } from '@ant-design/icons'
import {
  IQuestionCollapseProps,
  QuestionCollapseDefaultProps,
} from './interface.ts'

const { Paragraph, Text } = Typography

const QuestionCollapse: FC<IQuestionCollapseProps> = (
  props: IQuestionCollapseProps
) => {
  const {
    title = '点击展开查看详情',
    content = '这里是折叠的内容',
    defaultExpanded = false,
    expandText = '展开',
    collapseText = '收起',
    showIcon = true,
    bordered = true,
  } = {
    ...QuestionCollapseDefaultProps,
    ...props,
  }

  const [isExpanded, setIsExpanded] = useState(defaultExpanded)

  const toggleExpand = () => {
    setIsExpanded(!isExpanded)
  }

  return (
    <div style={{ width: '100%', maxWidth: 600 }}>
      <Card
        size="small"
        bordered={bordered}
        style={{
          borderRadius: '4px',
          backgroundColor: '#fafafa',
          width: '100%',
        }}
      >
        <Space direction="vertical" style={{ width: '100%' }} size={12}>
          <div
            onClick={toggleExpand}
            style={{
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Text strong style={{ fontSize: '14px' }}>
              {title}
            </Text>
            <Button
              type="text"
              size="small"
              icon={
                showIcon && (isExpanded ? <UpOutlined /> : <DownOutlined />)
              }
            >
              {isExpanded ? collapseText : expandText}
            </Button>
          </div>

          {isExpanded && (
            <div
              style={{
                animation: 'fadeIn 0.3s ease-in',
              }}
            >
              <Paragraph style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                {content}
              </Paragraph>
            </div>
          )}
        </Space>

        <style>
          {`
            @keyframes fadeIn {
              from {
                opacity: 0;
                transform: translateY(-10px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
          `}
        </style>
      </Card>
    </div>
  )
}

export default QuestionCollapse

