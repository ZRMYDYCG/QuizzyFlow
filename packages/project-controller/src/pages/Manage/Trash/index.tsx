import React from "react"
import {Empty, Typography, Table, Tag} from "antd"
import { useTitle } from "ahooks"
import { useState } from "react"

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

const Trash: React.FC =() => {
    useTitle("一刻 • 问卷 | 回收站")

    const [questionList, setQuestionList] = useState(QuestionList)
    const tableColumns = [
        {
            title: '标题',
            dataIndex: 'title',
            // key: 'title',
        },
        {
            title: '是否发布',
            dataIndex: 'isPublish',
            // key: 'isPublish',
            render: (isPublish: boolean) => {
               return isPublish ? <Tag color="success">已发布</Tag> : <Tag>未发布</Tag>
            }
        },
        {
          title: "答卷人数",
          dataIndex: "answerCount"
          // key: "answerCount"
        },
        {
            title: '创建时间',
            dataIndex: 'createdAt',
            // key: 'createdAt',
        }
    ]

    return (
        <>
            <div className="flex justify-between items-center">
                <div className="">
                    <Title level={3}>回收站</Title>
                </div>
                <div className="mb-5">
                    {/*搜索框*/}
                    搜索框
                </div>
            </div>
            <div>
                {questionList.length === 0 && <Empty />}
                {questionList.length > 0 && <Table dataSource={questionList} columns={tableColumns} pagination={false} /> }
            </div>
        </>
    )
}

export default Trash