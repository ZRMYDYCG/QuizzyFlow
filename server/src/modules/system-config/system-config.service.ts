import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import {
  SystemConfig,
  SystemConfigDocument,
} from './schemas/system-config.schema'
import { UpdateConfigItemDto, BatchUpdateConfigDto } from './dto/update-config.dto'
import { QueryConfigDto } from './dto/query-config.dto'
import * as crypto from 'crypto'

@Injectable()
export class SystemConfigService {
  // 加密密钥（生产环境应该从环境变量读取）
  private readonly ENCRYPTION_KEY =
    process.env.CONFIG_ENCRYPTION_KEY || 'quizzyflow-secret-key-32bytes!'
  private readonly ALGORITHM = 'aes-256-cbc'

  constructor(
    @InjectModel(SystemConfig.name)
    private systemConfigModel: Model<SystemConfigDocument>,
  ) {}

  /**
   * 初始化默认配置
   */
  async initializeDefaultConfig() {
    const defaultConfigs = [
      // 基础设置
      {
        key: 'site.name',
        value: 'QuizzyFlow',
        valueType: 'string',
        name: '网站名称',
        description: '显示在浏览器标题和网站头部的名称',
        category: 'basic',
        isPublic: true,
        isSystem: true,
        sortOrder: 1,
      },
      {
        key: 'site.logo',
        value: '/logo.png',
        valueType: 'string',
        name: '网站Logo',
        description: '网站Logo图片URL',
        category: 'basic',
        isPublic: true,
        isSystem: true,
        sortOrder: 2,
      },
      {
        key: 'site.favicon',
        value: '/favicon.ico',
        valueType: 'string',
        name: '网站图标',
        description: '浏览器标签页图标',
        category: 'basic',
        isPublic: true,
        isSystem: true,
        sortOrder: 3,
      },
      {
        key: 'site.description',
        value: '简单易用的问卷调查平台',
        valueType: 'string',
        name: '网站描述',
        description: 'SEO描述',
        category: 'basic',
        isPublic: true,
        isSystem: true,
        sortOrder: 4,
      },
      {
        key: 'site.keywords',
        value: '问卷,调查,表单,QuizzyFlow',
        valueType: 'string',
        name: '网站关键词',
        description: 'SEO关键词',
        category: 'basic',
        isPublic: true,
        isSystem: true,
        sortOrder: 5,
      },
      {
        key: 'site.copyright',
        value: '© 2025 QuizzyFlow. All rights reserved.',
        valueType: 'string',
        name: '版权信息',
        description: '页脚版权信息',
        category: 'basic',
        isPublic: true,
        isSystem: true,
        sortOrder: 6,
      },
      {
        key: 'site.icp',
        value: '',
        valueType: 'string',
        name: 'ICP备案号',
        description: '网站备案号',
        category: 'basic',
        isPublic: true,
        isSystem: true,
        sortOrder: 7,
      },
      {
        key: 'site.email',
        value: 'contact@quizzyflow.com',
        valueType: 'string',
        name: '联系邮箱',
        description: '网站联系邮箱',
        category: 'basic',
        isPublic: true,
        isSystem: true,
        sortOrder: 8,
      },
      {
        key: 'site.phone',
        value: '',
        valueType: 'string',
        name: '联系电话',
        description: '网站联系电话',
        category: 'basic',
        isPublic: true,
        isSystem: true,
        sortOrder: 9,
      },
      {
        key: 'site.address',
        value: '',
        valueType: 'string',
        name: '联系地址',
        description: '公司或组织地址',
        category: 'basic',
        isPublic: true,
        isSystem: true,
        sortOrder: 10,
      },

      // 功能开关
      {
        key: 'feature.register',
        value: true,
        valueType: 'boolean',
        name: '用户注册',
        description: '是否允许新用户注册',
        category: 'feature',
        isPublic: true,
        isSystem: true,
        sortOrder: 1,
      },
      {
        key: 'feature.emailVerification',
        value: false,
        valueType: 'boolean',
        name: '邮箱验证',
        description: '注册时是否需要验证邮箱',
        category: 'feature',
        isPublic: true,
        isSystem: true,
        sortOrder: 2,
      },
      {
        key: 'feature.questionReview',
        value: false,
        valueType: 'boolean',
        name: '问卷审核',
        description: '问卷发布前是否需要审核',
        category: 'feature',
        isPublic: true,
        isSystem: true,
        sortOrder: 3,
      },
      {
        key: 'feature.templateMarket',
        value: true,
        valueType: 'boolean',
        name: '模板市场',
        description: '是否启用模板市场功能',
        category: 'feature',
        isPublic: true,
        isSystem: true,
        sortOrder: 4,
      },
      {
        key: 'feature.aiAssistant',
        value: true,
        valueType: 'boolean',
        name: 'AI助手',
        description: '是否启用AI智能助手',
        category: 'feature',
        isPublic: true,
        isSystem: true,
        sortOrder: 5,
      },
      {
        key: 'feature.comment',
        value: false,
        valueType: 'boolean',
        name: '评论功能',
        description: '是否允许用户评论',
        category: 'feature',
        isPublic: true,
        isSystem: true,
        sortOrder: 6,
      },

      // 安全设置
      {
        key: 'security.passwordMinLength',
        value: 6,
        valueType: 'number',
        name: '密码最小长度',
        description: '用户密码最小长度要求',
        category: 'security',
        isPublic: false,
        isSystem: true,
        sortOrder: 1,
        validation: { min: 6, max: 20 },
      },
      {
        key: 'security.passwordRequireUppercase',
        value: false,
        valueType: 'boolean',
        name: '密码需要大写字母',
        description: '密码是否必须包含大写字母',
        category: 'security',
        isPublic: false,
        isSystem: true,
        sortOrder: 2,
      },
      {
        key: 'security.passwordRequireNumber',
        value: false,
        valueType: 'boolean',
        name: '密码需要数字',
        description: '密码是否必须包含数字',
        category: 'security',
        isPublic: false,
        isSystem: true,
        sortOrder: 3,
      },
      {
        key: 'security.passwordRequireSpecialChar',
        value: false,
        valueType: 'boolean',
        name: '密码需要特殊字符',
        description: '密码是否必须包含特殊字符',
        category: 'security',
        isPublic: false,
        isSystem: true,
        sortOrder: 4,
      },
      {
        key: 'security.loginMaxAttempts',
        value: 5,
        valueType: 'number',
        name: '登录最大尝试次数',
        description: '连续登录失败后锁定账户',
        category: 'security',
        isPublic: false,
        isSystem: true,
        sortOrder: 5,
        validation: { min: 3, max: 10 },
      },
      {
        key: 'security.loginLockDuration',
        value: 30,
        valueType: 'number',
        name: '账户锁定时长',
        description: '账户锁定时长（分钟）',
        category: 'security',
        isPublic: false,
        isSystem: true,
        sortOrder: 6,
        validation: { min: 5, max: 1440 },
      },
      {
        key: 'security.jwtExpiresIn',
        value: 7,
        valueType: 'number',
        name: 'Token过期时间',
        description: 'JWT Token过期时间（天）',
        category: 'security',
        isPublic: false,
        isSystem: true,
        sortOrder: 7,
        validation: { min: 1, max: 30 },
      },
      {
        key: 'security.captchaEnabled',
        value: false,
        valueType: 'boolean',
        name: '验证码',
        description: '登录时是否需要验证码',
        category: 'security',
        isPublic: true,
        isSystem: true,
        sortOrder: 8,
      },
      {
        key: 'security.ipWhitelist',
        value: [],
        valueType: 'array',
        name: 'IP白名单',
        description: '只允许这些IP访问后台',
        category: 'security',
        isPublic: false,
        isSystem: true,
        sortOrder: 9,
      },
      {
        key: 'security.ipBlacklist',
        value: [],
        valueType: 'array',
        name: 'IP黑名单',
        description: '禁止这些IP访问',
        category: 'security',
        isPublic: false,
        isSystem: true,
        sortOrder: 10,
      },

      // 业务规则
      {
        key: 'business.maxQuestionsPerUser',
        value: 100,
        valueType: 'number',
        name: '用户最大问卷数',
        description: '单个用户可创建的最大问卷数量',
        category: 'business',
        isPublic: true,
        isSystem: true,
        sortOrder: 1,
        validation: { min: 10, max: 10000 },
      },
      {
        key: 'business.maxComponentsPerQuestion',
        value: 50,
        valueType: 'number',
        name: '问卷最大题目数',
        description: '单个问卷可包含的最大题目数量',
        category: 'business',
        isPublic: true,
        isSystem: true,
        sortOrder: 2,
        validation: { min: 10, max: 200 },
      },
      {
        key: 'business.maxAnswersPerQuestion',
        value: 10000,
        valueType: 'number',
        name: '问卷最大答卷数',
        description: '单个问卷可收集的最大答卷数量',
        category: 'business',
        isPublic: true,
        isSystem: true,
        sortOrder: 3,
        validation: { min: 100, max: 100000 },
      },
      {
        key: 'business.uploadMaxSize',
        value: 5,
        valueType: 'number',
        name: '文件上传大小限制',
        description: '文件上传最大大小（MB）',
        category: 'business',
        isPublic: true,
        isSystem: true,
        sortOrder: 4,
        validation: { min: 1, max: 100 },
      },
      {
        key: 'business.imageMaxWidth',
        value: 2000,
        valueType: 'number',
        name: '图片最大宽度',
        description: '上传图片的最大宽度（像素）',
        category: 'business',
        isPublic: true,
        isSystem: true,
        sortOrder: 5,
        validation: { min: 500, max: 5000 },
      },
      {
        key: 'business.imageMaxHeight',
        value: 2000,
        valueType: 'number',
        name: '图片最大高度',
        description: '上传图片的最大高度（像素）',
        category: 'business',
        isPublic: true,
        isSystem: true,
        sortOrder: 6,
        validation: { min: 500, max: 5000 },
      },

      // 邮件配置
      {
        key: 'email.host',
        value: 'smtp.example.com',
        valueType: 'string',
        name: 'SMTP服务器',
        description: 'SMTP服务器地址',
        category: 'email',
        isPublic: false,
        isSystem: true,
        sortOrder: 1,
      },
      {
        key: 'email.port',
        value: 587,
        valueType: 'number',
        name: 'SMTP端口',
        description: 'SMTP服务器端口',
        category: 'email',
        isPublic: false,
        isSystem: true,
        sortOrder: 2,
        validation: { min: 1, max: 65535 },
      },
      {
        key: 'email.secure',
        value: false,
        valueType: 'boolean',
        name: '使用SSL/TLS',
        description: '是否使用安全连接',
        category: 'email',
        isPublic: false,
        isSystem: true,
        sortOrder: 3,
      },
      {
        key: 'email.user',
        value: '',
        valueType: 'string',
        name: 'SMTP用户名',
        description: 'SMTP认证用户名',
        category: 'email',
        isPublic: false,
        isSystem: true,
        sortOrder: 4,
      },
      {
        key: 'email.password',
        value: '',
        valueType: 'string',
        name: 'SMTP密码',
        description: 'SMTP认证密码',
        category: 'email',
        isPublic: false,
        isSystem: true,
        isEncrypted: true,
        sortOrder: 5,
      },
      {
        key: 'email.from',
        value: 'noreply@quizzyflow.com',
        valueType: 'string',
        name: '发件人邮箱',
        description: '邮件发件人地址',
        category: 'email',
        isPublic: false,
        isSystem: true,
        sortOrder: 6,
      },
      {
        key: 'email.fromName',
        value: 'QuizzyFlow',
        valueType: 'string',
        name: '发件人名称',
        description: '邮件发件人显示名称',
        category: 'email',
        isPublic: false,
        isSystem: true,
        sortOrder: 7,
      },

      // 存储配置
      {
        key: 'storage.type',
        value: 'local',
        valueType: 'string',
        name: '存储类型',
        description: '文件存储方式',
        category: 'storage',
        isPublic: false,
        isSystem: true,
        sortOrder: 1,
        validation: { options: ['local', 'aliyun', 'qiniu', 'tencent'] },
      },
      {
        key: 'storage.aliyun.accessKeyId',
        value: '',
        valueType: 'string',
        name: '阿里云AccessKeyId',
        description: '阿里云OSS AccessKeyId',
        category: 'storage',
        isPublic: false,
        isSystem: true,
        isEncrypted: true,
        sortOrder: 2,
      },
      {
        key: 'storage.aliyun.accessKeySecret',
        value: '',
        valueType: 'string',
        name: '阿里云AccessKeySecret',
        description: '阿里云OSS AccessKeySecret',
        category: 'storage',
        isPublic: false,
        isSystem: true,
        isEncrypted: true,
        sortOrder: 3,
      },
      {
        key: 'storage.aliyun.bucket',
        value: '',
        valueType: 'string',
        name: '阿里云Bucket',
        description: '阿里云OSS Bucket名称',
        category: 'storage',
        isPublic: false,
        isSystem: true,
        sortOrder: 4,
      },
      {
        key: 'storage.aliyun.region',
        value: 'oss-cn-hangzhou',
        valueType: 'string',
        name: '阿里云Region',
        description: '阿里云OSS区域',
        category: 'storage',
        isPublic: false,
        isSystem: true,
        sortOrder: 5,
      },
      {
        key: 'storage.aliyun.domain',
        value: '',
        valueType: 'string',
        name: '阿里云域名',
        description: '阿里云OSS自定义域名',
        category: 'storage',
        isPublic: false,
        isSystem: true,
        sortOrder: 6,
      },
      {
        key: 'storage.cdn.enabled',
        value: false,
        valueType: 'boolean',
        name: '启用CDN',
        description: '是否启用CDN加速',
        category: 'storage',
        isPublic: false,
        isSystem: true,
        sortOrder: 7,
      },
      {
        key: 'storage.cdn.domain',
        value: '',
        valueType: 'string',
        name: 'CDN域名',
        description: 'CDN加速域名',
        category: 'storage',
        isPublic: false,
        isSystem: true,
        sortOrder: 8,
      },
    ]

    // 检查是否已经初始化
    const count = await this.systemConfigModel.countDocuments()
    if (count > 0) {
      return { message: '配置已存在，跳过初始化' }
    }

    // 批量插入配置
    await this.systemConfigModel.insertMany(defaultConfigs)
    return { message: '默认配置初始化成功' }
  }

  /**
   * 获取所有配置（按分类）
   */
  async getAllConfigs(query: QueryConfigDto) {
    const filter: any = {}

    if (query.category) {
      filter.category = query.category
    }

    if (query.isPublic !== undefined) {
      filter.isPublic = query.isPublic
    }

    if (query.isActive !== undefined) {
      filter.isActive = query.isActive
    }

    if (query.keyword) {
      filter.$or = [
        { key: { $regex: query.keyword, $options: 'i' } },
        { name: { $regex: query.keyword, $options: 'i' } },
        { description: { $regex: query.keyword, $options: 'i' } },
      ]
    }

    const configs = await this.systemConfigModel
      .find(filter)
      .sort({ category: 1, sortOrder: 1 })
      .lean()
      .exec()

    // 解密加密的配置值
    const decryptedConfigs = configs.map((config) => {
      if (config.isEncrypted && config.value) {
        return {
          ...config,
          value: this.decrypt(config.value),
        }
      }
      return config
    })

    // 按分类分组
    const grouped = decryptedConfigs.reduce((acc, config) => {
      if (!acc[config.category]) {
        acc[config.category] = []
      }
      acc[config.category].push(config)
      return acc
    }, {})

    return grouped
  }

  /**
   * 获取公开配置（供前端使用）
   */
  async getPublicConfigs() {
    const configs = await this.systemConfigModel
      .find({ isPublic: true, isActive: true })
      .lean()
      .exec()

    // 转换为 key-value 对象
    const configMap = configs.reduce((acc, config) => {
      acc[config.key] = config.value
      return acc
    }, {})

    return configMap
  }

  /**
   * 获取单个配置
   */
  async getConfigByKey(key: string) {
    const config = await this.systemConfigModel.findOne({ key }).lean().exec()

    if (!config) {
      throw new NotFoundException(`配置 ${key} 不存在`)
    }

    // 解密加密的值
    if (config.isEncrypted && config.value) {
      config.value = this.decrypt(config.value)
    }

    return config
  }

  /**
   * 更新单个配置
   */
  async updateConfig(
    key: string,
    updateDto: UpdateConfigItemDto,
    username: string,
  ) {
    const config = await this.systemConfigModel.findOne({ key })

    if (!config) {
      throw new NotFoundException(`配置 ${key} 不存在`)
    }

    // 如果需要加密，先加密值
    let value = updateDto.value
    if (config.isEncrypted && value) {
      value = this.encrypt(value)
    }

    config.value = value
    config.updatedBy = username
    await config.save()

    return {
      message: '配置更新成功',
      config: {
        ...config.toObject(),
        value: config.isEncrypted ? this.decrypt(value) : value,
      },
    }
  }

  /**
   * 批量更新配置
   */
  async batchUpdateConfigs(
    batchDto: BatchUpdateConfigDto,
    username: string,
  ) {
    const results = []

    for (const configDto of batchDto.configs) {
      try {
        const result = await this.updateConfig(configDto.key, configDto, username)
        results.push({ key: configDto.key, success: true, data: result })
      } catch (error) {
        results.push({
          key: configDto.key,
          success: false,
          error: error.message,
        })
      }
    }

    return {
      message: '批量更新完成',
      results,
    }
  }

  /**
   * 重置配置为默认值
   */
  async resetConfig(key: string) {
    const config = await this.systemConfigModel.findOne({ key })

    if (!config) {
      throw new NotFoundException(`配置 ${key} 不存在`)
    }

    if (!config.isSystem) {
      throw new BadRequestException('只能重置系统配置')
    }

    // 这里应该从默认配置中读取，简化处理直接删除重建
    await this.systemConfigModel.deleteOne({ key })
    await this.initializeDefaultConfig()

    return { message: '配置已重置为默认值' }
  }

  /**
   * 加密敏感数据
   */
  private encrypt(text: string): string {
    try {
      const iv = crypto.randomBytes(16)
      const key = crypto
        .createHash('sha256')
        .update(this.ENCRYPTION_KEY)
        .digest()

      const cipher = crypto.createCipheriv(this.ALGORITHM, key, iv)
      let encrypted = cipher.update(text, 'utf8', 'hex')
      encrypted += cipher.final('hex')

      return iv.toString('hex') + ':' + encrypted
    } catch (error) {
      console.error('加密失败:', error)
      return text
    }
  }

  /**
   * 解密敏感数据
   */
  private decrypt(text: string): string {
    try {
      const parts = text.split(':')
      if (parts.length !== 2) {
        return text
      }

      const iv = Buffer.from(parts[0], 'hex')
      const encrypted = parts[1]
      const key = crypto
        .createHash('sha256')
        .update(this.ENCRYPTION_KEY)
        .digest()

      const decipher = crypto.createDecipheriv(this.ALGORITHM, key, iv)
      let decrypted = decipher.update(encrypted, 'hex', 'utf8')
      decrypted += decipher.final('utf8')

      return decrypted
    } catch (error) {
      console.error('解密失败:', error)
      return text
    }
  }

  /**
   * 获取按分类的配置值映射
   */
  async getConfigsByCategory(category: string) {
    const configs = await this.systemConfigModel
      .find({ category, isActive: true })
      .lean()
      .exec()

    // 解密并转换为 key-value 对象
    const configMap = configs.reduce((acc, config) => {
      let value = config.value
      if (config.isEncrypted && value) {
        value = this.decrypt(value)
      }
      acc[config.key] = value
      return acc
    }, {})

    return configMap
  }
}

