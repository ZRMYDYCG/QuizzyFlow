import React, { useState } from 'react'
import { Button, Spin, Space, message, Tooltip } from 'antd'
import {
  LeftOutlined,
  EditOutlined,
  CopyOutlined,
} from '@ant-design/icons'
import { useNavigate, useParams } from 'react-router-dom'
import { getComponentConfigByType } from '@/components/material'
import { QuestionComponentType } from '@/store/modules/question-component'
import useLoadQuestionData from '@/hooks/useLoadQuestionData'
import useGetComponentInfo from '@/hooks/useGetComponentInfo'
import useGetPageInfo from '@/hooks/useGetPageInfo'
import { useTitle } from 'ahooks'

function genComponent(componentInfo: QuestionComponentType) {
  const { type, props } = componentInfo
  const componentConfig = getComponentConfigByType(type)

  if (componentConfig === null) return null

  const { component: Component } = componentConfig

  return (
    <div key={componentInfo.fe_id}>
      <Component {...props} />
    </div>
  )
}

const PublishPage: React.FC = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { loading } = useLoadQuestionData()
  const { componentList = [] } = useGetComponentInfo()
  const pageInfo = useGetPageInfo()
  const [copying, setCopying] = useState(false)

  useTitle(`预览 - ${pageInfo.title}`)

  // 复制链接
  const handleCopyLink = async () => {
    const url = window.location.href
    try {
      setCopying(true)
      await navigator.clipboard.writeText(url)
      message.success('链接已复制到剪贴板')
    } catch (err) {
      message.error('复制失败，请手动复制')
    } finally {
      setCopying(false)
    }
  }

  // 返回编辑
  const handleEdit = () => {
    navigate(`/question/edit/${id}`)
  }

  // 计算布局方向对应的margin
  const getLayoutMargin = () => {
    switch (pageInfo.layout) {
      case 'left':
        return '0 auto 0 0'
      case 'right':
        return '0 0 0 auto'
      case 'center':
      default:
        return '0 auto'
    }
  }

  // 视差滚动效果
  const parallaxStyle = pageInfo.parallaxEffect
    ? {
        backgroundAttachment: 'fixed',
        backgroundPosition: `${pageInfo.bgPosition || 'center'} center`,
      }
    : {}

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="py-3 px-4 md:px-6 bg-white shadow-sm sticky top-0 z-10">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center space-x-2 md:space-x-4 flex-1 min-w-0">
            <Button
              type="text"
              icon={<LeftOutlined />}
              onClick={() => navigate(-1)}
              className="flex-shrink-0"
            >
              <span className="hidden sm:inline">返回</span>
            </Button>
            <h2 className="text-base md:text-lg font-semibold truncate">
              {pageInfo.title}
            </h2>
            <div className="hidden sm:block px-2 py-1 bg-blue-50 text-blue-600 text-xs rounded flex-shrink-0">
              预览模式
            </div>
          </div>
          <Space className="flex-shrink-0">
            <Tooltip title="复制链接">
              <Button
                type="text"
                icon={<CopyOutlined />}
                loading={copying}
                onClick={handleCopyLink}
              >
                <span className="hidden sm:inline">分享</span>
              </Button>
            </Tooltip>
            <Button
              type="default"
              icon={<EditOutlined />}
              onClick={handleEdit}
            >
              <span className="hidden sm:inline">编辑</span>
            </Button>
          </Space>
        </div>
      </div>

      {/* Content Area */}
      <div
        className="flex-1 overflow-auto"
        style={{
          padding: pageInfo.padding,
          backgroundImage: pageInfo.bgImage
            ? `url(${pageInfo.bgImage})`
            : 'none',
          backgroundSize: 'cover',
          backgroundRepeat: pageInfo.bgRepeat || 'no-repeat',
          backgroundPosition: pageInfo.bgPosition || 'center',
          ...parallaxStyle,
        }}
      >
        <div
          style={{
            maxWidth: pageInfo.maxWidth || '100%',
            margin: getLayoutMargin(),
            transition: 'all 0.3s ease',
          }}
        >
          {componentList
            .filter((item: any) => !item.isHidden)
            .map((item: QuestionComponentType) => {
              return (
                <div key={item.fe_id} className="m-[12px]">
                  {genComponent(item)}
                </div>
              )
            })}
        </div>
      </div>
    </div>
  )
}

export default PublishPage

