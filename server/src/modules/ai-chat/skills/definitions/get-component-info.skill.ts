import { z } from 'zod'
import type { SkillDefinition } from '../skill.types'

export const getComponentInfoSkill: SkillDefinition = {
  id: 'get_component_info',
  name: '组件详情查询',
  description:
    '根据 fe_id 查询当前问卷中某组件的完整配置（type、title、props）。',
  tags: ['组件', '详情', 'fe_id', '查询', 'props'],
  inputSchema: z.object({
    fe_id: z.string().describe('组件 fe_id，如 c_abc12345'),
  }),
  execute: ({ fe_id }, context) => {
    const components = context?.currentComponents ?? []
    const found = components.find((c) => c.fe_id === fe_id)

    if (!found) {
      return {
        success: false,
        summary: `未找到 fe_id 为 ${fe_id} 的组件`,
        error: 'component_not_found',
        data: {
          fe_id,
          availableIds: components.map((c) => c.fe_id),
        },
      }
    }

    return {
      success: true,
      summary: `已找到组件 ${found.title || found.fe_id}`,
      data: found,
    }
  },
}
