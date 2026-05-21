import { Navigate, useParams } from 'react-router-dom'

/** 将旧版分享链接 /question/:id 重定向到发布页 */
const LegacyPublishRedirect = () => {
  const { id } = useParams()
  return <Navigate to={`/question/publish/${id}`} replace />
}

export default LegacyPublishRedirect
