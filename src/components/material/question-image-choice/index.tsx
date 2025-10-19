import { FC, useState } from 'react'
import { Typography, Image, Checkbox, Radio } from 'antd'
import { CheckOutlined } from '@ant-design/icons'
import { IQuestionImageChoiceProps, QuestionImageChoiceDefaultProps } from './interface'

const QuestionImageChoice: FC<IQuestionImageChoiceProps> = (
  props: IQuestionImageChoiceProps
) => {
  const {
    title,
    options,
    isMultiple,
    value: initialValue,
    values: initialValues,
    columns,
    showLabel,
  } = {
    ...QuestionImageChoiceDefaultProps,
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

  const gridColsClass = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
    5: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-5',
  }[columns || 3]

  return (
    <div className="w-full">
      <Typography.Paragraph strong className="mb-4">
        {title}
      </Typography.Paragraph>

      <div className={`grid ${gridColsClass} gap-4`}>
        {options?.map((option) => (
          <div
            key={option.value}
            onClick={() => handleClick(option.value)}
            className={`
              relative rounded-lg overflow-hidden cursor-pointer
              border-3 transition-all duration-300
              ${
                isSelected(option.value)
                  ? 'border-blue-500 shadow-lg scale-105'
                  : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
              }
            `}
          >
            {/* 选中标记 */}
            {isSelected(option.value) && (
              <div className="absolute top-2 right-2 z-10 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                <CheckOutlined className="text-white text-lg" />
              </div>
            )}

            {/* 图片 */}
            <div className="aspect-[4/3] bg-gray-100 overflow-hidden">
              <Image
                src={option.imageUrl}
                alt={option.label}
                preview={false}
                className="w-full h-full object-cover"
                fallback="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='200' viewBox='0 0 300 200'%3E%3Crect fill='%23f0f0f0' width='300' height='200'/%3E%3Ctext fill='%23999' font-family='sans-serif' font-size='16' x='50%25' y='50%25' text-anchor='middle' dominant-baseline='middle'%3E图片加载失败%3C/text%3E%3C/svg%3E"
              />
            </div>

            {/* 标签 */}
            {showLabel && option.label && (
              <div className="p-3 bg-white flex items-center gap-2">
                {isMultiple ? (
                  <Checkbox checked={isSelected(option.value)} />
                ) : (
                  <Radio checked={isSelected(option.value)} />
                )}
                <span className="font-medium text-gray-700">{option.label}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {isMultiple && (
        <div className="mt-4 text-sm text-gray-500">提示：可选择多个选项</div>
      )}
    </div>
  )
}

export default QuestionImageChoice

