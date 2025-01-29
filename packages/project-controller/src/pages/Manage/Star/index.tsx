import QuestionsCard from "../../Manage/List/components/QuestionsCard.tsx"
import { useState } from "react";
import { useTitle } from "ahooks"
import {Empty, Typography} from "antd";

const { Title } = Typography

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
        isStar: true,
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
        isStar: true,
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
        isStar: true,
        /*是否发布*/
        isPublish: true,
    },
]

const Star = () => {
    useTitle("一刻 • 问卷 | 星标问卷")
    const [questionList] = useState(QuestionList)
    return (
        <>
            {/*问卷列表头部*/}
            <div className="flex justify-between items-center">
                <div className="">
                    <Title level={3}>星标问卷</Title>
                </div>
                <div className="mb-5">
                    {/*搜索框*/}
                    搜索框
                </div>
            </div>
            {/*问卷列表主体*/}
            <div>
                {questionList.length === 0 ? <Empty description="暂无数据" /> : questionList.map((question) => {
                    const { _id } = question
                    return (
                        <QuestionsCard key={_id} {...question} />
                    )
                })}
            </div>
            {/*问卷列表底部*/}
            <div className="text-center">
                按钮分页
            </div>
        </>
    )
}

export default Star
