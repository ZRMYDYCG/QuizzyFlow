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
    <div className="mb-4 p-3 rounded-sm bg-white border border-gray-200 hover:shadow-sm transition duration-300 ease-in-out">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link
            to={isPublish ? `/question/static/${_id}` : `/question/edit/${_id}`}
          >
            {title}
          </Link>
          <div className="text-red-400 text-sm bg-red-300/20 rounded-sm px-1">
            考试
          </div>
        </div>
        <div className="flex items-center gap-3 text-sm text-gray-400">
          <div>ID: {_id}</div>
          {isPublish ? <Tag color="success">已发布</Tag> : <Tag>未发布</Tag>}
          <div>
            答卷: <span className="text-blue-500">{answerCount}</span>
          </div>
          <div>{createdAt}</div>
        </div>
      </div>
      <Divider />
      <div className="flex items-center justify-between">
        <div>
          <Space>
            <Button
              type="text"
              icon={<EditOutlined />}
              size="small"
              onClick={() => navigate(`/question/edit/${_id}`)}
            >
              编辑问卷
            </Button>
            <Button
              type="text"
              disabled={!isPublish}
              icon={<LineChartOutlined />}
              size="small"
              onClick={() => navigate(`/question/star/${_id}`)}
            >
              数据统计
            </Button>
          </Space>
        </div>
        <div>
          <Space>
            <Button
              type="text"
              onClick={changeStar}
              disabled={changeStarLoading}
            >
              <StarOutlined />
              {isStarState ? '取消星标' : '标星'}
            </Button>
            <Popconfirm
              title="确认复制该问卷？"
              okText="确认"
              cancelText="取消"
              onConfirm={duplicate}
              disabled={duplicateLoading}
            >
              <Button type="text">
                <CopyOutlined />
                复制
              </Button>
            </Popconfirm>
            <Button
              type="text"
              onClick={deleteConfirm}
              disabled={deleteLoading}
            >
              <DeleteOutlined />
              删除
            </Button>
          </Space>
        </div>
      </div>
    </div>
  )
}

export default QuestionsCard
