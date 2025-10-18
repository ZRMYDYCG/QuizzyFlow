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
import { useTheme } from '@/contexts/ThemeContext'

const TitleElem: FC = () => {
  const { theme } = useTheme()
  const { title } = useGetPageInfo()
  const [editState, setEditState] = useState<boolean>(false)
  const dispatch = useDispatch()
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setTitle(e.target.value))
  }

  if (editState) {
    return (
      <Input
        placeholder="请输入标题"
        value={title}
        onChange={handleChange}
        onPressEnter={(e) => setEditState(false)}
        onBlur={() => setEditState(false)}
        className="w-64"
        autoFocus
      />
    )
  }

  return (
    <Space>
      <h2 className={`text-lg font-semibold ${theme === 'dark' ? 'text-slate-200' : 'text-gray-900'}`}>{title}</h2>
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
      await updateQuestion(id, { ...pageInfo, componentList, isPublish: true })
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

const EditHeader: React.FC = () => {
  const navigate = useNavigate()
  const { theme } = useTheme()

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
          </Space>
        </div>
      </div>
    </div>
  )
}

export default EditHeader
