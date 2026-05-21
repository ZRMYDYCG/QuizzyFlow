import { memo, useState, useMemo, useCallback, useEffect } from 'react'
import { useRequest, useResponsive } from 'ahooks'
import { useParams } from 'react-router-dom'
import {
  Typography,
  Spin,
  Table,
  Pagination,
  Tooltip,
  Image,
  Tag,
  Rate,
  Button,
  Space,
  Input,
  message,
} from 'antd'
import {
  DownloadOutlined,
  ReloadOutlined,
  FileExcelOutlined,
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'
import {
  getQuestionsStatistics,
  exportQuestionsStatistics,
} from '@/api/modules/statistics'
import useGetComponentInfo from '@/hooks/useGetComponentInfo'
import useGetPageInfo from '@/hooks/useGetPageInfo'
import { cn } from '@/utils/index'
import { useTheme } from '@/contexts/ThemeContext'
import { useManageTheme } from '@/hooks/useManageTheme'
import type { ComponentSelectionProps, StatisticsAnswer } from '../types'
import { STATS_META, META_COLUMN_LABELS, CHART_STAT_TYPES } from '../constants'
import StatisticsOverview from './statistics-overview'
import ComponentStatPanel from './component-stat-panel'
import {
  buildExportColumns,
  downloadAnswersExcel,
} from '../utils/export-answers-excel'

const cellText = {
  muted: (isDark: boolean) => (isDark ? 'text-slate-500' : 'text-gray-400'),
  secondary: (isDark: boolean) => (isDark ? 'text-slate-400' : 'text-gray-600'),
  label: (isDark: boolean) => (isDark ? 'text-slate-300' : 'text-gray-700'),
  hint: (isDark: boolean) => (isDark ? 'text-slate-500' : 'text-gray-500'),
}

interface ComponentData {
  fe_id: string
  title: string
  type: string
  isHidden?: boolean
  props?: Record<string, any>
}

// 根据组件类型渲染不同的单元格内容
const renderCellByType = (
  type: string,
  value: any,
  props?: any,
  isMobile?: boolean,
  primaryColor?: string,
  isDark = false
) => {
  // 空值处理
  if (value === null || value === undefined || value === '') {
    return (
      <span className={cn(cellText.muted(isDark), 'text-xs md:text-sm')}>-</span>
    )
  }

  switch (type) {
    // ========== 签名组件 - 显示图片预览 ==========
    case 'question-signature':
      if (typeof value === 'string' && value.startsWith('data:image')) {
        return (
          <div className="flex items-center gap-1 md:gap-2">
            <Image 
              src={value} 
              alt="签名" 
              width={isMobile ? 60 : 80}
              height={isMobile ? 30 : 40}
              style={{ objectFit: 'contain' }}
              preview={{
                mask: '查看'
              }}
            />
          </div>
        )
      }
      return <span className={cn(cellText.muted(isDark), 'text-xs')}>无签名</span>

    // ========== 颜色选择器 - 显示色块 ==========
    case 'question-color-picker':
      if (typeof value === 'string' && value.startsWith('#')) {
        return (
          <div className="flex items-center gap-1 md:gap-2">
            <div 
              className={cn(
                'w-6 h-6 md:w-8 md:h-8 rounded border-2 shadow-sm flex-shrink-0',
                isDark ? 'border-slate-600' : 'border-gray-300'
              )}
              style={{ backgroundColor: value }}
            />
            {!isMobile && <span className="font-mono text-xs md:text-sm">{value}</span>}
          </div>
        )
      }
      return String(value)

    // ========== 评分组件 - 显示星星 ==========
    case 'question-rate':
    case 'question-star-rating':
      const ratingValue = typeof value === 'string' ? parseFloat(value) : value
      if (!isNaN(ratingValue)) {
        return (
          <div className="flex items-center gap-1 md:gap-2">
            <Rate 
              disabled 
              value={ratingValue} 
              allowHalf 
              style={{ fontSize: isMobile ? 12 : 20 }}
            />
            <span className={cn('text-xs md:text-sm', cellText.secondary(isDark))}>
              ({ratingValue})
            </span>
          </div>
        )
      }
      return String(value)

    // ========== NPS 分数 - 带颜色标识 ==========
    case 'question-nps':
      const npsValue = typeof value === 'string' ? parseInt(value) : value
      if (!isNaN(npsValue) && npsValue >= 0 && npsValue <= 10) {
        let color = 'red'
        let label = '贬损者'
        if (npsValue >= 9) {
          color = 'green'
          label = '推荐者'
        } else if (npsValue >= 7) {
          color = 'orange'
          label = '中立者'
        }
        return (
          <div className="flex items-center gap-1 md:gap-2">
            <Tag color={color} className="m-0">{npsValue} 分</Tag>
            {!isMobile && (
              <span className={cn('text-xs', cellText.hint(isDark))}>{label}</span>
            )}
          </div>
        )
      }
      return String(value)

    // ========== 矩阵组件 - 格式化对象显示 ==========
    case 'question-matrix':
      if (typeof value === 'object' && !Array.isArray(value)) {
        const entries = Object.entries(value)
        if (entries.length === 0) {
          return <span className={cn(cellText.muted(isDark), 'text-xs')}>未填写</span>
        }
        
        return (
          <div className="space-y-0.5 md:space-y-1">
            {entries.slice(0, isMobile ? 2 : undefined).map(([key, val], idx) => (
              <div key={idx} className="text-xs">
                <span className={cn('font-medium', cellText.label(isDark))}>
                  {isMobile ? key.substring(0, 4) : key}:
                </span>{' '}
                <span className={cellText.secondary(isDark)}>
                  {Array.isArray(val) ? val.join(', ') : String(val)}
                </span>
              </div>
            ))}
            {isMobile && entries.length > 2 && (
              <div className={cn('text-xs', cellText.muted(isDark))}>
                +{entries.length - 2}项
              </div>
            )}
          </div>
        )
      }
      return JSON.stringify(value)

    // ========== Emoji 选择器 - 大号显示 ==========
    case 'question-emoji-picker':
      return <span className={isMobile ? 'text-xl' : 'text-2xl'}>{String(value)}</span>

    // ========== 图片选择 - 显示标签 ==========
    case 'question-image-choice':
      if (Array.isArray(value)) {
        return (
          <div className="flex flex-wrap gap-1">
            {value.slice(0, isMobile ? 2 : undefined).map((v, idx) => (
              <Tag key={idx} color="blue" className="text-xs">{v}</Tag>
            ))}
            {isMobile && value.length > 2 && (
              <Tag className="text-xs">+{value.length - 2}</Tag>
            )}
          </div>
        )
      }
      return <Tag color="blue" className="text-xs">{String(value)}</Tag>

    // ========== 文件上传 - 显示文件数量 ==========
    case 'question-upload':
      if (Array.isArray(value)) {
        return (
          <Tag color="cyan" className="text-xs m-0">
            {value.length}个文件
          </Tag>
        )
      }
      return <Tag color="cyan" className="text-xs m-0">1个文件</Tag>

    // ========== 开关组件 - 显示开/关状态 ==========
    case 'question-switch':
      const isOn = value === true || value === 'true' || value === 1
      return (
        <Tag color={isOn ? 'green' : 'default'} className="text-xs m-0">
          {isOn ? '开启' : '关闭'}
        </Tag>
      )

    // ========== 时间选择器 - 格式化时间 ==========
    case 'question-time-picker':
      if (typeof value === 'string') {
        return (
          <span className="text-xs md:text-sm font-mono">
            {value}
          </span>
        )
      }
      return String(value)

    // ========== 数字输入框 - 数字格式化 ==========
    case 'question-number-input':
      const numValue = typeof value === 'string' ? parseFloat(value) : value
      if (!isNaN(numValue)) {
        return (
          <span 
            className="text-xs md:text-sm font-semibold" 
            style={{ color: primaryColor || '#3b82f6' }}
          >
            {numValue.toLocaleString()}
          </span>
        )
      }
      return String(value)

    // ========== 密码输入框 - 隐藏显示 ==========
    case 'question-password-input':
      if (typeof value === 'string' && value.length > 0) {
        return (
          <span className="text-xs md:text-sm font-mono">
            {'•'.repeat(Math.min(value.length, 8))}
            {value.length > 8 ? '...' : ''}
          </span>
        )
      }
      return <span className={cn(cellText.muted(isDark), 'text-xs')}>未填写</span>

    // ========== 邮箱输入框 - 邮箱显示 ==========
    case 'question-email-input':
      if (typeof value === 'string' && value.includes('@')) {
        return (
          <a 
            href={`mailto:${value}`}
            className="text-xs md:text-sm text-blue-500 hover:text-blue-700 hover:underline"
            onClick={(e) => e.stopPropagation()}
          >
            {isMobile && value.length > 20 ? value.substring(0, 17) + '...' : value}
          </a>
        )
      }
      return <span className="text-xs md:text-sm">{String(value)}</span>

    // ========== 电话输入框 - 电话显示 ==========
    case 'question-phone-input':
      if (typeof value === 'string') {
        return (
          <a 
            href={`tel:${value}`}
            className="text-xs md:text-sm text-blue-500 hover:text-blue-700 hover:underline font-mono"
            onClick={(e) => e.stopPropagation()}
          >
            {value}
          </a>
        )
      }
      return <span className="text-xs md:text-sm">{String(value)}</span>

    // ========== URL输入框 - 链接显示 ==========
    case 'question-url-input':
      if (typeof value === 'string' && (value.startsWith('http') || value.startsWith('https'))) {
        const displayUrl = isMobile && value.length > 30 ? value.substring(0, 27) + '...' : value
        return (
          <a 
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs md:text-sm text-blue-500 hover:text-blue-700 hover:underline"
            onClick={(e) => e.stopPropagation()}
          >
            {displayUrl}
          </a>
        )
      }
      return <span className="text-xs md:text-sm">{String(value)}</span>

    // ========== 标签输入 - 标签列表显示 ==========
    case 'question-tags-input':
      if (Array.isArray(value) && value.length > 0) {
        return (
          <div className="flex flex-wrap gap-1">
            {value.slice(0, isMobile ? 3 : 5).map((tag, idx) => (
              <Tag key={idx} color="blue" className="text-xs m-0">
                {tag}
              </Tag>
            ))}
            {value.length > (isMobile ? 3 : 5) && (
              <Tag className="text-xs m-0">+{value.length - (isMobile ? 3 : 5)}</Tag>
            )}
          </div>
        )
      }
      return <span className={cn(cellText.muted(isDark), 'text-xs')}>无标签</span>

    // ========== 日期范围选择器 - 日期范围显示 ==========
    case 'question-range-picker':
      if (Array.isArray(value) && value.length === 2) {
        const [start, end] = value
        // 检查是否为有效的日期字符串
        if (start && end && start !== '' && end !== '') {
          return (
            <div className="text-xs md:text-sm space-y-1">
              <div className="flex items-center gap-1">
                <span className={cn(cellText.hint(isDark), 'text-xs')}>起:</span>
                <span className="font-mono">{start}</span>
              </div>
              <div className="flex items-center gap-1">
                <span className={cn(cellText.hint(isDark), 'text-xs')}>止:</span>
                <span className="font-mono">{end}</span>
              </div>
            </div>
          )
        }
      }
      return <span className={cn(cellText.muted(isDark), 'text-xs')}>未选择</span>

    // ========== 时间范围选择器 - 时间范围显示 ==========
    case 'question-time-range-picker':
      if (Array.isArray(value) && value.length === 2) {
        const [start, end] = value
        // 检查是否为有效的时间字符串
        if (start && end && start !== '' && end !== '') {
          return (
            <div className="text-xs md:text-sm font-mono">
              <div className="flex flex-col md:flex-row md:items-center gap-0.5 md:gap-1">
                <span>{start}</span>
                <span className={cellText.muted(isDark)}>~</span>
                <span>{end}</span>
              </div>
            </div>
          )
        }
      }
      return <span className={cn(cellText.muted(isDark), 'text-xs')}>未选择</span>

    // ========== 搜索输入框 - 普通文本显示 ==========
    case 'question-search-input':
      return (
        <Tooltip title={String(value)}>
          <div className="truncate text-xs md:text-sm">
            {String(value)}
          </div>
        </Tooltip>
      )

    // ========== @提及输入 - 高亮@符号 ==========
    case 'question-mentions':
    case 'question-mention-textarea':
      if (typeof value === 'string') {
        // 高亮 @ 和 # 符号
        const parts = value.split(/(@\S+|#\S+)/g)
        return (
          <div className="text-xs md:text-sm">
            {parts.map((part, idx) => {
              if (part.startsWith('@')) {
                return <Tag key={idx} color="blue" className="text-xs mx-0.5">{part}</Tag>
              }
              if (part.startsWith('#')) {
                return <Tag key={idx} color="cyan" className="text-xs mx-0.5">{part}</Tag>
              }
              return <span key={idx}>{part}</span>
            })}
          </div>
        )
      }
      return String(value)

    // ========== OTP验证码输入 - 验证码显示 ==========
    case 'question-otp-input':
      if (typeof value === 'string') {
        return (
          <div className="flex gap-0.5 md:gap-1">
            {value.split('').map((char, idx) => (
              <div 
                key={idx}
                className="w-6 h-6 md:w-8 md:h-8 flex items-center justify-center border-2 rounded font-mono font-bold text-xs md:text-base"
                style={{
                  borderColor: primaryColor || '#3b82f6',
                  backgroundColor: (primaryColor || '#3b82f6') + '08',
                }}
              >
                {char}
              </div>
            ))}
          </div>
        )
      }
      return String(value)

    // ========== 周选择器 - 周显示 ==========
    case 'question-week-picker':
      return (
        <span className="text-xs md:text-sm font-mono">
          {String(value)}
        </span>
      )

    // ========== 月份选择器 - 月份显示 ==========
    case 'question-month-picker':
      return (
        <span className="text-xs md:text-sm font-mono">
          {String(value)}
        </span>
      )

    // ========== 年份选择器 - 年份显示 ==========
    case 'question-year-picker':
      return (
        <span className="text-xs md:text-sm font-mono font-semibold">
          {String(value)}
        </span>
      )

    // ========== 区间滑块 - 区间显示 ==========
    case 'question-range-slider':
      if (Array.isArray(value) && value.length === 2) {
        return (
          <div className="flex items-center gap-1 md:gap-2">
            <Tag color="blue" className="text-xs m-0 font-mono">{value[0]}</Tag>
            <span className={cn(cellText.muted(isDark), 'text-xs')}>~</span>
            <Tag color="blue" className="text-xs m-0 font-mono">{value[1]}</Tag>
          </div>
        )
      }
      return String(value)

    // ========== 树形选择 - 树形路径显示 ==========
    case 'question-tree-select':
      if (Array.isArray(value)) {
        return (
          <div className="flex flex-wrap gap-1">
            {value.slice(0, isMobile ? 2 : 3).map((v, idx) => (
              <Tag key={idx} color="purple" className="text-xs m-0">
                {String(v)}
              </Tag>
            ))}
            {value.length > (isMobile ? 2 : 3) && (
              <Tag className="text-xs m-0">+{value.length - (isMobile ? 2 : 3)}</Tag>
            )}
          </div>
        )
      }
      if (typeof value === 'string') {
        return <Tag color="purple" className="text-xs m-0">{value}</Tag>
      }
      return String(value)

    // ========== 分段控制器 - 选中项显示 ==========
    case 'question-segmented':
      return (
        <Tag color="geekblue" className="text-xs m-0">
          {String(value)}
        </Tag>
      )

    // ========== 数组类型 - 标签显示 ==========
    default:
      if (Array.isArray(value)) {
        const displayText = value.join(', ')
        return (
          <Tooltip title={displayText}>
            <div className="truncate">{displayText}</div>
          </Tooltip>
        )
      }
      
      // ========== 对象类型 - JSON 显示 ==========
      if (typeof value === 'object') {
        const jsonStr = JSON.stringify(value)
        return (
          <Tooltip title={jsonStr}>
            <div className="truncate text-xs font-mono">{jsonStr}</div>
          </Tooltip>
        )
      }
      
      // ========== 默认文本显示 ==========
      const displayText = String(value)
      return (
        <Tooltip title={displayText}>
          <div className="truncate">{displayText}</div>
        </Tooltip>
      )
  }
}

const StatisticsTable = memo(
  ({ selectedComponentId, selectedComponentType, setSelectedComponent }: ComponentSelectionProps) => {
    const [total, setTotal] = useState<number>(0)
    const [list, setList] = useState<StatisticsAnswer[]>([])
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [keyword, setKeyword] = useState('')
    const [exporting, setExporting] = useState(false)

    const { componentList } = useGetComponentInfo()
    const { title: questionTitle } = useGetPageInfo()
    const { id = '' } = useParams()
    const responsive = useResponsive()
    const isMobile = !responsive.md
    const { primaryColor } = useTheme()
    const t = useManageTheme()

    const visibleComponents = useMemo(
      () => componentList.filter((c: ComponentData) => !c.isHidden),
      [componentList]
    )

    const exportColumns = useMemo(
      () => buildExportColumns(visibleComponents),
      [visibleComponents]
    )

    const selectedComponentTitle = useMemo(() => {
      const c = visibleComponents.find(
        (item: ComponentData) => item.fe_id === selectedComponentId
      )
      return c?.props?.title || c?.title || ''
    }, [visibleComponents, selectedComponentId])

    const { loading, refresh } = useRequest(
      async () => {
        return await getQuestionsStatistics(id, {
          page,
          pageSize,
        })
      },
      {
        refreshDeps: [id, page, pageSize],
        onSuccess(res: any) {
          const { total, list = [] } = res
          setTotal(total)
          setList(list)
        },
      }
    )

    const filteredList = useMemo(() => {
      const q = keyword.trim().toLowerCase()
      if (!q) return list
      return list.filter((row) =>
        Object.entries(row).some(([key, val]) => {
          if (key === '_id') return false
          return String(val ?? '').toLowerCase().includes(q)
        })
      )
    }, [list, keyword])

    const handleExportAll = useCallback(async () => {
      try {
        setExporting(true)
        message.loading({ content: '正在导出全量数据...', key: 'stat-export', duration: 0 })
        const { list: allList, total: exportTotal } = await exportQuestionsStatistics(id)
        if (!allList?.length) {
          message.warning({ content: '没有可导出的数据', key: 'stat-export' })
          return
        }
        const prefix = (questionTitle || '问卷统计').replace(/[\\/:*?"<>|]/g, '_')
        downloadAnswersExcel(allList, exportColumns, prefix)
        message.success({
          content: `已导出全部 ${exportTotal} 条答卷`,
          key: 'stat-export',
        })
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : '导出失败'
        message.error({ content: msg, key: 'stat-export' })
      } finally {
        setExporting(false)
      }
    }, [id, exportColumns, questionTitle])

    const handleExportCurrentPage = useCallback(() => {
      try {
        if (!filteredList.length) {
          message.warning('当前页没有可导出的数据')
          return
        }
        const prefix = `${(questionTitle || '问卷统计').replace(/[\\/:*?"<>|]/g, '_')}_第${page}页`
        downloadAnswersExcel(filteredList, exportColumns, prefix)
        message.success(`已导出当前页 ${filteredList.length} 条`)
      } catch (err: unknown) {
        message.error(err instanceof Error ? err.message : '导出失败')
      }
    }, [filteredList, exportColumns, questionTitle, page])

    useEffect(() => {
      if (selectedComponentId || !visibleComponents.length) return
      const first =
        visibleComponents.find((c: ComponentData) =>
          CHART_STAT_TYPES.has(c.type)
        ) || visibleComponents[0]
      setSelectedComponent(first.fe_id, first.type)
    }, [visibleComponents, selectedComponentId, setSelectedComponent])

    const handleColumnClick = useCallback(
      (fe_id: string, type: string) => {
        setSelectedComponent(fe_id, type)
      },
      [setSelectedComponent]
    )

    const metaColumns: ColumnsType<StatisticsAnswer> = useMemo(
      () => [
        {
          title: META_COLUMN_LABELS[STATS_META.submittedAt],
          dataIndex: STATS_META.submittedAt,
          key: STATS_META.submittedAt,
          width: isMobile ? 140 : 170,
          fixed: isMobile ? 'left' : undefined,
          render: (val: string) =>
            val ? dayjs(val).format('YYYY-MM-DD HH:mm') : '—',
        },
        {
          title: META_COLUMN_LABELS[STATS_META.respondentName],
          dataIndex: STATS_META.respondentName,
          key: STATS_META.respondentName,
          width: isMobile ? 90 : 120,
          ellipsis: true,
        },
        {
          title: META_COLUMN_LABELS[STATS_META.duration],
          dataIndex: STATS_META.duration,
          key: STATS_META.duration,
          width: isMobile ? 80 : 100,
        },
        {
          title: META_COLUMN_LABELS[STATS_META.isAnonymous],
          dataIndex: STATS_META.isAnonymous,
          key: STATS_META.isAnonymous,
          width: 64,
          render: (val: string) => (
            <Tag color={val === '是' ? 'default' : 'blue'} className="m-0 text-xs">
              {val || '—'}
            </Tag>
          ),
        },
      ],
      [isMobile]
    )

    const questionColumns: ColumnsType<StatisticsAnswer> = useMemo(
      () =>
        visibleComponents.map((c: ComponentData, index: number) => {
          const { fe_id, title, props = {}, type } = c
          const columnTitle = props.title || title

          return {
            title: (
              <div
                className="cursor-pointer transition-colors"
                onClick={() => handleColumnClick(fe_id, type)}
                style={fe_id === selectedComponentId ? {
                  color: primaryColor
                } : {}}
                onMouseEnter={(e) => {
                  if (fe_id !== selectedComponentId) {
                    e.currentTarget.style.color = primaryColor
                  }
                }}
                onMouseLeave={(e) => {
                  if (fe_id !== selectedComponentId) {
                    e.currentTarget.style.color = ''
                  }
                }}
              >
                <span
                  className={cn({
                    'font-semibold': fe_id === selectedComponentId,
                  })}
                  style={fe_id === selectedComponentId ? { color: primaryColor } : {}}
                >
                  {columnTitle}
                </span>
              </div>
            ),
            dataIndex: fe_id,
            key: fe_id,
            width: isMobile ? 120 : (
              type === 'question-signature' ? 200 : 
              type === 'question-color-picker' ? 180 : 
              type === 'question-rate' || type === 'question-star-rating' ? 200 :
              type === 'question-matrix' ? 250 :
              type === 'question-range-picker' ? 220 :
              type === 'question-otp-input' ? 200 :
              type === 'question-email-input' ? 180 :
              type === 'question-url-input' ? 200 :
              type === 'question-tags-input' ? 200 :
              type === 'question-mentions' || type === 'question-mention-textarea' ? 180 :
              type === 'question-range-slider' ? 150 :
              type === 'question-tree-select' ? 180 :
              150
            ),
            ellipsis: false,
            render: (value: any) =>
              renderCellByType(type, value, props, isMobile, primaryColor, t.isDark),
            // 移动端固定第一列
            fixed: undefined,
          }
        }),
      [
        visibleComponents,
        selectedComponentId,
        handleColumnClick,
        isMobile,
        primaryColor,
        t.isDark,
      ]
    )

    const columns = useMemo(
      () => [...metaColumns, ...questionColumns],
      [metaColumns, questionColumns]
    )

    const dataSource = useMemo(
      () => filteredList.map((item) => ({ ...item, key: item._id })),
      [filteredList]
    )

    const handlePageChange = useCallback((newPage: number) => {
      setPage(newPage)
    }, [])

    const handlePageSizeChange = useCallback(
      (_current: number, size: number) => {
        setPage(1)
        setPageSize(size)
      },
      []
    )

    if (loading) {
      return (
        <div className="flex justify-center items-center h-64">
          <Spin size="large" />
        </div>
      )
    }

    return (
      <div className="w-full h-full flex flex-col overflow-hidden">
        <StatisticsOverview />

        <ComponentStatPanel
          componentId={selectedComponentId}
          componentType={selectedComponentType}
          componentTitle={selectedComponentTitle}
        />

        <div className="flex-shrink-0 flex flex-col gap-2 md:gap-3 mb-2 md:mb-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <Typography.Title level={isMobile ? 4 : 3} className="!mb-0">
              答卷数量：{total}
              {keyword.trim() && (
                <span className={cn('text-sm font-normal ml-2', t.text.secondary)}>
                  （当前页筛选 {filteredList.length} 条）
                </span>
              )}
            </Typography.Title>
            <Space wrap size={isMobile ? 'small' : 'middle'}>
              <Button
                icon={<ReloadOutlined />}
                onClick={() => refresh()}
                loading={loading}
                size={isMobile ? 'small' : 'middle'}
              >
                刷新
              </Button>
              <Button
                icon={<FileExcelOutlined />}
                onClick={handleExportCurrentPage}
                disabled={!filteredList.length}
                size={isMobile ? 'small' : 'middle'}
              >
                导出本页
              </Button>
              <Button
                type="primary"
                icon={<DownloadOutlined />}
                onClick={handleExportAll}
                loading={exporting}
                size={isMobile ? 'small' : 'middle'}
              >
                全量导出 Excel
              </Button>
            </Space>
          </div>
          <Input.Search
            allowClear
            placeholder="搜索当前页（填写者、答案内容等）"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            size={isMobile ? 'small' : 'middle'}
            className="max-w-md"
          />
        </div>

        <div className="flex-1 min-h-0 mb-2 md:mb-4">
          <Table
            columns={columns}
            dataSource={dataSource}
            pagination={false}
            bordered
            scroll={{
              x: isMobile ? 960 : 'max-content',
              y: isMobile ? 'calc(100vh - 420px)' : 'calc(100vh - 480px)',
            }}
            size={isMobile ? 'small' : 'middle'}
          />
        </div>
        <div className="flex-shrink-0 flex justify-center md:justify-end">
          <Pagination
            total={total}
            current={page}
            pageSize={pageSize}
            onChange={handlePageChange}
            onShowSizeChange={handlePageSizeChange}
            showSizeChanger={!isMobile}
            showTotal={(total) => `共 ${total} 条`}
            size={isMobile ? 'small' : 'default'}
            simple={isMobile}
          />
        </div>
      </div>
    )
  }
)

StatisticsTable.displayName = 'StatisticsTable'

export default StatisticsTable
