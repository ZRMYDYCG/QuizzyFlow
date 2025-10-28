/**
 * 管理后台 - 敏感词管理
 */
import React, { useState } from 'react'
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Space,
  Tag,
  message,
  Upload,
  Alert,
} from 'antd'
import {
  PlusOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  UploadOutlined,
  DownloadOutlined,
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import { useRequest } from 'ahooks'
import dayjs from 'dayjs'
import {
  getSensitiveWords,
  addSensitiveWord,
  deleteSensitiveWord,
  batchImportSensitiveWords,
  type SensitiveWord,
} from '@/api/modules/admin-moderation'

const SensitiveWordsPage: React.FC = () => {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(50)
  const [words, setWords] = useState<SensitiveWord[]>([])
  const [total, setTotal] = useState(0)

  const [addModalVisible, setAddModalVisible] = useState(false)
  const [importModalVisible, setImportModalVisible] = useState(false)
  const [addForm] = Form.useForm()
  const [importForm] = Form.useForm()

  // 加载敏感词列表
  const { loading, run: loadWords } = useRequest(
    async () => {
      const res = await getSensitiveWords(page, pageSize)
      return res
    },
    {
      manual: false,
      refreshDeps: [page, pageSize],
      onSuccess: (res: any) => {
        setWords(res.list)
        setTotal(res.total)
      },
      onError: (error: any) => {
        message.error(error.response?.data?.message || '加载失败')
      },
    }
  )

  // 添加敏感词
  const handleAdd = async () => {
    try {
      const values = await addForm.validateFields()
      await addSensitiveWord(values)
      message.success('添加成功')
      setAddModalVisible(false)
      addForm.resetFields()
      loadWords()
    } catch (error: any) {
      if (error.errorFields) return
      message.error(error.response?.data?.message || '添加失败')
    }
  }

  // 删除敏感词
  const handleDelete = (record: SensitiveWord) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除敏感词"${record.word}"吗？`,
      icon: <ExclamationCircleOutlined />,
      okText: '确定',
      cancelText: '取消',
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          await deleteSensitiveWord(record._id)
          message.success('删除成功')
          loadWords()
        } catch (error: any) {
          message.error(error.response?.data?.message || '删除失败')
        }
      },
    })
  }

  // 批量导入
  const handleBatchImport = async () => {
    try {
      const values = await importForm.validateFields()
      
      // 解析文本，每行一个敏感词
      const lines = values.wordsText.split('\n').filter((line: string) => line.trim())
      
      const words = lines.map((line: string) => {
        const parts = line.trim().split(/\s+/)
        return {
          word: parts[0],
          severity: (values.severity || 'medium') as 'low' | 'medium' | 'high',
          category: values.category || 'other',
          description: parts.length > 1 ? parts.slice(1).join(' ') : undefined,
        }
      })

      if (words.length === 0) {
        message.warning('请输入至少一个敏感词')
        return
      }

      const result = await batchImportSensitiveWords(words)
      message.success(result.message || '导入成功')
      setImportModalVisible(false)
      importForm.resetFields()
      loadWords()
    } catch (error: any) {
      if (error.errorFields) return
      message.error(error.response?.data?.message || '导入失败')
    }
  }

  // 导出为模板
  const handleExportTemplate = () => {
    const template = `# 敏感词批量导入模板
# 格式：每行一个敏感词，可以添加空格后添加说明
# 示例：
违禁词1 说明文字
违禁词2
违禁词3 这是说明

`
    const blob = new Blob([template], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = '敏感词导入模板.txt'
    a.click()
    URL.revokeObjectURL(url)
  }

  // 表格列定义
  const columns: ColumnsType<SensitiveWord> = [
    {
      title: '敏感词',
      dataIndex: 'word',
      key: 'word',
      width: 200,
      render: (word) => <span className="font-medium text-red-600">{word}</span>,
    },
    {
      title: '严重程度',
      dataIndex: 'severity',
      key: 'severity',
      width: 120,
      filters: [
        { text: '高', value: 'high' },
        { text: '中', value: 'medium' },
        { text: '低', value: 'low' },
      ],
      onFilter: (value, record) => record.severity === value,
      render: (severity) => {
        const severityMap: Record<string, { text: string; color: string }> = {
          high: { text: '高', color: 'red' },
          medium: { text: '中', color: 'orange' },
          low: { text: '低', color: 'blue' },
        }
        return (
          <Tag color={severityMap[severity]?.color}>
            {severityMap[severity]?.text || severity}
          </Tag>
        )
      },
    },
    {
      title: '分类',
      dataIndex: 'category',
      key: 'category',
      width: 120,
      filters: [
        { text: '政治', value: 'political' },
        { text: '暴力', value: 'violence' },
        { text: '色情', value: 'pornography' },
        { text: '诈骗', value: 'fraud' },
        { text: '垃圾', value: 'spam' },
        { text: '其他', value: 'other' },
      ],
      onFilter: (value, record) => record.category === value,
      render: (category) => {
        const categoryMap: Record<string, string> = {
          political: '政治',
          violence: '暴力',
          pornography: '色情',
          fraud: '诈骗',
          spam: '垃圾',
          other: '其他',
        }
        return <Tag>{categoryMap[category] || category}</Tag>
      },
    },
    {
      title: '说明',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
      render: (desc) => desc || <span className="text-gray-400">-</span>,
    },
    {
      title: '状态',
      dataIndex: 'isActive',
      key: 'isActive',
      width: 80,
      render: (isActive) =>
        isActive ? (
          <Tag color="success">启用</Tag>
        ) : (
          <Tag color="default">禁用</Tag>
        ),
    },
    {
      title: '添加人',
      dataIndex: 'addedBy',
      key: 'addedBy',
      width: 120,
      render: (addedBy) => addedBy || <span className="text-gray-400">-</span>,
    },
    {
      title: '添加时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 170,
      render: (date) => dayjs(date).format('YYYY-MM-DD HH:mm'),
    },
    {
      title: '操作',
      key: 'actions',
      width: 100,
      fixed: 'right',
      render: (_, record) => (
        <Button
          type="link"
          size="small"
          danger
          icon={<DeleteOutlined />}
          onClick={() => handleDelete(record)}
        >
          删除
        </Button>
      ),
    },
  ]

  return (
    <div className="space-y-4">
      {/* 页面标题 */}
      <div>
        <h1 className="text-2xl font-bold mb-2">敏感词管理</h1>
        <p className="text-gray-600">
          管理审核系统的敏感词库，用于自动检测和标记风险内容
        </p>
      </div>

      {/* 说明 */}
      <Alert
        message="敏感词说明"
        description={
          <div className="text-sm space-y-1">
            <div>• 敏感词用于自动审核系统，检测到敏感词的内容会被标记为高风险</div>
            <div>• 严重程度影响风险评分：高=40分，中=20分，低=5分</div>
            <div>• 支持批量导入，每行一个敏感词</div>
          </div>
        }
        type="info"
        showIcon
        className="mb-4"
      />

      {/* 操作栏 */}
      <div className="flex gap-3">
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setAddModalVisible(true)}
        >
          添加敏感词
        </Button>
        <Button
          icon={<UploadOutlined />}
          onClick={() => setImportModalVisible(true)}
        >
          批量导入
        </Button>
        <Button
          icon={<DownloadOutlined />}
          onClick={handleExportTemplate}
        >
          下载导入模板
        </Button>
      </div>

      {/* 敏感词表格 */}
      <Table
        columns={columns}
        dataSource={words}
        rowKey="_id"
        loading={loading}
        scroll={{ x: 1200 }}
        pagination={{
          current: page,
          pageSize,
          total,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `共 ${total} 个敏感词`,
          onChange: (page, pageSize) => {
            setPage(page)
            setPageSize(pageSize)
          },
        }}
      />

      {/* 添加敏感词弹窗 */}
      <Modal
        title="添加敏感词"
        open={addModalVisible}
        onCancel={() => {
          setAddModalVisible(false)
          addForm.resetFields()
        }}
        onOk={handleAdd}
        okText="添加"
        cancelText="取消"
      >
        <Form form={addForm} layout="vertical">
          <Form.Item
            label="敏感词"
            name="word"
            rules={[{ required: true, message: '请输入敏感词' }]}
          >
            <Input placeholder="请输入敏感词" />
          </Form.Item>

          <Form.Item
            label="严重程度"
            name="severity"
            rules={[{ required: true, message: '请选择严重程度' }]}
            initialValue="medium"
          >
            <Select
              options={[
                { label: '高', value: 'high' },
                { label: '中', value: 'medium' },
                { label: '低', value: 'low' },
              ]}
            />
          </Form.Item>

          <Form.Item
            label="分类"
            name="category"
            rules={[{ required: true, message: '请选择分类' }]}
            initialValue="other"
          >
            <Select
              options={[
                { label: '政治', value: 'political' },
                { label: '暴力', value: 'violence' },
                { label: '色情', value: 'pornography' },
                { label: '诈骗', value: 'fraud' },
                { label: '垃圾', value: 'spam' },
                { label: '其他', value: 'other' },
              ]}
            />
          </Form.Item>

          <Form.Item label="说明" name="description">
            <Input.TextArea rows={3} placeholder="选填：说明该敏感词的用途" />
          </Form.Item>
        </Form>
      </Modal>

      {/* 批量导入弹窗 */}
      <Modal
        title="批量导入敏感词"
        open={importModalVisible}
        onCancel={() => {
          setImportModalVisible(false)
          importForm.resetFields()
        }}
        onOk={handleBatchImport}
        okText="导入"
        cancelText="取消"
        width={600}
      >
        <Form form={importForm} layout="vertical">
          <Form.Item
            label="敏感词列表"
            name="wordsText"
            rules={[{ required: true, message: '请输入敏感词' }]}
            extra="每行一个敏感词，可在空格后添加说明"
          >
            <Input.TextArea
              rows={10}
              placeholder={`违禁词1 说明文字
违禁词2
违禁词3 这是说明`}
            />
          </Form.Item>

          <Form.Item
            label="默认严重程度"
            name="severity"
            initialValue="medium"
          >
            <Select
              options={[
                { label: '高', value: 'high' },
                { label: '中', value: 'medium' },
                { label: '低', value: 'low' },
              ]}
            />
          </Form.Item>

          <Form.Item
            label="默认分类"
            name="category"
            initialValue="other"
          >
            <Select
              options={[
                { label: '政治', value: 'political' },
                { label: '暴力', value: 'violence' },
                { label: '色情', value: 'pornography' },
                { label: '诈骗', value: 'fraud' },
                { label: '垃圾', value: 'spam' },
                { label: '其他', value: 'other' },
              ]}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default SensitiveWordsPage

