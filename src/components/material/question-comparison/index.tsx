import { FC, useState } from 'react'
import { Typography, Image, Button } from 'antd'
import { CheckCircleFilled } from '@ant-design/icons'
import { IQuestionComparisonProps, QuestionComparisonDefaultProps } from './interface'

const QuestionComparison: FC<IQuestionComparisonProps> = (
  props: IQuestionComparisonProps
) => {
  const {
    title,
    optionA,
    optionB,
    value: initialValue,
    showImages,
    showFeatures,
  } = {
    ...QuestionComparisonDefaultProps,
    ...props,
  }

  const [value, setValue] = useState<string>(initialValue || '')

  const handleSelect = (optionValue: string) => {
    setValue(optionValue)
  }

  const renderOption = (option: any, position: 'left' | 'right') => {
    const isSelected = value === option.value

    return (
      <div
        onClick={() => handleSelect(option.value)}
        className={`
          flex-1 p-6 rounded-xl cursor-pointer transition-all duration-300
          border-3 ${
            isSelected
              ? 'bg-blue-50 border-blue-500 shadow-2xl scale-105'
              : 'bg-white border-gray-200 hover:border-blue-300 hover:shadow-lg'
          }
        `}
      >
        {/* 选中标记 */}
        {isSelected && (
          <div className="flex items-center justify-center mb-4">
            <CheckCircleFilled className="text-blue-500 text-3xl" />
          </div>
        )}

        {/* 标题 */}
        <Typography.Title
          level={3}
          className={`text-center mb-2 ${isSelected ? 'text-blue-600' : ''}`}
        >
          {option.title}
        </Typography.Title>

        {/* 描述 */}
        {option.description && (
          <Typography.Text className="block text-center text-gray-600 mb-4">
            {option.description}
          </Typography.Text>
        )}

        {/* 图片 */}
        {showImages && option.imageUrl && (
          <div className="mb-4 rounded-lg overflow-hidden">
            <Image
              src={option.imageUrl}
              alt={option.title}
              preview={false}
              className="w-full"
              fallback="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect fill='%23f0f0f0' width='400' height='300'/%3E%3Ctext fill='%23999' font-family='sans-serif' font-size='16' x='50%25' y='50%25' text-anchor='middle' dominant-baseline='middle'%3E图片加载失败%3C/text%3E%3C/svg%3E"
            />
          </div>
        )}

        {/* 特性列表 */}
        {showFeatures && option.features && option.features.length > 0 && (
          <div className="space-y-2">
            {option.features.map((feature: string, index: number) => (
              <div key={index} className="flex items-center gap-2">
                <span className="text-blue-500">✓</span>
                <Typography.Text className="text-gray-700">{feature}</Typography.Text>
              </div>
            ))}
          </div>
        )}

        {/* 选择按钮 */}
        <Button
          type={isSelected ? 'primary' : 'default'}
          size="large"
          block
          className="mt-4"
        >
          {isSelected ? '已选择' : '选择此方案'}
        </Button>
      </div>
    )
  }

  return (
    <div className="w-full">
      <Typography.Paragraph strong className="mb-6 text-center text-xl">
        {title}
      </Typography.Paragraph>

      {/* 对比区域 */}
      <div className="flex flex-col lg:flex-row gap-6">
        {renderOption(optionA, 'left')}
        
        {/* VS 分隔符 */}
        <div className="flex items-center justify-center lg:py-12">
          <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center shadow-lg">
            <Typography.Text className="text-white font-bold text-xl lg:text-2xl">
              VS
            </Typography.Text>
          </div>
        </div>

        {renderOption(optionB, 'right')}
      </div>

      {!value && (
        <Typography.Text type="secondary" className="block text-center mt-6">
          点击任一方案进行选择
        </Typography.Text>
      )}
    </div>
  )
}

export default QuestionComparison

