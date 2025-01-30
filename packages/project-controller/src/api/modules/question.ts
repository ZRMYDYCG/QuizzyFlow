import instance from '../index.ts'
import type { ResDataType } from '../index.ts'

export async function getQuestion(id: string): Promise<ResDataType> {
    return await instance.get(`/api/question/${id}`)
}

export async function createQuestion(): Promise<ResDataType> {
    return await instance.post(`/api/question`)
}