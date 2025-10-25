/**
 * 问卷类型配置
 * 按业务场景分类
 */

// 问卷类型枚举
export enum QuestionnaireType {
  // 信息收集类
  SURVEY = 'survey',              // 调查问卷
  FEEDBACK = 'feedback',          // 反馈表单
  REGISTRATION = 'registration',  // 报名表单
  APPLICATION = 'application',    // 申请表单
  
  // 测评考试类
  EXAM = 'exam',                  // 考试测验
  QUIZ = 'quiz',                  // 趣味测试
  ASSESSMENT = 'assessment',      // 能力评估
  
  // 投票表决类
  VOTE = 'vote',                  // 投票选举
  POLL = 'poll',                  // 民意调查
  
  // 数据记录类
  FORM = 'form',                  // 通用表单
  ORDER = 'order',                // 订单表单
  CHECKLIST = 'checklist',        // 检查清单
  
  // 互动营销类
  LOTTERY = 'lottery',            // 抽奖活动
  GAME = 'game',                  // 互动游戏
}

// 问卷类型配置接口
export interface QuestionnaireTypeConfig {
  type: QuestionnaireType
  label: string           // 显示名称
  description: string     // 描述
  icon: string           // 图标名称（lucide-react）
  color: string          // 主题色
  bgColor: string        // 背景色
  features: string[]     // 支持的特性
  defaultSettings: {     // 默认设置
    allowAnonymous?: boolean    // 允许匿名
    showProgress?: boolean      // 显示进度
    allowEdit?: boolean         // 允许修改答案
    needLogin?: boolean         // 需要登录
    timeLimit?: number          // 时间限制（秒）
    showResult?: boolean        // 显示结果
    randomOrder?: boolean       // 随机题序
  }
  category: 'collect' | 'test' | 'vote' | 'record' | 'interactive'  // 分组
}

// 问卷类型配置数据
export const QUESTIONNAIRE_TYPES: Record<QuestionnaireType, QuestionnaireTypeConfig> = {
  // ==================== 信息收集类 ====================
  [QuestionnaireType.SURVEY]: {
    type: QuestionnaireType.SURVEY,
    label: '调查问卷',
    description: '用于市场调研、用户研究、满意度调查等场景',
    icon: 'FileText',
    color: '#1890ff',
    bgColor: '#e6f7ff',
    features: ['匿名提交', '数据统计', '分页显示', '导出报告'],
    defaultSettings: {
      allowAnonymous: true,
      showProgress: true,
      allowEdit: false,
      needLogin: false,
      showResult: false,
      randomOrder: false,
    },
    category: 'collect',
  },
  
  [QuestionnaireType.FEEDBACK]: {
    type: QuestionnaireType.FEEDBACK,
    label: '反馈表单',
    description: '收集产品反馈、客户投诉、建议意见',
    icon: 'MessageSquare',
    color: '#52c41a',
    bgColor: '#f6ffed',
    features: ['开放式问题', '附件上传', '优先级标记', '跟进处理'],
    defaultSettings: {
      allowAnonymous: true,
      showProgress: false,
      allowEdit: true,
      needLogin: false,
      showResult: false,
      randomOrder: false,
    },
    category: 'collect',
  },
  
  [QuestionnaireType.REGISTRATION]: {
    type: QuestionnaireType.REGISTRATION,
    label: '报名表单',
    description: '活动报名、课程注册、会议签到',
    icon: 'UserPlus',
    color: '#722ed1',
    bgColor: '#f9f0ff',
    features: ['实名认证', '限额控制', '短信通知', '二维码签到'],
    defaultSettings: {
      allowAnonymous: false,
      showProgress: true,
      allowEdit: true,
      needLogin: true,
      showResult: false,
      randomOrder: false,
    },
    category: 'collect',
  },
  
  [QuestionnaireType.APPLICATION]: {
    type: QuestionnaireType.APPLICATION,
    label: '申请表单',
    description: '求职申请、入学申请、项目申请',
    icon: 'FileCheck',
    color: '#fa8c16',
    bgColor: '#fff7e6',
    features: ['多步骤流程', '文件上传', '审核流程', '状态跟踪'],
    defaultSettings: {
      allowAnonymous: false,
      showProgress: true,
      allowEdit: true,
      needLogin: true,
      showResult: false,
      randomOrder: false,
    },
    category: 'collect',
  },
  
  // ==================== 测评考试类 ====================
  [QuestionnaireType.EXAM]: {
    type: QuestionnaireType.EXAM,
    label: '考试测验',
    description: '在线考试、入职测试、认证考试',
    icon: 'GraduationCap',
    color: '#f5222d',
    bgColor: '#fff1f0',
    features: ['计时功能', '自动评分', '防作弊', '成绩分析'],
    defaultSettings: {
      allowAnonymous: false,
      showProgress: true,
      allowEdit: false,
      needLogin: true,
      timeLimit: 3600,
      showResult: true,
      randomOrder: true,
    },
    category: 'test',
  },
  
  [QuestionnaireType.QUIZ]: {
    type: QuestionnaireType.QUIZ,
    label: '趣味测试',
    description: '性格测试、趣味问答、知识竞赛',
    icon: 'Sparkles',
    color: '#eb2f96',
    bgColor: '#fff0f6',
    features: ['娱乐性', '结果分析', '社交分享', '排行榜'],
    defaultSettings: {
      allowAnonymous: true,
      showProgress: true,
      allowEdit: false,
      needLogin: false,
      showResult: true,
      randomOrder: false,
    },
    category: 'test',
  },
  
  [QuestionnaireType.ASSESSMENT]: {
    type: QuestionnaireType.ASSESSMENT,
    label: '能力评估',
    description: '360度评估、技能测评、员工评价',
    icon: 'BarChart3',
    color: '#13c2c2',
    bgColor: '#e6fffb',
    features: ['多维度评分', '雷达图分析', '对比报告', '匿名评价'],
    defaultSettings: {
      allowAnonymous: true,
      showProgress: true,
      allowEdit: false,
      needLogin: true,
      showResult: true,
      randomOrder: false,
    },
    category: 'test',
  },
  
  // ==================== 投票表决类 ====================
  [QuestionnaireType.VOTE]: {
    type: QuestionnaireType.VOTE,
    label: '投票选举',
    description: '评选活动、民主决策、选举投票',
    icon: 'Vote',
    color: '#52c41a',
    bgColor: '#f6ffed',
    features: ['一人一票', '实时统计', '结果公示', '防刷票'],
    defaultSettings: {
      allowAnonymous: false,
      showProgress: false,
      allowEdit: false,
      needLogin: true,
      showResult: true,
      randomOrder: false,
    },
    category: 'vote',
  },
  
  [QuestionnaireType.POLL]: {
    type: QuestionnaireType.POLL,
    label: '民意调查',
    description: '快速投票、意见征集',
    icon: 'PieChart',
    color: '#1890ff',
    bgColor: '#e6f7ff',
    features: ['快速投票', '即时结果', '图表展示'],
    defaultSettings: {
      allowAnonymous: true,
      showProgress: false,
      allowEdit: false,
      needLogin: false,
      showResult: true,
      randomOrder: false,
    },
    category: 'vote',
  },
  
  // ==================== 数据记录类 ====================
  [QuestionnaireType.FORM]: {
    type: QuestionnaireType.FORM,
    label: '通用表单',
    description: '信息登记、资料收集、数据录入',
    icon: 'FileText',
    color: '#595959',
    bgColor: '#fafafa',
    features: ['灵活自定义', '数据导出', '批量导入'],
    defaultSettings: {
      allowAnonymous: false,
      showProgress: false,
      allowEdit: true,
      needLogin: false,
      showResult: false,
      randomOrder: false,
    },
    category: 'record',
  },
  
  [QuestionnaireType.ORDER]: {
    type: QuestionnaireType.ORDER,
    label: '订单表单',
    description: '商品预约、服务预订、在线订购',
    icon: 'ShoppingCart',
    color: '#fa541c',
    bgColor: '#fff2e8',
    features: ['价格计算', '库存管理', '支付对接', '订单确认'],
    defaultSettings: {
      allowAnonymous: false,
      showProgress: true,
      allowEdit: true,
      needLogin: true,
      showResult: false,
      randomOrder: false,
    },
    category: 'record',
  },
  
  [QuestionnaireType.CHECKLIST]: {
    type: QuestionnaireType.CHECKLIST,
    label: '检查清单',
    description: '安全巡检、质量检查、审核评估',
    icon: 'ClipboardCheck',
    color: '#2f54eb',
    bgColor: '#f0f5ff',
    features: ['选项检查', '拍照记录', '位置定位', '检查报告'],
    defaultSettings: {
      allowAnonymous: false,
      showProgress: true,
      allowEdit: false,
      needLogin: true,
      showResult: false,
      randomOrder: false,
    },
    category: 'record',
  },
  
  // ==================== 互动营销类 ====================
  [QuestionnaireType.LOTTERY]: {
    type: QuestionnaireType.LOTTERY,
    label: '抽奖活动',
    description: '营销活动、用户拉新、促销抽奖',
    icon: 'Gift',
    color: '#fa8c16',
    bgColor: '#fff7e6',
    features: ['概率设置', '奖品管理', '中奖通知', '防作弊'],
    defaultSettings: {
      allowAnonymous: false,
      showProgress: false,
      allowEdit: false,
      needLogin: true,
      showResult: true,
      randomOrder: false,
    },
    category: 'interactive',
  },
  
  [QuestionnaireType.GAME]: {
    type: QuestionnaireType.GAME,
    label: '互动游戏',
    description: '答题闯关、知识竞赛、趣味挑战',
    icon: 'Gamepad2',
    color: '#eb2f96',
    bgColor: '#fff0f6',
    features: ['游戏化', '积分系统', '排行榜', '成就徽章'],
    defaultSettings: {
      allowAnonymous: false,
      showProgress: true,
      allowEdit: false,
      needLogin: true,
      timeLimit: 600,
      showResult: true,
      randomOrder: true,
    },
    category: 'interactive',
  },
}

// 分组配置
export const QUESTIONNAIRE_CATEGORIES = {
  collect: {
    key: 'collect',
    label: '信息收集',
    description: '收集用户信息、反馈和申请',
    icon: 'Inbox',
  },
  test: {
    key: 'test',
    label: '测评考试',
    description: '考试测验、能力评估',
    icon: 'GraduationCap',
  },
  vote: {
    key: 'vote',
    label: '投票表决',
    description: '投票选举、民意调查',
    icon: 'Vote',
  },
  record: {
    key: 'record',
    label: '数据记录',
    description: '表单登记、订单管理',
    icon: 'Database',
  },
  interactive: {
    key: 'interactive',
    label: '互动营销',
    description: '抽奖活动、互动游戏',
    icon: 'Zap',
  },
} as const

// 获取类型配置
export function getQuestionnaireTypeConfig(type: QuestionnaireType): QuestionnaireTypeConfig {
  return QUESTIONNAIRE_TYPES[type] || QUESTIONNAIRE_TYPES[QuestionnaireType.FORM]
}

// 获取类型标签
export function getQuestionnaireTypeLabel(type: QuestionnaireType): string {
  return QUESTIONNAIRE_TYPES[type]?.label || '未知类型'
}

// 获取分组下的类型列表
export function getTypesByCategory(category: keyof typeof QUESTIONNAIRE_CATEGORIES): QuestionnaireType[] {
  return Object.values(QUESTIONNAIRE_TYPES)
    .filter(config => config.category === category)
    .map(config => config.type)
}

// MVP 版本推荐类型（6个核心类型）
export const MVP_RECOMMENDED_TYPES: QuestionnaireType[] = [
  QuestionnaireType.SURVEY,        // 调查问卷 - 最通用
  QuestionnaireType.EXAM,          // 考试测验
  QuestionnaireType.VOTE,          // 投票选举
  QuestionnaireType.REGISTRATION,  // 报名表单
  QuestionnaireType.FEEDBACK,      // 反馈表单
  QuestionnaireType.FORM,          // 通用表单 - 兜底
]

