import React from 'react'
import { Button, Space, Tooltip } from 'antd'
import { DeleteOutlined } from '@ant-design/icons'
import { useDispatch } from 'react-redux'
import { extraComponents } from '../../../../store/modules/question-component'

const EditToolbar: React.FC = () => {
  const dispatch = useDispatch()
  const handleDelete = () => {
    dispatch(extraComponents())
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
      <Button shape="circle"></Button>
      <Button shape="circle"></Button>
      <Button shape="circle"></Button>
      <Button shape="circle"></Button>
    </Space>
  )
}

export default EditToolbar
