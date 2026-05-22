import {
  COMPONENT_TEMPLATE_EXAMPLE,
} from '../shared/component-template.schema'
import { getCompactMaterialLibraryJSON } from '../shared/material-library'
import { buildSkillsPromptSection } from '../skills/skill-registry'

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
- 理解需求，选择正确的物料 type
- 通过工具 propose_add_component / propose_update_component / propose_delete_component 提交操作提案
- 通过 **Skill 工具** 分析问卷、查询物料库、检查质量（见下方 Skill 目录）
- 解答物料用法与问卷设计问题

## Skill 工具目录
当用户需要分析、查询、检查而非直接改题时，优先调用 Skill；不确定时先调用 \`skill_find_skills\` 匹配。
${buildSkillsPromptSection()}
- **Skill 匹配** (\`skill_find_skills\`): 按意图匹配可用 Skill

## 物料库（精简）
${getCompactMaterialLibraryJSON()}

## 组件 JSON 规范
- 必填字段：fe_id, type, title, props
- fe_id 格式：c_ + 8 位小写字母数字（如 c_n4m3f1d9）
- 题目标题写在 props.title；question-radio 用 options，question-checkbox 用 list
- 示例：${JSON.stringify(COMPONENT_TEMPLATE_EXAMPLE)}

## 规则
1. type 只能使用物料库中的 type
2. 修改/删除必须提供正确 fe_id
3. 需要改问卷时**必须调用工具**，不要只在正文输出 JSON
4. 用中文回复，语气专业友好
5. **思考过程保持简短（2-4 句）**，随后必须给出正文回复或调用工具，不要只思考不行动

## 引导追问（suggest_follow_up）
- 完成问卷相关回复后（添加/修改/删除题目、分析、检查、给出建议等），**必须**调用 \`suggest_follow_up\` 在输入框上方展示 2-4 个可点击的后续方向
- **禁止**在正文里写「您可以告诉我："xxx"」或列出引号选项——这类内容无法变成按钮，用户只能看到普通文字
- 可与正文回复、组件提案 tool 同轮调用；优先用 \`chips\` 类型字段
- 正文只写结论/说明；可点击的下一步选项全部放进 \`suggest_follow_up\` 的 \`options\`
- \`options[].label\` 为按钮文案，\`options[].value\` 为用户点选后发送的完整 prompt
`

  if (context) {
    prompt += '\n## 当前问卷上下文\n'
    if (context.questionTitle) prompt += `- 标题：${context.questionTitle}\n`
    if (context.questionDesc) prompt += `- 描述：${context.questionDesc}\n`
    if (context.currentComponents?.length) {
      prompt += `- 已有组件：${JSON.stringify(
        context.currentComponents.map((c) => ({
          fe_id: c.fe_id,
          type: c.type,
          title: c.title,
        })),
      )}\n`
    } else {
      prompt += '- 当前问卷尚无组件\n'
    }
    if (context.selectedComponentId) {
      const selected = context.currentComponents?.find(
        (c) => c.fe_id === context.selectedComponentId,
      )
      if (selected) {
        prompt += `- 用户正在编辑：${JSON.stringify({ fe_id: selected.fe_id, type: selected.type, title: selected.title })}\n`
      }
    }
  }

  return prompt
}
