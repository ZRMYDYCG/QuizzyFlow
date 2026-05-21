import { Navigate, useParams } from 'react-router-dom'
import { getQuestionStatisticsPath } from '@/utils/question-routes'

/** 兼容旧链接 /question/static/:id */
const LegacyStaticRedirect = () => {
  const { id = '' } = useParams()
  return <Navigate to={getQuestionStatisticsPath(id)} replace />
}

export default LegacyStaticRedirect
