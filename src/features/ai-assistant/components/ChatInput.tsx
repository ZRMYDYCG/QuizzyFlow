/**
 * ChatInput Component
 * 聊天输入框（复用公共 AIPromptInput）
 */

import type { FC } from 'react'
import AIPromptInput, { type AIPromptInputProps } from '@/components/ai-prompt-input'

type ChatInputProps = Pick<
  AIPromptInputProps,
  'onSend' | 'onStop' | 'isLoading' | 'placeholder'
>

const ChatInput: FC<ChatInputProps> = (props) => {
  return <AIPromptInput variant="chat" {...props} />
}

export default ChatInput
