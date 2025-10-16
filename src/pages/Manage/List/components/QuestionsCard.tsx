import { FC, useState } from 'react'
import { Button, Space, Divider, Tag, Popconfirm, Modal, message } from 'antd'
import {
  EditOutlined,
  LineChartOutlined,
  CopyOutlined,
  DeleteOutlined,
  StarOutlined,
} from '@ant-design/icons'
import { useNavigate, Link } from 'react-router-dom'
import {
  updateQuestion,
  duplicateQuestion,
} from '../../../../api/modules/question.ts'
import { useRequest } from 'ahooks'

const { confirm } = Modal

interface QuestionCardProps {
  _id: string
  title: string
  createdAt: string
  answerCount: number
  isStar: boolean
  isPublish: boolean
}

const QuestionsCard: FC<QuestionCardProps> = (props: QuestionCardProps) => {
  const { _id, answerCount, isPublish, isStar, createdAt, title } = props
  const navigate = useNavigate()

  const { loading: duplicateLoading, run: duplicate } = useRequest(
    async () => {
      return await duplicateQuestion(_id)
    },
    {
      manual: true,
      onSuccess: async (res: any) => {
        await message.success('复制成功')
        navigate(`/question/edit/${res._id}`)
      },
    }
  )

  const [isStarState, setIsStarState] = useState(isStar)
  const { run: changeStar, loading: changeStarLoading } = useRequest(
    async () => {
      await updateQuestion(_id, { isStar: !isStarState })
    },
    {
      manual: true,
      onSuccess: async () => {
        setIsStarState(!isStarState)
        await message.success('已更新')
      },
    }
  )

  // 删除
  const { loading: deleteLoading, run: del } = useRequest(
    async () => {
      await updateQuestion(_id, { isDelete: true })
    },
    {
      manual: true,
      onSuccess: async () => {
        await message.success('删除成功')
      },
    }
  )

  const deleteConfirm = () => {
    confirm({
      title: '确认删除该问卷？',
      content: '删除后将无法恢复，请谨慎操作！',
      onOk() {
        del()
        console.log('OK')
      },
      onCancel() {
        console.log('Cancel')
      },
    })
  }

  return (
    <div className="mb-4 p-5 rounded-lg bg-white border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-300 ease-in-out">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3 flex-1">
          <Link
            to={isPublish ? `/question/static/${_id}` : `/question/edit/${_id}`}
            className="text-base font-medium text-gray-800 hover:text-blue-600 transition-colors"
          >
            {title}
          </Link>
          <div className="text-xs font-medium text-red-500 bg-red-50 rounded-md px-2 py-1 border border-red-200">
            考试
          </div>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <div className="text-gray-400 text-xs">ID: {_id.slice(-6)}</div>
          {isPublish ? (
            <Tag color="success" className="!m-0">已发布</Tag>
          ) : (
            <Tag color="default" className="!m-0">未发布</Tag>
          )}
          <div className="text-gray-500">
            答卷: <span className="text-blue-600 font-medium">{answerCount}</span>
          </div>
          <div className="text-gray-400">{createdAt}</div>
        </div>
      </div>
      <Divider className="!my-3" />
      <div className="flex items-center justify-between">
        <div>
          <Space size="small">
            <Button
              type="text"
              icon={<EditOutlined />}
              size="middle"
              onClick={() => navigate(`/question/edit/${_id}`)}
              className="hover:bg-blue-50 hover:text-blue-600"
            >
              编辑问卷
            </Button>
            <Button
              type="text"
              disabled={!isPublish}
              icon={<LineChartOutlined />}
              size="middle"
              onClick={() => navigate(`/question/star/${_id}`)}
              className="hover:bg-green-50 hover:text-green-600"
            >
              数据统计
            </Button>
          </Space>
        </div>
        <div>
          <Space size="small">
            <Button
              type="text"
              icon={<StarOutlined style={{ color: isStarState ? '#fadb14' : undefined }} />}
              onClick={changeStar}
              disabled={changeStarLoading}
              className="hover:bg-yellow-50"
            >
              {isStarState ? '取消星标' : '标星'}
            </Button>
            <Popconfirm
              title="确认复制该问卷？"
              okText="确认"
              cancelText="取消"
              onConfirm={duplicate}
              disabled={duplicateLoading}
            >
              <Button type="text" icon={<CopyOutlined />} className="hover:bg-gray-50">
                复制
              </Button>
            </Popconfirm>
            <Button
              type="text"
              icon={<DeleteOutlined />}
              onClick={deleteConfirm}
              disabled={deleteLoading}
              danger
              className="hover:bg-red-50"
            >
              删除
            </Button>
          </Space>
        </div>
      </div>
    </div>
  )
}

export default QuestionsCard
