import { FC, useState } from 'react'
import { Typography, message } from 'antd'
import { IQuestionWordCloudProps, QuestionWordCloudDefaultProps } from './interface'

const QuestionWordCloud: FC<IQuestionWordCloudProps> = (
  props: IQuestionWordCloudProps
) => {
  const {
    title,
    tags,
    value: initialValue,
    values: initialValues,
    isMultiple,
    maxSelections,
  } = {
    ...QuestionWordCloudDefaultProps,
    ...props,
  }

  const [value, setValue] = useState<string>(initialValue || '')
  const [values, setValues] = useState<string[]>(initialValues || [])

  const isSelected = (tagValue: string) => {
    if (isMultiple) {
      return values.includes(tagValue)
    }
    return value === tagValue
  }

  const handleClick = (tagValue: string) => {
    if (isMultiple) {
      if (values.includes(tagValue)) {
        setValues(values.filter((v) => v !== tagValue))
      } else {
        if (maxSelections && values.length >= maxSelections) {
          message.warning(`最多只能选择 ${maxSelections} 个标签`)
          return
        }
        setValues([...values, tagValue])
      }
    } else {
      setValue(tagValue)
    }
  }

  // 根据权重计算字体大小
  const getFontSize = (weight: number = 3) => {
    const baseSize = 14
    const sizeMap: Record<number, number> = {
      1: baseSize,
      2: baseSize + 4,
      3: baseSize + 8,
      4: baseSize + 12,
      5: baseSize + 16,
    }
    return sizeMap[weight] || baseSize + 8
  }

  // 生成随机颜色（柔和色系）
  const getTagColor = (index: number) => {
    const colors = [
      '#1890ff', '#52c41a', '#faad14', '#f5222d', '#722ed1',
      '#13c2c2', '#eb2f96', '#fa8c16', '#2f54eb', '#a0d911',
    ]
    return colors[index % colors.length]
  }

  return (
    <div className="w-full">
      <Typography.Paragraph strong className="mb-4">
        {title}
      </Typography.Paragraph>

      <div className="p-8 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 rounded-xl">
        {/* 词云标签 */}
        <div className="flex flex-wrap justify-center items-center gap-3 min-h-[300px]">
          {tags?.map((tag, index) => (
            <button
              key={tag.value}
              onClick={() => handleClick(tag.value)}
              className={`
                px-4 py-2 rounded-full cursor-pointer
                transition-all duration-300 font-semibold
                ${
                  isSelected(tag.value)
                    ? 'bg-blue-500 text-white shadow-lg scale-110'
                    : 'bg-white text-gray-700 hover:shadow-md hover:scale-105'
                }
              `}
              style={{
                fontSize: `${getFontSize(tag.weight)}px`,
                borderColor: isSelected(tag.value) ? 'transparent' : getTagColor(index),
                borderWidth: 2,
                borderStyle: 'solid',
              }}
            >
              {tag.text}
            </button>
          ))}
        </div>

        {/* 选择状态提示 */}
        {isMultiple && (
          <div className="mt-6 text-center">
            <Typography.Text className="text-gray-600">
              已选择 {values.length} 项
              {maxSelections && ` / 最多 ${maxSelections} 项`}
            </Typography.Text>
          </div>
        )}

        {/* 已选标签展示 */}
        {isMultiple && values.length > 0 && (
          <div className="mt-4 p-4 bg-white rounded-lg">
            <Typography.Text className="text-sm text-gray-600 block mb-2">
              您选择的标签：
            </Typography.Text>
            <div className="flex flex-wrap gap-2">
              {values.map((val) => {
                const tag = tags?.find((t) => t.value === val)
                return tag ? (
                  <span
                    key={val}
                    className="px-3 py-1 bg-blue-500 text-white rounded-full text-sm"
                  >
                    {tag.text}
                  </span>
                ) : null
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default QuestionWordCloud

