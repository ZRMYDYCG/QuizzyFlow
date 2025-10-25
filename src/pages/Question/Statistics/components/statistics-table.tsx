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
