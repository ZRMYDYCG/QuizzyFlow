import React, { FC } from 'react'
import { Card, Row, Col, Typography } from 'antd'
import { IQuestionCardGridProps, QuestionCardGridDefaultProps } from './interface'

const { Meta } = Card
const { Paragraph } = Typography

const QuestionCardGrid: React.FC<IQuestionCardGridProps> = (props) => {
  const {
    items,
    columns = 3,
    hoverable = true,
    bordered = true,
  } = {
    ...QuestionCardGridDefaultProps,
    ...props,
  }

  const getColSpan = () => {
    if (columns === 2) return 12
    if (columns === 3) return 8
    if (columns === 4) return 6
    return 8
  }

  return (
    <div style={{ width: '100%', maxWidth: 1000 }}>
      <Row gutter={[16, 16]}>
        {items.map((item, index) => (
          <Col span={getColSpan()} key={index}>
            <Card
              hoverable={hoverable}
              bordered={bordered}
              cover={
                item.image && (
                  <img 
                    alt={item.title} 
                    src={item.image}
                    style={{ 
                      height: 160, 
                      objectFit: 'cover',
                      display: 'block'
                    }}
                  />
                )
              }
            >
              <Meta
                title={item.title}
                description={
                  <Paragraph 
                    ellipsis={{ rows: 2 }} 
                    style={{ marginBottom: 0 }}
                  >
                    {item.description}
                  </Paragraph>
                }
              />
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  )
}

export default QuestionCardGrid

