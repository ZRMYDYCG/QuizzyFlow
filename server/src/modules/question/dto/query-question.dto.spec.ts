import { ValidationPipe } from '@nestjs/common'
import { QueryQuestionDto } from './query-question.dto'

describe('QueryQuestionDto', () => {
  const pipe = new ValidationPipe({ transform: true, whitelist: true })

  it('parses isDeleted=false from query string correctly', async () => {
    const result = await pipe.transform(
      { page: '1', pageSize: '10', isDeleted: 'false' },
      { type: 'query', metatype: QueryQuestionDto },
    )
    expect(result.isDeleted).toBe(false)
  })

  it('parses isDeleted=true from query string correctly', async () => {
    const result = await pipe.transform(
      { page: '1', pageSize: '10', isDeleted: 'true' },
      { type: 'query', metatype: QueryQuestionDto },
    )
    expect(result.isDeleted).toBe(true)
  })

  it('parses isStar=false from query string correctly', async () => {
    const result = await pipe.transform(
      { page: '1', isStar: 'false' },
      { type: 'query', metatype: QueryQuestionDto },
    )
    expect(result.isStar).toBe(false)
  })

  it('accepts type filter', async () => {
    const result = await pipe.transform(
      { page: '1', type: 'survey' },
      { type: 'query', metatype: QueryQuestionDto },
    )
    expect(result.type).toBe('survey')
  })
})

describe('UpdateQuestionDto type field', () => {
  const pipe = new ValidationPipe({ transform: true, whitelist: true })

  it('keeps type when updating questionnaire', async () => {
    const { UpdateQuestionDto } = await import('./update-question.dto')
    const result = await pipe.transform(
      { type: 'survey', title: 'test' },
      { type: 'body', metatype: UpdateQuestionDto },
    )
    expect(result.type).toBe('survey')
  })
})
