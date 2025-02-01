import instance from '../index.ts'
import type { ResDataType } from '../index.ts'

interface SearchOption {
    keyword: string
    isStar: boolean
    isDeleted: boolean
    page: number // 第几页
    pageSize: number // 每页多少条
}

export async function getQuestion(id: string): Promise<ResDataType> {
    return await instance.get(`/api/question/${id}`)
}

export async function createQuestion(): Promise<ResDataType> {
    return await instance.post(`/api/question`)
}

export async function getQuestionList(opt: Partial<SearchOption> = {}): Promise<ResDataType> {
    return await instance.get(`/api/question`, { params: opt })
}

export async function updateQuestion(id: string, data: { [key: string]: any }): Promise<ResDataType> {
    return await instance.patch(`/api/question/${id}`, data)
}

export async function duplicateQuestion(id: string): Promise<ResDataType> {
    return await instance.post(`/api/question/duplicate/${id}`)
}

// 批量删除
export async function deleteQuestion(ids: string[]): Promise<ResDataType> {
    return await instance.delete('/api/question', { data: { ids } })
}