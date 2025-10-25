import { FC, useState } from 'react'
import { Typography, Rate } from 'antd'
import { IQuestionStarRatingProps, QuestionStarRatingDefaultProps } from './interface'

const QuestionStarRating: FC<IQuestionStarRatingProps> = (
  props: IQuestionStarRatingProps
) => {
  const {
    title,
    count,
    value: initialValue,
    allowHalf,
    allowClear,
    showValue,
    descriptions,
    onChange,
  } = {
    ...QuestionStarRatingDefaultProps,
    ...props,
  }

  // 获取外部传入的 value（答题模式）
  const externalValue = (props as any).value
  const currentValue = externalValue !== undefined ? externalValue : (initialValue || 0)

  const handleChange = (newValue: number) => {
    if (onChange) {
      ;(onChange as any)(newValue)
    }
  }

  const getDescription = () => {
    if (!descriptions || descriptions.length === 0) return ''
    if (currentValue === 0) return ''
    
    const index = Math.ceil(currentValue) - 1
    return descriptions[index] || ''
  }

  return (
    <div className="w-full">
      <Typography.Paragraph strong className="mb-4">
        {title}
      </Typography.Paragraph>

      <div className="flex flex-col items-center gap-4 p-6 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg">
        {/* 星级评分 */}
        <Rate
          count={count}
          value={currentValue}
          onChange={handleChange}
          allowHalf={allowHalf}
          allowClear={allowClear}
          style={{ fontSize: 48 }}
        />

        {/* 分值显示 */}
        {showValue && currentValue > 0 && (
          <div className="flex items-center gap-2">
            <Typography.Text className="text-3xl font-bold text-orange-500">
              {currentValue.toFixed(allowHalf ? 1 : 0)}
            </Typography.Text>
            <Typography.Text className="text-gray-500">
              / {count}
            </Typography.Text>
          </div>
        )}

        {/* 描述文字 */}
        {getDescription() && (
          <Typography.Text className="text-lg text-gray-600 font-medium">
            {getDescription()}
          </Typography.Text>
        )}

        {currentValue === 0 && (
          <Typography.Text type="secondary">
            点击星星进行评分
          </Typography.Text>
        )}
      </div>
    </div>
  )
}

export default QuestionStarRating

