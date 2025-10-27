import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useLayoutConfig } from '@/contexts/LayoutContext'
import { useTheme } from '@/contexts/ThemeContext'
import './progress-bar.css'

/**
 * 顶部进度条组件
 * 在路由切换时显示加载进度
 */
const ProgressBar: React.FC = () => {
  const location = useLocation()
  const { config } = useLayoutConfig()
  const { themeColors } = useTheme()
  const [isLoading, setIsLoading] = useState(false)
  const [progress, setProgress] = useState(0)

  // 如果配置中关闭了进度条，不渲染
  if (!config.showProgressBar) {
    return null
  }

  useEffect(() => {
    // 路由变化时开始加载
    setIsLoading(true)
    setProgress(0)

    // 模拟加载进度
    const timer1 = setTimeout(() => setProgress(30), 100)
    const timer2 = setTimeout(() => setProgress(60), 200)
    const timer3 = setTimeout(() => setProgress(90), 300)
    const timer4 = setTimeout(() => {
      setProgress(100)
      setTimeout(() => setIsLoading(false), 400)
    }, 500)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
      clearTimeout(timer3)
      clearTimeout(timer4)
    }
  }, [location.pathname])

  if (!isLoading && progress === 0) {
    return null
  }

  return (
    <div
      className="progress-bar-container"
      style={{
        opacity: isLoading ? 1 : 0,
        transition: 'opacity 0.4s',
      }}
    >
      <div
        className="progress-bar"
        style={{
          width: `${progress}%`,
          backgroundColor: themeColors.primary,
          transition: 'width 0.3s ease-out',
        }}
      />
    </div>
  )
}

export default ProgressBar

