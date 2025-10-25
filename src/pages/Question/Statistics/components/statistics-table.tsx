import { memo, useState, useMemo, useCallback } from 'react'
import { useRequest } from 'ahooks'
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
const renderCellByType = (type: string, value: any, props?: any) => {
  // 空值处理
  if (value === null || value === undefined || value === '') {
    return <span className="text-gray-400">-</span>
  }

  switch (type) {
    // ========== 签名组件 - 显示图片预览 ==========
    case 'question-signature':
      if (typeof value === 'string' && value.startsWith('data:image')) {
        return (
          <div className="flex items-center gap-2">
            <Image 
              src={value} 
              alt="签名" 
              width={80}
              height={40}
              style={{ objectFit: 'contain' }}
              preview={{
                mask: '查看签名'
              }}
            />
          </div>
        )
      }
      return <span className="text-gray-400">无签名</span>

    // ========== 颜色选择器 - 显示色块 ==========
    case 'question-color-picker':
      if (typeof value === 'string' && value.startsWith('#')) {
        return (
          <div className="flex items-center gap-2">
            <div 
              className="w-8 h-8 rounded border-2 border-gray-300 shadow-sm"
              style={{ backgroundColor: value }}
            />
            <span className="font-mono text-sm">{value}</span>
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
          <div className="flex items-center gap-2">
            <Rate disabled value={ratingValue} allowHalf />
            <span className="text-sm text-gray-600">({ratingValue})</span>
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
          <div className="flex items-center gap-2">
            <Tag color={color}>{npsValue} 分</Tag>
            <span className="text-xs text-gray-500">{label}</span>
          </div>
        )
      }
      return String(value)

    // ========== 矩阵组件 - 格式化对象显示 ==========
    case 'question-matrix':
      if (typeof value === 'object' && !Array.isArray(value)) {
        const entries = Object.entries(value)
        if (entries.length === 0) return <span className="text-gray-400">未填写</span>
        
        return (
          <div className="space-y-1">
            {entries.map(([key, val], idx) => (
              <div key={idx} className="text-xs">
                <span className="font-medium text-gray-700">{key}:</span>{' '}
                <span className="text-gray-600">
                  {Array.isArray(val) ? val.join(', ') : String(val)}
                </span>
              </div>
            ))}
          </div>
        )
      }
      return JSON.stringify(value)

    // ========== Emoji 选择器 - 大号显示 ==========
    case 'question-emoji-picker':
      return <span className="text-2xl">{String(value)}</span>

    // ========== 图片选择 - 显示标签 ==========
    case 'question-image-choice':
      if (Array.isArray(value)) {
        return (
          <div className="flex flex-wrap gap-1">
            {value.map((v, idx) => (
              <Tag key={idx} color="blue">{v}</Tag>
            ))}
          </div>
        )
      }
      return <Tag color="blue">{String(value)}</Tag>

    // ========== 文件上传 - 显示文件数量 ==========
    case 'question-upload':
      if (Array.isArray(value)) {
        return (
          <Tag color="cyan">
            {value.length} 个文件
          </Tag>
        )
      }
      return <Tag color="cyan">1 个文件</Tag>

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
            width: type === 'question-signature' ? 200 : 
                   type === 'question-color-picker' ? 180 : 
                   type === 'question-rate' || type === 'question-star-rating' ? 200 :
                   type === 'question-matrix' ? 250 :
                   150,
            ellipsis: false,
            render: (value: any) => renderCellByType(type, value, props),
          }
        }),
      [componentList, selectedComponentId, handleColumnClick]
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
        <Typography.Title level={3} className="flex-shrink-0 mb-4">
          答卷数量：{total}
        </Typography.Title>
        <div className="flex-1 min-h-0 mb-4">
          <Table
            columns={columns}
            dataSource={dataSource}
            pagination={false}
            bordered
            scroll={{ x: 'max-content', y: 'calc(100vh - 320px)' }}
            size="middle"
          />
        </div>
        <div className="flex-shrink-0 flex justify-end">
          <Pagination
            total={total}
            current={page}
            pageSize={pageSize}
            onChange={handlePageChange}
            onShowSizeChange={handlePageSizeChange}
            showSizeChanger
            showTotal={(total) => `共 ${total} 条`}
          />
        </div>
      </div>
    )
  }
)

StatisticsTable.displayName = 'StatisticsTable'

export default StatisticsTable
