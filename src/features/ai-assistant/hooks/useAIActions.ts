/**
 * useAIActions Hook
 * 执行 AI 建议的操作
 */

import { useState, useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { message } from 'antd'
import { AIAction, ComponentData, UseAIActionsReturn } from '../types'
import { executeAIAction, previewAction as previewActionUtil } from '../services/actionExecutor'
import {
  addComponent,
  changeComponentProps,
  extraComponents,
} from '@/store/modules/question-component'

export const useAIActions = (): UseAIActionsReturn => {
  const dispatch = useDispatch()
  const [isExecuting, setIsExecuting] = useState(false)

  /**
   * 执行 AI 操作
   */
  const executeAction = useCallback(
    async (action: AIAction): Promise<boolean> => {
      setIsExecuting(true)

      try {
        let result: any

        // 根据操作类型分别处理
        switch (action.type) {
          case 'add_component': {
            const validation = executeAIAction(action, null, {
              addComponent,
              updateComponent: changeComponentProps,
              deleteComponent: extraComponents,
            })

            if (validation.success && (validation as any).action) {
              // 直接 dispatch Redux action
              dispatch((validation as any).action)
              message.success(validation.message)
              return true
            } else {
              message.error(validation.message)
              return false
            }
          }

          case 'update_component': {
            // 使用 changeComponentProps
            dispatch(changeComponentProps({
              fe_id: action.data.fe_id,
              props: action.data.props as any,
            }))
            message.success(action.description || '更新成功')
            return true
          }

          case 'delete_component': {
            // 删除当前选中的组件
            dispatch(extraComponents())
            message.success(action.description || '删除成功')
            return true
          }

          default:
            message.info('此操作类型暂不支持')
            return false
        }
      } catch (error) {
        console.error('Execute action error:', error)
        message.error('操作执行失败')
        return false
      } finally {
        setIsExecuting(false)
      }
    },
    [dispatch]
  )

  /**
   * 预览操作效果
   */
  const previewAction = useCallback((action: AIAction): ComponentData | null => {
    return previewActionUtil(action)
  }, [])

  return {
    executeAction,
    previewAction,
    isExecuting,
  }
}

