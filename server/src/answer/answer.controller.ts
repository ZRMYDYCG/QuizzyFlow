import { Controller, Post, Body } from '@nestjs/common'
import { AnswerService } from './answer.service'
import { Public } from '../auth/decorators/public.decorator'

@Controller('answer')
export class AnswerController {
  constructor(private readonly answerService: AnswerService) {}

  @Public()
  @Post()
  async create(@Body() body) {
    return await this.answerService.create(body)
  }
}
