import { Module, forwardRef } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { QuestionController } from './question.controller'
import { QuestionService } from './question.service'
import { Question, QuestionSchema } from './schemas/question.schema'
import { TemplateModule } from '../template/template.module'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Question.name, schema: QuestionSchema },
    ]),
    forwardRef(() => TemplateModule),
  ],
  controllers: [QuestionController],
  providers: [QuestionService],
  exports: [QuestionService],
})
export class QuestionModule {}
