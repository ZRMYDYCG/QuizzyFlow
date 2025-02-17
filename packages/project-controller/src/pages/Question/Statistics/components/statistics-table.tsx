import React, { useState, useEffect } from 'react'
import { useRequest } from 'ahooks'
import { useParams } from 'react-router-dom'
import { Typography, Spin, Table, Pagination } from 'antd'
import { getQuestionsStatistics } from '../../../../api/modules/statistics.ts'
import useGetComponentInfo from '../../../../hooks/useGetComponentInfo.ts'
import { cn } from '../../../../utils/index.ts'

interface IStatisticsTableProps {
  selectedComponentId: string
  setSelectedComponentId: (id: string) => void
  setSelectedComponentType: (type: string) => void
}

const StatisticsTable: React.FC<IStatisticsTableProps> = (
  props: IStatisticsTableProps
) => {
  const {
    selectedComponentId,
    setSelectedComponentId,
    setSelectedComponentType,
  } = props

  const [total, setTotal] = useState()
  const [list, setList] = useState([])
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const { componentList } = useGetComponentInfo()

  const { id = '' } = useParams()

  const { loading } = useRequest(
    async () => {
      return await getQuestionsStatistics(id, {
        page: 1,
        pageSize: 10,
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

  useEffect(() => {}, [id])

  const columns = componentList.map((c: any) => {
    const { fe_id, title, props = {} } = c

    const columnTitle = props.title || title

    return {
      title: (
        <div
          className="cursor-pointer"
          onClick={() => {
            setSelectedComponentId(fe_id)
          }}
        >
          <span
            className={cn({ 'text-blue-500': fe_id === selectedComponentId })}
          >
            {columnTitle}
          </span>
        </div>
      ),
      dataIndex: fe_id,
    }
  })

  const dataSource = list.map((item: any) => ({ ...item, key: item._id }))

  const TableElem = (
    <>
      <Table
        columns={columns}
        dataSource={dataSource}
        pagination={false}
      ></Table>
      <Pagination
        total={total}
        current={page}
        pageSize={pageSize}
        onChange={(page) => setPage(page)}
        onShowSizeChange={(current, size) => {
          setPage(1)
          setPageSize(size)
        }}
      ></Pagination>
    </>
  )

  return (
    <div>
      <Typography.Title level={3}>
        答卷数量：{!loading && total}
      </Typography.Title>
      {loading && (
        <div className="flex justify-center">
          <Spin />
        </div>
      )}
      {!loading && TableElem}
    </div>
  )
}

export default StatisticsTable
