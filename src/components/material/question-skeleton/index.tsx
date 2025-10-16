import React, { FC } from 'react'
import { Skeleton } from 'antd'
import { IQuestionSkeletonProps, QuestionSkeletonDefaultProps } from './interface'

const QuestionSkeleton: React.FC<IQuestionSkeletonProps> = (props) => {
  const {
    active = true,
    avatar = true,
    paragraph = true,
    rows = 3,
    showTitle = true,
    round = false,
  } = {
    ...QuestionSkeletonDefaultProps,
    ...props,
  }

  return (
    <div style={{ width: '100%', maxWidth: 600, padding: '16px 0' }}>
      <Skeleton
        active={active}
        avatar={avatar}
        paragraph={paragraph ? { rows } : false}
        title={showTitle}
        round={round}
      />
    </div>
  )
}

export default QuestionSkeleton

