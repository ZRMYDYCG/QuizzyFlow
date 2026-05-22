import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import {
  createQuestionnaireAgent,
} from './agent/component-tools'
import {
  QuestionnaireAgentContext,
} from './prompts/system-prompt'

@Injectable()
export class QuestionnaireAgentService {
  constructor(private readonly configService: ConfigService) {}

  getAgent(context?: QuestionnaireAgentContext) {
    return createQuestionnaireAgent(this.configService, context)
  }
}
