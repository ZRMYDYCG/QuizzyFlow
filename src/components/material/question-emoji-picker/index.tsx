import { FC, useState } from 'react'
import { Typography } from 'antd'
import { IQuestionEmojiPickerProps, QuestionEmojiPickerDefaultProps } from './interface'

const QuestionEmojiPicker: FC<IQuestionEmojiPickerProps> = (
  props: IQuestionEmojiPickerProps
) => {
  const {
    title,
    options,
    value: initialValue,
    values: initialValues,
    size,
    allowMultiple,
  } = {
    ...QuestionEmojiPickerDefaultProps,
    ...props,
  }

  const [value, setValue] = useState<string>(initialValue || '')
  const [values, setValues] = useState<string[]>(initialValues || [])

  const sizeMap = {
    small: 'text-3xl w-16 h-16',
    medium: 'text-5xl w-24 h-24',
    large: 'text-6xl w-32 h-32',
  }

  const sizeClass = sizeMap[size || 'medium']

  const isSelected = (optionValue: string) => {
    if (allowMultiple) {
      return values.includes(optionValue)
    }
    return value === optionValue
  }

  const handleClick = (optionValue: string) => {
    if (allowMultiple) {
      // 多选模式
      if (values.includes(optionValue)) {
        setValues(values.filter((v) => v !== optionValue))
      } else {
        setValues([...values, optionValue])
      }
    } else {
      // 单选模式
      setValue(optionValue)
    }
  }

  return (
    <div className="w-full">
      <Typography.Paragraph strong className="mb-6 text-center">
        {title}
      </Typography.Paragraph>

      <div className="flex flex-wrap justify-center gap-4">
        {options?.map((option) => (
          <div
            key={option.value}
            onClick={() => handleClick(option.value)}
            className="flex flex-col items-center gap-2 group cursor-pointer"
          >
            <div
              className={`
                ${sizeClass}
                flex items-center justify-center
                rounded-2xl border-3 transition-all duration-300
                ${
                  isSelected(option.value)
                    ? 'bg-blue-100 border-blue-500 shadow-lg scale-110'
                    : 'bg-gray-50 border-gray-200 hover:bg-gray-100 hover:border-gray-300 hover:scale-105'
                }
              `}
            >
              <span className="select-none">{option.emoji}</span>
            </div>
            <Typography.Text
              className={`
                text-center font-medium transition-colors
                ${isSelected(option.value) ? 'text-blue-600' : 'text-gray-600'}
              `}
            >
              {option.label}
            </Typography.Text>
          </div>
        ))}
      </div>

      {allowMultiple && (
        <div className="mt-4 text-center text-sm text-gray-500">可选择多个选项</div>
      )}
    </div>
  )
}

export default QuestionEmojiPicker

