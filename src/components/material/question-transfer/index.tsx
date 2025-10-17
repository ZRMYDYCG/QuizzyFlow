import React, { useState } from 'react'
import type { IQuestionTransferProps } from './interface.ts'
import { QuestionTransferDefaultData } from './interface.ts'
import { Transfer } from 'antd'
import type { TransferDirection } from 'antd/es/transfer'

const QuestionTransfer: React.FC<IQuestionTransferProps> = (
  props: IQuestionTransferProps
) => {
  const { dataSource, targetKeys, showSearch, titles, operations, disabled } = {
    ...QuestionTransferDefaultData,
    ...props,
  }

  const [selectedKeys, setSelectedKeys] = useState<string[]>([])
  const [currentTargetKeys, setCurrentTargetKeys] = useState<string[]>(
    targetKeys || []
  )

  const handleChange = (
    newTargetKeys: string[],
    direction: TransferDirection,
    moveKeys: string[]
  ) => {
    console.log('New target keys:', newTargetKeys)
    console.log('Direction:', direction)
    console.log('Move keys:', moveKeys)
    setCurrentTargetKeys(newTargetKeys)
  }

  const handleSelectChange = (
    sourceSelectedKeys: string[],
    targetSelectedKeys: string[]
  ) => {
    setSelectedKeys([...sourceSelectedKeys, ...targetSelectedKeys])
  }

  return (
    <div style={{ width: '100%', overflow: 'auto' }}>
      <Transfer
        dataSource={dataSource}
        targetKeys={currentTargetKeys}
        selectedKeys={selectedKeys}
        onChange={handleChange}
        onSelectChange={handleSelectChange}
        render={(item) => item.title}
        showSearch={showSearch}
        titles={titles}
        operations={operations}
        disabled={disabled}
        style={{ marginBottom: 16 }}
      />
    </div>
  )
}

export default QuestionTransfer

