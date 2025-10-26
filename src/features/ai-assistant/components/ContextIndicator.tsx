/**
 * ContextIndicator Component
 * 上下文指示器 - 显示当前问卷的信息
 */

import React from 'react'
import { Card, Tag, Space } from 'antd'
import { FileTextOutlined, AppstoreOutlined } from '@ant-design/icons'

interface ContextIndicatorProps {
  questionTitle?: string
  questionDesc?: string
  componentCount?: number
  selectedComponentId?: string
}

const ContextIndicator: React.FC<ContextIndicatorProps> = ({
  questionTitle = '未命名问卷',
  questionDesc,
  componentCount = 0,
  selectedComponentId,
}) => {
  return (
    <Card size="small" className="mb-4 bg-blue-50 dark:bg-blue-900/20 border-blue-200">
      <Space direction="vertical" size="small" className="w-full">
        {/* 问卷标题 */}
        <div className="flex items-start gap-2">
          <FileTextOutlined className="text-blue-500 mt-1" />
          <div className="flex-1">
            <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {questionTitle}
            </div>
            {questionDesc && (
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{questionDesc}</div>
            )}
          </div>
        </div>

        {/* 组件统计 */}
        <div className="flex items-center gap-2">
          <AppstoreOutlined className="text-blue-500" />
          <Space size="small">
            <Tag color="blue">{componentCount} 个组件</Tag>
            {selectedComponentId && <Tag color="purple">正在编辑组件</Tag>}
          </Space>
        </div>

        {/* 提示 */}
        <div className="text-xs text-gray-400 pt-2 border-t border-blue-200">
          💡 AI 已了解当前问卷的所有信息，可以为你提供针对性的帮助
        </div>
      </Space>
    </Card>
  )
}

export default ContextIndicator

