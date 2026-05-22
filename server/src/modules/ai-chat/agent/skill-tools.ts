import { tool } from 'ai'
import { z } from 'zod'
import type { QuestionnaireAgentContext } from '../prompts/system-prompt'
import {
  SKILL_REGISTRY,
  getSkillToolName,
  matchSkills,
} from '../skills/skill-registry'
import type { SkillToolOutput } from '../skills/skill.types'

function skillToolResult(payload: SkillToolOutput): string {
  return JSON.stringify(payload)
}

export function createSkillTools(context?: QuestionnaireAgentContext) {
  const skillToolEntries = SKILL_REGISTRY.map((skill) => {
    const toolName = getSkillToolName(skill.id)
    return [
      toolName,
      tool({
        description: `[Skill] ${skill.name} — ${skill.description}`,
        inputSchema: skill.inputSchema,
        execute: async (input) => {
          try {
            const result = await skill.execute(input, context)
            if (!result.success) {
              return skillToolResult({
                actionType: 'skill_result',
                skillId: skill.id,
                skillName: skill.name,
                summary: result.summary,
                data: result.data,
                status: 'info_only',
                error: result.error,
              })
            }
            return skillToolResult({
              actionType: 'skill_result',
              skillId: skill.id,
              skillName: skill.name,
              summary: result.summary,
              data: result.data,
              status: 'info_only',
            })
          } catch (err) {
            const message = err instanceof Error ? err.message : String(err)
            return skillToolResult({
              actionType: 'skill_result',
              skillId: skill.id,
              skillName: skill.name,
              summary: `Skill 执行失败：${message}`,
              status: 'info_only',
              error: message,
            })
          }
        },
      }),
    ] as const
  })

  return {
    ...Object.fromEntries(skillToolEntries),
    skill_find_skills: tool({
      description:
        '根据用户意图或关键词匹配可用的 Skill 工具。不确定该调用哪个 Skill 时先调用此工具。',
      inputSchema: z.object({
        query: z.string().describe('用户意图或关键词，如「分析问卷结构」「查邮箱题型」'),
        limit: z.number().int().min(1).max(10).optional().default(5),
      }),
      execute: async ({ query, limit }) => {
        const matches = matchSkills(query, limit ?? 5)
        return skillToolResult({
          actionType: 'skill_match',
          summary:
            matches.length > 0
              ? `匹配到 ${matches.length} 个 Skill，请调用对应 tool`
              : '未匹配到 Skill，可直接使用组件提案工具或继续对话',
          matches,
          status: 'info_only',
        })
      },
    }),
  }
}
