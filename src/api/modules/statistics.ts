import instance from '../index.ts'
import type { ResDataType } from '../index.ts'

export interface StatisticsListParams {
  page: number
  pageSize: number
}

export interface StatisticsOverview {
  total: number
  avgDurationSeconds: number | null
  anonymousCount: number
  namedCount: number
  lastSubmittedAt: string | null
  firstSubmittedAt: string | null
}

export const getQuestionsStatistics = async (
  questionId: string,
  params: StatisticsListParams
): Promise<ResDataType> => {
  return await instance.get(`/api/statistics/${questionId}`, { params })
}

export const exportQuestionsStatistics = async (
  questionId: string
): Promise<{ total: number; list: Record<string, unknown>[] }> => {
  return await instance.get(`/api/statistics/${questionId}/export`)
}

export const getQuestionStatisticsOverview = async (
  questionId: string
): Promise<StatisticsOverview> => {
  return await instance.get(`/api/statistics/${questionId}/overview`)
}

export const getAnswerStatistics = async (
  questionId: string,
  componentId: string
) => {
  return await instance.get(`/api/statistics/${questionId}/${componentId}`)
}
