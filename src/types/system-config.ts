/**
 * 系统配置类型定义
 */

// 配置分类
export type ConfigCategory = 
  | 'basic'      // 基础设置
  | 'feature'    // 功能开关
  | 'security'   // 安全设置
  | 'business'   // 业务规则
  | 'email'      // 邮件配置
  | 'storage'    // 存储配置

// 配置值类型
export type ConfigValueType = 'string' | 'number' | 'boolean' | 'object' | 'array'

// 单个配置项
export interface SystemConfigItem {
  _id: string
  key: string
  value: any
  valueType: ConfigValueType
  name: string
  description: string
  category: ConfigCategory
  isPublic: boolean
  isEncrypted: boolean
  isActive: boolean
  isSystem: boolean
  validation?: {
    min?: number
    max?: number
    pattern?: string
    options?: string[]
  }
  sortOrder: number
  updatedBy: string
  createdAt: string
  updatedAt: string
}

// 按分类分组的配置
export interface GroupedConfigs {
  [category: string]: SystemConfigItem[]
}

// ==================== 基础设置 ====================

export interface BasicSettings {
  'site.name': string
  'site.logo': string
  'site.favicon': string
  'site.description': string
  'site.keywords': string
  'site.copyright': string
  'site.icp': string
  'site.email': string
  'site.phone': string
  'site.address': string
}

// ==================== 功能开关 ====================

export interface FeatureSettings {
  'feature.register': boolean
  'feature.emailVerification': boolean
  'feature.questionReview': boolean
  'feature.templateMarket': boolean
  'feature.aiAssistant': boolean
  'feature.comment': boolean
}

// ==================== 安全设置 ====================

export interface SecuritySettings {
  'security.passwordMinLength': number
  'security.passwordRequireUppercase': boolean
  'security.passwordRequireNumber': boolean
  'security.passwordRequireSpecialChar': boolean
  'security.loginMaxAttempts': number
  'security.loginLockDuration': number
  'security.jwtExpiresIn': number
  'security.captchaEnabled': boolean
  'security.ipWhitelist': string[]
  'security.ipBlacklist': string[]
}

// ==================== 业务规则 ====================

export interface BusinessRules {
  'business.maxQuestionsPerUser': number
  'business.maxComponentsPerQuestion': number
  'business.maxAnswersPerQuestion': number
  'business.uploadMaxSize': number
  'business.imageMaxWidth': number
  'business.imageMaxHeight': number
}

// ==================== 邮件配置 ====================

export interface EmailSettings {
  'email.host': string
  'email.port': number
  'email.secure': boolean
  'email.user': string
  'email.password': string
  'email.from': string
  'email.fromName': string
}

// ==================== 存储配置 ====================

export type StorageType = 'local' | 'aliyun' | 'qiniu' | 'tencent'

export interface StorageSettings {
  'storage.type': StorageType
  'storage.aliyun.accessKeyId': string
  'storage.aliyun.accessKeySecret': string
  'storage.aliyun.bucket': string
  'storage.aliyun.region': string
  'storage.aliyun.domain': string
  'storage.qiniu.accessKey': string
  'storage.qiniu.secretKey': string
  'storage.qiniu.bucket': string
  'storage.qiniu.domain': string
  'storage.cdn.enabled': boolean
  'storage.cdn.domain': string
}

// ==================== 所有配置的联合类型 ====================

export type AllSettings = 
  & BasicSettings 
  & FeatureSettings 
  & SecuritySettings 
  & BusinessRules 
  & EmailSettings 
  & StorageSettings

// ==================== 配置表单值 ====================

export interface ConfigFormValues {
  [key: string]: any
}

