import React from 'react'
import { Slider, Typography } from 'antd'
import { IQuestionRangeSliderProps, QuestionRangeSliderDefaultData } from './interface.ts'

const QuestionRangeSlider: React.FC<IQuestionRangeSliderProps> = (
  props: IQuestionRangeSliderProps
) => {
  const { title, min, max, step, marks, disabled, onChange } = {
    ...QuestionRangeSliderDefaultData,
    ...props,
  }

  // 获取外部传入的 value（答题模式）
  const externalValue = (props as any).value || [min, max]

  const handleChange = (value: number | number[]) => {
    if (onChange) {
      // 答题模式：传递区间数组
      ;(onChange as any)(value)
    }
  }

  // 生成刻度标记
  const marksObj = marks
    ? {
        [min || 0]: min?.toString() || '0',
        [max || 100]: max?.toString() || '100',
      }
    : undefined

  return (
    <div>
      <Typography.Paragraph strong>{title}</Typography.Paragraph>
      <div className="px-2">
        <Slider
          range
          value={externalValue}
          min={min}
          max={max}
          step={step}
          marks={marksObj}
          onChange={handleChange}
          disabled={disabled}
        />
      </div>
    </div>
  )
}

export default QuestionRangeSlider

