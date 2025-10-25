import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { StatisticsController } from './statistics.controller'
import { StatisticsService } from './statistics.service'
import { Answer, AnswerSchema } from '../answer/schemas/answer.schema'
import { Question, QuestionSchema } from '../question/schemas/question.schema'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Answer.name, schema: AnswerSchema },
      { name: Question.name, schema: QuestionSchema },
    ]),
  ],
  controllers: [StatisticsController],
  providers: [StatisticsService],
})
export class StatisticsModule {}

