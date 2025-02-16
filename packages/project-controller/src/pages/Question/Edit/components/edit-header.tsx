import React, { FC, useState } from 'react'
import { Button, Space, Input } from 'antd'
import {
  LeftOutlined,
  EditOutlined,
  SaveOutlined,
  LoadingOutlined,
} from '@ant-design/icons'
import { useNavigate, useParams } from 'react-router-dom'
import EditToolbar from './edit-toolbar'
import { setTitle } from '../../../../store/modules/pageinfo-reducer.ts'
import { useDispatch } from 'react-redux'
import useGetPageInfo from '../../../../hooks/useGetPageInfo.ts'
import useGetComponentInfo from '../../../../hooks/useGetComponentInfo.ts'
import { updateQuestion } from '../../../../api/modules/question.ts'
import { useRequest, useKeyPress, useDebounceEffect } from 'ahooks'

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

const EditHeader: React.FC = () => {
  const navigate = useNavigate()

  return (
    <div className="bg-white border-b border-gray-200 py-[12px]">
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
            <Button type="primary">发布</Button>
          </Space>
        </div>
      </div>
    </div>
  )
}

export default EditHeader
