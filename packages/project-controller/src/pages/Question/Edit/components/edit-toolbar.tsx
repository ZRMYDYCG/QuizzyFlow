import React from 'react'
import { Button, Space, Tooltip } from 'antd'
import { DeleteOutlined, EyeInvisibleOutlined } from '@ant-design/icons'
import { useDispatch } from 'react-redux'
import {
  extraComponents,
  changeComponentsVisible,
} from '../../../../store/modules/question-component'
import useGetComponentInfo from '../../../../hooks/useGetComponentInfo'

const EditToolbar: React.FC = () => {
  const dispatch = useDispatch()
  const { selectedId } = useGetComponentInfo()

  // 删除组件
  const handleDelete = () => {
    dispatch(extraComponents())
  }

  // 隐藏组件
  const handleHide = () => {
    dispatch(changeComponentsVisible({ fe_id: selectedId, isHidden: true }))
  }

  return (
    <Space>
      <Tooltip title="删除">
        <Button
          shape="circle"
          icon={<DeleteOutlined />}
          onClick={handleDelete}
        ></Button>
      </Tooltip>
      <Tooltip title="隐藏">
        <Button
          shape="circle"
          icon={<EyeInvisibleOutlined />}
          onClick={handleHide}
        ></Button>
      </Tooltip>
      <Button shape="circle"></Button>
      <Button shape="circle"></Button>
      <Button shape="circle"></Button>
      <Button shape="circle"></Button>
    </Space>
  )
}

export default EditToolbar
