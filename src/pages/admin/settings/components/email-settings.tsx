import React, { useState } from 'react'
import { Form, Input, InputNumber, Switch, Card, Button, Alert, message } from 'antd'
import { MailOutlined, SendOutlined, EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons'
import type { SystemConfigItem, ConfigFormValues } from '@/types/system-config'

interface EmailSettingsProps {
  configs: SystemConfigItem[]
  changedValues: ConfigFormValues
  onChange: (key: string, value: any) => void
}

/**
 * 邮件配置组件
 */
const EmailSettings: React.FC<EmailSettingsProps> = ({
  configs,
  changedValues,
  onChange,
}) => {
  const [showPassword, setShowPassword] = useState(false)

  const getConfigValue = (key: string) => {
    if (key in changedValues) {
      return changedValues[key]
    }
    const config = configs.find((c) => c.key === key)
    return config?.value
  }

  const getConfigInfo = (key: string) => {
    return configs.find((c) => c.key === key)
  }

  // 测试邮件配置
  const handleTestEmail = () => {
    // TODO: 实现测试邮件发送功能
    message.info('测试邮件发送功能正在开发中')
  }

  return (
    <div className="space-y-6">
      <Alert
        message="邮件配置说明"
        description="配置SMTP服务器用于发送系统邮件，如注册验证、密码重置等"
        type="info"
        showIcon
        closable
      />

      <Card title="SMTP服务器配置" bordered={false}>
        <Form layout="vertical">
          <Form.Item
            label={<><span className="text-red-500">*</span> SMTP服务器地址</>}
            help={getConfigInfo('email.host')?.description}
          >
            <Input
              value={getConfigValue('email.host')}
              onChange={(e) => onChange('email.host', e.target.value)}
              placeholder="例如：smtp.gmail.com 或 smtp.qq.com"
              prefix={<MailOutlined />}
            />
          </Form.Item>

          <Form.Item
            label={<><span className="text-red-500">*</span> SMTP端口</>}
            help={getConfigInfo('email.port')?.description}
          >
            <InputNumber
              value={getConfigValue('email.port')}
              onChange={(value) => onChange('email.port', value)}
              min={1}
              max={65535}
              style={{ width: '100%' }}
              placeholder="常用端口：25, 465, 587"
            />
          </Form.Item>

          <Form.Item
            label="使用SSL/TLS"
            help={getConfigInfo('email.secure')?.description}
          >
            <Switch
              checked={getConfigValue('email.secure')}
              onChange={(checked) => onChange('email.secure', checked)}
              checkedChildren="启用"
              unCheckedChildren="禁用"
            />
            <div className="text-sm text-gray-500 mt-2">
              建议使用465端口时启用，使用587端口时禁用
            </div>
          </Form.Item>
        </Form>
      </Card>

      <Card title="SMTP认证信息" bordered={false}>
        <Alert
          message="安全提示"
          description="SMTP密码将被加密存储，但仍建议使用专用的应用密码，而非邮箱主密码"
          type="warning"
          showIcon
          style={{ marginBottom: 16 }}
        />

        <Form layout="vertical">
          <Form.Item
            label={<><span className="text-red-500">*</span> SMTP用户名</>}
            help={getConfigInfo('email.user')?.description}
          >
            <Input
              value={getConfigValue('email.user')}
              onChange={(e) => onChange('email.user', e.target.value)}
              placeholder="通常是完整的邮箱地址"
            />
          </Form.Item>

          <Form.Item
            label={<><span className="text-red-500">*</span> SMTP密码</>}
            help={getConfigInfo('email.password')?.description}
          >
            <Input
              type={showPassword ? 'text' : 'password'}
              value={getConfigValue('email.password')}
              onChange={(e) => onChange('email.password', e.target.value)}
              placeholder="邮箱密码或应用专用密码"
              suffix={
                <Button
                  type="text"
                  size="small"
                  icon={showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                  onClick={() => setShowPassword(!showPassword)}
                />
              }
            />
          </Form.Item>
        </Form>
      </Card>

      <Card title="发件人信息" bordered={false}>
        <Form layout="vertical">
          <Form.Item
            label={<><span className="text-red-500">*</span> 发件人邮箱</>}
            help={getConfigInfo('email.from')?.description}
          >
            <Input
              type="email"
              value={getConfigValue('email.from')}
              onChange={(e) => onChange('email.from', e.target.value)}
              placeholder="例如：noreply@quizzyflow.com"
              prefix={<MailOutlined />}
            />
          </Form.Item>

          <Form.Item
            label="发件人名称"
            help={getConfigInfo('email.fromName')?.description}
          >
            <Input
              value={getConfigValue('email.fromName')}
              onChange={(e) => onChange('email.fromName', e.target.value)}
              placeholder="例如：QuizzyFlow"
            />
          </Form.Item>
        </Form>
      </Card>

      <Card title="测试邮件配置" bordered={false}>
        <div className="space-y-4">
          <p className="text-gray-600">
            配置完成后，建议发送测试邮件验证配置是否正确
          </p>
          <Button
            type="primary"
            icon={<SendOutlined />}
            onClick={handleTestEmail}
          >
            发送测试邮件
          </Button>
        </div>
      </Card>

      <Alert
        message="常用SMTP配置参考"
        description={
          <div className="space-y-2 mt-2">
            <div><strong>Gmail:</strong> smtp.gmail.com:587 (需要应用专用密码)</div>
            <div><strong>QQ邮箱:</strong> smtp.qq.com:465 或 587 (需要开启SMTP服务)</div>
            <div><strong>163邮箱:</strong> smtp.163.com:465 或 25</div>
            <div><strong>阿里云邮箱:</strong> smtp.aliyun.com:465</div>
          </div>
        }
        type="info"
      />
    </div>
  )
}

export default EmailSettings

