/**
 * QuickActions Component
 * 快捷操作按钮
 */

import React from 'react'
import { Button, Space } from 'antd'
import { Sparkles, Plus, Wand2, Type, Lightbulb } from 'lucide-react'

interface QuickAction {
  label: string
  icon?: React.ReactNode
  prompt: string
  color?: string
}

interface QuickActionsProps {
  onActionClick: (prompt: string) => void
  disabled?: boolean
}

const defaultActions: QuickAction[] = [
  {
    label: '添加输入框',
    icon: <Plus className="w-4 h-4" />,
    prompt: '帮我添加一个姓名输入框',
    color: 'blue',
  },
  {
    label: '添加单选题',
    icon: <Plus className="w-4 h-4" />,
    prompt: '帮我添加一个性别单选题',
    color: 'green',
  },
  {
    label: '优化问卷',
    icon: <Wand2 className="w-4 h-4" />,
    prompt: '分析这个问卷并提供优化建议',
    color: 'purple',
  },
  {
    label: '生成标题',
    icon: <Type className="w-4 h-4" />,
    prompt: '帮我生成一个合适的问卷标题和描述',
    color: 'orange',
  },
]

const QuickActions: React.FC<QuickActionsProps> = ({ onActionClick, disabled }) => {
  return (
    <div className="mb-4">
      <div className="flex items-center gap-2 mb-2">
        <Sparkles className="w-4 h-4 text-purple-500" />
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">快捷操作</span>
      </div>

      <Space wrap>
        {defaultActions.map((action, index) => (
          <Button
            key={index}
            size="small"
            icon={action.icon}
            onClick={() => onActionClick(action.prompt)}
            disabled={disabled}
            className="flex items-center gap-1"
          >
            {action.label}
          </Button>
        ))}
      </Space>

      <div className="mt-2 text-xs text-gray-400">或者直接在下方输入你的需求</div>
    </div>
  )
}

export default QuickActions

