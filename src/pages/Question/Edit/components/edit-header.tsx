import React, { FC, useState } from 'react'
import { Button, Space, Input, message, Dropdown } from 'antd'
import type { MenuProps } from 'antd'
import {
  LeftOutlined,
  EditOutlined,
  SaveOutlined,
  LoadingOutlined,
  EyeOutlined,
  FullscreenOutlined,
  DownOutlined,
  MoreOutlined,
  UploadOutlined,
} from '@ant-design/icons'
import { useNavigate, useParams } from 'react-router-dom'
import EditToolbar from './edit-toolbar'
import { setTitle } from '@/store/modules/pageinfo-reducer'
import { useDispatch } from 'react-redux'
import useGetPageInfo from '@/hooks/useGetPageInfo'
import useGetComponentInfo from '@/hooks/useGetComponentInfo'
import { updateQuestion } from '@/api/modules/question'
import { useRequest, useKeyPress, useDebounceEffect } from 'ahooks'
import PreviewModal from './preview-modal'
import PublishTemplateModal from '@/components/template/PublishTemplateModal'
import { useTheme } from '@/contexts/ThemeContext'
import { useResponsive } from '@/hooks/useResponsive'

const TitleElem: FC = () => {
  const { theme } = useTheme()
  const { title } = useGetPageInfo()
  const [editState, setEditState] = useState<boolean>(false)
  const dispatch = useDispatch()
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setTitle(e.target.value))
  }

  const { isMobile } = useResponsive()

  if (editState) {
    return (
      <Input
        placeholder="请输入标题"
        value={title}
        onChange={handleChange}
        onPressEnter={(e) => setEditState(false)}
        onBlur={() => setEditState(false)}
        className={isMobile ? 'w-full text-sm' : 'w-64'}
        autoFocus
      />
    )
  }

  return (
    <Space size="small">
      <h2 
        className={`
          ${isMobile ? 'text-sm' : 'text-lg'} 
          font-semibold truncate
          ${theme === 'dark' ? 'text-slate-200' : 'text-gray-900'}
        `}
      >
        {title}
      </h2>
      <Button
        type="text"
        size="small"
        icon={<EditOutlined />}
        onClick={() => setEditState(true)}
      />
    </Space>
  )
}

const SaveButton: FC = () => {
  const { id } = useParams()
  const { componentList = [] } = useGetComponentInfo()
  const pageInfo = useGetPageInfo()

  // 快捷键保存
  useKeyPress(['ctrl.s', 'meta.s'], (event) => {
    event.preventDefault()
    if (!loading) save()
  })

  // 自动保存(防抖处理)
  useDebounceEffect(
    () => {
      save()
    },
    [componentList, pageInfo],
    { wait: 1000 }
  )

  // 手动保存
  const { loading, run: save } = useRequest(
    async () => {
      if (!id) return
      await updateQuestion(id, { ...pageInfo, componentList })
    },
    { manual: true }
  )

  return (
    <Button
      type="default"
      disabled={loading}
      onClick={save}
      icon={loading ? <LoadingOutlined /> : <SaveOutlined />}
    >
      保存
    </Button>
  )
}

const PublishButton: FC = () => {
  const { id } = useParams()
  const { componentList = [] } = useGetComponentInfo()
  const pageInfo = useGetPageInfo()
  const navigate = useNavigate()
  const { loading, run: publish } = useRequest(
    async () => {
      if (!id) return
      await updateQuestion(id, { ...pageInfo, componentList, isPublished: true })
    },
    {
      manual: true,
      onSuccess() {
        message.success('发布成功')
        navigate('/question/statistics/' + id)
      },
    }
  )
  return (
    <Button type="primary" disabled={loading} onClick={publish}>
      发布
    </Button>
  )
}

const PreviewButton: FC = () => {
  const { id } = useParams()
  const { componentList = [] } = useGetComponentInfo()
  const pageInfo = useGetPageInfo()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const navigate = useNavigate()

  const handleClose = () => {
    setIsModalOpen(false)
  }

  const handleFullPreview = () => {
    // 在新标签页打开完整预览
    window.open(`/question/publish/${id}`, '_blank')
  }

  const menuItems: MenuProps['items'] = [
    {
      key: 'quick',
      label: '快速预览',
      icon: <EyeOutlined />,
      onClick: () => setIsModalOpen(true),
    },
    {
      key: 'full',
      label: '完整预览',
      icon: <FullscreenOutlined />,
      onClick: handleFullPreview,
    },
  ]

  return (
    <>
      <Dropdown menu={{ items: menuItems }} placement="bottomRight">
        <Button type="default" icon={<EyeOutlined />}>
          预览 <DownOutlined />
        </Button>
      </Dropdown>
      <PreviewModal
        isOpen={isModalOpen}
        onOk={handleClose}
        onCancel={handleClose}
        componentList={componentList}
        pageInfo={pageInfo}
      />
    </>
  )
}

// 发布为模板按钮
const PublishTemplateButton: FC = () => {
  const { componentList = [] } = useGetComponentInfo()
  const pageInfo = useGetPageInfo()
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <Button
        type="default"
        icon={<UploadOutlined />}
        onClick={() => setIsModalOpen(true)}
      >
        发布为模板
      </Button>
      <PublishTemplateModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        componentList={componentList}
        pageInfo={pageInfo}
      />
    </>
  )
}

// 移动端更多操作菜单
const MobileMoreMenu: FC = () => {
  const { id } = useParams()
  const { componentList = [] } = useGetComponentInfo()
  const pageInfo = useGetPageInfo()
  const navigate = useNavigate()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false)

  const { loading: publishLoading, run: publish } = useRequest(
    async () => {
      if (!id) return
      await updateQuestion(id, { ...pageInfo, componentList, isPublished: true })
    },
    {
      manual: true,
      onSuccess() {
        message.success('发布成功')
        navigate('/question/statistics/' + id)
      },
    }
  )

  const handleFullPreview = () => {
    window.open(`/question/publish/${id}`, '_blank')
  }

  const menuItems: MenuProps['items'] = [
    {
      key: 'preview-quick',
      label: '快速预览',
      icon: <EyeOutlined />,
      onClick: () => setIsModalOpen(true),
    },
    {
      key: 'preview-full',
      label: '完整预览',
      icon: <FullscreenOutlined />,
      onClick: handleFullPreview,
    },
    {
      type: 'divider',
    },
    {
      key: 'publish',
      label: '发布问卷',
      disabled: publishLoading,
      onClick: publish,
    },
    {
      key: 'publish-template',
      label: '发布为模板',
      icon: <UploadOutlined />,
      onClick: () => setIsTemplateModalOpen(true),
    },
  ]

  return (
    <>
      <Dropdown menu={{ items: menuItems }} placement="bottomRight" trigger={['click']}>
        <Button type="text" icon={<MoreOutlined />} />
      </Dropdown>
      <PreviewModal
        isOpen={isModalOpen}
        onOk={() => setIsModalOpen(false)}
        onCancel={() => setIsModalOpen(false)}
        componentList={componentList}
        pageInfo={pageInfo}
      />
      <PublishTemplateModal
        open={isTemplateModalOpen}
        onClose={() => setIsTemplateModalOpen(false)}
        componentList={componentList}
        pageInfo={pageInfo}
      />
    </>
  )
}

const EditHeader: React.FC = () => {
  const navigate = useNavigate()
  const { theme } = useTheme()
  const { isMobile } = useResponsive()

  // 移动端布局
  if (isMobile) {
    return (
      <div className={`h-14 border-b flex-shrink-0 ${
        theme === 'dark' 
          ? 'bg-[#1e1e23] border-white/5' 
          : 'bg-white border-gray-200'
      }`}>
        <div className="flex items-center justify-between h-full px-3">
          {/* 左侧：返回按钮 */}
          <Button
            type="text"
            size="small"
            icon={<LeftOutlined />}
            onClick={() => navigate(-1)}
          />

          {/* 中间：标题 */}
          <div className="flex-1 mx-2 overflow-hidden">
            <TitleElem />
          </div>

          {/* 右侧：保存和更多操作 */}
          <Space size="small">
            <SaveButton />
            <MobileMoreMenu />
          </Space>
        </div>
      </div>
    )
  }

  // 桌面端布局
  return (
    <div className={`h-16 border-b flex-shrink-0 ${
      theme === 'dark' 
        ? 'bg-[#1e1e23] border-white/5' 
        : 'bg-white border-gray-200'
    }`}>
      <div className="flex items-center h-full px-6">
        <div className="flex-1">
          <Space className="items-center">
            <Button
              type="text"
              icon={<LeftOutlined />}
              onClick={() => navigate(-1)}
            >
              返回
            </Button>
            <TitleElem />
          </Space>
        </div>
        <div className="flex-1 flex justify-center">
          <EditToolbar />
        </div>
        <div className="flex-1 flex justify-end">
          <Space>
            <SaveButton />
            <PublishButton />
            <PreviewButton />
            <PublishTemplateButton />
          </Space>
        </div>
      </div>
    </div>
  )
}

export default EditHeader
