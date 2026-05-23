import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import {
  createQuestionnaireAgent,
} from './agent/component-tools'
import {
  QuestionnaireAgentContext,
} from './prompts/system-prompt'
import { WebSearchService } from './services/web-search.service'

@Injectable()
export class QuestionnaireAgentService {
  constructor(
    private readonly configService: ConfigService,
    private readonly webSearchService: WebSearchService,
  ) {}

  getAgent(context?: QuestionnaireAgentContext) {
    return createQuestionnaireAgent(
      this.configService,
      context,
      this.webSearchService,
    )
  }
}
