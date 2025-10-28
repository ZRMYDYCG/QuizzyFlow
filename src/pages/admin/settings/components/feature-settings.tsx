import React from 'react'
import { Form, Switch, Card, Divider, Alert } from 'antd'
import type { SystemConfigItem, ConfigFormValues } from '@/types/system-config'

interface FeatureSettingsProps {
  configs: SystemConfigItem[]
  changedValues: ConfigFormValues
  onChange: (key: string, value: any) => void
}

/**
 * 功能开关组件
 */
const FeatureSettings: React.FC<FeatureSettingsProps> = ({
  configs,
  changedValues,
  onChange,
}) => {
  // 获取配置值
  const getConfigValue = (key: string): boolean => {
    if (key in changedValues) {
      return changedValues[key]
    }
    const config = configs.find((c) => c.key === key)
    return config?.value === true
  }

  // 获取配置信息
  const getConfigInfo = (key: string) => {
    return configs.find((c) => c.key === key)
  }

  return (
    <div className="space-y-6">
      <Alert
        message="功能开关说明"
        description="这些开关控制系统核心功能的启用状态，请谨慎操作"
        type="info"
        showIcon
        closable
      />

      <Card title="用户功能" bordered={false}>
        <Form layout="horizontal" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
          <Form.Item
            label={getConfigInfo('feature.register')?.name || '用户注册'}
            help={getConfigInfo('feature.register')?.description}
          >
            <Switch
              checked={getConfigValue('feature.register')}
              onChange={(checked) => onChange('feature.register', checked)}
              checkedChildren="开启"
              unCheckedChildren="关闭"
            />
          </Form.Item>

          <Form.Item
            label={getConfigInfo('feature.emailVerification')?.name || '邮箱验证'}
            help={getConfigInfo('feature.emailVerification')?.description}
          >
            <Switch
              checked={getConfigValue('feature.emailVerification')}
              onChange={(checked) => onChange('feature.emailVerification', checked)}
              checkedChildren="开启"
              unCheckedChildren="关闭"
            />
          </Form.Item>
        </Form>
      </Card>

      <Card title="内容功能" bordered={false}>
        <Form layout="horizontal" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
          <Form.Item
            label={getConfigInfo('feature.questionReview')?.name || '问卷审核'}
            help={getConfigInfo('feature.questionReview')?.description}
          >
            <Switch
              checked={getConfigValue('feature.questionReview')}
              onChange={(checked) => onChange('feature.questionReview', checked)}
              checkedChildren="开启"
              unCheckedChildren="关闭"
            />
          </Form.Item>

          <Form.Item
            label={getConfigInfo('feature.templateMarket')?.name || '模板市场'}
            help={getConfigInfo('feature.templateMarket')?.description}
          >
            <Switch
              checked={getConfigValue('feature.templateMarket')}
              onChange={(checked) => onChange('feature.templateMarket', checked)}
              checkedChildren="开启"
              unCheckedChildren="关闭"
            />
          </Form.Item>

          <Form.Item
            label={getConfigInfo('feature.comment')?.name || '评论功能'}
            help={getConfigInfo('feature.comment')?.description}
          >
            <Switch
              checked={getConfigValue('feature.comment')}
              onChange={(checked) => onChange('feature.comment', checked)}
              checkedChildren="开启"
              unCheckedChildren="关闭"
            />
          </Form.Item>
        </Form>
      </Card>

      <Card title="AI功能" bordered={false}>
        <Form layout="horizontal" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
          <Form.Item
            label={getConfigInfo('feature.aiAssistant')?.name || 'AI助手'}
            help={getConfigInfo('feature.aiAssistant')?.description}
          >
            <Switch
              checked={getConfigValue('feature.aiAssistant')}
              onChange={(checked) => onChange('feature.aiAssistant', checked)}
              checkedChildren="开启"
              unCheckedChildren="关闭"
            />
          </Form.Item>
        </Form>

        <Divider />

        <Alert
          message="AI功能说明"
          description="AI助手需要配置API密钥才能正常使用，请确保已在环境变量中配置相关密钥"
          type="warning"
          showIcon
        />
      </Card>
    </div>
  )
}

export default FeatureSettings

