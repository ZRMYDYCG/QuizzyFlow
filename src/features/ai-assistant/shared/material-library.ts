/**
 * 与 server/src/modules/ai-chat/shared/material-library.ts 保持同步
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
    propsSchema: { title: { type: 'string' }, placeholder: { type: 'string' } },
  },
  {
    type: 'question-textarea',
    label: '多行输入框',
    category: 'input',
    description: '长文本：意见、建议等',
    defaultProps: { title: '多行输入框标题', placeholder: '请输入内容...' },
    requiredProps: ['title'],
    propsSchema: { title: { type: 'string' }, placeholder: { type: 'string' } },
  },
  {
    type: 'question-number-input',
    label: '数字输入框',
    category: 'input',
    description: '数值输入',
    defaultProps: { title: '数字输入', placeholder: '请输入数字' },
    requiredProps: ['title'],
    propsSchema: { title: { type: 'string' } },
  },
  {
    type: 'question-password-input',
    label: '密码输入框',
    category: 'input',
    description: '密码输入',
    defaultProps: { title: '密码', placeholder: '请输入密码' },
    requiredProps: ['title'],
    propsSchema: { title: { type: 'string' } },
  },
  {
    type: 'question-email-input',
    label: '邮箱输入框',
    category: 'input',
    description: '邮箱格式',
    defaultProps: { title: '电子邮箱', placeholder: 'example@email.com' },
    requiredProps: ['title'],
    propsSchema: { title: { type: 'string' } },
  },
  {
    type: 'question-phone-input',
    label: '手机号输入框',
    category: 'input',
    description: '手机号',
    defaultProps: { title: '手机号码', placeholder: '请输入手机号' },
    requiredProps: ['title'],
    propsSchema: { title: { type: 'string' } },
  },
  {
    type: 'question-url-input',
    label: '网址输入框',
    category: 'input',
    description: 'URL',
    defaultProps: { title: '网址', placeholder: 'https://' },
    requiredProps: ['title'],
    propsSchema: { title: { type: 'string' } },
  },
  {
    type: 'question-mentions',
    label: '@提及输入',
    category: 'input',
    description: '@ 提及单行',
    defaultProps: { title: '@提及' },
    requiredProps: ['title'],
    propsSchema: { title: { type: 'string' }, options: { type: 'array' } },
  },
  {
    type: 'question-mention-textarea',
    label: '@提及多行',
    category: 'input',
    description: '@ 提及多行',
    defaultProps: { title: '@提及多行' },
    requiredProps: ['title'],
    propsSchema: { title: { type: 'string' } },
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
    description: '日期',
    defaultProps: { title: '日期', format: 'YYYY-MM-DD' },
    requiredProps: ['title'],
    propsSchema: { title: { type: 'string' } },
  },
  {
    type: 'question-time-picker',
    label: '时间选择',
    category: 'datetime',
    description: '时间',
    defaultProps: { title: '时间' },
    requiredProps: ['title'],
    propsSchema: { title: { type: 'string' } },
  },
  {
    type: 'question-week-picker',
    label: '周选择',
    category: 'datetime',
    description: '周',
    defaultProps: { title: '周' },
    requiredProps: ['title'],
    propsSchema: { title: { type: 'string' } },
  },
  {
    type: 'question-month-picker',
    label: '月份选择',
    category: 'datetime',
    description: '月',
    defaultProps: { title: '月份' },
    requiredProps: ['title'],
    propsSchema: { title: { type: 'string' } },
  },
  {
    type: 'question-year-picker',
    label: '年份选择',
    category: 'datetime',
    description: '年',
    defaultProps: { title: '年份' },
    requiredProps: ['title'],
    propsSchema: { title: { type: 'string' } },
  },
  {
    type: 'question-range-picker',
    label: '日期范围',
    category: 'datetime',
    description: '日期范围',
    defaultProps: { title: '日期范围' },
    requiredProps: ['title'],
    propsSchema: { title: { type: 'string' } },
  },
  {
    type: 'question-time-range-picker',
    label: '时间范围',
    category: 'datetime',
    description: '时间范围',
    defaultProps: { title: '时间范围' },
    requiredProps: ['title'],
    propsSchema: { title: { type: 'string' } },
  },
  {
    type: 'question-radio',
    label: '单选题',
    category: 'choice',
    description: '单选，props.options',
    defaultProps: {
      title: '单选题',
      isVertical: false,
      options: [
        { text: '选项1', value: 'option1' },
        { text: '选项2', value: 'option2' },
      ],
    },
    requiredProps: ['title', 'options'],
    propsSchema: { title: { type: 'string' }, options: { type: 'array' } },
  },
  {
    type: 'question-checkbox',
    label: '多选题',
    category: 'choice',
    description: '多选，props.list',
    defaultProps: {
      title: '多选题',
      list: [
        { text: '选项1', value: 'option1', checked: false },
        { text: '选项2', value: 'option2', checked: false },
      ],
    },
    requiredProps: ['title', 'list'],
    propsSchema: { title: { type: 'string' }, list: { type: 'array' } },
  },
  {
    type: 'question-select',
    label: '下拉选择',
    category: 'choice',
    description: '下拉',
    defaultProps: { title: '下拉选择', options: [] },
    requiredProps: ['title'],
    propsSchema: { title: { type: 'string' }, options: { type: 'array' } },
  },
  {
    type: 'question-cascader',
    label: '级联选择',
    category: 'choice',
    description: '级联',
    defaultProps: { title: '级联选择', options: [] },
    requiredProps: ['title'],
    propsSchema: { title: { type: 'string' }, options: { type: 'array' } },
  },
  {
    type: 'question-tree-select',
    label: '树形选择',
    category: 'choice',
    description: '树选择',
    defaultProps: { title: '树形选择', treeData: [] },
    requiredProps: ['title'],
    propsSchema: { title: { type: 'string' }, treeData: { type: 'array' } },
  },
  {
    type: 'question-autocomplete',
    label: '自动完成',
    category: 'choice',
    description: '联想输入',
    defaultProps: { title: '自动完成', options: [] },
    requiredProps: ['title'],
    propsSchema: { title: { type: 'string' }, options: { type: 'array' } },
  },
]

export function getMaterialLibraryJSON(): string {
  return JSON.stringify(
    MATERIAL_LIBRARY.map(
      ({ type, label, category, description, defaultProps, requiredProps, propsSchema }) => ({
        type,
        label,
        category,
        description,
        defaultProps,
        requiredProps,
        propsSchema,
      }),
    ),
    null,
    2,
  )
}
