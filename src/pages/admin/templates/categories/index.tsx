/**
 * 管理后台 - 模板分类管理
 */
import React, { useEffect, useState } from 'react'
import { Table, Card, Tag, Space, Spin, Alert } from 'antd'
import { FolderOutlined, InfoCircleOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import { useRequest } from 'ahooks'
import { getTemplateStatistics } from '@/api/modules/admin-template'
import type { TemplateStatistics } from '@/api/modules/admin-template'
import { TEMPLATE_CATEGORIES, getAllCategories } from '@/constants/template-categories'

interface CategoryStatData {
  key: string
  name: string
  emoji: string
  description: string
  templateCount: number
  avgUseCount: number
  tags: string[]
}

const TemplateCategoriesPage: React.FC = () => {
  const [categoryData, setCategoryData] = useState<CategoryStatData[]>([])
  const categories = getAllCategories()

  // 加载统计数据
  const { loading } = useRequest(
    async () => {
      const stats = await getTemplateStatistics()
      return stats
    },
    {
      onSuccess: (stats: TemplateStatistics) => {
        // 将分类配置和统计数据合并
        const data = categories.map((category) => {
          const stat = stats.byCategory.find((s) => s._id === category.key)
          return {
            key: category.key,
            name: category.label,
            emoji: category.emoji,
            description: category.description,
            templateCount: stat?.count || 0,
            avgUseCount: Math.round(stat?.avgUseCount || 0),
            tags: category.tags,
          }
        })
        setCategoryData(data)
      },
      onError: () => {
        // 如果API失败，显示0数据
        const data = categories.map((category) => ({
          key: category.key,
          name: category.label,
          emoji: category.emoji,
          description: category.description,
          templateCount: 0,
          avgUseCount: 0,
          tags: category.tags,
        }))
        setCategoryData(data)
      },
    }
  )

  const columns: ColumnsType<CategoryStatData> = [
    {
      title: '分类',
      key: 'category',
      width: 200,
      render: (_, record) => (
        <div className="flex items-center gap-3">
          <span className="text-2xl">{record.emoji}</span>
          <div>
            <div className="font-semibold">{record.name}</div>
            <div className="text-xs text-gray-500">{record.key}</div>
          </div>
        </div>
      ),
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: '模板数量',
      dataIndex: 'templateCount',
      key: 'templateCount',
      width: 120,
      sorter: (a, b) => a.templateCount - b.templateCount,
      render: (count) => (
        <span className="font-semibold text-blue-600 text-base">{count}</span>
      ),
    },
    {
      title: '平均使用次数',
      dataIndex: 'avgUseCount',
      key: 'avgUseCount',
      width: 140,
      sorter: (a, b) => a.avgUseCount - b.avgUseCount,
      render: (avg) => (
        <span className="text-gray-700">{avg}</span>
      ),
    },
    {
      title: '常用标签',
      key: 'tags',
      width: 300,
      render: (_, record) => (
        <Space size="small" wrap>
          {record.tags && record.tags.length > 0 ? (
            record.tags.slice(0, 4).map((tag, index) => (
              <Tag key={index}>{tag}</Tag>
            ))
          ) : (
            <span className="text-gray-400 text-xs">-</span>
          )}
        </Space>
      ),
    },
    {
      title: '状态',
      key: 'status',
      width: 100,
      render: () => (
        <Tag color="blue">系统默认</Tag>
      ),
    },
  ]

  return (
    <div className="space-y-4">
      {/* 页面标题 */}
      <div>
        <h1 className="text-2xl font-bold mb-2">分类管理</h1>
        <p className="text-gray-600">
          系统预设 <span className="font-semibold text-blue-600">{categories.length}</span> 个模板分类，默认分类不可删除
        </p>
      </div>

      {/* 说明提示 */}
      <Alert
        message="分类说明"
        description={
          <div className="space-y-2 text-sm">
            <div className="flex items-start gap-2">
              <InfoCircleOutlined className="text-blue-500 mt-0.5" />
              <span>系统提供8个预设分类，涵盖商业、教育、研究、人力资源等主流场景</span>
            </div>
            <div className="flex items-start gap-2">
              <InfoCircleOutlined className="text-blue-500 mt-0.5" />
              <span>默认分类不可删除或修改，保证分类体系的稳定性和一致性</span>
            </div>
            <div className="flex items-start gap-2">
              <InfoCircleOutlined className="text-blue-500 mt-0.5" />
              <span>每个分类都有独特的图标(Emoji)和标签，便于用户识别和筛选</span>
            </div>
          </div>
        }
        type="info"
        showIcon
        className="mb-4"
      />

      {/* 统计概览卡片 */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <div className="text-center">
            <div className="text-gray-600 text-sm mb-1">总分类数</div>
            <div className="text-3xl font-bold text-blue-600">
              <FolderOutlined className="mr-2" />
              {categories.length}
            </div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-gray-600 text-sm mb-1">总模板数</div>
            <div className="text-3xl font-bold text-green-600">
              {categoryData.reduce((sum, cat) => sum + cat.templateCount, 0)}
            </div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-gray-600 text-sm mb-1">最多模板</div>
            <div className="text-3xl font-bold text-orange-600">
              {Math.max(...categoryData.map(c => c.templateCount), 0)}
            </div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-gray-600 text-sm mb-1">平均每类</div>
            <div className="text-3xl font-bold text-purple-600">
              {categoryData.length > 0 
                ? Math.round(categoryData.reduce((sum, cat) => sum + cat.templateCount, 0) / categoryData.length)
                : 0
              }
            </div>
          </div>
        </Card>
      </div>

      {/* 分类列表表格 */}
      <Card title="分类列表" className="shadow-sm">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Spin size="large" tip="加载分类数据中..." />
          </div>
        ) : (
          <Table
            columns={columns}
            dataSource={categoryData}
            rowKey="key"
            pagination={false}
            size="middle"
          />
        )}
      </Card>
    </div>
  )
}

export default TemplateCategoriesPage

