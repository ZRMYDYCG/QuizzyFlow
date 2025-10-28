import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { ModerationController } from './moderation.controller'
import { ModerationService } from './moderation.service'
import {
  ModerationRecord,
  ModerationRecordSchema,
} from './schemas/moderation-record.schema'
import {
  SensitiveWord,
  SensitiveWordSchema,
} from './schemas/sensitive-word.schema'
import { Question, QuestionSchema } from '../question/schemas/question.schema'
import { Template, TemplateSchema } from '../template/schemas/template.schema'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ModerationRecord.name, schema: ModerationRecordSchema },
      { name: SensitiveWord.name, schema: SensitiveWordSchema },
      { name: Question.name, schema: QuestionSchema },
      { name: Template.name, schema: TemplateSchema },
    ]),
  ],
  controllers: [ModerationController],
  providers: [ModerationService],
  exports: [ModerationService], // 导出Service供其他模块使用
})
export class ModerationModule {}

