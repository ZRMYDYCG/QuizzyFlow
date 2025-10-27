import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLocation } from 'react-router-dom'
import { useLayoutConfig } from '@/contexts/LayoutContext'
import type { PageTransition as PageTransitionType } from '@/types/layout'

interface PageTransitionProps {
  children: React.ReactNode
}

/**
 * 页面过渡动画配置
 */
const transitionVariants: Record<PageTransitionType, {
  initial: any
  animate: any
  exit: any
}> = {
  'slide-left': {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
  },
  'slide-right': {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  },
  'fade': {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  'zoom': {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 1.05 },
  },
  'none': {
    initial: {},
    animate: {},
    exit: {},
  },
}

/**
 * 页面过渡动画包装组件
 */
const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  const location = useLocation()
  const { config } = useLayoutConfig()

  const variants = transitionVariants[config.pageTransition]
  const duration = config.transitionDuration / 1000 // 转换为秒

  // 如果禁用动画，直接返回子组件
  if (config.pageTransition === 'none') {
    return <>{children}</>
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={variants.initial}
        animate={variants.animate}
        exit={variants.exit}
        transition={{
          duration,
          ease: [0.22, 1, 0.36, 1], // 自定义缓动函数
        }}
        className="h-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}

export default PageTransition

