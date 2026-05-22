export interface CommunityTemplateSchema {
  title: string
  desc: string
  componentList: Array<Record<string, unknown>>
}

export interface CommunityTemplate {
  id: string
  title: string
  author: string
  cover: string
  height: number
  tags: string[]
  likes: number
  views: number
  description: string
  schema: CommunityTemplateSchema
}
