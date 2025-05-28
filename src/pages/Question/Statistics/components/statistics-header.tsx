import React, { useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Space, Button, Input, Tooltip, InputRef, message, Popover } from 'antd'
import { LeftOutlined, CopyOutlined, QrcodeOutlined } from '@ant-design/icons'
import useGetPageInfo from '../../../../hooks/useGetPageInfo.ts'
import { QRCodeSVG } from 'qrcode.react'

const StatisticsHeader: React.FC = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const { title, isPublished } = useGetPageInfo()
  const inputRef = useRef<InputRef | null>(null)
  function copyLink() {
    const elem = inputRef.current
    if (elem === null) return
    elem.select()
    document.execCommand('copy')
    message.success('链接已复制')
  }

  function genLinkAndQRCodeElement() {
    if (!isPublished) return null

    const url = `http://localhost:3000/question/${id}`

    const QRCodeElement = (
      <div style={{ textAlign: 'center' }}>
        <QRCodeSVG value={url} size={128} />
      </div>
    )

    return (
      <Space>
        <Input value={url} ref={inputRef} readOnly style={{ width: '300px' }} />
        <Tooltip title="复制链接">
          <Button icon={<CopyOutlined />} onClick={copyLink}></Button>
        </Tooltip>
        <Popover content={QRCodeElement}>
          <Button icon={<QrcodeOutlined />} />
        </Popover>
      </Space>
    )
  }

  return (
    <div className="bg-white border-b border-gray-200 py-[12px]">
      <div className="flex mx-[24px]">
        <div className="flex-1">
          <Space>
            <Button
              type="link"
              onClick={() => navigate(-1)}
              icon={<LeftOutlined />}
            >
              返回
            </Button>
            <h2 className="text-xl font-bold">标题都发到算法</h2>
          </Space>
        </div>
        <div className="flex-1 text-center">{genLinkAndQRCodeElement()}</div>
        <div className="flex-1 text-right">
          <Button
            type="primary"
            onClick={() => navigate(`/question/edit/${id}`)}
          >
            编辑
          </Button>
        </div>
      </div>
    </div>
  )
}

export default StatisticsHeader
