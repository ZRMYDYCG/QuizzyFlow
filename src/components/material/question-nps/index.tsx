import { FC } from 'react'
import { Typography } from 'antd'
import { IQuestionNPSProps, QuestionNPSDefaultProps } from './interface'

const QuestionNPS: FC<IQuestionNPSProps> = (props: IQuestionNPSProps) => {
  const { title, value, minLabel, maxLabel, showDescription } = {
    ...QuestionNPSDefaultProps,
    ...props,
  }

  const scores = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

  const getScoreColor = (score: number) => {
    if (score <= 6) return 'bg-red-100 border-red-300 hover:bg-red-200'
    if (score <= 8) return 'bg-yellow-100 border-yellow-300 hover:bg-yellow-200'
    return 'bg-green-100 border-green-300 hover:bg-green-200'
  }

  const getScoreActiveColor = (score: number) => {
    if (score <= 6) return 'bg-red-500 border-red-600 text-white'
    if (score <= 8) return 'bg-yellow-500 border-yellow-600 text-white'
    return 'bg-green-500 border-green-600 text-white'
  }

  return (
    <div className="w-full">
      <Typography.Paragraph strong className="mb-4">
        {title}
      </Typography.Paragraph>

      <div className="flex flex-col gap-4">
        {/* NPS评分按钮 */}
        <div className="flex flex-wrap gap-2 justify-center">
          {scores.map((score) => (
            <button
              key={score}
              className={`
                w-12 h-12 rounded-lg border-2 font-bold text-lg
                transition-all duration-200 cursor-pointer
                ${
                  value === score
                    ? getScoreActiveColor(score)
                    : `${getScoreColor(score)} text-gray-700`
                }
              `}
            >
              {score}
            </button>
          ))}
        </div>

        {/* 标签说明 */}
        <div className="flex justify-between text-sm text-gray-600 px-2">
          <span>{minLabel}</span>
          <span>{maxLabel}</span>
        </div>

        {/* 分类说明 */}
        {showDescription && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-500 rounded"></div>
                <span>0-6分：贬损者</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                <span>7-8分：中立者</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 rounded"></div>
                <span>9-10分：推荐者</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default QuestionNPS

