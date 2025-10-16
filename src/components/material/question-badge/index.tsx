import { FC } from 'react'
import { Tag, Space } from 'antd'
import {
  IQuestionBadgeProps,
  QuestionBadgeDefaultProps,
  DIFFICULTY_PRESETS,
  TYPE_PRESETS,
} from './interface.ts'

const QuestionBadge: FC<IQuestionBadgeProps> = (
  props: IQuestionBadgeProps
) => {
  const {
    badges = [],
    preset = 'custom',
    shape = 'default',
    size = 'default',
    showIcon = false,
  } = {
    ...QuestionBadgeDefaultProps,
    ...props,
  }

  // 根据预设获取徽章列表
  const getBadges = () => {
    if (preset === 'difficulty') {
      return DIFFICULTY_PRESETS
    } else if (preset === 'type') {
      return TYPE_PRESETS
    }
    return badges
  }

  const displayBadges = getBadges()

  return (
    <Space size={8} wrap>
      {displayBadges.map((badge, index) => (
        <Tag
          key={index}
          color={badge.color}
          style={{
            borderRadius: shape === 'round' ? '16px' : '4px',
            fontSize: size === 'small' ? '12px' : size === 'large' ? '16px' : '14px',
            padding:
              size === 'small'
                ? '2px 8px'
                : size === 'large'
                ? '6px 16px'
                : '4px 12px',
            margin: 0,
          }}
        >
          {showIcon && badge.icon && <span style={{ marginRight: '4px' }}>{badge.icon}</span>}
          {badge.text}
        </Tag>
      ))}
    </Space>
  )
}

export default QuestionBadge

