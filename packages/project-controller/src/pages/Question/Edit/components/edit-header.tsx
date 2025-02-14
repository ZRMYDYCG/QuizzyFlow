import React from 'react'
import { Button, Space } from 'antd'
import { LeftOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import EditToolbar from './edit-toolbar'

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
            <h2 className="text-lg font-bold">问卷标题</h2>
          </Space>
        </div>
        <div className="flex-1 text-center">
          <EditToolbar />
        </div>
        <div className="flex-1 text-right">
          <Space>
            <Button type="default">保存</Button>
            <Button type="primary">发布</Button>
          </Space>
        </div>
      </div>
    </div>
  )
}

export default EditHeader
