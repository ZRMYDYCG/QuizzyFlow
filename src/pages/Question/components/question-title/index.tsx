import React from 'react'
import type { IQuestionTitleProps } from './interface.ts'
import { QuestionTitleDefaultData } from './interface.ts'
import { Typography } from 'antd'
import { motion } from 'framer-motion'

const QuestionTitle: React.FC<IQuestionTitleProps> = (
  props: IQuestionTitleProps
) => {
  const { text, level, isCenter, color, animateType } = {
    ...QuestionTitleDefaultData,
    ...props,
  }
  const { Title } = Typography

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

  // 定义动画配置
  const animationConfig = {
    shake: {
      x: [-5, 5, -5, 5, 0],
      transition: { duration: 0.3, repeat: Infinity },
    }, // 抖动动画（水平偏移循环）
    float: {
      y: [-5, 5, -5, 5, 0],
      transition: { duration: 2, repeat: Infinity },
    }, // 浮动动画（垂直偏移循环）
    none: {}, // 无动画
  }[animateType || 'none']

  return (
    <motion.div animate={animationConfig}>
      <Title
        level={level}
        style={{
          textAlign: isCenter ? 'center' : 'left',
          fontSize: genFontSize(level as number),
          color: color || 'inherit',
        }}
      >
        {text}
      </Title>
    </motion.div>
  )
}

export default QuestionTitle
