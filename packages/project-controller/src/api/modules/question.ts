import instance from '../index.ts'
import type { ResDataType } from '../index.ts'

interface SearchOption {
    keyword: string
    isStar: boolean
    isDeleted: boolean
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