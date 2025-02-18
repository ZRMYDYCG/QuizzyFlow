import React, { useEffect, useState } from 'react'
import { Result, Typography } from 'antd'
import { getAnswerStatistics } from '../../../../api/modules/statistics.ts'
import { useRequest } from 'ahooks'
import { useParams } from 'react-router-dom'
import { getComponentConfigByType } from '../../components'

const { Title } = Typography

interface IStatisticsChartsProps {
  selectedComponentId: string
  selectedComponentType: string
}

const StatisticsCharts: React.FC<IStatisticsChartsProps> = (
  props: IStatisticsChartsProps
) => {
  const { selectedComponentId, selectedComponentType } = props
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

    const componentConfig = getComponentConfigByType(selectedComponentType)

    const { statisticsComponent: StatisticsComponent } = componentConfig

    if (!StatisticsComponent)
      return <Result title="该项不支持统计分析"></Result>

    return <StatisticsComponent stat={stat as any} />
  }

  return (
    <>
      <Title level={2}>统计分析</Title>
      <div>{renderChart()}</div>
    </>
  )
}

export default StatisticsCharts
