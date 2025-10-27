import { Module, forwardRef } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { AdminController } from './admin.controller'
import { AdminService } from './admin.service'
import { User, UserSchema } from '../user/schemas/user.schema'
import { Question, QuestionSchema } from '../question/schemas/question.schema'
import { Answer, AnswerSchema } from '../answer/schemas/answer.schema'
import { RbacModule } from '../rbac/rbac.module'
import { AdminLogModule } from '../admin-log/admin-log.module'
import { RoleModule } from '../role/role.module'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Question.name, schema: QuestionSchema },
      { name: Answer.name, schema: AnswerSchema },
    ]),
    forwardRef(() => RbacModule),
    forwardRef(() => AdminLogModule),
    forwardRef(() => RoleModule),
  ],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}

