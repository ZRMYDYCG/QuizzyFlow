import React, { useState } from 'react'
import { useRequest } from 'ahooks'
import { useParams } from 'react-router-dom'
import { Typography, Spin } from 'antd'
import { getQuestionsStatistics } from '../../../../api/modules/statistics.ts'

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

  const { id = '' } = useParams()

  const { loading } = useRequest(
    async () => {
      return await getQuestionsStatistics(id, {
        page: 1,
        pageSize: 10,
      })
    },
    {
      onSuccess(res: any) {
        const { total, list = [] } = res
        setTotal(total)
        setList(list)
      },
    }
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
    </div>
  )
}

export default StatisticsTable
