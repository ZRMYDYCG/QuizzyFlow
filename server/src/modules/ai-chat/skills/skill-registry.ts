import { analyzeQuestionnaireSkill } from './definitions/analyze-questionnaire.skill'
import { listMaterialsSkill } from './definitions/list-materials.skill'
import { getComponentInfoSkill } from './definitions/get-component-info.skill'
import { checkQualitySkill } from './definitions/check-quality.skill'
import type { SkillDefinition, SkillMatch } from './skill.types'

export const SKILL_REGISTRY: SkillDefinition[] = [
  analyzeQuestionnaireSkill,
  listMaterialsSkill,
  getComponentInfoSkill,
  checkQualitySkill,
]

export function getSkillById(id: string): SkillDefinition | undefined {
  return SKILL_REGISTRY.find((s) => s.id === id)
}

export function getSkillToolName(skillId: string): string {
  return `skill_${skillId}`
}

export function listSkillCatalog() {
  return SKILL_REGISTRY.map((skill) => ({
    id: skill.id,
    name: skill.name,
    description: skill.description,
    tags: skill.tags,
    toolName: getSkillToolName(skill.id),
  }))
}

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .split(/[\s,，。、；;：:]+/)
    .map((t) => t.trim())
    .filter(Boolean)
}

/**
 * 按关键词/意图匹配可用 Skill
 */
export function matchSkills(query: string, limit = 5): SkillMatch[] {
  const tokens = tokenize(query)
  if (tokens.length === 0) {
    return SKILL_REGISTRY.slice(0, limit).map((skill) => ({
      id: skill.id,
      name: skill.name,
      description: skill.description,
      toolName: getSkillToolName(skill.id),
      score: 0,
      tags: skill.tags,
    }))
  }

  const scored = SKILL_REGISTRY.map((skill) => {
    const haystack = [
      skill.id,
      skill.name,
      skill.description,
      ...skill.tags,
    ]
      .join(' ')
      .toLowerCase()

    let score = 0
    for (const token of tokens) {
      if (haystack.includes(token)) score += 2
      for (const tag of skill.tags) {
        if (tag.toLowerCase().includes(token) || token.includes(tag.toLowerCase())) {
          score += 1
        }
      }
    }

    return {
      id: skill.id,
      name: skill.name,
      description: skill.description,
      toolName: getSkillToolName(skill.id),
      score,
      tags: skill.tags,
    }
  })

  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
}

export function buildSkillsPromptSection(): string {
  const lines = SKILL_REGISTRY.map(
    (s) =>
      `- **${s.name}** (\`${getSkillToolName(s.id)}\`): ${s.description}`,
  )
  return lines.join('\n')
}
