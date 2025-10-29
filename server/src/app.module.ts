import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { QuestionModule } from './modules/question/question.module'
import { MongooseModule } from '@nestjs/mongoose'
import { ConfigModule } from '@nestjs/config'
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { AnswerModule } from './modules/answer/answer.module';
import { StatisticsModule } from './modules/statistics/statistics.module';
import { TemplateModule } from './modules/template/template.module';
import { AIChatModule } from './modules/ai-chat/ai-chat.module';
import { ModerationModule } from './modules/moderation/moderation.module';
import { FeedbackModule } from './modules/feedback/feedback.module';
// 🆕 RBAC 和管理功能模块
import { RbacModule } from './modules/rbac/rbac.module';
import { RoleModule } from './modules/role/role.module';
import { PermissionModule } from './modules/permission/permission.module';
import { AdminLogModule } from './modules/admin-log/admin-log.module';
import { AdminModule } from './modules/admin/admin.module';
import { SystemConfigModule } from './modules/system-config/system-config.module';
import { FlowModule } from './modules/flow/flow.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(
      `mongodb://${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DATABASE}`
    ),
    // 基础模块
    QuestionModule,
    UserModule,
    AuthModule,
    AnswerModule,
    StatisticsModule,
    TemplateModule,
    AIChatModule,
    ModerationModule,
    FeedbackModule,
    // RBAC 和管理功能模块
    RbacModule,
    RoleModule,
    PermissionModule,
    AdminLogModule,
    AdminModule,
    SystemConfigModule,
    // Flow 工作流模块
    FlowModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
