import React, { FC } from 'react'
import { Card, Space, Typography } from 'antd'
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons'
import { IQuestionStatCardProps, QuestionStatCardDefaultProps } from './interface'

const { Title, Text } = Typography

const QuestionStatCard: React.FC<IQuestionStatCardProps> = (props) => {
  const {
    title,
    value,
    prefix,
    suffix,
    subtitle,
    trend = 'none',
    trendValue,
    color = '#1890ff',
  } = {
    ...QuestionStatCardDefaultProps,
    ...props,
  }

  const getTrendIcon = () => {
    if (trend === 'up') {
      return <ArrowUpOutlined style={{ color: '#52c41a' }} />
    }
    if (trend === 'down') {
      return <ArrowDownOutlined style={{ color: '#ff4d4f' }} />
    }
    return null
  }

  const getTrendColor = () => {
    if (trend === 'up') return '#52c41a'
    if (trend === 'down') return '#ff4d4f'
    return '#8c8c8c'
  }

  return (
    <div style={{ width: '100%', maxWidth: 400 }}>
      <Card
        bordered
        style={{
          borderLeft: `4px solid ${color}`,
          width: '100%',
        }}
      >
        <Space direction="vertical" size={8} style={{ width: '100%' }}>
          <Text type="secondary" style={{ fontSize: '14px' }}>
            {title}
          </Text>
          <Space size={4} align="baseline">
            {prefix && (
              <Text style={{ fontSize: '18px', color }}>
                {prefix}
              </Text>
            )}
            <Title level={2} style={{ margin: 0, color }}>
              {value}
            </Title>
            {suffix && (
              <Text style={{ fontSize: '16px', color: '#8c8c8c' }}>
                {suffix}
              </Text>
            )}
          </Space>
          <Space size={12}>
            {subtitle && <Text type="secondary">{subtitle}</Text>}
            {trend !== 'none' && trendValue && (
              <Space size={4}>
                {getTrendIcon()}
                <Text style={{ color: getTrendColor(), fontSize: '14px' }}>
                  {trendValue}
                </Text>
              </Space>
            )}
          </Space>
        </Space>
      </Card>
    </div>
  )
}

export default QuestionStatCard

