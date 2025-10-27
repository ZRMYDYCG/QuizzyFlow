import React from 'react'
import { Empty, Button } from 'antd'
import { FileTextOutlined } from '@ant-design/icons'

/**
 * 管理后台 - 问卷管理
 * TODO: 实现问卷审核和管理功能
 */
const QuestionsManagement: React.FC = () => {
  return (
    <div className="flex items-center justify-center" style={{ minHeight: '60vh' }}>
      <Empty
        image={<FileTextOutlined style={{ fontSize: 80, color: '#ccc' }} />}
        description={
          <div className="space-y-2">
            <div className="text-lg">问卷管理功能</div>
            <div className="text-gray-500">查看和管理所有用户的问卷</div>
          </div>
        }
      >
        <Button type="primary">敬请期待</Button>
      </Empty>
    </div>
  )
}

export default QuestionsManagement

