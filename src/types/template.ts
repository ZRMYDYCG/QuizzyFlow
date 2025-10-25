/**
 * 模板市场 - 类型定义
 */
import { TemplateCategory } from '@/constants/template-categories'
import { QuestionnaireType } from '@/constants/questionnaire-types'
import { QuestionComponentType } from '@/store/modules/question-component'
import { IPageInfo } from '@/store/modules/pageinfo-reducer'

// 模板数据接口
export interface Template {
  _id: string                      // 模板ID
  name: string                     // 模板名称
  description: string              // 模板描述
  thumbnail: string                // 缩略图URL
  category: TemplateCategory       // 模板分类
  type: QuestionnaireType          // 问卷类型
  tags: string[]                   // 标签
  
  // 模板内容（核心）
  templateData: {
    title: string                  // 默认标题
    desc: string                   // 默认描述
    type: QuestionnaireType        // 问卷类型
    componentList: QuestionComponentType[]  // 组件列表
    pageInfo: Partial<IPageInfo>   // 页面配置
  }
  
  // 元数据
  author: string                   // 创作者用户名
  authorNickname: string           // 创作者昵称
  authorAvatar?: string            // 创作者头像
  isOfficial: boolean              // 是否官方模板
  isPublic: boolean                // 是否公开
  isFeatured: boolean              // 是否精选
  
  // 统计数据
  useCount: number                 // 使用次数
  likeCount: number                // 点赞数
  viewCount: number                // 浏览次数
  rating: number                   // 评分 (0-5)
  
  // 时间戳
  createdAt: string
  updatedAt: string
}

// 模板列表查询参数
export interface TemplateListParams {
  page?: number
  pageSize?: number
  category?: TemplateCategory
  type?: QuestionnaireType
  keyword?: string
  sortBy?: string
  isOfficial?: boolean
  isFeatured?: boolean
}

// 模板列表响应
export interface TemplateListResponse {
  list: Template[]
  total: number
  page: number
  pageSize: number
}

// 创建/更新模板请求
export interface CreateTemplateRequest {
  name: string
  description: string
  thumbnail?: string
  category: TemplateCategory
  type: QuestionnaireType
  tags: string[]
  templateData: {
    title: string
    desc: string
    type: QuestionnaireType
    componentList: QuestionComponentType[]
    pageInfo: Partial<IPageInfo>
  }
  isPublic: boolean
}

// 模板预览数据
export interface TemplatePreview {
  templateId: string
  name: string
  thumbnail: string
  componentCount: number
  questionCount: number
  estimatedTime: number  // 预计完成时间（分钟）
}

