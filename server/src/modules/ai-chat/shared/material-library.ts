/**
 * QuizzyFlow 物料库定义（与 src/components/material 保持同步）
 * 供 AI Agent 系统提示词与 JSON Schema 引用
 */

export type MaterialCategory =
  | 'input'
  | 'choice'
  | 'datetime'
  | 'advanced'

export interface MaterialDefinition {
  type: string
  label: string
  category: MaterialCategory
  description: string
  defaultProps: Record<string, unknown>
  requiredProps: string[]
  propsSchema: Record<string, unknown>
}

export const MATERIAL_LIBRARY: MaterialDefinition[] = [
  {
    type: 'question-input',
    label: '单行输入框',
    category: 'input',
    description: '短文本：姓名、邮箱、电话等',
    defaultProps: { title: '输入框标题', placeholder: '请输入内容...' },
    requiredProps: ['title'],
    propsSchema: {
      title: { type: 'string', description: '题目标题' },
      placeholder: { type: 'string' },
      disabled: { type: 'boolean' },
    },
  },
  {
    type: 'question-textarea',
    label: '多行输入框',
    category: 'input',
    description: '长文本：意见、建议、描述等',
    defaultProps: { title: '多行输入框标题', placeholder: '请输入内容...' },
    requiredProps: ['title'],
    propsSchema: {
      title: { type: 'string' },
      placeholder: { type: 'string' },
      disabled: { type: 'boolean' },
    },
  },
  {
    type: 'question-number-input',
    label: '数字输入框',
    category: 'input',
    description: '数值输入，可配置最小/最大值与步长',
    defaultProps: { title: '数字输入', placeholder: '请输入数字' },
    requiredProps: ['title'],
    propsSchema: {
      title: { type: 'string' },
      placeholder: { type: 'string' },
      min: { type: 'number' },
      max: { type: 'number' },
      step: { type: 'number' },
    },
  },
  {
    type: 'question-password-input',
    label: '密码输入框',
    category: 'input',
    description: '密码类输入',
    defaultProps: { title: '密码', placeholder: '请输入密码' },
    requiredProps: ['title'],
    propsSchema: { title: { type: 'string' }, placeholder: { type: 'string' } },
  },
  {
    type: 'question-email-input',
    label: '邮箱输入框',
    category: 'input',
    description: '电子邮箱格式校验',
    defaultProps: { title: '电子邮箱', placeholder: 'example@email.com' },
    requiredProps: ['title'],
    propsSchema: { title: { type: 'string' }, placeholder: { type: 'string' } },
  },
  {
    type: 'question-phone-input',
    label: '手机号输入框',
    category: 'input',
    description: '手机号码输入',
    defaultProps: { title: '手机号码', placeholder: '请输入手机号' },
    requiredProps: ['title'],
    propsSchema: { title: { type: 'string' }, placeholder: { type: 'string' } },
  },
  {
    type: 'question-url-input',
    label: '网址输入框',
    category: 'input',
    description: 'URL 链接输入',
    defaultProps: { title: '网址', placeholder: 'https://' },
    requiredProps: ['title'],
    propsSchema: { title: { type: 'string' }, placeholder: { type: 'string' } },
  },
  {
    type: 'question-mentions',
    label: '@提及输入',
    category: 'input',
    description: '带 @ 候选列表的单行输入',
    defaultProps: { title: '@提及', placeholder: '输入 @ 提及' },
    requiredProps: ['title'],
    propsSchema: {
      title: { type: 'string' },
      options: { type: 'array', items: { type: 'object' } },
    },
  },
  {
    type: 'question-mention-textarea',
    label: '@提及多行输入',
    category: 'input',
    description: '带 @ 候选的多行输入',
    defaultProps: { title: '@提及多行', placeholder: '请输入内容' },
    requiredProps: ['title'],
    propsSchema: { title: { type: 'string' }, options: { type: 'array' } },
  },
  {
    type: 'question-rate',
    label: '评分',
    category: 'advanced',
    description: '星级评分',
    defaultProps: { title: '评分', count: 5 },
    requiredProps: ['title'],
    propsSchema: { title: { type: 'string' }, count: { type: 'number' } },
  },
  {
    type: 'question-date',
    label: '日期选择',
    category: 'datetime',
    description: '选择日期',
    defaultProps: { title: '日期', format: 'YYYY-MM-DD' },
    requiredProps: ['title'],
    propsSchema: { title: { type: 'string' }, format: { type: 'string' } },
  },
  {
    type: 'question-time-picker',
    label: '时间选择',
    category: 'datetime',
    description: '选择时间',
    defaultProps: { title: '时间', format: 'HH:mm:ss' },
    requiredProps: ['title'],
    propsSchema: { title: { type: 'string' }, format: { type: 'string' } },
  },
  {
    type: 'question-week-picker',
    label: '周选择',
    category: 'datetime',
    description: '选择周',
    defaultProps: { title: '周', format: 'YYYY-wo' },
    requiredProps: ['title'],
    propsSchema: { title: { type: 'string' } },
  },
  {
    type: 'question-month-picker',
    label: '月份选择',
    category: 'datetime',
    description: '选择月份',
    defaultProps: { title: '月份', format: 'YYYY-MM' },
    requiredProps: ['title'],
    propsSchema: { title: { type: 'string' } },
  },
  {
    type: 'question-year-picker',
    label: '年份选择',
    category: 'datetime',
    description: '选择年份',
    defaultProps: { title: '年份', format: 'YYYY' },
    requiredProps: ['title'],
    propsSchema: { title: { type: 'string' } },
  },
  {
    type: 'question-range-picker',
    label: '日期范围',
    category: 'datetime',
    description: '选择起止日期',
    defaultProps: { title: '日期范围' },
    requiredProps: ['title'],
    propsSchema: { title: { type: 'string' } },
  },
  {
    type: 'question-time-range-picker',
    label: '时间范围',
    category: 'datetime',
    description: '选择起止时间',
    defaultProps: { title: '时间范围' },
    requiredProps: ['title'],
    propsSchema: { title: { type: 'string' } },
  },
  {
    type: 'question-radio',
    label: '单选题',
    category: 'choice',
    description: '单项选择，options 为选项列表',
    defaultProps: {
      title: '单选题标题',
      isVertical: false,
      options: [
        { text: '选项1', value: 'option1' },
        { text: '选项2', value: 'option2' },
      ],
    },
    requiredProps: ['title', 'options'],
    propsSchema: {
      title: { type: 'string' },
      isVertical: { type: 'boolean' },
      options: {
        type: 'array',
        items: {
          type: 'object',
          properties: { text: { type: 'string' }, value: { type: 'string' } },
          required: ['text', 'value'],
        },
      },
    },
  },
  {
    type: 'question-checkbox',
    label: '多选题',
    category: 'choice',
    description: '多项选择，list 为选项列表（含 checked）',
    defaultProps: {
      title: '多选题标题',
      list: [
        { text: '选项1', value: 'option1', checked: false },
        { text: '选项2', value: 'option2', checked: false },
      ],
    },
    requiredProps: ['title', 'list'],
    propsSchema: {
      title: { type: 'string' },
      list: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            text: { type: 'string' },
            value: { type: 'string' },
            checked: { type: 'boolean' },
          },
        },
      },
    },
  },
  {
    type: 'question-select',
    label: '下拉选择',
    category: 'choice',
    description: '下拉单选/多选',
    defaultProps: {
      title: '下拉选择',
      options: [
        { label: '选项1', value: '1' },
        { label: '选项2', value: '2' },
      ],
    },
    requiredProps: ['title', 'options'],
    propsSchema: {
      title: { type: 'string' },
      options: { type: 'array' },
      mode: { type: 'string', enum: ['single', 'multiple'] },
    },
  },
  {
    type: 'question-cascader',
    label: '级联选择',
    category: 'choice',
    description: '省市区等级联',
    defaultProps: { title: '级联选择', options: [] },
    requiredProps: ['title'],
    propsSchema: { title: { type: 'string' }, options: { type: 'array' } },
  },
  {
    type: 'question-tree-select',
    label: '树形选择',
    category: 'choice',
    description: '树形结构多选/单选',
    defaultProps: { title: '树形选择', treeData: [] },
    requiredProps: ['title'],
    propsSchema: { title: { type: 'string' }, treeData: { type: 'array' } },
  },
  {
    type: 'question-autocomplete',
    label: '自动完成',
    category: 'choice',
    description: '输入联想补全',
    defaultProps: { title: '自动完成', options: [] },
    requiredProps: ['title'],
    propsSchema: { title: { type: 'string' }, options: { type: 'array' } },
  },
]

export const SUPPORTED_COMPONENT_TYPES = MATERIAL_LIBRARY.map((m) => m.type)

export function getMaterialByType(type: string): MaterialDefinition | undefined {
  return MATERIAL_LIBRARY.find((m) => m.type === type)
}

export function getMaterialLibraryJSON(): string {
  return JSON.stringify(
    MATERIAL_LIBRARY.map(({ type, label, category, description, defaultProps, requiredProps, propsSchema }) => ({
      type,
      label,
      category,
      description,
      defaultProps,
      requiredProps,
      propsSchema,
    })),
    null,
    2,
  )
}

/** Agent 提示词用精简物料表，减少输入 token */
export function getCompactMaterialLibraryJSON(): string {
  return JSON.stringify(
    MATERIAL_LIBRARY.map(({ type, label, description, defaultProps, requiredProps }) => ({
      type,
      label,
      description,
      defaultProps,
      requiredProps,
    })),
  )
}
