/**
 * 将 AI 提案中的 fe_id 解析为当前问卷上下文中的真实 ID。
 * 兼容 AI 误加 c_ 前缀、用 c_001 表示第 1 题序号等情况。
 */
export function resolveFeIdInList(
  requestedId: string | undefined,
  knownIds: string[],
): string | null {
  const requested = requestedId?.trim()
  if (!requested) return null
  if (knownIds.length === 0) return null

  if (knownIds.includes(requested)) return requested

  if (requested.startsWith('c_')) {
    const bare = requested.slice(2)
    if (knownIds.includes(bare)) return bare
  } else if (knownIds.includes(`c_${requested}`)) {
    return `c_${requested}`
  }

  const byIndex = resolveByListIndex(requested, knownIds)
  if (byIndex) return byIndex

  const lower = requested.toLowerCase()
  const caseMatch = knownIds.find((id) => id.toLowerCase() === lower)
  if (caseMatch) return caseMatch

  const suffixMatches = knownIds.filter(
    (id) =>
      id.endsWith(requested) ||
      id.toLowerCase().endsWith(lower) ||
      (requested.startsWith('c_') &&
        (id.endsWith(requested.slice(2)) ||
          id.toLowerCase().endsWith(requested.slice(2).toLowerCase()))),
  )
  if (suffixMatches.length === 1) return suffixMatches[0]

  return null
}

/** c_001 / 1 / #1 / 第1题 → 题目顺序中的第 N 个 fe_id（1-based） */
function resolveByListIndex(
  requested: string,
  knownIds: string[],
): string | null {
  const patterns = [
    /^c_0*(\d{1,3})$/i,
    /^#?0*(\d{1,3})$/,
    /^第(\d{1,3})题$/,
  ]

  for (const pattern of patterns) {
    const match = requested.match(pattern)
    if (!match) continue
    const index = parseInt(match[1], 10)
    if (index >= 1 && index <= knownIds.length) {
      return knownIds[index - 1]
    }
  }

  return null
}

export function formatKnownFeIds(knownIds: string[]): string {
  if (!knownIds.length) return '（当前无题目）'
  return knownIds.join(', ')
}
