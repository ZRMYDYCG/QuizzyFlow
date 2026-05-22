import type { AIContext, AIAction, FollowUpGuide, Message } from '../types'

export function isFollowUpGuide(data: unknown): data is FollowUpGuide {
  if (!data || typeof data !== 'object') return false
  const guide = data as FollowUpGuide
  return Array.isArray(guide.fields) && guide.fields.length > 0
}

export function isLocalFollowUpActionId(actionId?: string): boolean {
  return !!actionId?.startsWith('local-')
}

const FOLLOW_UP_TRIGGER =
  /需要我(?:立即)?执行|您可以告诉我|您可以选择|接下来(?:可以|您)|需要我继续|请告诉我|是否(?:需要|要)|或其他具体需求/i

const FOLLOW_UP_SECTION_START =
  /(?:^|\n)\s*(?:需要我(?:立即)?执行哪些操作|您可以告诉我|您可以选择以下|接下来(?:可以|您)|请(?:选择|告诉我))/i

function normalizeOptionLabel(raw: string): string {
  return raw
    .replace(/^[\s\-*•·\d.)、]+/, '')
    .replace(/^[「『"'""]|["'""」』]$/g, '')
    .trim()
}

function toFollowUpPrompt(label: string): string {
  if (/^(请|帮我|帮忙)/.test(label)) return label
  if (/删除|移除|去掉/.test(label)) return `请${label}`
  if (/新增|添加|加上|补充/.test(label)) return `请${label}`
  return `请帮我${label}`
}

/**
 * 从 AI 正文中解析「引号选项 / 列表」式引导追问（未调用 suggest_follow_up 时的兜底）
 */
export function parseFollowUpFromContent(content: string): {
  guide: FollowUpGuide
  cleanedContent: string
} | null {
  const text = content.trim()
  if (!text || !FOLLOW_UP_TRIGGER.test(text)) return null

  const options: Array<{ label: string; value: string }> = []
  const seen = new Set<string>()

  const quotePatterns = [
    /[""「『]([^""」』\n]{2,80})[""」』]/g,
    /"([^"\n]{2,80})"/g,
  ]

  for (const pattern of quotePatterns) {
    pattern.lastIndex = 0
    let match: RegExpExecArray | null
    while ((match = pattern.exec(text)) !== null) {
      const label = normalizeOptionLabel(match[1])
      if (!label || seen.has(label)) continue
      seen.add(label)
      options.push({ label, value: toFollowUpPrompt(label) })
    }
  }

  if (options.length < 2) {
    const linePattern = /(?:^|\n)\s*(?:[-*•·]|\d+[.)、])\s*([^\n]{2,80})/g
    let match: RegExpExecArray | null
    while ((match = linePattern.exec(text)) !== null) {
      const label = normalizeOptionLabel(match[1])
      if (!label || /或其他|具体需求/.test(label) || seen.has(label)) continue
      seen.add(label)
      options.push({ label, value: toFollowUpPrompt(label) })
    }
  }

  if (options.length < 2) return null

  const sectionMatch = text.match(FOLLOW_UP_SECTION_START)
  let cleanedContent = text
  if (sectionMatch?.index != null) {
    cleanedContent = text.slice(0, sectionMatch.index).trim()
  }

  const titleLine = text.slice(sectionMatch?.index ?? 0).split('\n')[0]?.trim()
  const title =
    titleLine && titleLine.length <= 60
      ? titleLine.replace(/[：:]\s*$/, '')
      : '还可以继续帮你'

  return {
    guide: {
      title,
      description: '点选下方选项，或直接输入你的需求',
      fields: [
        {
          id: 'next',
          type: 'chips',
          label: '选择一个操作',
          options: options.slice(0, 6),
        },
      ],
      dismissLabel: '暂不需要',
    },
    cleanedContent,
  }
}

export function resolveAssistantDisplayContent(message: Message): string {
  const base = message.contentDisplay ?? message.content
  const withoutActionBlocks = base.replace(/```action\s*[\s\S]*?```/g, '').trim()

  if (message.contentDisplay != null) return withoutActionBlocks

  if (message.followUp && !message.followUpUsed) {
    const parsed = parseFollowUpFromContent(message.content)
    if (parsed) return parsed.cleanedContent.replace(/```action\s*[\s\S]*?```/g, '').trim()
  }

  return withoutActionBlocks
}

export function applyContentParsedFollowUp(message: Message): Message {
  if (message.role !== 'assistant' || message.followUpUsed || message.followUp) {
    return message
  }

  const parsed = parseFollowUpFromContent(message.content)
  if (!parsed) return message

  return {
    ...message,
    contentDisplay: parsed.cleanedContent,
    followUp: parsed.guide,
    followUpActionId: `local-parsed-${message.id}`,
  }
}

export function splitFollowUpFromActions(actions?: AIAction[]): {
  actions?: AIAction[]
  followUp?: FollowUpGuide
  followUpActionId?: string
  followUpUsed?: boolean
} {
  if (!actions?.length) return {}

  const followUpAction = actions.find((a) => a.type === 'follow_up')
  const rest = actions.filter((a) => a.type !== 'follow_up')

  if (!followUpAction || !isFollowUpGuide(followUpAction.data)) {
    return { actions: actions.length ? actions : undefined }
  }

  return {
    actions: rest.length ? rest : undefined,
    followUp: followUpAction.data,
    followUpActionId: followUpAction.id,
    followUpUsed: !!followUpAction.applied,
  }
}

export function mergeFollowUpIntoActions(message: Message): AIAction[] | undefined {
  const base = message.actions?.filter((a) => a.type !== 'follow_up') ?? []

  if (!message.followUpActionId || !message.followUp) {
    return base.length ? base : undefined
  }

  if (isLocalFollowUpActionId(message.followUpActionId)) {
    return base.length ? base : undefined
  }

  return [
    ...base,
    {
      id: message.followUpActionId,
      type: 'follow_up',
      data: message.followUp,
      applied: !!message.followUpUsed,
      appliedAt: message.followUpUsed ? Date.now() : undefined,
    },
  ]
}

export function composeFollowUpMessage(
  guide: FollowUpGuide,
  values: Record<string, string | string[]>,
): string {
  const parts: string[] = []

  for (const field of guide.fields) {
    const val = values[field.id]
    if (val == null || val === '') continue
    if (Array.isArray(val)) {
      if (val.length === 0) continue
      parts.push(val.join('；'))
      continue
    }
    if (field.type === 'text') {
      parts.push(`${field.label}：${val}`)
      continue
    }
    parts.push(val)
  }

  return parts.filter(Boolean).join('\n')
}

export function getActiveFollowUpMessage(messages: Message[], isLoading: boolean): Message | null {
  if (isLoading || messages.length === 0) return null

  for (let i = messages.length - 1; i >= 0; i -= 1) {
    const msg = messages[i]
    if (msg.role === 'user') break
    if (msg.role !== 'assistant' || msg.isStreaming) continue
    if (!msg.followUp || msg.followUpUsed) continue
    return msg
  }

  return null
}

interface FallbackOption {
  label: string
  value: string
  when?: (ctx: AIContext, last: Message) => boolean
}

const FALLBACK_OPTIONS: FallbackOption[] = [
  {
    label: '检查问卷质量',
    value: '请检查一下当前问卷有没有质量问题，并给出改进建议',
    when: (ctx) => (ctx.currentComponents?.length ?? 0) > 0,
  },
  {
    label: '分析问卷结构',
    value: '请分析一下当前问卷的结构和题型分布',
    when: (ctx) => (ctx.currentComponents?.length ?? 0) > 0,
  },
  {
    label: '补充背景题',
    value: '帮我补充姓名、联系方式等基础背景信息题',
    when: (ctx) => (ctx.currentComponents?.length ?? 0) < 5,
  },
  {
    label: '添加满意度题',
    value: '帮我添加一道满意度评分题',
  },
  {
    label: '优化题目表述',
    value: '帮我优化现有题目的表述，让问题更清晰易懂',
    when: (ctx) => (ctx.currentComponents?.length ?? 0) > 0,
  },
  {
    label: '查看可用题型',
    value: '有哪些适合用在问卷里的题型？帮我推荐几种',
  },
  {
    label: '从零搭建问卷',
    value: '当前问卷还是空的，帮我从零搭建一份基础问卷',
    when: (ctx) => (ctx.currentComponents?.length ?? 0) === 0,
  },
]

/** 按消息 id 稳定选取，避免每次 merge 随机打乱触发多余 setState */
function pickStableOptions(items: FallbackOption[], seed: string, count: number): FallbackOption[] {
  if (items.length <= count) return items
  const sorted = [...items].sort((a, b) => a.label.localeCompare(b.label, 'zh-CN'))
  const offset =
    seed.split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0) % sorted.length
  const picked: FallbackOption[] = []
  for (let i = 0; i < count; i += 1) {
    picked.push(sorted[(offset + i) % sorted.length])
  }
  return picked
}

function shouldOfferFallback(last: Message): boolean {
  const content = (last.content ?? '').trim()
  const hasProposals = (last.actions?.length ?? 0) > 0
  const hasTools = (last.toolCalls?.length ?? 0) > 0
  const hasReasoning = !!last.reasoning?.trim()

  if (hasProposals || hasTools) return true
  if (content.length >= 40) return true
  if (/问卷|题目|组件|优化|添加|修改|分析|检查|满意度|单选|多选/.test(content)) {
    return true
  }
  if (hasReasoning && content.length >= 15) return true
  return false
}

export function generateFallbackFollowUp(
  context: AIContext,
  messages: Message[],
): FollowUpGuide | null {
  if (messages.length === 0) return null
  const last = messages[messages.length - 1]
  if (last.role !== 'assistant' || last.isStreaming || last.followUpUsed) return null
  if (last.followUp) return null
  if (!shouldOfferFallback(last)) return null

  const candidates = FALLBACK_OPTIONS.filter(
    (opt) => !opt.when || opt.when(context, last),
  )
  if (candidates.length === 0) return null

  const picked = pickStableOptions(candidates, last.id, 3)

  return {
    title: '还可以继续帮你优化',
    description: '选一个方向，或直接在下方的输入框继续聊',
    fields: [
      {
        id: 'next',
        type: 'chips',
        label: '下一步想做什么？',
        options: picked.map(({ label, value }) => ({ label, value })),
      },
    ],
    dismissLabel: '暂不需要',
  }
}

export function attachFallbackFollowUp(
  messages: Message[],
  previous: Message[],
  context?: AIContext,
  isStreaming?: boolean,
): Message[] {
  if (isStreaming || messages.length === 0) return messages

  const lastIdx = messages.length - 1
  const last = messages[lastIdx]
  const prev = previous[lastIdx]

  if (last.role !== 'assistant' || last.isStreaming || last.followUpUsed) {
    return messages
  }

  if (last.followUp) return messages

  // 保持已生成的本地引导
  if (
    prev?.followUp &&
    !prev.followUpUsed &&
    isLocalFollowUpActionId(prev.followUpActionId)
  ) {
    const updated = [...messages]
    updated[lastIdx] = {
      ...last,
      followUp: prev.followUp,
      followUpActionId: prev.followUpActionId,
      contentDisplay: prev.contentDisplay,
    }
    return updated
  }

  // 优先：从 AI 正文解析引号/列表式引导
  const parsed = parseFollowUpFromContent(last.content)
  if (parsed) {
    const updated = [...messages]
    updated[lastIdx] = {
      ...last,
      contentDisplay: parsed.cleanedContent,
      followUp: parsed.guide,
      followUpActionId: `local-parsed-${last.id}`,
    }
    return updated
  }

  if (!context) return messages

  const guide = generateFallbackFollowUp(context, messages)
  if (!guide) return messages

  const updated = [...messages]
  updated[lastIdx] = {
    ...last,
    followUp: guide,
    followUpActionId: `local-${last.id}`,
  }
  return updated
}
