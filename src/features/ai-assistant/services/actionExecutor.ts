/**
 * Action Executor
 * 执行 AI 建议的操作
 */

import { AIAction, ComponentData } from '../types'
import { validateComponentData, normalizeComponentData } from './responseParser'
import { message } from 'antd'

/**
 * 执行添加组件操作
 */
export const executeAddComponent = (
  action: AIAction,
  addComponentAction: any
): { success: boolean; message: string } => {
  try {
    // 验证数据
    const validation = validateComponentData(action.data)
    if (!validation.valid) {
      return {
        success: false,
        message: `组件数据验证失败: ${validation.errors.join(', ')}`,
      }
    }

    // 标准化数据
    const componentData = normalizeComponentData(action.data)

    // 添加必需的属性
    const fullComponent = {
      ...componentData,
      isLocked: false,
      isHidden: false,
    }

    // 返回 Redux action（不在这里 dispatch）
    return {
      success: true,
      message: action.description || `成功添加组件: ${componentData.title || componentData.text}`,
      action: addComponentAction(fullComponent),
    } as any
  } catch (error) {
    console.error('Execute add component error:', error)
    return {
      success: false,
      message: '添加组件失败: ' + (error instanceof Error ? error.message : '未知错误'),
    }
  }
}

/**
 * 执行更新组件操作
 */
export const executeUpdateComponent = (
  action: AIAction,
  updateComponentAction: any
): { success: boolean; message: string } => {
  try {
    // 验证是否有 fe_id
    if (!action.data.fe_id) {
      return {
        success: false,
        message: '缺少组件 ID (fe_id)，无法更新',
      }
    }

    // 验证数据
    const validation = validateComponentData(action.data)
    if (!validation.valid) {
      return {
        success: false,
        message: `组件数据验证失败: ${validation.errors.join(', ')}`,
      }
    }

    // 标准化数据
    const componentData = normalizeComponentData(action.data)

    return {
      success: true,
      message: action.description || `成功更新组件: ${componentData.title || componentData.text}`,
      action: updateComponentAction({
        fe_id: componentData.fe_id,
        props: componentData.props,
      }),
    } as any
  } catch (error) {
    console.error('Execute update component error:', error)
    return {
      success: false,
      message: '更新组件失败: ' + (error instanceof Error ? error.message : '未知错误'),
    }
  }
}

/**
 * 执行删除组件操作
 */
export const executeDeleteComponent = (
  action: AIAction,
  deleteComponentAction: any
): { success: boolean; message: string } => {
  try {
    // QuizzyFlow 的删除是删除当前选中的组件
    // 这里返回 action，让 Hook 来 dispatch
    return {
      success: true,
      message: action.description || `成功删除组件`,
      action: deleteComponentAction(),
    } as any
  } catch (error) {
    console.error('Execute delete component error:', error)
    return {
      success: false,
      message: '删除组件失败: ' + (error instanceof Error ? error.message : '未知错误'),
    }
  }
}

/**
 * 执行 AI 操作（统一入口）
 * 返回包含 Redux action 的结果，由调用方 dispatch
 */
export const executeAIAction = (
  action: AIAction,
  _dispatch: any,
  actions: {
    addComponent: any
    updateComponent: any
    deleteComponent: any
  }
): { success: boolean; message: string; action?: any } => {
  switch (action.type) {
    case 'add_component':
      return executeAddComponent(action, actions.addComponent)

    case 'update_component':
      return executeUpdateComponent(action, actions.updateComponent)

    case 'delete_component':
      return executeDeleteComponent(action, actions.deleteComponent)

    case 'suggest_improvement':
      // 建议类操作不需要执行，只是提示用户
      return {
        success: true,
        message: '这是一个优化建议，请查看 AI 的说明',
      }

    default:
      return {
        success: false,
        message: `未知的操作类型: ${action.type}`,
      }
  }
}

/**
 * 预览操作效果（不实际执行）
 */
export const previewAction = (action: AIAction): ComponentData | null => {
  try {
    if (action.type === 'add_component' || action.type === 'update_component') {
      const validation = validateComponentData(action.data)
      if (validation.valid) {
        return normalizeComponentData(action.data)
      }
    }
    return null
  } catch (error) {
    console.error('Preview action error:', error)
    return null
  }
}

/**
 * 批量执行多个操作
 */
export const executeBatchActions = async (
  actions: AIAction[],
  dispatch: any,
  reduxActions: {
    addComponent: any
    updateComponent: any
    deleteComponent: any
  }
): Promise<{ successCount: number; failCount: number; messages: string[] }> => {
  let successCount = 0
  let failCount = 0
  const messages: string[] = []

  for (const aiAction of actions) {
    const result = executeAIAction(aiAction, dispatch, reduxActions)
    if (result.success) {
      // Dispatch the Redux action
      if ((result as any).action) {
        dispatch((result as any).action)
      }
      successCount++
    } else {
      failCount++
    }
    messages.push(result.message)
  }

  return { successCount, failCount, messages }
}

