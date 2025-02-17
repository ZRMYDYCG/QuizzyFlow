import instance from '../index.ts'
import type { ResDataType } from '../index.ts'

export const getQuestionsStatistics = async (
  questionId: string,
  opt: {
    page: number
    pageSize: number
  }
): Promise<ResDataType> => {
  return await instance.get(`/api/statistics/${questionId}`)
}

export const getAnswerStatistics = async (
  questionId: string,
  componentId: string
) => {
  return await instance.get(`/api/${questionId}/${componentId}`)
}
