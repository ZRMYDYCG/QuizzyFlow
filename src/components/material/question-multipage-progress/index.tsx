import { FC } from 'react'
import { Typography, Progress, Steps } from 'antd'
import {
  CheckCircleFilled,
  ClockCircleOutlined,
  MinusCircleOutlined,
} from '@ant-design/icons'
import { IQuestionMultipageProgressProps, QuestionMultipageProgressDefaultProps } from './interface'

const QuestionMultipageProgress: FC<IQuestionMultipageProgressProps> = (
  props: IQuestionMultipageProgressProps
) => {
  const {
    title,
    totalPages,
    currentPage,
    showPercentage,
    showPageNumber,
    progressType,
  } = {
    ...QuestionMultipageProgressDefaultProps,
    ...props,
  }

  const percentage = Math.round(((currentPage || 1) / (totalPages || 1)) * 100)

  // 线性进度条
  const renderLineProgress = () => (
    <div className="w-full">
      {title && (
        <Typography.Text strong className="block mb-3">
          {title}
        </Typography.Text>
      )}
      <Progress
        percent={percentage}
        strokeColor={{
          '0%': '#108ee9',
          '100%': '#87d068',
        }}
        status="active"
        strokeWidth={12}
        format={() => null}
      />
      <div className="flex justify-between mt-2 text-sm text-gray-600">
        {showPageNumber && (
          <span>
            第 {currentPage} / {totalPages} 页
          </span>
        )}
        {showPercentage && <span>{percentage}%</span>}
      </div>
    </div>
  )

  // 圆形进度条
  const renderCircleProgress = () => (
    <div className="flex flex-col items-center gap-3">
      {title && (
        <Typography.Text strong className="text-center">
          {title}
        </Typography.Text>
      )}
      <Progress
        type="circle"
        percent={percentage}
        strokeColor={{
          '0%': '#108ee9',
          '100%': '#87d068',
        }}
        width={120}
      />
      {showPageNumber && (
        <Typography.Text className="text-gray-600">
          第 {currentPage} / {totalPages} 页
        </Typography.Text>
      )}
    </div>
  )

  // 步骤条
  const renderStepsProgress = () => {
    const items = Array.from({ length: totalPages || 1 }, (_, index) => {
      const pageNum = index + 1
      const isCurrent = pageNum === currentPage
      const isCompleted = pageNum < (currentPage || 1)

      return {
        title: `第${pageNum}页`,
        icon: isCompleted ? (
          <CheckCircleFilled />
        ) : isCurrent ? (
          <ClockCircleOutlined />
        ) : (
          <MinusCircleOutlined />
        ),
      }
    })

    return (
      <div className="w-full">
        {title && (
          <Typography.Text strong className="block mb-4">
            {title}
          </Typography.Text>
        )}
        <Steps
          current={(currentPage || 1) - 1}
          items={items}
          responsive={false}
          size="small"
        />
        {showPercentage && (
          <div className="text-center mt-3 text-sm text-gray-600">{percentage}% 完成</div>
        )}
      </div>
    )
  }

  return (
    <div className="w-full p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
      {progressType === 'line' && renderLineProgress()}
      {progressType === 'circle' && renderCircleProgress()}
      {progressType === 'steps' && renderStepsProgress()}
    </div>
  )
}

export default QuestionMultipageProgress

