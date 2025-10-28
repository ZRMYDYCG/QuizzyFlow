/**
 * 答卷详情抽屉组件
 */
import React from 'react'
import {
  Drawer,
  Descriptions,
  Card,
  Tag,
  Space,
  Button,
  Divider,
  message,
} from 'antd'
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons'
import dayjs from 'dayjs'
import type { Answer } from '@/api/modules/admin-answer'
import { markAnswer, deleteAnswer } from '@/api/modules/admin-answer'

interface AnswerDetailDrawerProps {
  open: boolean
  answer: Answer
  onClose: () => void
  onRefresh?: () => void
}

const AnswerDetailDrawer: React.FC<AnswerDetailDrawerProps> = ({
  open,
  answer,
  onClose,
  onRefresh,
}) => {
  // 切换标记状态
  const handleToggleMark = async () => {
    try {
      await markAnswer(answer._id, !answer.isValid)
      message.success(answer.isValid ? '已标记为异常' : '已标记为正常')
      onRefresh?.()
    } catch (error: any) {
      message.error(error.response?.data?.message || '标记失败')
    }
  }

  // 删除答卷
  const handleDelete = async () => {
    try {
      await deleteAnswer(answer._id)
      message.success('删除成功')
      onClose()
      onRefresh?.()
    } catch (error: any) {
      message.error(error.response?.data?.message || '删除失败')
    }
  }

  // 格式化答案值
  const formatAnswerValue = (value: any): string => {
    if (value === null || value === undefined) {
      return '-'
    }
    if (Array.isArray(value)) {
      return value.join(', ')
    }
    if (typeof value === 'object') {
      return JSON.stringify(value, null, 2)
    }
    return String(value)
  }

  return (
    <Drawer
      title={
        <div className="flex items-center gap-2">
          <span>答卷详情</span>
          {answer.isValid ? (
            <Tag color="success" icon={<CheckCircleOutlined />}>
              正常
            </Tag>
          ) : (
            <Tag color="error" icon={<CloseCircleOutlined />}>
              异常
            </Tag>
          )}
        </div>
      }
      placement="right"
      width={700}
      open={open}
      onClose={onClose}
    >
      <div className="space-y-6">
        {/* 基本信息 */}
        <Card title="基本信息" size="small">
          <Descriptions column={1} bordered size="small">
            <Descriptions.Item label="答卷ID">
              <span className="font-mono text-xs">{answer._id}</span>
            </Descriptions.Item>
            <Descriptions.Item label="问卷标题">
              <span className="font-semibold">{answer.questionTitle || '未知问卷'}</span>
            </Descriptions.Item>
            <Descriptions.Item label="问卷创建者">
              {answer.questionAuthor || '-'}
            </Descriptions.Item>
            <Descriptions.Item label="提交时间">
              {dayjs(answer.createdAt).format('YYYY-MM-DD HH:mm:ss')}
            </Descriptions.Item>
            <Descriptions.Item label="答题时长">
              {answer.duration ? `${answer.duration} 秒` : '-'}
            </Descriptions.Item>
            <Descriptions.Item label="状态">
              {answer.isValid ? (
                <Tag color="success" icon={<CheckCircleOutlined />}>
                  正常答卷
                </Tag>
              ) : (
                <Tag color="error" icon={<CloseCircleOutlined />}>
                  异常答卷
                </Tag>
              )}
            </Descriptions.Item>
          </Descriptions>
        </Card>

        {/* 设备信息 */}
        <Card title="设备信息" size="small">
          <Descriptions column={1} bordered size="small">
            <Descriptions.Item label="IP地址">
              {answer.ip || '-'}
            </Descriptions.Item>
            <Descriptions.Item label="设备标识">
              <div className="text-xs break-all">
                {answer.userAgent || '-'}
              </div>
            </Descriptions.Item>
          </Descriptions>
        </Card>

        {/* 答题内容 */}
        <Card title="答题内容" size="small">
          {answer.answerList && answer.answerList.length > 0 ? (
            <div className="space-y-3">
              {answer.answerList.map((item, index) => (
                <div
                  key={item.componentId}
                  className="p-3 bg-gray-50 rounded border border-gray-200"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="font-semibold text-sm">
                      第 {index + 1} 题
                    </div>
                    <Tag color="blue" className="text-xs">
                      {item.componentType}
                    </Tag>
                  </div>
                  <div className="text-xs text-gray-500 mb-2 font-mono">
                    ID: {item.componentId}
                  </div>
                  <div className="text-sm">
                    <span className="text-gray-600">答案：</span>
                    <span className="font-medium">
                      {formatAnswerValue(item.value)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-400 py-8">
              暂无答题内容
            </div>
          )}
        </Card>

        {/* 操作按钮 */}
        <Divider />
        <div className="flex gap-3">
          <Button
            type={answer.isValid ? 'default' : 'primary'}
            icon={answer.isValid ? <ExclamationCircleOutlined /> : <CheckCircleOutlined />}
            block
            onClick={handleToggleMark}
          >
            {answer.isValid ? '标记为异常' : '标记为正常'}
          </Button>
          <Button
            danger
            icon={<DeleteOutlined />}
            block
            onClick={handleDelete}
          >
            删除答卷
          </Button>
        </div>
      </div>
    </Drawer>
  )
}

export default AnswerDetailDrawer

