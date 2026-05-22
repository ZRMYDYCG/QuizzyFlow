import { tool, stepCountIs, ToolLoopAgent } from 'ai'
import { z } from 'zod'
import { ConfigService } from '@nestjs/config'
import {
  createSiliconFlowProvider,
  getSiliconFlowModelId,
} from '../silicon-flow.provider'
import {
  buildQuestionnaireAgentSystemPrompt,
  QuestionnaireAgentContext,
} from '../prompts/system-prompt'
import { normalizeProposedComponent } from './component-validator'

const componentInputSchema = z.object({
  type: z.string().describe('物料 type，如 question-input'),
  title: z.string().describe('组件标题/题目标识'),
  props: z
    .record(z.string(), z.unknown())
    .optional()
    .describe('组件 props，需符合物料库 propsSchema'),
  fe_id: z
    .string()
    .optional()
    .describe('更新/删除时必填；新增时可省略由系统生成'),
  description: z.string().optional().describe('操作说明，展示给用户'),
})

function toolResult(
  actionType: string,
  data: unknown,
  description?: string,
): string {
  return JSON.stringify({
    actionType,
    data,
    description: description ?? '',
    status: 'pending_approval',
  })
}

export function createQuestionnaireTools() {
  return {
    propose_add_component: tool({
      description:
        '向当前问卷添加一个新题目组件。生成符合 JSON Template 的完整配置，需用户在前端确认后才会写入画布。',
      inputSchema: componentInputSchema,
      execute: async ({ type, title, props, description }) => {
        const result = normalizeProposedComponent({ type, title, props })
        if (result.ok === false) {
          return JSON.stringify({ error: result.error })
        }
        return toolResult('add_component', result.data, description)
      },
    }),

    propose_update_component: tool({
      description:
        '更新已有组件（必须提供 fe_id）。合并 props 后返回完整组件配置提案。',
      inputSchema: componentInputSchema.extend({
        fe_id: z.string().describe('要更新的组件 fe_id'),
      }),
      execute: async ({ fe_id, type, title, props, description }) => {
        const result = normalizeProposedComponent({
          type,
          title,
          props,
          fe_id,
        })
        if (result.ok === false) {
          return JSON.stringify({ error: result.error })
        }
        return toolResult('update_component', result.data, description)
      },
    }),

    propose_delete_component: tool({
      description: '删除指定 fe_id 的组件（需用户确认）',
      inputSchema: z.object({
        fe_id: z.string().describe('要删除的组件 fe_id'),
        description: z.string().optional(),
      }),
      execute: async ({ fe_id, description }) => {
        return toolResult(
          'delete_component',
          { fe_id },
          description ?? `删除组件 ${fe_id}`,
        )
      },
    }),

    suggest_improvement: tool({
      description: '仅提供优化建议，不修改问卷结构',
      inputSchema: z.object({
        suggestions: z
          .array(z.string())
          .describe('具体建议条目'),
        summary: z.string().optional(),
      }),
      execute: async ({ suggestions, summary }) => {
        return JSON.stringify({
          actionType: 'suggest_improvement',
          data: { suggestions, summary },
          status: 'info_only',
        })
      },
    }),
  }
}

export function createQuestionnaireAgent(
  configService: ConfigService,
  context?: QuestionnaireAgentContext,
) {
  const provider = createSiliconFlowProvider(configService)
  const modelId = getSiliconFlowModelId(configService)

  return new ToolLoopAgent({
    model: provider.chat(modelId),
    instructions: buildQuestionnaireAgentSystemPrompt(context),
    tools: createQuestionnaireTools(),
    stopWhen: stepCountIs(12),
    temperature: 0.7,
    maxOutputTokens: 4096,
  })
}
