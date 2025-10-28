import React from 'react'
import { Form, Input, InputNumber, Switch, Card, Tag, Select, Alert } from 'antd'
import type { SystemConfigItem, ConfigFormValues } from '@/types/system-config'

interface SecuritySettingsProps {
  configs: SystemConfigItem[]
  changedValues: ConfigFormValues
  onChange: (key: string, value: any) => void
}

/**
 * 安全设置组件
 */
const SecuritySettings: React.FC<SecuritySettingsProps> = ({
  configs,
  changedValues,
  onChange,
}) => {
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

  return (
    <div className="space-y-6">
      <Alert
        message="安全设置警告"
        description="这些设置直接影响系统安全性，修改前请仔细评估影响"
        type="warning"
        showIcon
        closable
      />

      <Card title="密码策略" bordered={false}>
        <Form layout="vertical">
          <Form.Item
            label={<><span className="text-red-500">*</span> 密码最小长度</>}
            help={getConfigInfo('security.passwordMinLength')?.description}
          >
            <InputNumber
              value={getConfigValue('security.passwordMinLength')}
              onChange={(value) => onChange('security.passwordMinLength', value)}
              min={6}
              max={20}
              style={{ width: '100%' }}
              addonAfter="个字符"
            />
          </Form.Item>

          <Form.Item
            label="密码复杂度要求"
            help="设置密码必须包含的字符类型"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <span>必须包含大写字母</span>
                <Switch
                  checked={getConfigValue('security.passwordRequireUppercase')}
                  onChange={(checked) =>
                    onChange('security.passwordRequireUppercase', checked)
                  }
                />
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <span>必须包含数字</span>
                <Switch
                  checked={getConfigValue('security.passwordRequireNumber')}
                  onChange={(checked) =>
                    onChange('security.passwordRequireNumber', checked)
                  }
                />
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <span>必须包含特殊字符</span>
                <Switch
                  checked={getConfigValue('security.passwordRequireSpecialChar')}
                  onChange={(checked) =>
                    onChange('security.passwordRequireSpecialChar', checked)
                  }
                />
              </div>
            </div>
          </Form.Item>
        </Form>
      </Card>

      <Card title="登录安全" bordered={false}>
        <Form layout="vertical">
          <Form.Item
            label="登录失败最大尝试次数"
            help={getConfigInfo('security.loginMaxAttempts')?.description}
          >
            <InputNumber
              value={getConfigValue('security.loginMaxAttempts')}
              onChange={(value) => onChange('security.loginMaxAttempts', value)}
              min={3}
              max={10}
              style={{ width: '100%' }}
              addonAfter="次"
            />
          </Form.Item>

          <Form.Item
            label="账户锁定时长"
            help={getConfigInfo('security.loginLockDuration')?.description}
          >
            <InputNumber
              value={getConfigValue('security.loginLockDuration')}
              onChange={(value) => onChange('security.loginLockDuration', value)}
              min={5}
              max={1440}
              style={{ width: '100%' }}
              addonAfter="分钟"
            />
          </Form.Item>

          <Form.Item
            label="JWT Token过期时间"
            help={getConfigInfo('security.jwtExpiresIn')?.description}
          >
            <InputNumber
              value={getConfigValue('security.jwtExpiresIn')}
              onChange={(value) => onChange('security.jwtExpiresIn', value)}
              min={1}
              max={30}
              style={{ width: '100%' }}
              addonAfter="天"
            />
          </Form.Item>

          <Form.Item
            label="验证码"
            help={getConfigInfo('security.captchaEnabled')?.description}
          >
            <Switch
              checked={getConfigValue('security.captchaEnabled')}
              onChange={(checked) => onChange('security.captchaEnabled', checked)}
              checkedChildren="启用"
              unCheckedChildren="禁用"
            />
          </Form.Item>
        </Form>
      </Card>

      <Card title="IP访问控制" bordered={false}>
        <Alert
          message="IP控制说明"
          description="白名单优先级高于黑名单。如果设置了白名单，则只允许白名单内的IP访问后台"
          type="info"
          showIcon
          style={{ marginBottom: 16 }}
        />

        <Form layout="vertical">
          <Form.Item
            label={
              <span>
                IP白名单 <Tag color="green">允许</Tag>
              </span>
            }
            help="只允许这些IP访问后台管理，每行一个IP或IP段"
          >
            <Select
              mode="tags"
              value={getConfigValue('security.ipWhitelist') || []}
              onChange={(value) => onChange('security.ipWhitelist', value)}
              placeholder="输入IP地址，回车添加"
              style={{ width: '100%' }}
              tokenSeparators={[',']}
            />
          </Form.Item>

          <Form.Item
            label={
              <span>
                IP黑名单 <Tag color="red">禁止</Tag>
              </span>
            }
            help="禁止这些IP访问系统，每行一个IP或IP段"
          >
            <Select
              mode="tags"
              value={getConfigValue('security.ipBlacklist') || []}
              onChange={(value) => onChange('security.ipBlacklist', value)}
              placeholder="输入IP地址，回车添加"
              style={{ width: '100%' }}
              tokenSeparators={[',']}
            />
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}

export default SecuritySettings

