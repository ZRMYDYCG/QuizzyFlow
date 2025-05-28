import { Module } from '@nestjs/common'
import { QuestionController } from './question.controller'
import { QuestionService } from './question.service'
import { MongooseModule } from '@nestjs/mongoose'
import { QuestionSchema, Question } from './schemas/question.schema'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Question.name, schema: QuestionSchema },
    ]),
  ],
  controllers: [QuestionController],
  exports: [QuestionService],
  providers: [QuestionService],
})
export class QuestionModule {}
