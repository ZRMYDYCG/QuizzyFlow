import { memo, useCallback, useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Space, Button, Input, Tooltip, message, Popover, Dropdown, Modal } from 'antd'
import { LeftOutlined, CopyOutlined, QrcodeOutlined, ShareAltOutlined, EllipsisOutlined } from '@ant-design/icons'
import { useResponsive } from 'ahooks'
import useGetPageInfo from '@/hooks/useGetPageInfo'
import QRCodePopover from './qrcode-popover'

const StatisticsHeader = memo(() => {
  const navigate = useNavigate()
  const { id } = useParams()
  const { title, isPublished } = useGetPageInfo()
  const responsive = useResponsive()
  const isMobile = !responsive.md

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

  // PC端：完整布局
  const renderDesktopLayout = useMemo(() => (
    <div className="flex">
      <div className="flex-1">
        <Space>
          <Button type="link" onClick={handleGoBack} icon={<LeftOutlined />}>
            返回
          </Button>
          <h2 className="text-xl font-bold">{title}</h2>
        </Space>
      </div>
      <div className="flex-1 text-center">
        {isPublished && (
          <Space>
            <Input value={questionUrl} readOnly style={{ width: '300px' }} />
            <Tooltip title="复制链接">
              <Button icon={<CopyOutlined />} onClick={copyLink} />
            </Tooltip>
            <Popover content={<QRCodePopover url={questionUrl} />}>
              <Button icon={<QrcodeOutlined />} />
            </Popover>
          </Space>
        )}
      </div>
      <div className="flex-1 text-right">
        <Button type="primary" onClick={handleEdit}>
          编辑
        </Button>
      </div>
    </div>
  ), [title, isPublished, questionUrl, copyLink, handleGoBack, handleEdit])

  // 移动端：紧凑布局
  const mobileMenuItems = useMemo(() => [
    {
      key: 'copy',
      label: '复制链接',
      icon: <CopyOutlined />,
      onClick: copyLink,
    },
    {
      key: 'qrcode',
      label: '查看二维码',
      icon: <QrcodeOutlined />,
      onClick: () => {
        Modal.info({
          title: '问卷二维码',
          content: <QRCodePopover url={questionUrl} />,
          width: 320,
        })
      },
    },
  ], [copyLink, questionUrl])

  const renderMobileLayout = useMemo(() => (
    <div className="space-y-2">
      {/* 第一行：返回按钮和标题 */}
      <div className="flex items-center justify-between">
        <Space>
          <Button 
            type="text" 
            onClick={handleGoBack} 
            icon={<LeftOutlined />}
            size="small"
          />
          <h2 className="text-base font-bold truncate max-w-[200px]">{title}</h2>
        </Space>
        <Space size="small">
          {isPublished && (
            <Dropdown menu={{ items: mobileMenuItems }} trigger={['click']}>
              <Button icon={<ShareAltOutlined />} size="small" />
            </Dropdown>
          )}
          <Button type="primary" onClick={handleEdit} size="small">
            编辑
          </Button>
        </Space>
      </div>
    </div>
  ), [title, isPublished, handleGoBack, handleEdit, mobileMenuItems])

  return (
    <div className="bg-white border-b border-gray-200 py-2 md:py-[12px]">
      <div className="px-2 md:mx-[24px]">
        {isMobile ? renderMobileLayout : renderDesktopLayout}
      </div>
    </div>
  )
})

StatisticsHeader.displayName = 'StatisticsHeader'

export default StatisticsHeader
