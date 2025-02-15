import React from 'react'
import { Button, Space, Tooltip } from 'antd'
import {
  CopyOutlined,
  DeleteOutlined,
  EyeInvisibleOutlined,
  LockOutlined,
  BlockOutlined,
  ArrowDownOutlined,
  ArrowUpOutlined,
} from '@ant-design/icons'
import { useDispatch } from 'react-redux'
import {
  extraComponents,
  changeComponentsVisible,
  changeComponentsLock,
  copySelectedComponent,
  pasteComponent,
  selectPrevComponent,
  selectNextComponent,
} from '../../../../store/modules/question-component'
import useGetComponentInfo from '../../../../hooks/useGetComponentInfo'

const EditToolbar: React.FC = () => {
  const dispatch = useDispatch()
  const { selectedId, selectedComponent, copiedComponent } =
    useGetComponentInfo()
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

  // 拷贝当前选中的组件
  const handleCopy = () => {
    dispatch(copySelectedComponent())
  }

  // 粘贴组件
  const handlePasteComponent = () => {
    dispatch(pasteComponent())
  }

  // 上一个
  const handlePrevious = () => {
    dispatch(selectPrevComponent())
  }

  // 下一个
  const handleNext = () => {
    dispatch(selectNextComponent())
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
      <Tooltip title="上一个">
        <Button
          shape="circle"
          icon={<ArrowUpOutlined />}
          onClick={handlePrevious}
        />
      </Tooltip>
      <Tooltip title="下一个">
        <Button
          shape="circle"
          icon={<ArrowDownOutlined />}
          onClick={handleNext}
        />
      </Tooltip>
      <Tooltip title="复制">
        <Button
          shape="circle"
          icon={<CopyOutlined />}
          onClick={handleCopy}
        ></Button>
      </Tooltip>
      <Tooltip title="粘贴">
        <Button
          shape="circle"
          icon={<BlockOutlined />}
          onClick={handlePasteComponent}
          disabled={copiedComponent === null}
        ></Button>
      </Tooltip>
    </Space>
  )
}

export default EditToolbar
