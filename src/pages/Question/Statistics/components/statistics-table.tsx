import { memo, useState, useMemo, useCallback } from 'react'
import { useRequest, useResponsive } from 'ahooks'
import { useParams } from 'react-router-dom'
import { Typography, Spin, Table, Pagination, Tooltip, Image, Tag, Rate } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { getQuestionsStatistics } from '@/api/modules/statistics'
import useGetComponentInfo from '@/hooks/useGetComponentInfo'
import { cn } from '@/utils/index'
import type { ComponentSelectionProps, StatisticsAnswer } from '../types'

interface ComponentData {
  fe_id: string
  title: string
  type: string
  props?: Record<string, any>
}

// 根据组件类型渲染不同的单元格内容
const renderCellByType = (type: string, value: any, props?: any, isMobile?: boolean) => {
  // 空值处理
  if (value === null || value === undefined || value === '') {
    return <span className="text-gray-400 text-xs md:text-sm">-</span>
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
      return <span className="text-gray-400 text-xs">无签名</span>

    // ========== 颜色选择器 - 显示色块 ==========
    case 'question-color-picker':
      if (typeof value === 'string' && value.startsWith('#')) {
        return (
          <div className="flex items-center gap-1 md:gap-2">
            <div 
              className="w-6 h-6 md:w-8 md:h-8 rounded border-2 border-gray-300 shadow-sm flex-shrink-0"
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
            <span className="text-xs md:text-sm text-gray-600">({ratingValue})</span>
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
            {!isMobile && <span className="text-xs text-gray-500">{label}</span>}
          </div>
        )
      }
      return String(value)

    // ========== 矩阵组件 - 格式化对象显示 ==========
    case 'question-matrix':
      if (typeof value === 'object' && !Array.isArray(value)) {
        const entries = Object.entries(value)
        if (entries.length === 0) return <span className="text-gray-400 text-xs">未填写</span>
        
        return (
          <div className="space-y-0.5 md:space-y-1">
            {entries.slice(0, isMobile ? 2 : undefined).map(([key, val], idx) => (
              <div key={idx} className="text-xs">
                <span className="font-medium text-gray-700">{isMobile ? key.substring(0, 4) : key}:</span>{' '}
                <span className="text-gray-600">
                  {Array.isArray(val) ? val.join(', ') : String(val)}
                </span>
              </div>
            ))}
            {isMobile && entries.length > 2 && (
              <div className="text-xs text-gray-400">+{entries.length - 2}项</div>
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
          <span className="text-xs md:text-sm font-semibold text-blue-600">
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
      return <span className="text-gray-400 text-xs">未填写</span>

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
      return <span className="text-gray-400 text-xs">无标签</span>

    // ========== 日期范围选择器 - 日期范围显示 ==========
    case 'question-range-picker':
      if (Array.isArray(value) && value.length === 2) {
        const [start, end] = value
        // 检查是否为有效的日期字符串
        if (start && end && start !== '' && end !== '') {
          return (
            <div className="text-xs md:text-sm space-y-1">
              <div className="flex items-center gap-1">
                <span className="text-gray-500 text-xs">起:</span>
                <span className="font-mono">{start}</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-gray-500 text-xs">止:</span>
                <span className="font-mono">{end}</span>
              </div>
            </div>
          )
        }
      }
      return <span className="text-gray-400 text-xs">未选择</span>

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
                <span className="text-gray-400">~</span>
                <span>{end}</span>
              </div>
            </div>
          )
        }
      }
      return <span className="text-gray-400 text-xs">未选择</span>

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
                className="w-6 h-6 md:w-8 md:h-8 flex items-center justify-center border-2 border-blue-400 rounded bg-blue-50 font-mono font-bold text-xs md:text-base"
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
            <span className="text-gray-400 text-xs">~</span>
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
  ({ selectedComponentId, setSelectedComponent }: ComponentSelectionProps) => {
    const [total, setTotal] = useState<number>(0)
    const [list, setList] = useState<StatisticsAnswer[]>([])
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)

    const { componentList } = useGetComponentInfo()
    const { id = '' } = useParams()
    const responsive = useResponsive()
    const isMobile = !responsive.md

    const { loading } = useRequest(
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

    const handleColumnClick = useCallback(
      (fe_id: string, type: string) => {
        setSelectedComponent(fe_id, type)
      },
      [setSelectedComponent]
    )

    const columns: ColumnsType<StatisticsAnswer> = useMemo(
      () =>
        componentList.map((c: ComponentData, index: number) => {
          const { fe_id, title, props = {}, type } = c
          const columnTitle = props.title || title

          return {
            title: (
              <div
                className="cursor-pointer hover:text-blue-600 transition-colors"
                onClick={() => handleColumnClick(fe_id, type)}
              >
                <span
                  className={cn({
                    'text-blue-500 font-semibold':
                      fe_id === selectedComponentId,
                  })}
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
            render: (value: any) => renderCellByType(type, value, props, isMobile),
            // 移动端固定第一列
            fixed: isMobile && index === 0 ? 'left' : undefined,
          }
        }),
      [componentList, selectedComponentId, handleColumnClick, isMobile]
    )

    const dataSource = useMemo(
      () => list.map((item) => ({ ...item, key: item._id })),
      [list]
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
      <div className="w-full h-full flex flex-col">
        <Typography.Title 
          level={isMobile ? 4 : 3} 
          className="flex-shrink-0 mb-2 md:mb-4"
        >
          答卷数量：{total}
        </Typography.Title>
        <div className="flex-1 min-h-0 mb-2 md:mb-4">
          <Table
            columns={columns}
            dataSource={dataSource}
            pagination={false}
            bordered
            scroll={{ 
              x: isMobile ? 800 : 'max-content', 
              y: isMobile ? 'calc(100vh - 280px)' : 'calc(100vh - 320px)' 
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
