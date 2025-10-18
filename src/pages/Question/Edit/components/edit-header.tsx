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

const TitleElem: FC = () => {
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
      ></Input>
    )
  }

  return (
    <Space>
      <h2 className="text-lg font-bold">{title}</h2>
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

  return (
    <div className="py-[12px] bg-white">
      <div className="flex mx-[24px]">
        <div className="flex-1">
          <Space className="items-center">
            <Button
              type="link"
              icon={<LeftOutlined />}
              onClick={() => navigate(-1)}
            >
              返回
            </Button>
            <TitleElem />
          </Space>
        </div>
        <div className="flex-1 text-center">
          <EditToolbar />
        </div>
        <div className="flex-1 text-right">
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
