/**
 * C 端 - 用户反馈 API
 */
import instance from '../index'

export type FeedbackType = 'bug' | 'feature' | 'improvement' | 'other'

export interface CreateFeedbackPayload {
  type: FeedbackType
  title: string
  description: string
  authorEmail?: string
  tags?: string[]
  screenshots?: string[]
  browserInfo?: string
  osInfo?: string
}

export interface CreateFeedbackResult {
  message: string
  _id: string
}

export async function createFeedback(
  data: CreateFeedbackPayload
): Promise<CreateFeedbackResult> {
  return instance.post('/api/feedback', data)
}
