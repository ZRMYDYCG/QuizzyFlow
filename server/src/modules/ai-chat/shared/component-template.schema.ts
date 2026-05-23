/**
 * 问卷组件 JSON Template 的 JSON Schema（供 Agent 与校验使用）
 */

import { SUPPORTED_COMPONENT_TYPES } from './material-library'

export const QUESTION_COMPONENT_JSON_SCHEMA = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  title: 'QuizzyFlowQuestionComponent',
  type: 'object',
  required: ['fe_id', 'type', 'title', 'props'],
  additionalProperties: false,
  properties: {
    fe_id: {
      type: 'string',
      minLength: 1,
      description: '画布上组件的唯一 ID，必须与当前问卷上下文中的 fe_id 完全一致',
    },
    type: {
      type: 'string',
      enum: SUPPORTED_COMPONENT_TYPES,
      description: '物料 type，kebab-case',
    },
    title: {
      type: 'string',
      description: '组件在画布上的标题/题目标识',
    },
    props: {
      type: 'object',
      description: '组件配置，字段因 type 而异，题目标题通常在 props.title',
    },
    isLocked: { type: 'boolean', default: false },
    isHidden: { type: 'boolean', default: false },
  },
} as const

export const COMPONENT_TEMPLATE_EXAMPLE = {
  fe_id: 'c_k2n3m4p5',
  type: 'question-input',
  title: '请输入您的姓名',
  props: {
    title: '请输入您的姓名',
    placeholder: '请输入真实姓名',
  },
  isLocked: false,
  isHidden: false,
}
