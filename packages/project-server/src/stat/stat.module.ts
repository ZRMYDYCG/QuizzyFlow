import { Module } from '@nestjs/common'
import { StatService } from './stat.service'
import { StatController } from './stat.controller'
import { QuestionModule } from '../question/question.module'
import { AnswerModule } from '../answer/answer.module'

@Module({
  imports: [QuestionModule, AnswerModule],
  providers: [StatService],
  controllers: [StatController],
})
export class StatModule {}
