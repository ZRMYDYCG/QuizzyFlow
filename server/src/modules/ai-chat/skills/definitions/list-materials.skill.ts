import { z } from 'zod'
import {
  MATERIAL_LIBRARY,
  type MaterialCategory,
} from '../../shared/material-library'
import type { SkillDefinition } from '../skill.types'

export const listMaterialsSkill: SkillDefinition = {
  id: 'list_materials',
  name: '物料库查询',
  description:
    '按关键词或分类查询 QuizzyFlow 物料库，返回可用题型 type、标签与默认 props。',
  tags: ['物料', '组件', '题型', '库', '查询', 'input', 'radio', 'checkbox'],
  inputSchema: z.object({
    keyword: z
      .string()
      .optional()
      .describe('搜索关键词，如「邮箱」「评分」「下拉」'),
    category: z
      .enum(['input', 'choice', 'datetime', 'advanced'])
      .optional()
      .describe('按分类筛选'),
    limit: z.number().int().min(1).max(30).optional().default(15),
  }),
  execute: ({ keyword, category, limit }) => {
    let items = MATERIAL_LIBRARY

    if (category) {
      items = items.filter((m) => m.category === (category as MaterialCategory))
    }

    if (keyword?.trim()) {
      const q = keyword.trim().toLowerCase()
      items = items.filter(
        (m) =>
          m.type.toLowerCase().includes(q) ||
          m.label.toLowerCase().includes(q) ||
          m.description.toLowerCase().includes(q),
      )
    }

    const sliced = items.slice(0, limit ?? 15)

    return {
      success: true,
      summary: `找到 ${sliced.length} 个物料${keyword ? `（关键词：${keyword}）` : ''}`,
      data: {
        total: sliced.length,
        items: sliced.map(({ type, label, category, description, defaultProps }) => ({
          type,
          label,
          category,
          description,
          defaultProps,
        })),
      },
    }
  },
}
