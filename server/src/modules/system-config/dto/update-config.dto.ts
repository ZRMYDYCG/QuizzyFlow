import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsObject,
  IsNumber,
  IsArray,
} from 'class-validator'

/**
 * 更新单个配置项 DTO
 */
export class UpdateConfigItemDto {
  @IsString()
  @IsNotEmpty()
  key: string

  @IsNotEmpty()
  value: any

  @IsString()
  @IsOptional()
  updatedBy?: string
}

/**
 * 批量更新配置 DTO
 */
export class BatchUpdateConfigDto {
  @IsArray()
  @IsNotEmpty()
  configs: UpdateConfigItemDto[]
}

/**
 * 基础设置 DTO
 */
export class BasicSettingsDto {
  @IsString()
  @IsOptional()
  'site.name'?: string

  @IsString()
  @IsOptional()
  'site.logo'?: string

  @IsString()
  @IsOptional()
  'site.favicon'?: string

  @IsString()
  @IsOptional()
  'site.description'?: string

  @IsString()
  @IsOptional()
  'site.keywords'?: string

  @IsString()
  @IsOptional()
  'site.copyright'?: string

  @IsString()
  @IsOptional()
  'site.icp'?: string

  @IsString()
  @IsOptional()
  'site.email'?: string

  @IsString()
  @IsOptional()
  'site.phone'?: string

  @IsString()
  @IsOptional()
  'site.address'?: string
}

/**
 * 功能开关 DTO
 */
export class FeatureSettingsDto {
  @IsBoolean()
  @IsOptional()
  'feature.register'?: boolean

  @IsBoolean()
  @IsOptional()
  'feature.emailVerification'?: boolean

  @IsBoolean()
  @IsOptional()
  'feature.questionReview'?: boolean

  @IsBoolean()
  @IsOptional()
  'feature.templateMarket'?: boolean

  @IsBoolean()
  @IsOptional()
  'feature.aiAssistant'?: boolean

  @IsBoolean()
  @IsOptional()
  'feature.comment'?: boolean
}

/**
 * 安全设置 DTO
 */
export class SecuritySettingsDto {
  @IsNumber()
  @IsOptional()
  'security.passwordMinLength'?: number

  @IsBoolean()
  @IsOptional()
  'security.passwordRequireUppercase'?: boolean

  @IsBoolean()
  @IsOptional()
  'security.passwordRequireNumber'?: boolean

  @IsBoolean()
  @IsOptional()
  'security.passwordRequireSpecialChar'?: boolean

  @IsNumber()
  @IsOptional()
  'security.loginMaxAttempts'?: number

  @IsNumber()
  @IsOptional()
  'security.loginLockDuration'?: number

  @IsNumber()
  @IsOptional()
  'security.jwtExpiresIn'?: number

  @IsBoolean()
  @IsOptional()
  'security.captchaEnabled'?: boolean

  @IsArray()
  @IsOptional()
  'security.ipWhitelist'?: string[]

  @IsArray()
  @IsOptional()
  'security.ipBlacklist'?: string[]
}

/**
 * 业务规则 DTO
 */
export class BusinessRulesDto {
  @IsNumber()
  @IsOptional()
  'business.maxQuestionsPerUser'?: number

  @IsNumber()
  @IsOptional()
  'business.maxComponentsPerQuestion'?: number

  @IsNumber()
  @IsOptional()
  'business.maxAnswersPerQuestion'?: number

  @IsNumber()
  @IsOptional()
  'business.uploadMaxSize'?: number

  @IsNumber()
  @IsOptional()
  'business.imageMaxWidth'?: number

  @IsNumber()
  @IsOptional()
  'business.imageMaxHeight'?: number
}

/**
 * 邮件配置 DTO
 */
export class EmailSettingsDto {
  @IsString()
  @IsOptional()
  'email.host'?: string

  @IsNumber()
  @IsOptional()
  'email.port'?: number

  @IsBoolean()
  @IsOptional()
  'email.secure'?: boolean

  @IsString()
  @IsOptional()
  'email.user'?: string

  @IsString()
  @IsOptional()
  'email.password'?: string

  @IsString()
  @IsOptional()
  'email.from'?: string

  @IsString()
  @IsOptional()
  'email.fromName'?: string
}

/**
 * 存储配置 DTO
 */
export class StorageSettingsDto {
  @IsString()
  @IsOptional()
  'storage.type'?: string // 'local' | 'aliyun' | 'qiniu' | 'tencent'

  @IsString()
  @IsOptional()
  'storage.aliyun.accessKeyId'?: string

  @IsString()
  @IsOptional()
  'storage.aliyun.accessKeySecret'?: string

  @IsString()
  @IsOptional()
  'storage.aliyun.bucket'?: string

  @IsString()
  @IsOptional()
  'storage.aliyun.region'?: string

  @IsString()
  @IsOptional()
  'storage.aliyun.domain'?: string

  @IsString()
  @IsOptional()
  'storage.qiniu.accessKey'?: string

  @IsString()
  @IsOptional()
  'storage.qiniu.secretKey'?: string

  @IsString()
  @IsOptional()
  'storage.qiniu.bucket'?: string

  @IsString()
  @IsOptional()
  'storage.qiniu.domain'?: string

  @IsString()
  @IsOptional()
  'storage.cdn.domain'?: string

  @IsBoolean()
  @IsOptional()
  'storage.cdn.enabled'?: boolean
}

