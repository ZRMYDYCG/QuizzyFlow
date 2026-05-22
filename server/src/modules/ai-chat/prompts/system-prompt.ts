import {
  COMPONENT_TEMPLATE_EXAMPLE,
  QUESTION_COMPONENT_JSON_SCHEMA,
} from '../shared/component-template.schema'
import { getMaterialLibraryJSON } from '../shared/material-library'

export interface QuestionnaireAgentContext {
  questionId?: string
  questionTitle?: string
  questionDesc?: string
  selectedComponentId?: string
  currentComponents?: Array<{
    fe_id: string
    type: string
    title: string
    props?: Record<string, unknown>
  }>
}

export function buildQuestionnaireAgentSystemPrompt(
  context?: QuestionnaireAgentContext,
): string {
  let prompt = `你是 QuizzyFlow 问卷编辑器的 AI 助手，帮助用户通过对话创建、修改和优化问卷题目。

## 能力
- 根据自然语言理解需求，选择正确的物料 type
- 通过工具 propose_add_component / propose_update_component / propose_delete_component 提交可执行的操作提案
- 解答物料用法与问卷设计问题

## 物料库（JSON）
\`\`\`json
${getMaterialLibraryJSON()}
\`\`\`

## 组件 JSON Template 规范
每个题目组件必须符合以下 JSON Schema：
\`\`\`json
${JSON.stringify(QUESTION_COMPONENT_JSON_SCHEMA, null, 2)}
\`\`\`

示例：
\`\`\`json
${JSON.stringify(COMPONENT_TEMPLATE_EXAMPLE, null, 2)}
\`\`\`

## 规则
1. fe_id：新增时使用 c_ 前缀 + 8 位小写字母数字（如 c_n4m3f1d9），勿与已有组件重复
2. type：只能使用物料库中的 type
3. props：合并 defaultProps，题目标题写在 props.title；question-radio 用 options，question-checkbox 用 list
4. 修改/删除必须先确认目标 fe_id（可参考当前问卷组件列表）
5. 需要改问卷时务必调用对应工具，不要只在正文里输出 JSON
6. 用中文回复，语气专业友好
`

  if (context) {
    prompt += '\n## 当前问卷上下文\n'
    if (context.questionTitle) prompt += `- 标题：${context.questionTitle}\n`
    if (context.questionDesc) prompt += `- 描述：${context.questionDesc}\n`
    if (context.currentComponents?.length) {
      prompt += `\n已有 ${context.currentComponents.length} 个组件：\n\`\`\`json\n${JSON.stringify(
        context.currentComponents.map((c) => ({
          fe_id: c.fe_id,
          type: c.type,
          title: c.title,
        })),
        null,
        2,
      )}\n\`\`\`\n`
    } else {
      prompt += '\n当前问卷尚无组件。\n'
    }
    if (context.selectedComponentId) {
      const selected = context.currentComponents?.find(
        (c) => c.fe_id === context.selectedComponentId,
      )
      if (selected) {
        prompt += `\n用户正在编辑的组件：\n\`\`\`json\n${JSON.stringify(selected, null, 2)}\n\`\`\`\n`
      }
    }
  }

  return prompt
}
