/**
 * useAIActions Hook
 * 执行 AI 建议的操作
 */

import { useState, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { message } from '@/utils/app-message'
import type { stateType } from '@/store'
import { AIAction, ComponentData, UseAIActionsReturn } from '../types'
import { executeAIAction, previewAction as previewActionUtil } from '../services/actionExecutor'
import {
  addComponent,
  updateComponentByFeId,
  removeComponentByFeId,
} from '@/store/modules/question-component'

import {
  resolveComponentFeId,
  resolveInsertAnchor,
} from '../utils/resolve-component-fe-id'

function resolveActionFeIds(
  action: AIAction,
  componentList: Array<{ fe_id: string }>,
  selectedId: string,
): { action: AIAction; insertFallback?: string } {
  const data = action.data ?? {}

  if (action.type === 'update_component' || action.type === 'delete_component') {
    const resolved = resolveComponentFeId(data.fe_id, componentList)
    if (!resolved) return { action }
    return {
      action: {
        ...action,
        data: { ...data, fe_id: resolved },
      },
    }
  }

  if (action.type === 'add_component') {
    let insertAfterFeId = data.insertAfterFeId as string | undefined

    if (!insertAfterFeId) {
      if (selectedId && componentList.some((item) => item.fe_id === selectedId)) {
        insertAfterFeId = selectedId
      }
    } else if (insertAfterFeId !== '__start__') {
      const { feId, fallback } = resolveInsertAnchor(
        insertAfterFeId,
        componentList,
        selectedId,
      )

      if (feId) {
        insertAfterFeId = feId
        if (fallback === 'selected') {
          return {
            action: {
              ...action,
              data: { ...data, insertAfterFeId },
            },
            insertFallback: `未识别锚点「${data.insertAfterFeId}」，已插入到当前选中题目之后`,
          }
        }
        if (fallback === 'last') {
          return {
            action: {
              ...action,
              data: { ...data, insertAfterFeId },
            },
            insertFallback: `未识别锚点「${data.insertAfterFeId}」，已插入到最后一题之后`,
          }
        }
      } else if (fallback === 'removed') {
        const { insertAfterFeId: _removed, ...rest } = data
        return { action: { ...action, data: rest } }
      }
    }

    if (insertAfterFeId) {
      return {
        action: {
          ...action,
          data: { ...data, insertAfterFeId },
        },
      }
    }
  }

  return { action }
}

export const useAIActions = (): UseAIActionsReturn => {
  const dispatch = useDispatch()
  const componentList = useSelector(
    (state: stateType) => state.questionComponent.present.componentList,
  )
  const selectedId = useSelector(
    (state: stateType) => state.questionComponent.present.selectedId,
  )
  const [isExecuting, setIsExecuting] = useState(false)

  /**
   * 执行 AI 操作
   */
  const executeAction = useCallback(
    async (action: AIAction): Promise<boolean> => {
      setIsExecuting(true)

      try {
        const { action: actionToRun, insertFallback } = resolveActionFeIds(
          action,
          componentList,
          selectedId,
        )

        if (
          actionToRun.type === 'update_component' ||
          actionToRun.type === 'delete_component'
        ) {
          const feId = actionToRun.data?.fe_id
          if (!feId) {
            message.error('缺少组件 ID (fe_id)，无法应用操作')
            return false
          }

          const exists = componentList.some((item) => item.fe_id === feId)
          if (!exists) {
            message.error(
              `未找到组件 ${feId}。请让 AI 使用属性面板「物料 ID」中的真实 ID，或重新发起对话后再应用`,
            )
            return false
          }
        }

        const result = executeAIAction(actionToRun, null, {
          addComponent,
          updateComponent: updateComponentByFeId,
          deleteComponent: removeComponentByFeId,
        })

        if (result.success && (result as { action?: unknown }).action) {
          dispatch((result as { action: unknown }).action as never)
          if (insertFallback) {
            message.warning(insertFallback)
          }
          message.success(result.message)
          return true
        }

        message.error(result.message)
        return false
      } catch (error) {
        console.error('Execute action error:', error)
        message.error('操作执行失败')
        return false
      } finally {
        setIsExecuting(false)
      }
    },
    [dispatch, componentList, selectedId],
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
