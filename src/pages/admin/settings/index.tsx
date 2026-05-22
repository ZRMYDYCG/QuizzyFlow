import React, { useEffect, useState } from 'react'
import { Tabs, Button, Space, Alert } from 'antd'
import { message } from '@/utils/app-message'
import {
  SettingOutlined,
  SafetyOutlined,
  ThunderboltOutlined,
  ShopOutlined,
  MailOutlined,
  CloudOutlined,
  ReloadOutlined,
  SaveOutlined,
} from '@ant-design/icons'
import { useRequest } from 'ahooks'
import { getAllConfigsAPI, batchUpdateConfigsAPI } from '@/api/modules/system-config'
import type { GroupedConfigs, ConfigFormValues } from '@/types/system-config'

// 导入各配置分类组件
import BasicSettings from './components/basic-settings'
import FeatureSettings from './components/feature-settings'
import SecuritySettings from './components/security-settings'
import BusinessRules from './components/business-rules'
import EmailSettings from './components/email-settings'
import StorageSettings from './components/storage-settings'

/**
 * 管理后台 - 系统设置
 */
const SystemSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('basic')
  const [configs, setConfigs] = useState<GroupedConfigs>({})
  const [hasChanges, setHasChanges] = useState(false)
  const [changedValues, setChangedValues] = useState<ConfigFormValues>({})

  // 加载所有配置
  const { run: loadConfigs, loading } = useRequest(
    async () => {
      return await getAllConfigsAPI()
    },
    {
      manual: true,
      onSuccess: (result) => {
        console.log('📋 加载系统配置:', result)
        setConfigs(result)
      },
      onError: (error) => {
        console.error('Failed to load configs:', error)
        message.error('加载配置失败')
      },
    }
  )

  // 保存配置
  const { run: saveConfigs, loading: saving } = useRequest(
    async () => {
      const configArray = Object.entries(changedValues).map(([key, value]) => ({
        key,
        value,
      }))
      return await batchUpdateConfigsAPI({ configs: configArray })
    },
    {
      manual: true,
      onSuccess: (result) => {
        console.log('💾 保存结果:', result)
        message.success('配置保存成功')
        setHasChanges(false)
        setChangedValues({})
        loadConfigs()
      },
      onError: (error) => {
        console.error('Failed to save configs:', error)
        message.error('配置保存失败')
      },
    }
  )

  useEffect(() => {
    loadConfigs()
  }, [])

  // 处理配置值变化
  const handleConfigChange = (key: string, value: any) => {
    setChangedValues((prev) => ({
      ...prev,
      [key]: value,
    }))
    setHasChanges(true)
  }

  // 保存所有更改
  const handleSave = () => {
    if (!hasChanges) {
      message.info('没有需要保存的更改')
      return
    }
    saveConfigs()
  }

  // 重新加载
  const handleReload = () => {
    setChangedValues({})
    setHasChanges(false)
    loadConfigs()
  }

  // Tabs 配置
  const tabItems = [
    {
      key: 'basic',
      label: (
        <span>
          <SettingOutlined />
          基础设置
        </span>
      ),
      children: (
        <BasicSettings
          configs={configs.basic || []}
          changedValues={changedValues}
          onChange={handleConfigChange}
        />
      ),
    },
    {
      key: 'feature',
      label: (
        <span>
          <ThunderboltOutlined />
          功能开关
        </span>
      ),
      children: (
        <FeatureSettings
          configs={configs.feature || []}
          changedValues={changedValues}
          onChange={handleConfigChange}
        />
      ),
    },
    {
      key: 'security',
      label: (
        <span>
          <SafetyOutlined />
          安全设置
        </span>
      ),
      children: (
        <SecuritySettings
          configs={configs.security || []}
          changedValues={changedValues}
          onChange={handleConfigChange}
        />
      ),
    },
    {
      key: 'business',
      label: (
        <span>
          <ShopOutlined />
          业务规则
        </span>
      ),
      children: (
        <BusinessRules
          configs={configs.business || []}
          changedValues={changedValues}
          onChange={handleConfigChange}
        />
      ),
    },
    {
      key: 'email',
      label: (
        <span>
          <MailOutlined />
          邮件配置
        </span>
      ),
      children: (
        <EmailSettings
          configs={configs.email || []}
          changedValues={changedValues}
          onChange={handleConfigChange}
        />
      ),
    },
    {
      key: 'storage',
      label: (
        <span>
          <CloudOutlined />
          存储配置
        </span>
      ),
      children: (
        <StorageSettings
          configs={configs.storage || []}
          changedValues={changedValues}
          onChange={handleConfigChange}
        />
      ),
    },
  ]

  return (
    <div className="space-y-4">
      {/* 页面头部 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-2">系统设置</h1>
          <p className="text-gray-600">管理系统的全局配置和参数</p>
        </div>
        <Space>
          <Button
            icon={<ReloadOutlined />}
            onClick={handleReload}
            disabled={loading || saving}
          >
            重新加载
          </Button>
          <Button
            type="primary"
            icon={<SaveOutlined />}
            onClick={handleSave}
            loading={saving}
            disabled={!hasChanges || loading}
          >
            保存更改
          </Button>
        </Space>
      </div>

      {/* 未保存提示 */}
      {hasChanges && (
        <Alert
          message="您有未保存的更改"
          description='请点击"保存更改"按钮保存您的配置修改'
          type="warning"
          showIcon
          closable
        />
      )}

      {/* 配置选项卡 */}
      <div className="bg-white rounded-lg p-6">
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={tabItems}
          tabPosition="left"
          style={{ minHeight: 500 }}
        />
      </div>
    </div>
  )
}

export default SystemSettings
