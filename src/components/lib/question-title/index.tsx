import React, { useState, useEffect } from 'react'
import type { IQuestionTitleProps } from './interface.ts'
import { QuestionTitleDefaultData } from './interface.ts'
import { Typography } from 'antd'
import { motion } from 'framer-motion'

const QuestionTitle: React.FC<IQuestionTitleProps> = (
  props: IQuestionTitleProps
) => {
  const { text, level, isCenter, color, animateType, typewriter } = {
    ...QuestionTitleDefaultData,
    ...props,
  }
  const { Title } = Typography

  // 打字机状态管理
  const [currentText, setCurrentText] = useState('')
  const [cursorVisible, setCursorVisible] = useState(true)
  const [isTyping, setIsTyping] = useState(false)

  // 打字机效果逻辑
  useEffect(() => {
    if (!typewriter?.isOpen || !text || !typewriter?.config) {
      setCurrentText(text || '')
      return
    }

    const { speed, cursor, isInfinite, loopCount } = typewriter.config // Destructure safely after null check
    let timer: NodeJS.Timeout | null = null
    let cursorTimer: NodeJS.Timeout | null = null
    let charIndex = 0
    let loopCountCurrent = 0

    const startTyping = () => {
      setIsTyping(true)
      if (charIndex <= text.length) {
        // Use safe cursor value with fallback
        const displayText =
          text.substring(0, charIndex) +
          (charIndex < text.length ? (cursorVisible ? cursor || '⎟' : '') : '')
        setCurrentText(displayText)
        charIndex++
        timer = setTimeout(startTyping, speed || 50)
      } else {
        setIsTyping(false)
        if (isInfinite || loopCountCurrent < (loopCount || 1)) {
          loopCountCurrent++
          timer = setTimeout(() => {
            charIndex = 0
            startTyping()
          }, 1000)
        }
      }
    }

    cursorTimer = setInterval(() => {
      if (!isTyping) setCursorVisible((prev) => !prev)
    }, 500)

    startTyping()

    return () => {
      if (timer) clearTimeout(timer)
      if (cursorTimer) clearInterval(cursorTimer)
    }
  }, [text, typewriter?.isOpen, typewriter?.config])

  // 字体大小计算（保持原有逻辑）
  const genFontSize = (level: number) => {
    switch (level) {
      case 1:
        return '36px'
      case 2:
        return '32px'
      case 3:
        return '28px'
      case 4:
        return '24px'
      case 5:
        return '20px'
      default:
        return '20px'
    }
  }

  // 动画配置（保持原有逻辑）
  const animationConfig = {
    shake: {
      x: [-5, 5, -5, 5, 0],
      transition: { duration: 0.3, repeat: Infinity },
    },
    float: {
      y: [-5, 5, -5, 5, 0],
      transition: { duration: 2, repeat: Infinity },
    },
    none: {},
  }[animateType || 'none']

  return (
    <motion.div animate={animationConfig}>
      <Title
        level={level}
        style={{
          textAlign: isCenter ? 'center' : 'left',
          fontSize: genFontSize(level as number),
          color: color || 'inherit',
          userSelect: 'none', // 防止文本被选中影响体验
        }}
      >
        {typewriter?.isOpen ? currentText : text}
      </Title>
    </motion.div>
  )
}

export default QuestionTitle
