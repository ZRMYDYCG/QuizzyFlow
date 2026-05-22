import { tool, stepCountIs, ToolLoopAgent, extractReasoningMiddleware, wrapLanguageModel } from 'ai'
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
import { createSkillTools } from './skill-tools'

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

    suggest_follow_up: tool({
      description:
        '在回复完成后，若用户仍有优化空间或需要澄清需求，调用此工具在对话底部展示引导追问表单。简单问答、需求已完全满足时不要调用。',
      inputSchema: z.object({
        title: z.string().optional().describe('引导标题，如「还可以继续帮你」'),
        description: z.string().optional().describe('补充说明'),
        fields: z
          .array(
            z.object({
              id: z.string().describe('字段唯一 id'),
              type: z
                .enum(['chips', 'single_choice', 'multi_choice', 'text'])
                .describe(
                  'chips=快捷按钮一键发送；single_choice=单选；multi_choice=多选；text=文本补充',
                ),
              label: z.string().describe('字段标签/问题'),
              placeholder: z.string().optional(),
              options: z
                .array(
                  z.object({
                    label: z.string().describe('展示文案'),
                    value: z
                      .string()
                      .describe('用户选择后发送给 AI 的完整 prompt'),
                  }),
                )
                .optional()
                .describe('chips / single_choice / multi_choice 必填'),
              required: z.boolean().optional(),
            }),
          )
          .min(1)
          .max(4)
          .describe('1-4 个引导字段，优先用 chips 提供 2-4 个具体优化方向'),
        submitLabel: z.string().optional().describe('提交按钮文案，默认「发送」'),
        dismissLabel: z.string().optional().describe('跳过文案，默认「暂不需要」'),
      }),
      execute: async (input) => {
        return JSON.stringify({
          actionType: 'follow_up',
          data: input,
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
  const baseModel = provider.chat(modelId)
  const model = wrapLanguageModel({
    model: baseModel,
    middleware: extractReasoningMiddleware({ tagName: 'think' }),
  })

  return new ToolLoopAgent({
    model,
    instructions: buildQuestionnaireAgentSystemPrompt(context),
    tools: {
      ...createQuestionnaireTools(),
      ...createSkillTools(context),
    },
    stopWhen: stepCountIs(12),
    temperature: 0.7,
    maxOutputTokens: 8192,
  })
}
