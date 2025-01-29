import React from "react"
import {Empty, Typography, Table, Tag, Button, Space, Modal} from "antd"
import { useTitle } from "ahooks"
import { useState } from "react"
import ListSearch from "../../../components/list-search.tsx"

const { Title } = Typography
const { confirm } = Modal

const QuestionList = [
    {
        /*问卷ID*/
        _id: '2566582',
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
        _id: '256682',
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
        _id: '2966582',
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
        _id: '2559682',
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
        _id: '255236582',
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
        _id: '2554346582',
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
        _id: '323966582',
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
        _id: '2559323282',
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
        _id: '255961122',
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
        _id: '23542',
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

    const [questionList] = useState(QuestionList)
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
    const [selectedIds, setSelectedIds] = useState<string[]>([])

    const del = () => {
        confirm({
            title: '确认删除吗？',
            content: '删除后将无法恢复，请谨慎操作！',
            onOk() {
                console.log('OK')
            },
            onCancel() {
                console.log('Cancel')
            }
        })
    }

    const TableElement = <>
        <Space>
            <Button disabled={selectedIds.length === 0} type="primary" onClick={() => {
                console.log(selectedIds)
            }}>
                恢复
            </Button>
            <Button disabled={selectedIds.length === 0} danger onClick={del}>
                彻底删除
            </Button>
        </Space>
        <Table
            dataSource={questionList}
            columns={tableColumns}
            pagination={false}
            rowKey={q => q._id}
            rowSelection={{
                type: "checkbox",
                onChange: (selectedRowKeys) => {
                    setSelectedIds(selectedRowKeys as string[])
                }
            }}
        />
    </>

    return (
        <>
            <div className="flex justify-between items-center">
                <div className="">
                    <Title level={3}>回收站</Title>
                </div>
                <div className="mb-5">
                    {/*搜索框*/}
                    <ListSearch />
                </div>
            </div>
            <div>
                {questionList.length === 0 && <Empty />}
                {questionList.length > 0 &&  TableElement}
            </div>
        </>
    )
}

export default Trash