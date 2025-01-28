import type { FC } from 'react'
import { Button, Space, Divider, Tag } from 'antd'
import {EditOutlined, LineChartOutlined, CopyOutlined, DeleteOutlined, StarOutlined} from '@ant-design/icons'
import { useNavigate, Link } from "react-router-dom";

interface QuestionCardProps {
  _id: string;
  title: string;
  type: string;
  createdAt: string;
  answerCount: number
  isStar: boolean
  isPublish: boolean
}

const QuestionsCard: FC<QuestionCardProps> = (props: QuestionCardProps) => {
  const { _id, answerCount, isPublish, isStar} = props;
  const navigate = useNavigate();

  return (
      <div className="mb-4 p-3 rounded-sm bg-white border border-gray-200 hover:shadow-sm transition duration-300 ease-in-out">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link to={isPublish ? `/question/static/${_id}` : `/question/edit/${_id}`}>2023级电子科技小组项目组预备组员选拔 — WEB 前端开发</Link>
            <div className="text-red-400 text-sm bg-red-300/20 rounded-sm px-1">考试</div>
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-400">
            <div>ID: { _id }</div>
            { isPublish ? <Tag color="success">已发布</Tag> : <Tag>未发布</Tag> }
            <div>答卷: <span className="text-blue-500">{ answerCount }</span></div>
            <div>2024/2/29 18:16</div>
          </div>
        </div>
        <Divider />
        <div className="flex items-center justify-between">
          <div>
            <Space>
              <Button type="text" icon={<EditOutlined />} size="small" onClick={() => navigate(`/question/edit/${_id}`)}>编辑问卷</Button>
              <Button type="text" disabled={!isPublish} icon={<LineChartOutlined />} size="small"  onClick={() => navigate(`/question/star/${_id}`)}>数据统计</Button>
            </Space>
          </div>
          <div>
            <Space>
              <Button type="text">
                <StarOutlined />
                {isStar ? '取消星标' : '标星'}
              </Button>
              <Button type="text">
                <CopyOutlined />
                复制
              </Button>
              <Button type="text">
                <DeleteOutlined />
                删除
              </Button>
            </Space>
          </div>
        </div>
      </div>
  );
};

export default QuestionsCard;
