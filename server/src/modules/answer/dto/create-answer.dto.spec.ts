import { ValidationPipe } from '@nestjs/common'
import { CreateAnswerDto } from './create-answer.dto'

describe('CreateAnswerDto', () => {
  const pipe = new ValidationPipe({ transform: true, whitelist: true })

  it('keeps answerList[].value when global whitelist is enabled', async () => {
    const result = await pipe.transform(
      {
        questionId: '507f1f77bcf86cd799439011',
        answerList: [
          {
            componentId: 'c_input',
            componentType: 'question-input',
            value: '用户填写的内容',
          },
          {
            componentId: 'c_checkbox',
            componentType: 'question-checkbox',
            value: ['opt1', 'opt2'],
          },
        ],
        duration: 12,
      },
      { type: 'body', metatype: CreateAnswerDto },
    )

    expect(result.answerList[0].value).toBe('用户填写的内容')
    expect(result.answerList[1].value).toEqual(['opt1', 'opt2'])
  })
})
