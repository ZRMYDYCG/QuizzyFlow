/**
 * Component Library Schema
 * QuizzyFlow 组件库的完整定义，供 AI 理解和使用
 */

import { ComponentDefinition } from '../types'

export const COMPONENT_LIBRARY: ComponentDefinition[] = [
  // ==================== 输入类组件 ====================
  {
    type: 'question-input',
    label: '单行输入框',
    category: 'input',
    description: '用于收集短文本信息，如姓名、邮箱、电话等',
    defaultProps: {
      title: '输入框标题',
      placeholder: '请输入内容',
    },
    requiredProps: ['title'],
    examples: [
      {
        scenario: '收集用户姓名',
        config: {
          title: '请输入您的姓名',
          placeholder: '请输入真实姓名',
        },
      },
      {
        scenario: '收集电子邮箱',
        config: {
          title: '电子邮箱',
          placeholder: 'example@email.com',
        },
      },
    ],
  },
  {
    type: 'question-textarea',
    label: '多行输入框',
    category: 'input',
    description: '用于收集较长的文本内容，如意见、建议等',
    defaultProps: {
      title: '多行输入框标题',
      placeholder: '请输入内容...',
    },
    requiredProps: ['title'],
    examples: [
      {
        scenario: '收集用户反馈',
        config: {
          title: '您对我们的产品有什么建议？',
          placeholder: '请详细描述您的想法...',
        },
      },
    ],
  },

  // ==================== 选择类组件 ====================
  {
    type: 'question-radio',
    label: '单选题',
    category: 'choice',
    description: '单项选择题，用户只能选择一个选项',
    defaultProps: {
      title: '单选题标题',
      isVertical: false,
      options: [
        { text: '选项1', value: 'option1' },
        { text: '选项2', value: 'option2' },
      ],
    },
    requiredProps: ['title', 'options'],
    examples: [
      {
        scenario: '性别选择',
        config: {
          title: '您的性别是？',
          options: [
            { text: '男', value: 'male' },
            { text: '女', value: 'female' },
          ],
        },
      },
      {
        scenario: '满意度调查',
        config: {
          title: '您对我们的服务满意吗？',
          options: [
            { text: '非常满意', value: '5' },
            { text: '满意', value: '4' },
            { text: '一般', value: '3' },
            { text: '不满意', value: '2' },
            { text: '非常不满意', value: '1' },
          ],
        },
      },
    ],
  },
  {
    type: 'question-checkbox',
    label: '多选题',
    category: 'choice',
    description: '多项选择题，用户可以选择多个选项',
    defaultProps: {
      title: '多选题标题',
      list: [
        { text: '选项1', value: 'option1', checked: false },
        { text: '选项2', value: 'option2', checked: false },
      ],
    },
    requiredProps: ['title', 'list'],
    examples: [
      {
        scenario: '兴趣爱好调查',
        config: {
          title: '您的兴趣爱好有哪些？（可多选）',
          list: [
            { text: '运动健身', value: 'sports', checked: false },
            { text: '阅读写作', value: 'reading', checked: false },
            { text: '音乐艺术', value: 'music', checked: false },
            { text: '旅游摄影', value: 'travel', checked: false },
          ],
        },
      },
    ],
  },

  // ==================== 展示类组件 ====================
  {
    type: 'question-title',
    label: '标题',
    category: 'display',
    description: '用于显示问卷标题或章节标题',
    defaultProps: {
      text: '标题内容',
      level: 1,
      isCenter: false,
    },
    requiredProps: ['text'],
    examples: [
      {
        scenario: '问卷主标题',
        config: {
          text: '用户满意度调查问卷',
          level: 1,
          isCenter: true,
        },
      },
    ],
  },
  {
    type: 'question-paragraph',
    label: '段落说明',
    category: 'display',
    description: '用于显示说明文字或描述信息',
    defaultProps: {
      text: '段落内容',
      isCenter: false,
    },
    requiredProps: ['text'],
    examples: [
      {
        scenario: '问卷说明',
        config: {
          text: '感谢您参与本次调查，您的意见对我们非常重要。本问卷大约需要 5 分钟完成。',
          isCenter: false,
        },
      },
    ],
  },
  {
    type: 'question-image',
    label: '图片',
    category: 'display',
    description: '用于展示图片内容',
    defaultProps: {
      src: '',
      alt: '图片描述',
    },
    requiredProps: ['src'],
    examples: [
      {
        scenario: '产品图片展示',
        config: {
          src: 'https://example.com/product.jpg',
          alt: '产品效果图',
        },
      },
    ],
  },

  // ==================== 高级组件 ====================
  {
    type: 'question-upload',
    label: '文件上传',
    category: 'advanced',
    description: '允许用户上传文件',
    defaultProps: {
      title: '文件上传',
      maxSize: 10,
      accept: '*',
    },
    requiredProps: ['title'],
    examples: [
      {
        scenario: '简历上传',
        config: {
          title: '请上传您的简历',
          accept: '.pdf,.doc,.docx',
          maxSize: 5,
        },
      },
    ],
  },
  {
    type: 'question-date',
    label: '日期选择',
    category: 'advanced',
    description: '用于选择日期',
    defaultProps: {
      title: '日期选择',
      format: 'YYYY-MM-DD',
    },
    requiredProps: ['title'],
    examples: [
      {
        scenario: '生日选择',
        config: {
          title: '请选择您的出生日期',
          format: 'YYYY-MM-DD',
        },
      },
    ],
  },
  {
    type: 'question-slider',
    label: '滑动条',
    category: 'advanced',
    description: '用于在范围内选择数值',
    defaultProps: {
      title: '滑动条',
      min: 0,
      max: 100,
      step: 1,
    },
    requiredProps: ['title'],
    examples: [
      {
        scenario: '价格预算调查',
        config: {
          title: '您的预算范围是？',
          min: 0,
          max: 10000,
          step: 100,
        },
      },
    ],
  },
  {
    type: 'question-rate',
    label: '评分',
    category: 'advanced',
    description: '星级评分组件',
    defaultProps: {
      title: '评分',
      count: 5,
    },
    requiredProps: ['title'],
    examples: [
      {
        scenario: '服务评分',
        config: {
          title: '请为我们的服务打分',
          count: 5,
        },
      },
    ],
  },
]

/**
 * 获取组件定义
 */
export const getComponentDefinition = (type: string): ComponentDefinition | undefined => {
  return COMPONENT_LIBRARY.find((comp) => comp.type === type)
}

/**
 * 获取所有组件类型
 */
export const getAllComponentTypes = (): string[] => {
  return COMPONENT_LIBRARY.map((comp) => comp.type)
}

/**
 * 按分类获取组件
 */
export const getComponentsByCategory = (
  category: ComponentDefinition['category']
): ComponentDefinition[] => {
  return COMPONENT_LIBRARY.filter((comp) => comp.category === category)
}

/**
 * 生成组件库的 JSON 字符串（用于 AI prompt）
 */
export const getComponentLibraryJSON = (): string => {
  return JSON.stringify(
    COMPONENT_LIBRARY.map((comp) => ({
      type: comp.type,
      label: comp.label,
      category: comp.category,
      description: comp.description,
      defaultProps: comp.defaultProps,
      examples: comp.examples,
    })),
    null,
    2
  )
}

