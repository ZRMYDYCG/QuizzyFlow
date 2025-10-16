import React, { FC } from 'react'
import { Tree } from 'antd'
import { IQuestionTreeProps, QuestionTreeDefaultProps } from './interface'

const QuestionTree: React.FC<IQuestionTreeProps> = (props) => {
  const {
    treeData,
    showLine = true,
    showIcon = false,
    defaultExpandAll = true,
    checkable = false,
    selectable = true,
  } = {
    ...QuestionTreeDefaultProps,
    ...props,
  }

  return (
    <div style={{ width: '100%', maxWidth: 600, padding: '16px 0' }}>
      <Tree
        treeData={treeData}
        showLine={showLine}
        showIcon={showIcon}
        defaultExpandAll={defaultExpandAll}
        checkable={checkable}
        selectable={selectable}
      />
    </div>
  )
}

export default QuestionTree

