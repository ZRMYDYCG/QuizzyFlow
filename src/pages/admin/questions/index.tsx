import React, { useEffect, useState } from 'react'
import {
  Table,
  Button,
  Input,
  Select,
  Space,
  Tag,
  Modal,
  message,
  Popconfirm,
  Drawer,
  Descriptions,
  Card,
  Row,
  Col,
  Badge,
  Tooltip,
  Switch,
} from 'antd'
import {
  SearchOutlined,
  EyeOutlined,
  DeleteOutlined,
  ReloadOutlined,
  StopOutlined,
  StarOutlined,
  StarFilled,
  CheckCircleOutlined,
  CloseCircleOutlined,
  FileTextOutlined,
  FormOutlined,
  BarChartOutlined,
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import { useRequest } from 'ahooks'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn'
import {
  getAdminQuestionsAPI,
  getAdminQuestionDetailAPI,
  updateQuestionStatusAPI,
  deleteQuestionAPI,
  setQuestionRecommendedAPI,
  getQuestionStatisticsAPI,
} from '@/api/modules/admin'
import { 
  QUESTIONNAIRE_TYPE_NAMES, 
  QUESTIONNAIRE_TYPE_COLORS 
} from '@/constants/questionnaire-types'

// 配置 dayjs
dayjs.extend(relativeTime)
dayjs.locale('zh-cn')

const { Search } = Input

/**
 * 管理后台 - 问卷管理
 */
const QuestionsManagement: React.FC = () => {
  const [questions, setQuestions] = useState<any[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  
  const [keyword, setKeyword] = useState('')
  const [statusFilter, setStatusFilter] = useState<'published' | 'draft' | undefined>()
  const [typeFilter, setTypeFilter] = useState<string>()
  const [authorFilter, setAuthorFilter] = useState<string>()
  
  const [detailDrawerVisible, setDetailDrawerVisible] = useState(false)
  const [selectedQuestion, setSelectedQuestion] = useState<any>(null)
  const [questionDetail, setQuestionDetail] = useState<any>(null)
  
  const [statistics, setStatistics] = useState<any>(null)

  // 加载问卷列表
  const { run: loadQuestions, loading } = useRequest(
    async () => {
      return await getAdminQuestionsAPI({
        page,
        pageSize,
        keyword,
        status: statusFilter,
        type: typeFilter,
        author: authorFilter,
      })
    },
    {
      manual: true,
      onSuccess: (result) => {
        console.log('📋 加载问卷数据:', result)
        setQuestions(Array.isArray(result.list) ? result.list : [])
        setTotal(result.total || 0)
      },
      onError: () => {
        message.error('加载问卷列表失败')
      },
    }
  )

  // 加载统计数据
  const { run: loadStatistics } = useRequest(
    async () => {
      return await getQuestionStatisticsAPI()
    },
    {
      manual: true,
      onSuccess: (result) => {
        setStatistics(result)
      },
      onError: (error) => {
        console.error('Failed to load statistics:', error)
      },
    }
  )

  useEffect(() => {
    loadQuestions()
    loadStatistics()
  }, [page, pageSize, keyword, statusFilter, typeFilter, authorFilter])

  // 查看详情
  const { run: fetchQuestionDetail } = useRequest(
    async (questionId: string) => {
      return await getAdminQuestionDetailAPI(questionId)
    },
    {
      manual: true,
      onSuccess: (result) => {
        setQuestionDetail(result)
        setDetailDrawerVisible(true)
      },
      onError: () => {
        message.error('加载问卷详情失败')
      },
    }
  )

  const showQuestionDetail = (question: any) => {
    setSelectedQuestion(question)
    fetchQuestionDetail(question._id)
  }

  // 下架问卷
  const handleTakeDown = async (question: any) => {
    try {
      await updateQuestionStatusAPI(question._id, {
        isPublished: false,
        reason: '管理员下架',
      })
      message.success('问卷已下架')
      loadQuestions()
    } catch (error: any) {
      message.error(error.response?.data?.message || '下架失败')
    }
  }

  // 发布问卷
  const handlePublish = async (question: any) => {
    try {
      await updateQuestionStatusAPI(question._id, {
        isPublished: true,
      })
      message.success('问卷已发布')
      loadQuestions()
    } catch (error: any) {
      message.error(error.response?.data?.message || '发布失败')
    }
  }

  // 删除问卷
  const handleDelete = async (question: any) => {
    try {
      await deleteQuestionAPI(question._id)
      message.success('问卷已删除')
      loadQuestions()
      loadStatistics()
    } catch (error: any) {
      message.error(error.response?.data?.message || '删除失败')
    }
  }

  // 设置推荐
  const handleToggleRecommended = async (question: any) => {
    try {
      const isRecommended = !question.isRecommended
      await setQuestionRecommendedAPI(question._id, isRecommended)
      message.success(isRecommended ? '已设为推荐' : '已取消推荐')
      loadQuestions()
    } catch (error: any) {
      message.error(error.response?.data?.message || '操作失败')
    }
  }

  const columns: ColumnsType<any> = [
    {
      title: '问卷信息',
      key: 'info',
      width: 300,
      fixed: 'left' as const,
      render: (_, record) => (
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium text-base">{record.title}</span>
            {record.isRecommended && (
              <StarFilled className="text-yellow-500" />
            )}
          </div>
          {record.desc && (
            <div className="text-xs text-gray-500 mb-2 line-clamp-2">
              {record.desc}
            </div>
          )}
          <Space size="small">
            <Tag color={QUESTIONNAIRE_TYPE_COLORS[record.type as keyof typeof QUESTIONNAIRE_TYPE_COLORS] || 'default'}>
              {QUESTIONNAIRE_TYPE_NAMES[record.type as keyof typeof QUESTIONNAIRE_TYPE_NAMES] || record.type || '未分类'}
            </Tag>
            {record.isPublished ? (
              <Tag color="success" icon={<CheckCircleOutlined />}>
                已发布
              </Tag>
            ) : (
              <Tag color="default" icon={<CloseCircleOutlined />}>
                草稿
              </Tag>
            )}
          </Space>
        </div>
      ),
    },
    {
      title: '创建者',
      dataIndex: 'author',
      key: 'author',
      width: 150,
      render: (author, record) => (
        <div>
          <div className="font-medium">{record.authorInfo?.nickname || author}</div>
          <div className="text-xs text-gray-500">{author}</div>
        </div>
      ),
    },
    {
      title: '数据统计',
      key: 'statistics',
      width: 150,
      render: (_, record) => (
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <FormOutlined className="text-blue-500" />
            <span className="text-sm">
              <span className="font-semibold">{record.answerCount || 0}</span> 份答卷
            </span>
          </div>
          <div className="flex items-center gap-2">
            <FileTextOutlined className="text-green-500" />
            <span className="text-sm">
              <span className="font-semibold">{record.componentList?.length || 0}</span> 个题目
            </span>
          </div>
        </div>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 170,
      sorter: (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      render: (date) => (
        <div>
          <div>{dayjs(date).format('YYYY-MM-DD')}</div>
          <div className="text-xs text-gray-500">
            {dayjs(date).format('HH:mm:ss')}
          </div>
        </div>
      ),
    },
    {
      title: '最后更新',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      width: 170,
      sorter: (a, b) => new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime(),
      render: (date) => dayjs(date).fromNow(),
    },
    {
      title: '推荐',
      key: 'recommended',
      width: 80,
      render: (_, record) => (
        <Switch
          checked={record.isRecommended}
          checkedChildren={<StarFilled />}
          unCheckedChildren={<StarOutlined />}
          onChange={() => handleToggleRecommended(record)}
        />
      ),
    },
    {
      title: '操作',
      key: 'actions',
      fixed: 'right' as const,
      width: 280,
      render: (_, record) => (
        <Space size="small" wrap>
          <Button
            type="link"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => showQuestionDetail(record)}
          >
            详情
          </Button>
          {record.isPublished ? (
            <Button
              type="link"
              size="small"
              danger
              icon={<StopOutlined />}
              onClick={() => {
                Modal.confirm({
                  title: '下架问卷',
                  content: `确定要下架问卷《${record.title}》吗？`,
                  onOk: () => handleTakeDown(record),
                })
              }}
            >
              下架
            </Button>
          ) : (
            <Button
              type="link"
              size="small"
              icon={<CheckCircleOutlined />}
              onClick={() => handlePublish(record)}
            >
              发布
            </Button>
          )}
          <Button
            type="link"
            size="small"
            icon={<BarChartOutlined />}
            onClick={() => {
              window.open(`/question/statistics/${record._id}`, '_blank')
            }}
          >
            统计
          </Button>
          <Popconfirm
            title="删除问卷"
            description={`确定要删除问卷《${record.title}》吗？此操作不可恢复！`}
            onConfirm={() => handleDelete(record)}
            okText="确定"
            cancelText="取消"
          >
            <Button
              type="link"
              size="small"
              danger
              icon={<DeleteOutlined />}
            >
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-2">问卷管理</h1>
          <p className="text-gray-600">查看和管理所有用户创建的问卷</p>
        </div>
      </div>

      {/* 统计卡片 */}
      {statistics && (
        <Row gutter={16}>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                  <FileTextOutlined className="text-2xl text-blue-500" />
                </div>
                <div>
                  <div className="text-gray-600 text-sm">总问卷数</div>
                  <div className="text-2xl font-bold">{statistics.total || 0}</div>
                </div>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                  <CheckCircleOutlined className="text-2xl text-green-500" />
                </div>
                <div>
                  <div className="text-gray-600 text-sm">已发布</div>
                  <div className="text-2xl font-bold">{statistics.published || 0}</div>
                </div>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
                  <CloseCircleOutlined className="text-2xl text-gray-500" />
                </div>
                <div>
                  <div className="text-gray-600 text-sm">草稿</div>
                  <div className="text-2xl font-bold">{statistics.draft || 0}</div>
                </div>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-yellow-100 flex items-center justify-center">
                  <StarFilled className="text-2xl text-yellow-500" />
                </div>
                <div>
                  <div className="text-gray-600 text-sm">推荐问卷</div>
                  <div className="text-2xl font-bold">{statistics.recommended || 0}</div>
                </div>
              </div>
            </Card>
          </Col>
        </Row>
      )}

      {/* 筛选栏 */}
      <div className="flex gap-4 flex-wrap">
        <Search
          placeholder="搜索问卷标题或描述"
          allowClear
          style={{ width: 300 }}
          onSearch={(value) => {
            setKeyword(value)
            setPage(1)
          }}
          enterButton={<SearchOutlined />}
        />
        <Select
          placeholder="发布状态"
          style={{ width: 150 }}
          allowClear
          onChange={(value) => {
            setStatusFilter(value)
            setPage(1)
          }}
        >
          <Select.Option value="published">已发布</Select.Option>
          <Select.Option value="draft">草稿</Select.Option>
        </Select>
        <Select
          placeholder="问卷类型"
          style={{ width: 150 }}
          allowClear
          onChange={(value) => {
            setTypeFilter(value)
            setPage(1)
          }}
        >
          {Object.entries(QUESTIONNAIRE_TYPE_NAMES).map(([key, label]) => (
            <Select.Option key={key} value={key}>
              {label as string}
            </Select.Option>
          ))}
        </Select>
        <Input
          placeholder="创建者用户名"
          style={{ width: 200 }}
          allowClear
          onChange={(e) => {
            setAuthorFilter(e.target.value)
            if (!e.target.value) {
              setPage(1)
            }
          }}
          onPressEnter={(e) => {
            setAuthorFilter((e.target as HTMLInputElement).value)
            setPage(1)
          }}
        />
        <Button icon={<ReloadOutlined />} onClick={() => {
          loadQuestions()
          loadStatistics()
        }}>
          刷新
        </Button>
      </div>

      {/* 问卷表格 */}
      <Table
        columns={columns}
        dataSource={questions}
        rowKey="_id"
        loading={loading}
        scroll={{ x: 1400 }}
        pagination={{
          current: page,
          pageSize,
          total,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `共 ${total} 份问卷`,
          onChange: (page, pageSize) => {
            setPage(page)
            setPageSize(pageSize)
          },
        }}
      />

      {/* 问卷详情抽屉 */}
      <Drawer
        title="问卷详情"
        placement="right"
        width={700}
        onClose={() => setDetailDrawerVisible(false)}
        open={detailDrawerVisible}
      >
        {questionDetail && (
          <div className="space-y-6">
            <Descriptions column={1} bordered>
              <Descriptions.Item label="问卷标题">
                {questionDetail.title}
              </Descriptions.Item>
              <Descriptions.Item label="问卷描述">
                {questionDetail.desc || '-'}
              </Descriptions.Item>
              <Descriptions.Item label="问卷类型">
                <Tag color={QUESTIONNAIRE_TYPE_COLORS[questionDetail.type as keyof typeof QUESTIONNAIRE_TYPE_COLORS] || 'default'}>
                  {QUESTIONNAIRE_TYPE_NAMES[questionDetail.type as keyof typeof QUESTIONNAIRE_TYPE_NAMES] || questionDetail.type || '未分类'}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="创建者">
                <div>
                  <div>{questionDetail.authorInfo?.nickname || questionDetail.author}</div>
                  <div className="text-xs text-gray-500">{questionDetail.author}</div>
                </div>
              </Descriptions.Item>
              <Descriptions.Item label="状态">
                <Space>
                  {questionDetail.isPublished ? (
                    <Badge status="success" text="已发布" />
                  ) : (
                    <Badge status="default" text="草稿" />
                  )}
                  {questionDetail.isStarred && <Tag color="gold">已收藏</Tag>}
                  {questionDetail.isRecommended && <Tag color="orange">推荐</Tag>}
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="题目数量">
                {questionDetail.componentList?.length || 0} 个
              </Descriptions.Item>
              <Descriptions.Item label="答卷数量">
                {questionDetail.answerCount || 0} 份
              </Descriptions.Item>
              <Descriptions.Item label="创建时间">
                {dayjs(questionDetail.createdAt).format('YYYY-MM-DD HH:mm:ss')}
              </Descriptions.Item>
              <Descriptions.Item label="最后更新">
                {dayjs(questionDetail.updatedAt).format('YYYY-MM-DD HH:mm:ss')}
              </Descriptions.Item>
            </Descriptions>

            {/* 题目列表 */}
            {questionDetail.componentList && questionDetail.componentList.length > 0 && (
              <div>
                <h3 className="font-semibold mb-3 text-base">题目列表</h3>
                <div className="space-y-3">
                  {questionDetail.componentList.map((component: any, index: number) => (
                    <Card key={component.fe_id} size="small">
                      <div className="flex items-start gap-3">
                        <Badge count={index + 1} style={{ backgroundColor: '#52c41a' }} />
                        <div className="flex-1">
                          <div className="font-medium mb-1">{component.title || component.text || '未命名题目'}</div>
                          <Tag color="blue" className="text-xs">{component.type}</Tag>
                          {component.isRequired && (
                            <Tag color="red" className="text-xs">必填</Tag>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* 操作按钮 */}
            <div className="flex gap-3">
              <Button
                type="primary"
                icon={<BarChartOutlined />}
                onClick={() => {
                  window.open(`/question/statistics/${questionDetail._id}`, '_blank')
                }}
                block
              >
                查看统计
              </Button>
              <Button
                icon={<EyeOutlined />}
                onClick={() => {
                  window.open(`/question/edit/${questionDetail._id}`, '_blank')
                }}
                block
              >
                查看问卷
              </Button>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  )
}

export default QuestionsManagement
