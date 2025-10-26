/**
 * Response Parser
 * 解析 AI 的响应，提取可执行的操作
 */

import { AIAction, ComponentData } from '../types'
import { nanoid } from 'nanoid'

/**
 * 从 AI 响应中提取 action 代码块
 */
export const extractActions = (content: string): AIAction[] => {
  const actions: AIAction[] = []

  // 使用正则表达式匹配 ```action ... ``` 代码块
  const actionRegex = /```action\s*([\s\S]*?)```/g
  let match

  while ((match = actionRegex.exec(content)) !== null) {
    try {
      const actionJSON = match[1].trim()
      const action = JSON.parse(actionJSON) as AIAction

      // 验证 action 格式
      if (action.type && action.data) {
        actions.push(action)
      }
    } catch (error) {
      console.error('Failed to parse action:', match[1], error)
    }
  }

  return actions
}

/**
 * 清理 AI 响应中的 action 代码块（用于显示纯文本）
 */
export const removeActionBlocks = (content: string): string => {
  return content.replace(/```action\s*[\s\S]*?```/g, '').trim()
}

/**
 * 验证组件数据的完整性
 */
export const validateComponentData = (data: any): {
  valid: boolean
  errors: string[]
} => {
  const errors: string[] = []

  // 检查必需字段
  if (!data.type) {
    errors.push('缺少必需字段: type')
  }

  if (!data.title && data.type !== 'questionImage') {
    errors.push('缺少必需字段: title')
  }

  // 检查 fe_id 格式
  if (data.fe_id && !data.fe_id.startsWith('c_')) {
    errors.push('fe_id 格式不正确，应该以 c_ 开头')
  }

  // 确保有 fe_id（如果没有则生成）
  if (!data.fe_id) {
    data.fe_id = `c_${nanoid(8)}`
  }

  // 验证特定组件类型的必需属性
  switch (data.type) {
    case 'question-radio':
      if (!data.props?.options || !Array.isArray(data.props.options)) {
        errors.push('question-radio 必须包含 props.options 数组')
      }
      break

    case 'question-checkbox':
      if (!data.props?.list || !Array.isArray(data.props.list)) {
        errors.push('question-checkbox 必须包含 props.list 数组')
      }
      break

    case 'question-image':
      if (!data.props?.src) {
        errors.push('question-image 必须包含 props.src')
      }
      break
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

/**
 * 修复和标准化组件数据
 */
export const normalizeComponentData = (data: any): ComponentData => {
  // 确保有 fe_id
  if (!data.fe_id) {
    data.fe_id = `c_${nanoid(8)}`
  }

  // 确保有 props
  if (!data.props) {
    data.props = {}
  }

  // 根据组件类型设置默认值
  switch (data.type) {
    case 'question-input':
      data.props = {
        placeholder: '请输入内容',
        ...data.props,
      }
      break

    case 'question-textarea':
      data.props = {
        placeholder: '请输入内容...',
        ...data.props,
      }
      break

    case 'question-radio':
      if (!data.props.options) {
        data.props.options = []
      }
      data.props = {
        isVertical: false,
        ...data.props,
      }
      break

    case 'question-checkbox':
      if (!data.props.list) {
        data.props.list = []
      }
      break

    case 'question-title':
      data.props = {
        level: 1,
        isCenter: false,
        ...data.props,
      }
      // question-title 使用 text 而不是 title
      if (data.title && !data.text) {
        data.text = data.title
        delete data.title
      }
      break

    case 'question-paragraph':
      data.props = {
        isCenter: false,
        ...data.props,
      }
      // question-paragraph 使用 text 而不是 title
      if (data.title && !data.text) {
        data.text = data.title
        delete data.title
      }
      break
  }

  return data as ComponentData
}

/**
 * 解析完整的 AI 响应
 */
export const parseAIResponse = (
  content: string
): {
  text: string
  actions: AIAction[]
} => {
  const actions = extractActions(content)
  const text = removeActionBlocks(content)

  return {
    text,
    actions,
  }
}

/**
 * 格式化 action 为人类可读的描述
 */
export const formatActionDescription = (action: AIAction): string => {
  switch (action.type) {
    case 'add_component':
      return `添加${action.data.title || action.data.text || '组件'}`

    case 'update_component':
      return `修改${action.data.title || action.data.text || '组件'}`

    case 'delete_component':
      return `删除组件 ${action.data.fe_id}`

    case 'reorder_components':
      return '调整组件顺序'

    case 'generate_title':
      return '生成标题'

    case 'suggest_improvement':
      return '优化建议'

    default:
      return '执行操作'
  }
}

