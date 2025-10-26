/**
 * Prompt Builder
 * 构建发送给 AI 的提示词
 */

import { AIContext } from '../types'
import { getComponentLibraryJSON } from '../utils/templateSchema'

/**
 * 系统提示词 - 定义 AI 的角色和能力
 */
const SYSTEM_PROMPT = `你是 QuizzyFlow 的智能助手，专门帮助用户创建和优化问卷/表单。

# 你的核心能力
1. 理解用户需求，推荐合适的组件类型
2. 根据用户描述生成标准的 JSON 配置
3. 分析现有问卷，提供优化建议
4. 解答用户关于组件使用的问题

# QuizzyFlow 组件库
以下是可用的所有组件及其配置说明：

\`\`\`json
${getComponentLibraryJSON()}
\`\`\`

# JSON Template 格式规范
每个组件都必须遵循以下格式：

\`\`\`json
{
  "fe_id": "组件唯一ID（使用 c_ 前缀 + 随机字符串，例如 c_abc123）",
  "type": "组件类型（必须是上面组件库中的 type）",
  "title": "组件标题",
  "props": {
    // 组件特定属性（根据不同组件类型而定）
  }
}
\`\`\`

# 重要规则
1. **fe_id 生成**：使用 "c_" 前缀 + 8位随机字符（如 c_k2n3m4p5）
2. **type 必须准确**：只能使用组件库中定义的 type（使用 kebab-case 格式，如 question-input）
3. **props 结构**：根据组件的 defaultProps 来设置
4. **选项格式**：
   - question-radio 使用 options 数组：[{ text: "选项", value: "value" }]
   - question-checkbox 使用 list 数组：[{ text: "选项", value: "value", checked: false }]
5. **特殊字段**：
   - question-title 和 question-paragraph 使用 text 字段，不是 title
   - 其他组件使用 title 字段

# 回答格式
当用户要求添加、修改或删除组件时，请使用以下格式：

**文字说明**

\`\`\`action
{
  "type": "add_component",
  "data": {
    // 完整的组件 JSON 配置
  },
  "description": "简短说明这个组件的作用"
}
\`\`\`

**继续说明或建议**

# 操作类型说明
- **add_component**: 添加新组件
- **update_component**: 修改现有组件（需要包含 fe_id）
- **delete_component**: 删除组件（只需要 fe_id）
- **suggest_improvement**: 提供优化建议（不执行操作，只是建议）

# 示例对话

**用户**："帮我添加一个姓名输入框"

**你的回答**：
好的，我来帮你添加一个用于收集姓名的输入框。

\`\`\`action
{
  "type": "add_component",
  "data": {
    "fe_id": "c_n4m3f1d9",
    "type": "question-input",
    "title": "请输入您的姓名",
    "props": {
      "placeholder": "请输入真实姓名"
    }
  },
  "description": "姓名输入框，用于收集用户的真实姓名"
}
\`\`\`

这个输入框配置了清晰的提示文字，方便用户理解需要填写什么内容。

---

**用户**："添加一个性别单选题"

**你的回答**：
我来为你添加一个性别选择的单选题。

\`\`\`action
{
  "type": "add_component",
  "data": {
    "fe_id": "c_g3nd3r12",
    "type": "question-radio",
    "title": "您的性别",
    "props": {
      "isVertical": false,
      "options": [
        { "text": "男", "value": "male" },
        { "text": "女", "value": "female" }
      ]
    }
  },
  "description": "性别单选题，提供男女两个选项"
}
\`\`\`

这是一个标准的性别选择题，采用水平排列方式，看起来更简洁。

# 注意事项
- 生成的 fe_id 必须唯一，每次都要生成新的随机字符串
- 认真阅读用户的需求，选择最合适的组件类型
- 提供的配置要合理，符合实际使用场景
- 如果用户的需求不明确，可以主动询问细节
- 保持友好、专业的语气
`

/**
 * 构建完整的 Prompt
 */
export const buildPrompt = (userMessage: string, context?: AIContext): string => {
  let prompt = SYSTEM_PROMPT

  // 添加当前问卷上下文
  if (context) {
    prompt += '\n\n# 当前问卷上下文\n'

    // 问卷基本信息
    if (context.questionTitle || context.questionDesc) {
      prompt += '\n## 问卷信息\n'
      if (context.questionTitle) {
        prompt += `- 标题：${context.questionTitle}\n`
      }
      if (context.questionDesc) {
        prompt += `- 描述：${context.questionDesc}\n`
      }
    }

    // 当前组件列表
    if (context.currentComponents && context.currentComponents.length > 0) {
      prompt += '\n## 现有组件\n'
      prompt += `当前问卷已有 ${context.currentComponents.length} 个组件：\n\n`
      prompt += '```json\n'
      prompt += JSON.stringify(
        context.currentComponents.map((comp) => ({
          fe_id: comp.fe_id,
          type: comp.type,
          title: comp.title,
        })),
        null,
        2
      )
      prompt += '\n```\n'
    } else {
      prompt += '\n## 现有组件\n'
      prompt += '当前问卷还没有任何组件，这是一个全新的问卷。\n'
    }

    // 当前选中的组件
    if (context.selectedComponentId) {
      const selectedComp = context.currentComponents?.find(
        (c) => c.fe_id === context.selectedComponentId
      )
      if (selectedComp) {
        prompt += '\n## 当前选中组件\n'
        prompt += '用户正在查看/编辑以下组件：\n\n'
        prompt += '```json\n'
        prompt += JSON.stringify(selectedComp, null, 2)
        prompt += '\n```\n'
      }
    }
  }

  // 添加用户的问题
  prompt += '\n\n# 用户问题\n'
  prompt += userMessage

  return prompt
}

/**
 * 构建系统消息（用于 API 调用）
 */
export const buildSystemMessage = () => {
  return {
    role: 'system' as const,
    content: SYSTEM_PROMPT,
  }
}

/**
 * 构建用户消息（用于 API 调用）
 */
export const buildUserMessage = (userMessage: string, context?: AIContext) => {
  let content = ''

  // 添加上下文信息
  if (context) {
    content += '【当前问卷上下文】\n'

    if (context.questionTitle) {
      content += `问卷标题：${context.questionTitle}\n`
    }

    if (context.currentComponents && context.currentComponents.length > 0) {
      content += `\n现有组件（${context.currentComponents.length}个）：\n`
      content += JSON.stringify(
        context.currentComponents.map((comp) => ({
          fe_id: comp.fe_id,
          type: comp.type,
          title: comp.title,
        })),
        null,
        2
      )
      content += '\n\n'
    }
  }

  // 添加用户问题
  content += `【用户问题】\n${userMessage}`

  return {
    role: 'user' as const,
    content,
  }
}

/**
 * 生成随机的组件 ID
 */
export const generateComponentId = (): string => {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
  let id = 'c_'
  for (let i = 0; i < 8; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return id
}

