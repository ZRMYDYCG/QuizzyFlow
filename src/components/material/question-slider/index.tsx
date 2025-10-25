import { FC } from 'react'
import { Slider, Space, Typography } from 'antd'
import {
  IQuestionSliderProps,
  QuestionSliderDefaultProps,
} from './interface.ts'

const { Text } = Typography

const QuestionSlider: FC<IQuestionSliderProps> = (
  props: IQuestionSliderProps
) => {
  const {
    min = 0,
    max = 100,
    step = 1,
    defaultValue = 50,
    range = false,
    marks = true,
    label = '请选择数值',
    showValue = true,
    onChange,
  } = {
    ...QuestionSliderDefaultProps,
    ...props,
  }

  // 获取外部传入的 value（答题模式）
  const externalValue = (props as any).value
  const currentValue = externalValue !== undefined 
    ? externalValue 
    : (range ? [min, max / 2] : defaultValue)

  const handleChange = (newValue: number | [number, number]) => {
    if (onChange) {
      ;(onChange as any)(newValue)
    }
  }

  // 禁用 marks 以避免宽度溢出问题
  const sliderMarks = undefined

  return (
    <div style={{ 
      width: '100%', 
      maxWidth: 500,
      boxSizing: 'border-box',
      padding: '0 4px'
    }}>
      <Space direction="vertical" size={8} style={{ width: '100%' }}>
        {label && <Text>{label}</Text>}
        <div style={{ 
          width: '100%',
          padding: '0 8px',
          boxSizing: 'border-box'
        }}>
          <Slider
            min={min}
            max={max}
            step={step}
            value={currentValue as any}
            onChange={handleChange as any}
            range={range}
            marks={sliderMarks}
          />
        </div>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          padding: '0 8px',
          fontSize: '12px',
          color: '#8c8c8c'
        }}>
          <span>{min}</span>
          <span>{max}</span>
        </div>
        {showValue && (
          <Text type="secondary">
            当前值: {Array.isArray(currentValue) ? currentValue.join(' ~ ') : currentValue}
          </Text>
        )}
      </Space>
    </div>
  )
}

export default QuestionSlider

