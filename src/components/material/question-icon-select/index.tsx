import { FC, useState } from 'react'
import { Typography, Checkbox } from 'antd'
import { CheckOutlined } from '@ant-design/icons'
import { IQuestionIconSelectProps, QuestionIconSelectDefaultProps } from './interface'

const QuestionIconSelect: FC<IQuestionIconSelectProps> = (
  props: IQuestionIconSelectProps
) => {
  const {
    title,
    options,
    value: initialValue,
    values: initialValues,
    isMultiple,
    iconSize,
  } = {
    ...QuestionIconSelectDefaultProps,
    ...props,
  }

  const [value, setValue] = useState<string>(initialValue || '')
  const [values, setValues] = useState<string[]>(initialValues || [])

  const isSelected = (optionValue: string) => {
    if (isMultiple) {
      return values.includes(optionValue)
    }
    return value === optionValue
  }

  const handleClick = (optionValue: string) => {
    if (isMultiple) {
      if (values.includes(optionValue)) {
        setValues(values.filter((v) => v !== optionValue))
      } else {
        setValues([...values, optionValue])
      }
    } else {
      setValue(optionValue)
    }
  }

  return (
    <div className="w-full">
      <Typography.Paragraph strong className="mb-4">
        {title}
      </Typography.Paragraph>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4">
        {options?.map((option) => (
          <div
            key={option.value}
            onClick={() => handleClick(option.value)}
            className={`
              relative flex flex-col items-center gap-3 p-4 rounded-xl cursor-pointer
              border-2 transition-all duration-300
              ${
                isSelected(option.value)
                  ? 'bg-blue-50 border-blue-500 shadow-lg'
                  : 'bg-white border-gray-200 hover:border-blue-300 hover:shadow-md'
              }
            `}
          >
            {/* 选中标记 */}
            {isSelected(option.value) && (
              <div className="absolute top-2 right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                <CheckOutlined className="text-white text-xs" />
              </div>
            )}

            {/* 图标 */}
            <div
              className="flex items-center justify-center"
              style={{ fontSize: iconSize }}
            >
              {option.icon}
            </div>

            {/* 标签 */}
            <Typography.Text
              className={`
                text-center font-medium transition-colors
                ${isSelected(option.value) ? 'text-blue-600' : 'text-gray-700'}
              `}
            >
              {option.label}
            </Typography.Text>
          </div>
        ))}
      </div>

      {isMultiple && (
        <div className="mt-4 text-sm text-gray-500">
          已选择 {values.length} 项
        </div>
      )}
    </div>
  )
}

export default QuestionIconSelect

