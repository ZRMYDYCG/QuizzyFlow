import { z } from 'zod'
import type { SkillDefinition } from '../skill.types'

export const analyzeQuestionnaireSkill: SkillDefinition = {
  id: 'analyze_questionnaire',
  name: '问卷结构分析',
  description:
    '分析当前问卷的组件数量、题型分布、标题列表，并给出结构概览与改进方向。',
  tags: ['分析', '统计', '结构', '概览', '问卷', '题目数量'],
  inputSchema: z.object({
    focus: z
      .string()
      .optional()
      .describe('可选：用户关注的分析方向，如「题型分布」「是否缺少联系方式」'),
  }),
  execute: ({ focus }, context) => {
    const components = context?.currentComponents ?? []
    const byType: Record<string, number> = {}
    const titles: string[] = []

    for (const c of components) {
      byType[c.type] = (byType[c.type] ?? 0) + 1
      titles.push(c.title || c.props?.title?.toString?.() || c.fe_id)
    }

    const typeBreakdown = Object.entries(byType).map(([type, count]) => ({
      type,
      count,
    }))

    const summary =
      components.length === 0
        ? '当前问卷尚无题目组件。'
        : `共 ${components.length} 个组件，涵盖 ${typeBreakdown.length} 种题型。`

    return {
      success: true,
      summary,
      data: {
        total: components.length,
        questionTitle: context?.questionTitle,
        typeBreakdown,
        titles,
        focus: focus?.trim() || undefined,
        suggestions:
          components.length === 0
            ? ['可从姓名、联系方式等基础题开始搭建问卷']
            : components.length < 3
              ? ['题目较少，可考虑补充背景信息或满意度类题目']
              : [],
      },
    }
  },
}
