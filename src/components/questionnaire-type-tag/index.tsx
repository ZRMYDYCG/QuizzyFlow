/**
 * 问卷类型标签组件
 * 用于在列表页、详情页展示问卷类型
 */
import React from 'react'
import { Tag } from 'antd'
import * as LucideIcons from 'lucide-react'
import {
  QuestionnaireType,
  getQuestionnaireTypeConfig,
} from '@/constants/questionnaire-types'

interface QuestionnaireTypeTagProps {
  type: QuestionnaireType
  showIcon?: boolean
  size?: 'small' | 'default' | 'large'
  bordered?: boolean
  className?: string
}

const QuestionnaireTypeTag: React.FC<QuestionnaireTypeTagProps> = ({
  type,
  showIcon = true,
  size = 'default',
  bordered = false,
  className,
}) => {
  const config = getQuestionnaireTypeConfig(type)
  const Icon = (LucideIcons as any)[config.icon] || LucideIcons.FileText

  const sizeMap = {
    small: { iconSize: 12, fontSize: '12px', padding: '0 6px' },
    default: { iconSize: 14, fontSize: '14px', padding: '2px 8px' },
    large: { iconSize: 16, fontSize: '16px', padding: '4px 12px' },
  }

  const { iconSize, fontSize, padding } = sizeMap[size]

  return (
    <Tag
      color={config.color}
      bordered={bordered}
      className={className}
      style={{
        fontSize,
        padding,
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        backgroundColor: config.bgColor,
        color: config.color,
        border: bordered ? `1px solid ${config.color}` : 'none',
      }}
    >
      {showIcon && <Icon size={iconSize} />}
      {config.label}
    </Tag>
  )
}

export default QuestionnaireTypeTag

