/**
 * 模板详情抽屉组件
 */
import React from 'react'
import { 
  Drawer, 
  Descriptions, 
  Tag, 
  Space, 
  Button, 
  Image, 
  Card,
  Badge,
  Switch,
  message,
  Divider,
} from 'antd'
import {
  StarFilled,
  StarOutlined,
  CrownOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  EyeOutlined,
  HeartOutlined,
  FireOutlined,
} from '@ant-design/icons'
import dayjs from 'dayjs'
import type { Template } from '@/types/template'
import { TEMPLATE_CATEGORIES } from '@/constants/template-categories'
import { QUESTIONNAIRE_TYPE_NAMES, QUESTIONNAIRE_TYPE_COLORS } from '@/constants/questionnaire-types'
import { 
  setTemplateOfficial, 
  setTemplateFeatured,
  updateTemplateAdmin,
} from '@/api/modules/admin-template'

interface TemplateDetailDrawerProps {
  visible: boolean
  template: Template
  onClose: () => void
  onRefresh?: () => void
}

const TemplateDetailDrawer: React.FC<TemplateDetailDrawerProps> = ({
  visible,
  template,
  onClose,
  onRefresh,
}) => {
  // 切换官方状态
  const handleToggleOfficial = async () => {
    try {
      await setTemplateOfficial(template._id, !template.isOfficial)
      message.success(template.isOfficial ? '已取消官方标记' : '已设为官方模板')
      onRefresh?.()
    } catch (error: any) {
      message.error(error.response?.data?.message || '操作失败')
    }
  }

  // 切换精选状态
  const handleToggleFeatured = async () => {
    try {
      await setTemplateFeatured(template._id, !template.isFeatured)
      message.success(template.isFeatured ? '已取消精选' : '已设为精选')
      onRefresh?.()
    } catch (error: any) {
      message.error(error.response?.data?.message || '操作失败')
    }
  }

  // 更新评分
  const handleRatingChange = async (rating: number) => {
    try {
      await updateTemplateAdmin(template._id, { rating })
      message.success('评分更新成功')
      onRefresh?.()
    } catch (error: any) {
      message.error(error.response?.data?.message || '评分更新失败')
    }
  }

  // 获取审核状态标签
  const getApprovalStatusTag = (status: string) => {
    switch (status) {
      case 'approved':
        return <Tag color="success" icon={<CheckCircleOutlined />}>已通过</Tag>
      case 'rejected':
        return <Tag color="error" icon={<CloseCircleOutlined />}>已拒绝</Tag>
      case 'pending':
        return <Tag color="warning" icon={<ExclamationCircleOutlined />}>待审核</Tag>
      default:
        return <Tag>未知</Tag>
    }
  }

  const categoryConfig = TEMPLATE_CATEGORIES[template.category as keyof typeof TEMPLATE_CATEGORIES]

  return (
    <Drawer
      title={
        <div className="flex items-center gap-2">
          <span>模板详情</span>
          {template.isOfficial && <CrownOutlined className="text-yellow-500" />}
          {template.isFeatured && <StarFilled className="text-yellow-500" />}
        </div>
      }
      placement="right"
      width={700}
      open={visible}
      onClose={onClose}
    >
      <div className="space-y-6">
        {/* 缩略图 */}
        {template.thumbnail && (
          <div className="text-center">
            <Image
              src={template.thumbnail}
              alt={template.name}
              className="rounded-lg"
              style={{ maxHeight: 300 }}
            />
          </div>
        )}

        {/* 基本信息 */}
        <Card title="基本信息" size="small">
          <Descriptions column={1} bordered size="small">
            <Descriptions.Item label="模板名称">
              <span className="font-semibold">{template.name}</span>
            </Descriptions.Item>
            <Descriptions.Item label="模板描述">
              {template.description}
            </Descriptions.Item>
            <Descriptions.Item label="分类">
              {categoryConfig && (
                <Tag color={categoryConfig.color}>
                  {categoryConfig.emoji} {categoryConfig.label}
                </Tag>
              )}
            </Descriptions.Item>
            <Descriptions.Item label="问卷类型">
              <Tag color={QUESTIONNAIRE_TYPE_COLORS[template.type as keyof typeof QUESTIONNAIRE_TYPE_COLORS] || 'default'}>
                {QUESTIONNAIRE_TYPE_NAMES[template.type as keyof typeof QUESTIONNAIRE_TYPE_NAMES] || template.type}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="标签">
              <Space size="small" wrap>
                {template.tags && template.tags.length > 0 ? (
                  template.tags.map((tag, index) => (
                    <Tag key={index}>{tag}</Tag>
                  ))
                ) : (
                  <span className="text-gray-400">无</span>
                )}
              </Space>
            </Descriptions.Item>
          </Descriptions>
        </Card>

        {/* 创作者信息 */}
        <Card title="创作者信息" size="small">
          <Descriptions column={1} bordered size="small">
            <Descriptions.Item label="用户名">
              {template.author}
            </Descriptions.Item>
            <Descriptions.Item label="昵称">
              {template.authorNickname}
            </Descriptions.Item>
            {template.authorAvatar && (
              <Descriptions.Item label="头像">
                <Image
                  src={template.authorAvatar}
                  width={50}
                  height={50}
                  className="rounded-full"
                />
              </Descriptions.Item>
            )}
          </Descriptions>
        </Card>

        {/* 统计数据 */}
        <Card title="统计数据" size="small">
          <div className="grid grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">
                <FireOutlined /> {template.useCount || 0}
              </div>
              <div className="text-xs text-gray-500">使用次数</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-600">
                <HeartOutlined /> {template.likeCount || 0}
              </div>
              <div className="text-xs text-gray-500">点赞数</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">
                <EyeOutlined /> {template.viewCount || 0}
              </div>
              <div className="text-xs text-gray-500">浏览量</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-600">
                <StarFilled /> {template.rating?.toFixed(1) || '5.0'}
              </div>
              <div className="text-xs text-gray-500">评分</div>
            </div>
          </div>
        </Card>

        {/* 审核信息 */}
        <Card title="审核信息" size="small">
          <Descriptions column={1} bordered size="small">
            <Descriptions.Item label="审核状态">
              {getApprovalStatusTag(template.approvalStatus || 'approved')}
            </Descriptions.Item>
            {template.rejectionReason && (
              <Descriptions.Item label="拒绝原因">
                <div className="text-red-600">{template.rejectionReason}</div>
              </Descriptions.Item>
            )}
            {template.approvedAt && (
              <Descriptions.Item label="审核时间">
                {dayjs(template.approvedAt).format('YYYY-MM-DD HH:mm:ss')}
              </Descriptions.Item>
            )}
            {template.approvedBy && (
              <Descriptions.Item label="审核人">
                {template.approvedBy}
              </Descriptions.Item>
            )}
          </Descriptions>
        </Card>

        {/* 时间信息 */}
        <Card title="时间信息" size="small">
          <Descriptions column={1} bordered size="small">
            <Descriptions.Item label="创建时间">
              {dayjs(template.createdAt).format('YYYY-MM-DD HH:mm:ss')}
            </Descriptions.Item>
            <Descriptions.Item label="最后更新">
              {dayjs(template.updatedAt).format('YYYY-MM-DD HH:mm:ss')}
            </Descriptions.Item>
          </Descriptions>
        </Card>

        {/* 管理操作 */}
        <Card title="管理操作" size="small">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span>官方模板</span>
              <Switch
                checked={template.isOfficial}
                checkedChildren="是"
                unCheckedChildren="否"
                onChange={handleToggleOfficial}
              />
            </div>
            <Divider className="my-2" />
            <div className="flex items-center justify-between">
              <span>精选推荐</span>
              <Switch
                checked={template.isFeatured}
                checkedChildren={<StarFilled />}
                unCheckedChildren={<StarOutlined />}
                onChange={handleToggleFeatured}
              />
            </div>
            <Divider className="my-2" />
            <div className="flex items-center justify-between">
              <span>公开可见</span>
              <Switch
                checked={template.isPublic}
                checkedChildren="是"
                unCheckedChildren="否"
                disabled
              />
            </div>
          </div>
        </Card>

        {/* 底部操作按钮 */}
        <div className="flex gap-3">
          <Button
            type="primary"
            block
            onClick={() => {
              window.open(`/template/detail/${template._id}`, '_blank')
            }}
          >
            在新标签页中查看
          </Button>
        </div>
      </div>
    </Drawer>
  )
}

export default TemplateDetailDrawer

