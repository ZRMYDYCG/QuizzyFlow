import { memo, useCallback, useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Space, Button, Input, Tooltip, message, Popover } from 'antd'
import { LeftOutlined, CopyOutlined, QrcodeOutlined } from '@ant-design/icons'
import useGetPageInfo from '@/hooks/useGetPageInfo'
import QRCodePopover from './qrcode-popover'

const StatisticsHeader = memo(() => {
  const navigate = useNavigate()
  const { id } = useParams()
  const { title, isPublished } = useGetPageInfo()

  const questionUrl = useMemo(
    () => `${window.location.origin}/question/${id}`,
    [id]
  )

  const copyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(questionUrl)
      message.success('链接已复制')
    } catch (error) {
      // Fallback for older browsers
      const textarea = document.createElement('textarea')
      textarea.value = questionUrl
      textarea.style.position = 'fixed'
      textarea.style.opacity = '0'
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      message.success('链接已复制')
    }
  }, [questionUrl])

  const handleGoBack = useCallback(() => {
    navigate(-1)
  }, [navigate])

  const handleEdit = useCallback(() => {
    navigate(`/question/edit/${id}`)
  }, [navigate, id])

  const renderLinkAndQRCode = useMemo(() => {
    if (!isPublished) return null

    return (
      <Space>
        <Input value={questionUrl} readOnly style={{ width: '300px' }} />
        <Tooltip title="复制链接">
          <Button icon={<CopyOutlined />} onClick={copyLink} />
        </Tooltip>
        <Popover content={<QRCodePopover url={questionUrl} />}>
          <Button icon={<QrcodeOutlined />} />
        </Popover>
      </Space>
    )
  }, [isPublished, questionUrl, copyLink])

  return (
    <div className="bg-white border-b border-gray-200 py-[12px]">
      <div className="flex mx-[24px]">
        <div className="flex-1">
          <Space>
            <Button type="link" onClick={handleGoBack} icon={<LeftOutlined />}>
              返回
            </Button>
            <h2 className="text-xl font-bold">{title}</h2>
          </Space>
        </div>
        <div className="flex-1 text-center">{renderLinkAndQRCode}</div>
        <div className="flex-1 text-right">
          <Button type="primary" onClick={handleEdit}>
            编辑
          </Button>
        </div>
      </div>
    </div>
  )
})

StatisticsHeader.displayName = 'StatisticsHeader'

export default StatisticsHeader
