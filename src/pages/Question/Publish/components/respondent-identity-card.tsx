import React from 'react'
import { Card, Input, Radio, Space, Typography } from 'antd'
import { UserOutlined } from '@ant-design/icons'
import { cn } from '@/utils'
import type { RespondentIdentityMode } from '../types'

const { Text } = Typography

export interface RespondentIdentityCardProps {
  isLoggedIn: boolean
  accountDisplayName: string
  mode: RespondentIdentityMode
  customName: string
  hint: string
  onModeChange: (mode: RespondentIdentityMode) => void
  onCustomNameChange: (name: string) => void
  isDark?: boolean
}

const RespondentIdentityCard: React.FC<RespondentIdentityCardProps> = ({
  isLoggedIn,
  accountDisplayName,
  mode,
  customName,
  hint,
  onModeChange,
  onCustomNameChange,
  isDark = false,
}) => {
  const showCustomInput =
    !isLoggedIn || mode === 'custom'

  return (
    <Card
      className={cn(
        'm-[12px]',
        isDark
          ? 'bg-slate-800/70 border-slate-700/60 [&_.ant-card-head]:border-slate-700/60 [&_.ant-card-head-title]:text-slate-100'
          : 'bg-white/90 border-gray-100'
      )}
      size="small"
      title={
        <Space className={isDark ? 'text-slate-100' : undefined}>
          <UserOutlined />
          <span>填写身份</span>
        </Space>
      }
    >
      {isLoggedIn ? (
        <Radio.Group
          value={mode}
          onChange={(e) => onModeChange(e.target.value)}
          className={cn('mb-3', isDark && '[&_.ant-radio-wrapper]:text-slate-200')}
        >
          <Space direction="vertical">
            <Radio value="account">
              使用账号昵称
              {accountDisplayName ? (
                <Text type="secondary" className="ml-1">
                  （{accountDisplayName}）
                </Text>
              ) : null}
            </Radio>
            <Radio value="anonymous">匿名填写</Radio>
            <Radio value="custom">自定义昵称</Radio>
          </Space>
        </Radio.Group>
      ) : (
        <Text type="secondary" className="block mb-3">
          您尚未登录，请填写昵称后参与问卷
        </Text>
      )}

      {showCustomInput ? (
        <Input
          placeholder="请输入您的昵称（必填）"
          value={customName}
          onChange={(e) => onCustomNameChange(e.target.value)}
          maxLength={50}
          showCount
          allowClear
        />
      ) : null}

      <Text type="secondary" className="block mt-3 text-xs">
        {hint}
      </Text>
    </Card>
  )
}

export default RespondentIdentityCard
