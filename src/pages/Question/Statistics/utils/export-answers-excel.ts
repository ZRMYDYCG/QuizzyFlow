import * as XLSX from 'xlsx'
import dayjs from 'dayjs'
import { STATS_META, META_COLUMN_LABELS } from '../constants'

export interface ExportColumn {
  key: string
  title: string
}

function cellToExportString(value: unknown): string {
  if (value === null || value === undefined || value === '') return ''
  if (typeof value === 'string') {
    if (value.startsWith('data:image')) return '[已签名]'
    return value
  }
  if (Array.isArray(value)) return value.map(String).join(', ')
  if (typeof value === 'object') {
    return Object.entries(value as Record<string, unknown>)
      .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(', ') : v}`)
      .join('; ')
  }
  return String(value)
}

export function buildExportColumns(
  componentList: { fe_id: string; title?: string; props?: { title?: string } }[]
): ExportColumn[] {
  const metaCols: ExportColumn[] = [
    { key: STATS_META.submittedAt, title: META_COLUMN_LABELS[STATS_META.submittedAt] },
    { key: STATS_META.respondentName, title: META_COLUMN_LABELS[STATS_META.respondentName] },
    { key: STATS_META.duration, title: META_COLUMN_LABELS[STATS_META.duration] },
    { key: STATS_META.isAnonymous, title: META_COLUMN_LABELS[STATS_META.isAnonymous] },
  ]

  const questionCols = componentList
    .filter((c) => !c.fe_id?.startsWith('__'))
    .map((c) => ({
      key: c.fe_id,
      title: c.props?.title || c.title || c.fe_id,
    }))

  return [...metaCols, ...questionCols]
}

export function rowsToSheetData(
  list: Record<string, unknown>[],
  columns: ExportColumn[]
): Record<string, string>[] {
  return list.map((row, index) => {
    const sheetRow: Record<string, string> = {
      序号: String(index + 1),
    }
    columns.forEach(({ key, title }) => {
      sheetRow[title] = cellToExportString(row[key])
    })
    return sheetRow
  })
}

export function downloadAnswersExcel(
  list: Record<string, unknown>[],
  columns: ExportColumn[],
  filenamePrefix: string
) {
  if (list.length === 0) {
    throw new Error('没有可导出的数据')
  }

  const sheetData = rowsToSheetData(list, columns)
  const worksheet = XLSX.utils.json_to_sheet(sheetData)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, '答卷数据')

  const filename = `${filenamePrefix}_${dayjs().format('YYYY-MM-DD_HHmmss')}.xlsx`
  XLSX.writeFile(workbook, filename)
}
