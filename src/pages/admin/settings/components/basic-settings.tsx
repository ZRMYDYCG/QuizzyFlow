import React from 'react'
import { Form, Input, Upload, Button, Card } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import type { SystemConfigItem, ConfigFormValues } from '@/types/system-config'

const { TextArea } = Input

interface BasicSettingsProps {
  configs: SystemConfigItem[]
  changedValues: ConfigFormValues
  onChange: (key: string, value: any) => void
}

/**
 * 基础设置组件
 */
const BasicSettings: React.FC<BasicSettingsProps> = ({
  configs,
  changedValues,
  onChange,
}) => {
  // 获取配置值（优先使用已更改的值）
  const getConfigValue = (key: string) => {
    if (key in changedValues) {
      return changedValues[key]
    }
    const config = configs.find((c) => c.key === key)
    return config?.value || ''
  }

  return (
    <div className="space-y-6">
      <Card title="网站信息" bordered={false}>
        <Form layout="vertical">
          <Form.Item
            label="网站名称"
            help="显示在浏览器标题和网站头部的名称"
          >
            <Input
              value={getConfigValue('site.name')}
              onChange={(e) => onChange('site.name', e.target.value)}
              placeholder="请输入网站名称"
              maxLength={50}
            />
          </Form.Item>

          <Form.Item
            label="网站Logo"
            help="网站Logo图片URL或上传图片"
          >
            <Input
              value={getConfigValue('site.logo')}
              onChange={(e) => onChange('site.logo', e.target.value)}
              placeholder="请输入Logo URL"
              addonAfter={
                <Upload>
                  <Button size="small" icon={<UploadOutlined />}>
                    上传
                  </Button>
                </Upload>
              }
            />
          </Form.Item>

          <Form.Item
            label="网站图标 (Favicon)"
            help="浏览器标签页图标"
          >
            <Input
              value={getConfigValue('site.favicon')}
              onChange={(e) => onChange('site.favicon', e.target.value)}
              placeholder="请输入Favicon URL"
            />
          </Form.Item>

          <Form.Item
            label="网站描述"
            help="显示在搜索引擎结果中的描述（SEO）"
          >
            <TextArea
              value={getConfigValue('site.description')}
              onChange={(e) => onChange('site.description', e.target.value)}
              placeholder="请输入网站描述"
              rows={3}
              maxLength={200}
              showCount
            />
          </Form.Item>

          <Form.Item
            label="网站关键词"
            help="SEO关键词，用逗号分隔"
          >
            <Input
              value={getConfigValue('site.keywords')}
              onChange={(e) => onChange('site.keywords', e.target.value)}
              placeholder="例如：问卷,调查,表单,QuizzyFlow"
            />
          </Form.Item>
        </Form>
      </Card>

      <Card title="版权信息" bordered={false}>
        <Form layout="vertical">
          <Form.Item
            label="版权信息"
            help="显示在页脚的版权信息"
          >
            <Input
              value={getConfigValue('site.copyright')}
              onChange={(e) => onChange('site.copyright', e.target.value)}
              placeholder="例如：© 2025 QuizzyFlow. All rights reserved."
            />
          </Form.Item>

          <Form.Item
            label="ICP备案号"
            help="网站ICP备案号"
          >
            <Input
              value={getConfigValue('site.icp')}
              onChange={(e) => onChange('site.icp', e.target.value)}
              placeholder="例如：京ICP备12345678号"
            />
          </Form.Item>
        </Form>
      </Card>

      <Card title="联系方式" bordered={false}>
        <Form layout="vertical">
          <Form.Item
            label="联系邮箱"
            help="网站联系邮箱"
          >
            <Input
              type="email"
              value={getConfigValue('site.email')}
              onChange={(e) => onChange('site.email', e.target.value)}
              placeholder="例如：contact@quizzyflow.com"
            />
          </Form.Item>

          <Form.Item
            label="联系电话"
            help="网站联系电话"
          >
            <Input
              value={getConfigValue('site.phone')}
              onChange={(e) => onChange('site.phone', e.target.value)}
              placeholder="例如：400-123-4567"
            />
          </Form.Item>

          <Form.Item
            label="联系地址"
            help="公司或组织地址"
          >
            <TextArea
              value={getConfigValue('site.address')}
              onChange={(e) => onChange('site.address', e.target.value)}
              placeholder="请输入联系地址"
              rows={2}
            />
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}

export default BasicSettings

