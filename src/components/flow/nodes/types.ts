import { Node } from 'reactflow'

// 节点类型枚举
export enum FlowNodeType {
  START = 'start',
  END = 'end',
  ACTION = 'action',
  CONDITION = 'condition',
  INPUT = 'input',
  OUTPUT = 'output',
  CUSTOM = 'custom',
}

// 节点数据接口
export interface BaseNodeData {
  label: string
  description?: string
}

export interface StartNodeData extends BaseNodeData {
  type: 'start'
}

export interface EndNodeData extends BaseNodeData {
  type: 'end'
}

export interface ActionNodeData extends BaseNodeData {
  type: 'action'
  actionType?: 'http' | 'email' | 'notify' | 'script'
  config?: Record<string, any>
}

export interface ConditionNodeData extends BaseNodeData {
  type: 'condition'
  condition?: string
  trueLabel?: string
  falseLabel?: string
}

export interface InputNodeData extends BaseNodeData {
  type: 'input'
  inputType?: 'form' | 'file' | 'api'
  schema?: Record<string, any>
}

export interface OutputNodeData extends BaseNodeData {
  type: 'output'
  outputType?: 'response' | 'file' | 'webhook'
  format?: string
}

export interface CustomNodeData extends BaseNodeData {
  type: 'custom'
  customType?: string
  config?: Record<string, any>
}

export type FlowNodeData =
  | StartNodeData
  | EndNodeData
  | ActionNodeData
  | ConditionNodeData
  | InputNodeData
  | OutputNodeData
  | CustomNodeData

export type FlowNode = Node<FlowNodeData>

// 节点颜色配置
export const NODE_COLORS = {
  start: {
    bg: 'bg-green-50 dark:bg-green-900/20',
    border: 'border-green-500',
    text: 'text-green-700 dark:text-green-300',
    icon: 'text-green-600 dark:text-green-400',
  },
  end: {
    bg: 'bg-red-50 dark:bg-red-900/20',
    border: 'border-red-500',
    text: 'text-red-700 dark:text-red-300',
    icon: 'text-red-600 dark:text-red-400',
  },
  action: {
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    border: 'border-blue-500',
    text: 'text-blue-700 dark:text-blue-300',
    icon: 'text-blue-600 dark:text-blue-400',
  },
  condition: {
    bg: 'bg-yellow-50 dark:bg-yellow-900/20',
    border: 'border-yellow-500',
    text: 'text-yellow-700 dark:text-yellow-300',
    icon: 'text-yellow-600 dark:text-yellow-400',
  },
  input: {
    bg: 'bg-indigo-50 dark:bg-indigo-900/20',
    border: 'border-indigo-500',
    text: 'text-indigo-700 dark:text-indigo-300',
    icon: 'text-indigo-600 dark:text-indigo-400',
  },
  output: {
    bg: 'bg-purple-50 dark:bg-purple-900/20',
    border: 'border-purple-500',
    text: 'text-purple-700 dark:text-purple-300',
    icon: 'text-purple-600 dark:text-purple-400',
  },
  custom: {
    bg: 'bg-gray-50 dark:bg-gray-800',
    border: 'border-gray-400',
    text: 'text-gray-700 dark:text-gray-300',
    icon: 'text-gray-600 dark:text-gray-400',
  },
} as const

