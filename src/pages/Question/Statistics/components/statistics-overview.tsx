import { memo } from 'react'
import { useRequest } from 'ahooks'
import { useParams } from 'react-router-dom'
import { Spin, Statistic, Row, Col } from 'antd'
import {
  FileTextOutlined,
  ClockCircleOutlined,
  UserOutlined,
  CalendarOutlined,
} from '@ant-design/icons'
import dayjs from 'dayjs'
import { getQuestionStatisticsOverview } from '@/api/modules/statistics'
import { useManageTheme } from '@/hooks/useManageTheme'
import { cn } from '@/utils'

const StatisticsOverview = memo(() => {
  const { id = '' } = useParams()
  const t = useManageTheme()

  const { data, loading } = useRequest(() => getQuestionStatisticsOverview(id), {
    refreshDeps: [id],
  })

  if (loading) {
    return (
      <div className="flex justify-center py-4">
        <Spin size="small" />
      </div>
    )
  }

  if (!data) return null

  const formatDate = (iso: string | null) =>
    iso ? dayjs(iso).format('YYYY-MM-DD HH:mm') : '—'

  const cardClass = cn(
    'rounded-lg border p-3 md:p-4 h-full',
    t.isDark ? 'bg-slate-800/40 border-slate-700/50' : 'bg-gray-50 border-gray-100'
  )

  return (
    <Row gutter={[12, 12]} className="mb-3 md:mb-4">
      <Col xs={12} sm={6}>
        <div className={cardClass}>
          <Statistic
            title={<span className={t.text.secondary}>答卷总数</span>}
            value={data.total}
            prefix={<FileTextOutlined style={{ color: 'var(--ant-color-primary)' }} />}
            valueStyle={{ fontSize: 22 }}
          />
        </div>
      </Col>
      <Col xs={12} sm={6}>
        <div className={cardClass}>
          <Statistic
            title={<span className={t.text.secondary}>平均用时</span>}
            value={data.avgDurationSeconds ?? '—'}
            suffix={data.avgDurationSeconds != null ? '秒' : undefined}
            prefix={<ClockCircleOutlined style={{ color: 'var(--ant-color-primary)' }} />}
            valueStyle={{ fontSize: 22 }}
          />
        </div>
      </Col>
      <Col xs={12} sm={6}>
        <div className={cardClass}>
          <Statistic
            title={<span className={t.text.secondary}>实名 / 匿名</span>}
            value={`${data.namedCount} / ${data.anonymousCount}`}
            prefix={<UserOutlined style={{ color: 'var(--ant-color-primary)' }} />}
            valueStyle={{ fontSize: 18 }}
          />
        </div>
      </Col>
      <Col xs={12} sm={6}>
        <div className={cardClass}>
          <Statistic
            title={<span className={t.text.secondary}>最近提交</span>}
            value={formatDate(data.lastSubmittedAt)}
            prefix={<CalendarOutlined style={{ color: 'var(--ant-color-primary)' }} />}
            valueStyle={{ fontSize: 14 }}
          />
        </div>
      </Col>
    </Row>
  )
})

StatisticsOverview.displayName = 'StatisticsOverview'

export default StatisticsOverview
