import { Module, forwardRef } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { AnswerController } from './answer.controller'
import { AnswerService } from './answer.service'
import { Answer, AnswerSchema } from './schemas/answer.schema'
import { Question, QuestionSchema } from '../question/schemas/question.schema'
import { RbacModule } from '../rbac/rbac.module'

@Module({
  imports: [
    forwardRef(() => RbacModule),
    MongooseModule.forFeature([
      { name: Answer.name, schema: AnswerSchema },
      { name: Question.name, schema: QuestionSchema },
    ]),
  ],
  controllers: [AnswerController],
  providers: [AnswerService],
  exports: [AnswerService],
})
export class AnswerModule {}

