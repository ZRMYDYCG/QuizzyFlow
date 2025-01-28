import type { FC } from 'react'

interface QuestionCardProps {
  _id: string;
  title: string;
  type: string;
  createdAt: string;
  answerCount: number
  isStart: boolean
  isPublish: boolean
}

const QuestionsCard: FC<QuestionCardProps> = (props: QuestionCardProps) => {
  const { _id, answerCount, isPublish} = props;
  return (
      <div className="mb-4 p-3 rounded-sm bg-white border border-gray-200 hover:shadow-sm transition duration-300 ease-in-out">
        <div className="flex items-center justify-between border-b pb-3">
          <div className="flex items-center gap-2">
            <div>2023级电子科技小组项目组预备组员选拔 — WEB 前端开发</div>
            <div className="text-red-400 text-sm bg-red-300/20 rounded-sm px-1">考试</div>
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-400">
            <div>ID: { _id }</div>
            { isPublish ? <div className="text-blue-500">• 已发布</div> : '未发布' }
            <div>答卷: <span className="text-blue-500">{ answerCount }</span></div>
            <div>2024/2/29 18:16</div>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <button>编辑问卷</button>
            <button>数据统计</button>
          </div>
          <div>
            <button>标星</button>
            <button>复制</button>
            <button>删除</button>
          </div>
        </div>
      </div>
  );
};

export default QuestionsCard;
