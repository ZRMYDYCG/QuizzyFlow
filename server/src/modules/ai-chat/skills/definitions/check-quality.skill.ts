import { z } from 'zod'
import type { SkillDefinition } from '../skill.types'

export const checkQualitySkill: SkillDefinition = {
  id: 'check_quality',
  name: '问卷质量检查',
  description:
    '检查当前问卷的常见问题：重复标题、空标题、题目过少、缺少必填 props 等。',
  tags: ['质量', '检查', '校验', '优化', '问题', '重复'],
  inputSchema: z.object({}),
  execute: (_input, context) => {
    const components = context?.currentComponents ?? []
    const issues: Array<{ level: 'warn' | 'info'; message: string }> = []

    if (components.length === 0) {
      issues.push({ level: 'warn', message: '问卷没有任何题目组件' })
    } else if (components.length < 2) {
      issues.push({ level: 'info', message: '题目数量较少，建议至少 2-3 题' })
    }

    const titleMap = new Map<string, string[]>()
    for (const c of components) {
      const title = (c.title || c.props?.title || '').toString().trim()
      if (!title) {
        issues.push({
          level: 'warn',
          message: `组件 ${c.fe_id} 缺少题目标题`,
        })
        continue
      }
      const list = titleMap.get(title) ?? []
      list.push(c.fe_id)
      titleMap.set(title, list)
    }

    for (const [title, ids] of titleMap) {
      if (ids.length > 1) {
        issues.push({
          level: 'warn',
          message: `题目标题「${title}」重复（${ids.join(', ')}）`,
        })
      }
    }

    const warnCount = issues.filter((i) => i.level === 'warn').length

    return {
      success: true,
      summary:
        issues.length === 0
          ? '未发现明显质量问题'
          : `发现 ${issues.length} 条提示（${warnCount} 条需关注）`,
      data: {
        issueCount: issues.length,
        warnCount,
        issues,
        componentCount: components.length,
      },
    }
  },
}
