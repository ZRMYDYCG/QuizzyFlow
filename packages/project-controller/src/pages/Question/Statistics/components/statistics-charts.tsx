import React, { useEffect, useState } from 'react'
import { Result, Typography } from 'antd'
import { getAnswerStatistics } from '../../../../api/modules/statistics.ts'
import { useRequest } from 'ahooks'
import { useParams } from 'react-router-dom'
import StatisticsComponents from '../../components/question-radio/stat-component.tsx'

const { Title } = Typography

interface IStatisticsChartsProps {
  selectedComponentId: string
  selectedComponentType: string
}

const StatisticsCharts: React.FC<IStatisticsChartsProps> = (
  props: IStatisticsChartsProps
) => {
  const { selectedComponentId } = props
  const { id = '' } = useParams()

  const [stat, setStat] = useState()

  const { data, loading, run } = useRequest(
    async (questionId: string, componentId: string) =>
      await getAnswerStatistics(id, selectedComponentId),
    {
      manual: true,
      onSuccess(res: any) {
        setStat(res)
      },
    }
  )

  useEffect(() => {
    if (selectedComponentId) {
      run(id, selectedComponentId)
    }
  }, [id, selectedComponentId])

  function renderChart() {
    if (!selectedComponentId) return <Result title="未选中组件"></Result>
  }

  return (
    <>
      <Title level={2}>统计分析</Title>
      <div>{renderChart()}</div>
    </>
  )
}

export default StatisticsCharts
