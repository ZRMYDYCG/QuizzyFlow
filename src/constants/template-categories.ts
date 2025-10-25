/**
 * 模板市场 - 分类和配置系统
 */

// 模板分类枚举
export enum TemplateCategory {
  ALL = 'all',                    // 全部
  BUSINESS = 'business',          // 商业营销
  EDUCATION = 'education',        // 教育培训
  RESEARCH = 'research',          // 学术研究
  HR = 'hr',                      // 人力资源
  EVENT = 'event',                // 活动管理
  FEEDBACK = 'feedback',          // 反馈收集
  MEDICAL = 'medical',            // 医疗健康
  CUSTOM = 'custom',              // 自定义
}

// 分类配置接口
export interface TemplateCategoryConfig {
  key: TemplateCategory
  label: string
  description: string
  icon: string           // Lucide icon name
  color: string          // 主题色
  bgGradient: string     // 背景渐变
  emoji: string          // Emoji 图标
  tags: string[]         // 常用标签
}

// 分类配置数据
export const TEMPLATE_CATEGORIES: Record<TemplateCategory, TemplateCategoryConfig> = {
  [TemplateCategory.ALL]: {
    key: TemplateCategory.ALL,
    label: '全部模板',
    description: '浏览所有可用模板',
    icon: 'Grid3x3',
    color: '#6366f1',
    bgGradient: 'from-indigo-500 to-purple-500',
    emoji: '📦',
    tags: [],
  },
  
  [TemplateCategory.BUSINESS]: {
    key: TemplateCategory.BUSINESS,
    label: '商业营销',
    description: '市场调研、客户反馈、产品调查',
    icon: 'TrendingUp',
    color: '#3b82f6',
    bgGradient: 'from-blue-500 to-cyan-500',
    emoji: '💼',
    tags: ['市场调研', '客户满意度', '产品体验', '品牌认知'],
  },
  
  [TemplateCategory.EDUCATION]: {
    key: TemplateCategory.EDUCATION,
    label: '教育培训',
    description: '课程评估、学生反馈、培训考核',
    icon: 'GraduationCap',
    color: '#8b5cf6',
    bgGradient: 'from-violet-500 to-purple-500',
    emoji: '🎓',
    tags: ['课程评价', '学习反馈', '知识测验', '培训效果'],
  },
  
  [TemplateCategory.RESEARCH]: {
    key: TemplateCategory.RESEARCH,
    label: '学术研究',
    description: '问卷调查、数据收集、研究分析',
    icon: 'FlaskConical',
    color: '#06b6d4',
    bgGradient: 'from-cyan-500 to-teal-500',
    emoji: '🔬',
    tags: ['社会调查', '数据收集', '研究问卷', '统计分析'],
  },
  
  [TemplateCategory.HR]: {
    key: TemplateCategory.HR,
    label: '人力资源',
    description: '员工调查、绩效评估、招聘面试',
    icon: 'Users',
    color: '#f59e0b',
    bgGradient: 'from-amber-500 to-orange-500',
    emoji: '👥',
    tags: ['员工满意度', '绩效考核', '入职调查', '离职面谈'],
  },
  
  [TemplateCategory.EVENT]: {
    key: TemplateCategory.EVENT,
    label: '活动管理',
    description: '活动报名、签到登记、满意度调查',
    icon: 'CalendarCheck',
    color: '#ec4899',
    bgGradient: 'from-pink-500 to-rose-500',
    emoji: '🎉',
    tags: ['活动报名', '会议签到', '活动反馈', '嘉宾登记'],
  },
  
  [TemplateCategory.FEEDBACK]: {
    key: TemplateCategory.FEEDBACK,
    label: '反馈收集',
    description: '用户反馈、建议征集、问题报告',
    icon: 'MessageSquare',
    color: '#10b981',
    bgGradient: 'from-emerald-500 to-green-500',
    emoji: '💬',
    tags: ['用户反馈', '产品建议', 'Bug反馈', '功能需求'],
  },
  
  [TemplateCategory.MEDICAL]: {
    key: TemplateCategory.MEDICAL,
    label: '医疗健康',
    description: '健康调查、患者反馈、体检登记',
    icon: 'Heart',
    color: '#ef4444',
    bgGradient: 'from-red-500 to-pink-500',
    emoji: '🏥',
    tags: ['健康问卷', '症状记录', '满意度调查', '体检预约'],
  },
  
  [TemplateCategory.CUSTOM]: {
    key: TemplateCategory.CUSTOM,
    label: '自定义',
    description: '用户创建的自定义模板',
    icon: 'Sparkles',
    color: '#64748b',
    bgGradient: 'from-slate-500 to-gray-500',
    emoji: '✨',
    tags: ['自定义', '个性化', '创意'],
  },
}

// 获取分类配置
export function getCategoryConfig(category: TemplateCategory): TemplateCategoryConfig {
  return TEMPLATE_CATEGORIES[category] || TEMPLATE_CATEGORIES[TemplateCategory.ALL]
}

// 获取所有分类（排除ALL）
export function getAllCategories(): TemplateCategoryConfig[] {
  return Object.values(TEMPLATE_CATEGORIES).filter(cat => cat.key !== TemplateCategory.ALL)
}

// 模板标签配置
export const POPULAR_TAGS = [
  '热门推荐',
  '新手友好',
  '专业版',
  '简约风格',
  '多页问卷',
  '快速上手',
  '数据分析',
  '移动优先',
  '高级功能',
  '企业级',
]

// 排序选项
export enum TemplateSortBy {
  LATEST = 'latest',        // 最新
  POPULAR = 'popular',      // 最热
  MOST_USED = 'most_used',  // 最多使用
  HIGHEST_RATED = 'rated',  // 评分最高
}

export const SORT_OPTIONS = [
  { value: TemplateSortBy.POPULAR, label: '最热门', icon: 'TrendingUp' },
  { value: TemplateSortBy.LATEST, label: '最新', icon: 'Clock' },
  { value: TemplateSortBy.MOST_USED, label: '最多使用', icon: 'Users' },
  { value: TemplateSortBy.HIGHEST_RATED, label: '评分最高', icon: 'Star' },
]

