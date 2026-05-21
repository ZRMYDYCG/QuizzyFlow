/** 与后端 statistics.service STATS_META 保持一致 */
export const STATS_META = {
  submittedAt: '__submittedAt',
  respondentName: '__respondentName',
  duration: '__duration',
  isAnonymous: '__isAnonymous',
} as const

export const META_COLUMN_LABELS: Record<string, string> = {
  [STATS_META.submittedAt]: '提交时间',
  [STATS_META.respondentName]: '填写者',
  [STATS_META.duration]: '答题用时',
  [STATS_META.isAnonymous]: '匿名',
}

/** 支持选项分布图表的组件类型 */
export const CHART_STAT_TYPES = new Set([
  'question-radio',
  'question-checkbox',
  'question-select',
])
