import { memo, useState, useMemo, useCallback } from 'react'
import { useRequest } from 'ahooks'
import { useParams } from 'react-router-dom'
import { Typography, Spin, Table, Pagination, Tooltip } from 'antd'
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
            width: 150,
            ellipsis: {
              showTitle: false,
            },
            render: (text: any) => (
              <Tooltip title={text} placement="topLeft">
                <div className="truncate">{text}</div>
              </Tooltip>
            ),
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
