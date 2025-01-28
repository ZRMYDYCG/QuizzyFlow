import QuestionsCard from "../../../components/QuestionsCard.tsx"
import { useState } from "react";

const QuestionList = [
    {
        /*问卷ID*/
        _id: '255966582',
        /*问卷标题*/
        title: "2023级电子科技小组项目组预备组员选拔赛 —— Web前端开发",
        /*问卷类型 enum*/
        type: "考试",
        /*问卷创建时间*/
        createdAt: "2025-01-01 14:30:00",
        /*答卷人数*/
        answerCount: 8,
        /*是否收藏*/
        isStart: true,
        /*是否发布*/
        isPublish: true,
    },
    {
        /*问卷ID*/
        _id: '255966582',
        /*问卷标题*/
        title: "2023级电子科技小组项目组预备组员选拔赛 —— Web前端开发",
        /*问卷类型 enum*/
        type: "考试",
        /*问卷创建时间*/
        createdAt: "2025-01-01 14:30:00",
        /*答卷人数*/
        answerCount: 8,
        /*是否收藏*/
        isStart: true,
        /*是否发布*/
        isPublish: true,
    },
    {
        /*问卷ID*/
        _id: '255966582',
        /*问卷标题*/
        title: "2023级电子科技小组项目组预备组员选拔赛 —— Web前端开发",
        /*问卷类型 enum*/
        type: "考试",
        /*问卷创建时间*/
        createdAt: "2025-01-01 14:30:00",
        /*答卷人数*/
        answerCount: 8,
        /*是否收藏*/
        isStart: true,
        /*是否发布*/
        isPublish: true,
    },
    {
        /*问卷ID*/
        _id: '255966582',
        /*问卷标题*/
        title: "2023级电子科技小组项目组预备组员选拔赛 —— Web前端开发",
        /*问卷类型 enum*/
        type: "考试",
        /*问卷创建时间*/
        createdAt: "2025-01-01 14:30:00",
        /*答卷人数*/
        answerCount: 8,
        /*是否收藏*/
        isStart: true,
        /*是否发布*/
        isPublish: true,
    },
    {
        /*问卷ID*/
        _id: '255966582',
        /*问卷标题*/
        title: "2023级电子科技小组项目组预备组员选拔赛 —— Web前端开发",
        /*问卷类型 enum*/
        type: "考试",
        /*问卷创建时间*/
        createdAt: "2025-01-01 14:30:00",
        /*答卷人数*/
        answerCount: 8,
        /*是否收藏*/
        isStart: true,
        /*是否发布*/
        isPublish: true,
    },
    {
        /*问卷ID*/
        _id: '255966582',
        /*问卷标题*/
        title: "2023级电子科技小组项目组预备组员选拔赛 —— Web前端开发",
        /*问卷类型 enum*/
        type: "考试",
        /*问卷创建时间*/
        createdAt: "2025-01-01 14:30:00",
        /*答卷人数*/
        answerCount: 8,
        /*是否收藏*/
        isStart: true,
        /*是否发布*/
        isPublish: true,
    },
    {
        /*问卷ID*/
        _id: '255966582',
        /*问卷标题*/
        title: "2023级电子科技小组项目组预备组员选拔赛 —— Web前端开发",
        /*问卷类型 enum*/
        type: "考试",
        /*问卷创建时间*/
        createdAt: "2025-01-01 14:30:00",
        /*答卷人数*/
        answerCount: 8,
        /*是否收藏*/
        isStart: true,
        /*是否发布*/
        isPublish: true,
    },
    {
        /*问卷ID*/
        _id: '255966582',
        /*问卷标题*/
        title: "2023级电子科技小组项目组预备组员选拔赛 —— Web前端开发",
        /*问卷类型 enum*/
        type: "考试",
        /*问卷创建时间*/
        createdAt: "2025-01-01 14:30:00",
        /*答卷人数*/
        answerCount: 8,
        /*是否收藏*/
        isStart: true,
        /*是否发布*/
        isPublish: true,
    },
    {
        /*问卷ID*/
        _id: '255966582',
        /*问卷标题*/
        title: "2023级电子科技小组项目组预备组员选拔赛 —— Web前端开发",
        /*问卷类型 enum*/
        type: "考试",
        /*问卷创建时间*/
        createdAt: "2025-01-01 14:30:00",
        /*答卷人数*/
        answerCount: 8,
        /*是否收藏*/
        isStart: true,
        /*是否发布*/
        isPublish: true,
    },
    {
        /*问卷ID*/
        _id: '255966582',
        /*问卷标题*/
        title: "2023级电子科技小组项目组预备组员选拔赛 —— Web前端开发",
        /*问卷类型 enum*/
        type: "考试",
        /*问卷创建时间*/
        createdAt: "2025-01-01 14:30:00",
        /*答卷人数*/
        answerCount: 8,
        /*是否收藏*/
        isStart: true,
        /*是否发布*/
        isPublish: true,
    },

]

const List = () => {
    const [questionList] = useState(QuestionList)
    return (
        <>
            {/*问卷列表头部*/}
            <div className="flex justify-between items-center">
                <div className="">
                    <h1 className="font-bold text-xl">问卷列表</h1>
                </div>
                <div className="mb-5">
                    {/*搜索框*/}
                    搜索框
                </div>
            </div>
            {/*问卷列表主体*/}
            <div>
                {questionList.map((question) => {
                    const { _id } = question
                    return (
                        <QuestionsCard key={_id} {...question} />
                    )
                })}
            </div>
            {/*问卷列表底部*/}
            <div className="text-center">
                底部
            </div>
        </>
    )
}

export default List
