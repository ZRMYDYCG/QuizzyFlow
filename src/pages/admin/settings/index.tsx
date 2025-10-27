import React from 'react'
import { Empty, Button } from 'antd'
import { SettingOutlined } from '@ant-design/icons'

/**
 * 管理后台 - 系统设置
 * TODO: 实现系统配置功能
 */
const SystemSettings: React.FC = () => {
  return (
    <div className="flex items-center justify-center" style={{ minHeight: '60vh' }}>
      <Empty
        image={<SettingOutlined style={{ fontSize: 80, color: '#ccc' }} />}
        description={
          <div className="space-y-2">
            <div className="text-lg">系统设置</div>
            <div className="text-gray-500">配置系统参数和选项</div>
          </div>
        }
      >
        <Button type="primary">敬请期待</Button>
      </Empty>
    </div>
  )
}

export default SystemSettings

