import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { TemplateController } from './template.controller'
import { TemplateService } from './template.service'
import { Template, TemplateSchema } from './schemas/template.schema'
import { User, UserSchema } from '../user/schemas/user.schema'
import { ModerationModule } from '../moderation/moderation.module'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Template.name, schema: TemplateSchema },
      { name: User.name, schema: UserSchema },
    ]),
    ModerationModule,
  ],
  controllers: [TemplateController],
  providers: [TemplateService],
  exports: [TemplateService],
})
export class TemplateModule {}

