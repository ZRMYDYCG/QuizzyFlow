import type { z } from 'zod'
import type { QuestionnaireAgentContext } from '../prompts/system-prompt'

export interface SkillResult {
  success: boolean
  summary: string
  data?: unknown
  error?: string
}

export interface SkillMatch {
  id: string
  name: string
  description: string
  toolName: string
  score: number
  tags: string[]
}

export interface SkillDefinition<T extends z.ZodTypeAny = z.ZodTypeAny> {
  id: string
  name: string
  description: string
  tags: string[]
  inputSchema: T
  execute: (
    input: z.infer<T>,
    context?: QuestionnaireAgentContext,
  ) => Promise<SkillResult> | SkillResult
}

export interface SkillToolOutput {
  actionType: 'skill_result' | 'skill_match'
  skillId?: string
  skillName?: string
  summary?: string
  data?: unknown
  matches?: SkillMatch[]
  status: 'info_only'
  error?: string
}
