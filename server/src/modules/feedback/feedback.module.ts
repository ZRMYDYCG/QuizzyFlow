import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { FeedbackController } from './feedback.controller'
import { FeedbackService } from './feedback.service'
import { Feedback, FeedbackSchema } from './schemas/feedback.schema'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Feedback.name, schema: FeedbackSchema },
    ]),
  ],
  controllers: [FeedbackController],
  providers: [FeedbackService],
  exports: [FeedbackService],
})
export class FeedbackModule {}

