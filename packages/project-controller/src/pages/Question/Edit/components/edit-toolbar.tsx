import React from 'react'
import { Button, Space, Tooltip } from 'antd'
import {
  DeleteOutlined,
  EyeInvisibleOutlined,
  LockOutlined,
} from '@ant-design/icons'
import { useDispatch } from 'react-redux'
import {
  extraComponents,
  changeComponentsVisible,
  changeComponentsLock
} from '../../../../store/modules/question-component'
import useGetComponentInfo from '../../../../hooks/useGetComponentInfo'

const EditToolbar: React.FC = () => {
  const dispatch = useDispatch()
  const { selectedId, selectedComponent } = useGetComponentInfo()
  const { isLocked } = selectedComponent || {}

  // 删除组件
  const handleDelete = () => {
    dispatch(extraComponents())
  }

  // 隐藏组件
  const handleHide = () => {
    dispatch(changeComponentsVisible({ fe_id: selectedId, isHidden: true }))
  }

  // 锁定组件
  const handleLock = () => {
    dispatch(changeComponentsLock({ fe_id: selectedId }))
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
      <Tooltip title="锁定">
        <Button
          shape="circle"
          icon={<LockOutlined />}
          onClick={handleLock}
          type={isLocked ? 'primary' : 'default'}
        ></Button>
      </Tooltip>
      <Button shape="circle"></Button>
      <Button shape="circle"></Button>
      <Button shape="circle"></Button>
    </Space>
  )
}

export default EditToolbar
