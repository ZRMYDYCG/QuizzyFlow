import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { ConfigModule } from '@nestjs/config'
import { AIChatController } from './ai-chat.controller'
import { AIChatService } from './ai-chat.service'
import { AIChatProxyService } from './ai-chat-proxy.service'
import { AIChat, AIChatSchema } from './schemas/ai-chat.schema'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: AIChat.name, schema: AIChatSchema }]),
    ConfigModule,
  ],
  controllers: [AIChatController],
  providers: [AIChatService, AIChatProxyService],
  exports: [AIChatService, AIChatProxyService],
})
export class AIChatModule {}

