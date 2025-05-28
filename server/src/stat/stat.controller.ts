import { Controller, Get, Param, Query } from '@nestjs/common'
import { StatService } from './stat.service'

@Controller('stat')
export class StatController {
  constructor(private readonly statService: StatService) {}

  @Get(':questionId')
  async getQuestionStat(
    @Param('questionId') questionId: string,
    @Query('page') page: number,
    @Query('pageSize') pageSize: number
  ) {
    return await this.statService.getQuestionStatListAndCount(questionId, {
      page,
      pageSize,
    })
  }
  @Get(':questionId/:componentFeId')
  async getComponentStat(
    @Param('questionId') questionId: string,
    @Param('componentFeId') componentFeId: string
  ) {
    const stat = await this.statService.getComponentStat(
      questionId,
      componentFeId
    )

    return {
      stat,
    }
  }
}
