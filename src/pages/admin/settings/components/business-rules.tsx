import React from 'react'
import { Form, InputNumber, Card, Alert, Statistic, Row, Col } from 'antd'
import {
  FileTextOutlined,
  FormOutlined,
  CloudUploadOutlined,
  PictureOutlined,
} from '@ant-design/icons'
import type { SystemConfigItem, ConfigFormValues } from '@/types/system-config'

interface BusinessRulesProps {
  configs: SystemConfigItem[]
  changedValues: ConfigFormValues
  onChange: (key: string, value: any) => void
}

/**
 * 业务规则组件
 */
const BusinessRules: React.FC<BusinessRulesProps> = ({
  configs,
  changedValues,
  onChange,
}) => {
  const getConfigValue = (key: string): number => {
    if (key in changedValues) {
      return changedValues[key]
    }
    const config = configs.find((c) => c.key === key)
    return config?.value || 0
  }

  const getConfigInfo = (key: string) => {
    return configs.find((c) => c.key === key)
  }

  return (
    <div className="space-y-6">
      <Alert
        message="业务规则说明"
        description="这些规则控制用户可使用的资源限制，合理设置可以保护系统性能和防止滥用"
        type="info"
        showIcon
        closable
      />

      <Card title="当前限制概览" bordered={false}>
        <Row gutter={16}>
          <Col span={8}>
            <Card>
              <Statistic
                title="用户最大问卷数"
                value={getConfigValue('business.maxQuestionsPerUser')}
                prefix={<FileTextOutlined />}
                suffix="份"
                valueStyle={{ color: '#3f8600' }}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Statistic
                title="问卷最大题目数"
                value={getConfigValue('business.maxComponentsPerQuestion')}
                prefix={<FormOutlined />}
                suffix="个"
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Statistic
                title="问卷最大答卷数"
                value={getConfigValue('business.maxAnswersPerQuestion')}
                prefix={<FormOutlined />}
                suffix="份"
                valueStyle={{ color: '#cf1322' }}
              />
            </Card>
          </Col>
        </Row>
      </Card>

      <Card title="问卷限制" bordered={false}>
        <Form layout="vertical">
          <Form.Item
            label="用户最大问卷数"
            help={getConfigInfo('business.maxQuestionsPerUser')?.description}
          >
            <InputNumber
              value={getConfigValue('business.maxQuestionsPerUser')}
              onChange={(value) => onChange('business.maxQuestionsPerUser', value)}
              min={10}
              max={10000}
              style={{ width: '100%' }}
              addonAfter="份问卷"
            />
          </Form.Item>

          <Form.Item
            label="问卷最大题目数"
            help={getConfigInfo('business.maxComponentsPerQuestion')?.description}
          >
            <InputNumber
              value={getConfigValue('business.maxComponentsPerQuestion')}
              onChange={(value) =>
                onChange('business.maxComponentsPerQuestion', value)
              }
              min={10}
              max={200}
              style={{ width: '100%' }}
              addonAfter="个题目"
            />
          </Form.Item>

          <Form.Item
            label="问卷最大答卷数"
            help={getConfigInfo('business.maxAnswersPerQuestion')?.description}
          >
            <InputNumber
              value={getConfigValue('business.maxAnswersPerQuestion')}
              onChange={(value) =>
                onChange('business.maxAnswersPerQuestion', value)
              }
              min={100}
              max={100000}
              style={{ width: '100%' }}
              addonAfter="份答卷"
            />
          </Form.Item>
        </Form>
      </Card>

      <Card title="文件上传限制" bordered={false}>
        <Form layout="vertical">
          <Form.Item
            label={
              <span>
                <CloudUploadOutlined /> 文件上传大小限制
              </span>
            }
            help={getConfigInfo('business.uploadMaxSize')?.description}
          >
            <InputNumber
              value={getConfigValue('business.uploadMaxSize')}
              onChange={(value) => onChange('business.uploadMaxSize', value)}
              min={1}
              max={100}
              style={{ width: '100%' }}
              addonAfter="MB"
            />
          </Form.Item>

          <Form.Item
            label={
              <span>
                <PictureOutlined /> 图片最大宽度
              </span>
            }
            help={getConfigInfo('business.imageMaxWidth')?.description}
          >
            <InputNumber
              value={getConfigValue('business.imageMaxWidth')}
              onChange={(value) => onChange('business.imageMaxWidth', value)}
              min={500}
              max={5000}
              step={100}
              style={{ width: '100%' }}
              addonAfter="像素"
            />
          </Form.Item>

          <Form.Item
            label={
              <span>
                <PictureOutlined /> 图片最大高度
              </span>
            }
            help={getConfigInfo('business.imageMaxHeight')?.description}
          >
            <InputNumber
              value={getConfigValue('business.imageMaxHeight')}
              onChange={(value) => onChange('business.imageMaxHeight', value)}
              min={500}
              max={5000}
              step={100}
              style={{ width: '100%' }}
              addonAfter="像素"
            />
          </Form.Item>
        </Form>

        <Alert
          message="文件限制说明"
          description="文件大小限制也受服务器配置影响，请确保服务器允许上传相应大小的文件"
          type="warning"
          showIcon
        />
      </Card>
    </div>
  )
}

export default BusinessRules

