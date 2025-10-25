import React, { useState } from 'react'
import type { IQuestionTransferProps } from './interface.ts'
import { QuestionTransferDefaultData } from './interface.ts'
import { Transfer } from 'antd'
import type { TransferDirection } from 'antd/es/transfer'

const QuestionTransfer: React.FC<IQuestionTransferProps> = (
  props: IQuestionTransferProps
) => {
  const { dataSource, targetKeys, showSearch, titles, operations, disabled, onChange } = {
    ...QuestionTransferDefaultData,
    ...props,
  }

  // 获取外部传入的 value（答题模式）
  const externalValue = (props as any).value
  // Transfer 组件的 targetKeys 必须是数组
  const currentTargetKeys = Array.isArray(externalValue) 
    ? externalValue 
    : (Array.isArray(targetKeys) ? targetKeys : [])

  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([])

  const handleChange = (
    newTargetKeys: React.Key[],
    direction: TransferDirection,
    moveKeys: React.Key[]
  ) => {
    if (onChange) {
      // Transfer 总是返回数组，转换为字符串数组
      const stringKeys = newTargetKeys.map(key => String(key))
      ;(onChange as any)(stringKeys)
    }
  }

  const handleSelectChange = (
    sourceSelectedKeys: React.Key[],
    targetSelectedKeys: React.Key[]
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
