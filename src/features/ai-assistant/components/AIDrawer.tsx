/**
 * AIDrawer Component
 * AI 助手侧边栏（移动端 Drawer）
 */

import React from 'react'
import { Drawer } from 'antd'
import { CloseOutlined } from '@ant-design/icons'
import { Sparkles } from 'lucide-react'
import AIChatPanel from './AIChatPanel'

interface AIDrawerProps {
  open: boolean
  onClose: () => void
  questionId?: string
  initialMessage?: string
  onInitialMessageSent?: () => void
}

const AIDrawer: React.FC<AIDrawerProps> = ({
  open,
  onClose,
  questionId,
  initialMessage,
  onInitialMessageSent,
}) => {
  return (
    <Drawer
      title={
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-500" />
          <span>AI 助手</span>
        </div>
      }
      width={520}
      placement="right"
      open={open}
      onClose={onClose}
      closeIcon={<CloseOutlined />}
      styles={{ body: { padding: 0, display: 'flex', flexDirection: 'column', height: '100%' } }}
    >
      <AIChatPanel
        questionId={questionId}
        initialMessage={initialMessage}
        onInitialMessageSent={onInitialMessageSent}
        className="h-full"
      />
    </Drawer>
  )
}

export default AIDrawer
