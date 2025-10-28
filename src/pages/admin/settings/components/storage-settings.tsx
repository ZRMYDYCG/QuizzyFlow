import React, { useState } from 'react'
import { Form, Input, Switch, Card, Radio, Alert, Collapse, Space, Tag } from 'antd'
import {
  CloudOutlined,
  FolderOutlined,
  GlobalOutlined,
  EyeInvisibleOutlined,
  EyeOutlined,
} from '@ant-design/icons'
import type { SystemConfigItem, ConfigFormValues } from '@/types/system-config'
import type { StorageType } from '@/types/system-config'

const { Panel } = Collapse

interface StorageSettingsProps {
  configs: SystemConfigItem[]
  changedValues: ConfigFormValues
  onChange: (key: string, value: any) => void
}

/**
 * 存储配置组件
 */
const StorageSettings: React.FC<StorageSettingsProps> = ({
  configs,
  changedValues,
  onChange,
}) => {
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({})

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

  const storageType = getConfigValue('storage.type') as StorageType

  const toggleSecret = (key: string) => {
    setShowSecrets((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  return (
    <div className="space-y-6">
      <Alert
        message="存储配置说明"
        description="选择文件存储方式，可以使用本地存储或云存储服务（OSS）"
        type="info"
        showIcon
        closable
      />

      <Card title="存储类型选择" bordered={false}>
        <Form layout="vertical">
          <Form.Item
            label="选择存储方式"
            help={getConfigInfo('storage.type')?.description}
          >
            <Radio.Group
              value={storageType}
              onChange={(e) => onChange('storage.type', e.target.value)}
              buttonStyle="solid"
            >
              <Space direction="vertical" style={{ width: '100%' }}>
                <Radio.Button value="local" style={{ width: '100%', height: 'auto', padding: '12px' }}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FolderOutlined style={{ fontSize: 20 }} />
                      <div>
                        <div className="font-medium">本地存储</div>
                        <div className="text-xs text-gray-500">文件保存在服务器本地磁盘</div>
                      </div>
                    </div>
                    {storageType === 'local' && <Tag color="green">当前使用</Tag>}
                  </div>
                </Radio.Button>

                <Radio.Button value="aliyun" style={{ width: '100%', height: 'auto', padding: '12px' }}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CloudOutlined style={{ fontSize: 20 }} />
                      <div>
                        <div className="font-medium">阿里云 OSS</div>
                        <div className="text-xs text-gray-500">使用阿里云对象存储服务</div>
                      </div>
                    </div>
                    {storageType === 'aliyun' && <Tag color="green">当前使用</Tag>}
                  </div>
                </Radio.Button>

                <Radio.Button value="qiniu" style={{ width: '100%', height: 'auto', padding: '12px' }}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CloudOutlined style={{ fontSize: 20 }} />
                      <div>
                        <div className="font-medium">七牛云 Kodo</div>
                        <div className="text-xs text-gray-500">使用七牛云对象存储服务</div>
                      </div>
                    </div>
                    {storageType === 'qiniu' && <Tag color="green">当前使用</Tag>}
                  </div>
                </Radio.Button>

                <Radio.Button value="tencent" style={{ width: '100%', height: 'auto', padding: '12px' }}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CloudOutlined style={{ fontSize: 20 }} />
                      <div>
                        <div className="font-medium">腾讯云 COS</div>
                        <div className="text-xs text-gray-500">使用腾讯云对象存储服务</div>
                      </div>
                    </div>
                    {storageType === 'tencent' && <Tag color="green">当前使用</Tag>}
                  </div>
                </Radio.Button>
              </Space>
            </Radio.Group>
          </Form.Item>
        </Form>
      </Card>

      {storageType === 'local' && (
        <Card title="本地存储配置" bordered={false}>
          <Alert
            message="本地存储说明"
            description="文件将保存在服务器的 uploads/ 目录下。本地存储适合小规模部署，大规模应用建议使用云存储。"
            type="info"
            showIcon
          />
        </Card>
      )}

      {storageType === 'aliyun' && (
        <Card title="阿里云 OSS 配置" bordered={false}>
          <Form layout="vertical">
            <Form.Item
              label={<><span className="text-red-500">*</span> AccessKey ID</>}
              help={getConfigInfo('storage.aliyun.accessKeyId')?.description}
            >
              <Input
                type={showSecrets['aliyun-key'] ? 'text' : 'password'}
                value={getConfigValue('storage.aliyun.accessKeyId')}
                onChange={(e) => onChange('storage.aliyun.accessKeyId', e.target.value)}
                placeholder="请输入阿里云 AccessKey ID"
                suffix={
                  showSecrets['aliyun-key'] ? (
                    <EyeOutlined onClick={() => toggleSecret('aliyun-key')} />
                  ) : (
                    <EyeInvisibleOutlined onClick={() => toggleSecret('aliyun-key')} />
                  )
                }
              />
            </Form.Item>

            <Form.Item
              label={<><span className="text-red-500">*</span> AccessKey Secret</>}
              help={getConfigInfo('storage.aliyun.accessKeySecret')?.description}
            >
              <Input
                type={showSecrets['aliyun-secret'] ? 'text' : 'password'}
                value={getConfigValue('storage.aliyun.accessKeySecret')}
                onChange={(e) =>
                  onChange('storage.aliyun.accessKeySecret', e.target.value)
                }
                placeholder="请输入阿里云 AccessKey Secret"
                suffix={
                  showSecrets['aliyun-secret'] ? (
                    <EyeOutlined onClick={() => toggleSecret('aliyun-secret')} />
                  ) : (
                    <EyeInvisibleOutlined onClick={() => toggleSecret('aliyun-secret')} />
                  )
                }
              />
            </Form.Item>

            <Form.Item
              label={<><span className="text-red-500">*</span> Bucket 名称</>}
              help={getConfigInfo('storage.aliyun.bucket')?.description}
            >
              <Input
                value={getConfigValue('storage.aliyun.bucket')}
                onChange={(e) => onChange('storage.aliyun.bucket', e.target.value)}
                placeholder="例如：quizzyflow"
              />
            </Form.Item>

            <Form.Item
              label={<><span className="text-red-500">*</span> Region 区域</>}
              help={getConfigInfo('storage.aliyun.region')?.description}
            >
              <Input
                value={getConfigValue('storage.aliyun.region')}
                onChange={(e) => onChange('storage.aliyun.region', e.target.value)}
                placeholder="例如：oss-cn-hangzhou"
              />
            </Form.Item>

            <Form.Item
              label="自定义域名"
              help={getConfigInfo('storage.aliyun.domain')?.description}
            >
              <Input
                value={getConfigValue('storage.aliyun.domain')}
                onChange={(e) => onChange('storage.aliyun.domain', e.target.value)}
                placeholder="例如：https://cdn.quizzyflow.com"
                prefix={<GlobalOutlined />}
              />
            </Form.Item>
          </Form>
        </Card>
      )}

      {storageType === 'qiniu' && (
        <Card title="七牛云 Kodo 配置" bordered={false}>
          <Form layout="vertical">
            <Form.Item
              label={<><span className="text-red-500">*</span> Access Key</>}
              help={getConfigInfo('storage.qiniu.accessKey')?.description}
            >
              <Input
                type={showSecrets['qiniu-key'] ? 'text' : 'password'}
                value={getConfigValue('storage.qiniu.accessKey')}
                onChange={(e) => onChange('storage.qiniu.accessKey', e.target.value)}
                placeholder="请输入七牛云 Access Key"
                suffix={
                  showSecrets['qiniu-key'] ? (
                    <EyeOutlined onClick={() => toggleSecret('qiniu-key')} />
                  ) : (
                    <EyeInvisibleOutlined onClick={() => toggleSecret('qiniu-key')} />
                  )
                }
              />
            </Form.Item>

            <Form.Item
              label={<><span className="text-red-500">*</span> Secret Key</>}
              help={getConfigInfo('storage.qiniu.secretKey')?.description}
            >
              <Input
                type={showSecrets['qiniu-secret'] ? 'text' : 'password'}
                value={getConfigValue('storage.qiniu.secretKey')}
                onChange={(e) => onChange('storage.qiniu.secretKey', e.target.value)}
                placeholder="请输入七牛云 Secret Key"
                suffix={
                  showSecrets['qiniu-secret'] ? (
                    <EyeOutlined onClick={() => toggleSecret('qiniu-secret')} />
                  ) : (
                    <EyeInvisibleOutlined onClick={() => toggleSecret('qiniu-secret')} />
                  )
                }
              />
            </Form.Item>

            <Form.Item
              label={<><span className="text-red-500">*</span> Bucket 名称</>}
              help={getConfigInfo('storage.qiniu.bucket')?.description}
            >
              <Input
                value={getConfigValue('storage.qiniu.bucket')}
                onChange={(e) => onChange('storage.qiniu.bucket', e.target.value)}
                placeholder="例如：quizzyflow"
              />
            </Form.Item>

            <Form.Item
              label={<><span className="text-red-500">*</span> 绑定域名</>}
              help={getConfigInfo('storage.qiniu.domain')?.description}
            >
              <Input
                value={getConfigValue('storage.qiniu.domain')}
                onChange={(e) => onChange('storage.qiniu.domain', e.target.value)}
                placeholder="例如：https://cdn.quizzyflow.com"
                prefix={<GlobalOutlined />}
              />
            </Form.Item>
          </Form>
        </Card>
      )}

      <Card title="CDN加速配置" bordered={false}>
        <Form layout="vertical">
          <Form.Item
            label="启用CDN加速"
            help={getConfigInfo('storage.cdn.enabled')?.description}
          >
            <Switch
              checked={getConfigValue('storage.cdn.enabled')}
              onChange={(checked) => onChange('storage.cdn.enabled', checked)}
              checkedChildren="启用"
              unCheckedChildren="禁用"
            />
          </Form.Item>

          {getConfigValue('storage.cdn.enabled') && (
            <Form.Item
              label="CDN域名"
              help={getConfigInfo('storage.cdn.domain')?.description}
            >
              <Input
                value={getConfigValue('storage.cdn.domain')}
                onChange={(e) => onChange('storage.cdn.domain', e.target.value)}
                placeholder="例如：https://cdn.quizzyflow.com"
                prefix={<GlobalOutlined />}
              />
            </Form.Item>
          )}
        </Form>

        <Alert
          message="CDN说明"
          description="启用CDN可以加速文件访问速度，需要在云存储服务商处配置CDN加速域名"
          type="info"
          showIcon
        />
      </Card>
    </div>
  )
}

export default StorageSettings

