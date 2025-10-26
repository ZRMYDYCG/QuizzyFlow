import { useState, useEffect, useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

interface NavigationHistoryState {
  canGoBack: boolean
  canGoForward: boolean
  goBack: () => void
  goForward: () => void
}

/**
 * 导航历史记录 Hook
 * 维护浏览器历史记录状态，支持前进/后退判断
 */
export const useNavigationHistory = (): NavigationHistoryState => {
  const location = useLocation()
  const navigate = useNavigate()
  
  // 历史记录栈
  const [historyStack, setHistoryStack] = useState<string[]>([])
  const [currentIndex, setCurrentIndex] = useState(-1)

  // 初始化历史记录
  useEffect(() => {
    // 从 sessionStorage 恢复历史记录
    const savedHistory = sessionStorage.getItem('navigationHistory')
    const savedIndex = sessionStorage.getItem('navigationIndex')
    
    if (savedHistory && savedIndex) {
      try {
        const stack = JSON.parse(savedHistory)
        const index = parseInt(savedIndex, 10)
        setHistoryStack(stack)
        setCurrentIndex(index)
      } catch (error) {
        console.error('Failed to restore navigation history:', error)
      }
    }
  }, [])

  // 监听路由变化
  useEffect(() => {
    const currentPath = location.pathname

    // 检查是否是通过前进/后退按钮触发的
    const isNavigating = sessionStorage.getItem('isNavigating')
    
    if (isNavigating === 'true') {
      // 如果是通过我们的按钮触发的，不添加到历史
      sessionStorage.removeItem('isNavigating')
      return
    }

    // 正常导航：添加到历史记录
    setHistoryStack((prevStack) => {
      // 如果当前不在栈顶，删除当前位置之后的所有记录
      const newStack = prevStack.slice(0, currentIndex + 1)
      
      // 添加新路径（如果和上一个不同）
      if (newStack[newStack.length - 1] !== currentPath) {
        newStack.push(currentPath)
        setCurrentIndex(newStack.length - 1)
        
        // 保存到 sessionStorage
        sessionStorage.setItem('navigationHistory', JSON.stringify(newStack))
        sessionStorage.setItem('navigationIndex', String(newStack.length - 1))
        
        return newStack
      }
      
      return prevStack
    })
  }, [location.pathname, currentIndex])

  // 后退
  const goBack = useCallback(() => {
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1
      const targetPath = historyStack[newIndex]
      
      sessionStorage.setItem('isNavigating', 'true')
      sessionStorage.setItem('navigationIndex', String(newIndex))
      setCurrentIndex(newIndex)
      
      navigate(targetPath)
    }
  }, [currentIndex, historyStack, navigate])

  // 前进
  const goForward = useCallback(() => {
    if (currentIndex < historyStack.length - 1) {
      const newIndex = currentIndex + 1
      const targetPath = historyStack[newIndex]
      
      sessionStorage.setItem('isNavigating', 'true')
      sessionStorage.setItem('navigationIndex', String(newIndex))
      setCurrentIndex(newIndex)
      
      navigate(targetPath)
    }
  }, [currentIndex, historyStack, navigate])

  return {
    canGoBack: currentIndex > 0,
    canGoForward: currentIndex < historyStack.length - 1,
    goBack,
    goForward,
  }
}

