import { FC } from 'react'
import { Typography } from 'antd'
import { HolderOutlined } from '@ant-design/icons'
import { IQuestionRankingProps, QuestionRankingDefaultProps } from './interface'

const QuestionRanking: FC<IQuestionRankingProps> = (props: IQuestionRankingProps) => {
  const { title, options, showNumbers, description } = {
    ...QuestionRankingDefaultProps,
    ...props,
  }

  // 按order排序
  const sortedOptions = [...(options || [])].sort((a, b) => (a.order || 0) - (b.order || 0))

  return (
    <div className="w-full">
      <Typography.Paragraph strong className="mb-2">
        {title}
      </Typography.Paragraph>

      {description && (
        <Typography.Paragraph className="text-gray-500 text-sm mb-4">
          {description}
        </Typography.Paragraph>
      )}

      <div className="space-y-2">
        {sortedOptions.map((option, index) => (
          <div
            key={option.value}
            className="flex items-center gap-3 p-4 bg-white border-2 border-gray-200 rounded-lg hover:border-blue-400 hover:shadow-md transition-all duration-200 cursor-move group"
          >
            {/* 拖拽手柄 */}
            <HolderOutlined className="text-gray-400 text-lg group-hover:text-blue-500" />

            {/* 序号 */}
            {showNumbers && (
              <div className="flex items-center justify-center w-8 h-8 bg-blue-500 text-white font-bold rounded-full text-sm">
                {index + 1}
              </div>
            )}

            {/* 选项文本 */}
            <div className="flex-1 font-medium text-gray-700">{option.text}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default QuestionRanking

