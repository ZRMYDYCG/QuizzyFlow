import { Module } from '@nestjs/common'
import { UserService } from './user.service'
import { UserStatisticsService } from './user-statistics.service'
import { UserController } from './user.controller'
import { UploadController } from './upload.controller'
import { MongooseModule } from '@nestjs/mongoose'
import { User, UserSchema } from './schemas/user.schema'
import { Question, QuestionSchema } from '../question/schemas/question.schema'
import { Answer, AnswerSchema } from '../answer/schemas/answer.schema'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Question.name, schema: QuestionSchema },
      { name: Answer.name, schema: AnswerSchema },
    ]),
  ],
  providers: [UserService, UserStatisticsService],
  exports: [UserService],
  controllers: [UserController, UploadController],
})
export class UserModule {}
