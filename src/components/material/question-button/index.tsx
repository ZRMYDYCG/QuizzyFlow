import React from 'react'
import type { IQuestionButtonProps } from './interface.ts'
import { QuestionButtonDefaultData } from './interface.ts'
import { Button } from 'antd'
import * as Icons from '@ant-design/icons'

const QuestionButton: React.FC<IQuestionButtonProps> = (
  props: IQuestionButtonProps
) => {
  const { text, type, size, disabled, loading, icon, shape, danger, block, onClick } = {
    ...QuestionButtonDefaultData,
    ...props,
  }

  // 动态获取图标组件
  const getIcon = () => {
    if (!icon) return null
    const IconComponent = (Icons as any)[icon]
    return IconComponent ? <IconComponent /> : null
  }

  // 处理点击事件
  const handleClick = () => {
    if (!onClick) return
    
    // 如果是链接，则跳转
    if (onClick.startsWith('http://') || onClick.startsWith('https://') || onClick.startsWith('/')) {
      if (onClick.startsWith('http://') || onClick.startsWith('https://')) {
        window.open(onClick, '_blank')
      } else {
        window.location.href = onClick
      }
    } else {
      // 否则尝试执行自定义脚本（在实际应用中需要谨慎处理）
      console.log('Button clicked:', onClick)
    }
  }

  return (
    <Button
      type={type}
      size={size}
      disabled={disabled}
      loading={loading}
      icon={getIcon()}
      shape={shape}
      danger={danger}
      block={block}
      onClick={handleClick}
    >
      {text}
    </Button>
  )
}

export default QuestionButton

