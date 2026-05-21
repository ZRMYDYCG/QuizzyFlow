/**
 * 从问卷/模板结构中抽取用于敏感词检测的纯文本
 */

function extractTextFromValue(value: unknown): string {
  if (value == null) return ''
  if (typeof value === 'string' || typeof value === 'number') return String(value)
  if (Array.isArray(value)) {
    return value.map(extractTextFromValue).filter(Boolean).join(' ')
  }
  if (typeof value === 'object') {
    return Object.values(value as Record<string, unknown>)
      .map(extractTextFromValue)
      .filter(Boolean)
      .join(' ')
  }
  return ''
}

function extractTextFromComponents(componentList?: unknown[]): string {
  if (!Array.isArray(componentList)) return ''

  return componentList
    .map((component) => {
      if (!component || typeof component !== 'object') return ''
      const item = component as Record<string, unknown>
      const parts = [item.title, extractTextFromValue(item.props)]
      return parts.filter(Boolean).join(' ')
    })
    .filter(Boolean)
    .join(' ')
}

export function buildModerationScanText(parts: {
  title?: string
  description?: string
  desc?: string
  componentList?: unknown[]
  templateData?: {
    title?: string
    desc?: string
    componentList?: unknown[]
  }
}): string {
  const chunks: string[] = []

  if (parts.title) chunks.push(parts.title)
  if (parts.description) chunks.push(parts.description)
  if (parts.desc) chunks.push(parts.desc)

  if (parts.templateData) {
    if (parts.templateData.title) chunks.push(parts.templateData.title)
    if (parts.templateData.desc) chunks.push(parts.templateData.desc)
    chunks.push(extractTextFromComponents(parts.templateData.componentList))
  }

  chunks.push(extractTextFromComponents(parts.componentList))

  return chunks.filter(Boolean).join(' ')
}
