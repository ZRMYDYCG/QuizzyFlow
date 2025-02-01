import React from "react"
import {Empty, Typography, Table, Tag, Button, Space, Modal, Spin, message} from "antd"
import { useTitle } from "ahooks"
import { useState } from "react"
import ListSearch from "../../../components/list-search.tsx"
import useLoadQuestionListData from "../../../hooks/useLoadQuestionListData.ts";
import ListPage from "../../../components/list-page.tsx"
import { updateQuestion } from "../../../api/modules/question.ts"
import { useRequest } from "ahooks"

const { Title } = Typography
const { confirm } = Modal

const Trash: React.FC =() => {
    useTitle("一刻 • 问卷 | 回收站")

    const { data = {}, loading, refresh } = useLoadQuestionListData({ isDeleted: true })
    const { list = [], total = 0 } = data


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

    // 恢复删除
    const { run: restore } = useRequest(async () => {
        for await (const id of selectedIds) {
            await updateQuestion(id, { isDeleted: false })
        }
    }, {
        manual: true,
        debounceWait: 500, // 防抖
        onSuccess: async () => {
            message.success('恢复成功')
            refresh() // 手动刷新列表
        }
    })

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
        <Space className="mb-5">
            <Button type="primary" onClick={restore} disabled={selectedIds.length === 0}  >
                恢复
            </Button>
            <Button disabled={selectedIds.length === 0} danger onClick={del}>
                彻底删除
            </Button>
        </Space>
        <Table
            dataSource={list}
            columns={tableColumns}
            pagination={false}
            rowKey={(q: any) => q._id}
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
                {loading && <div className="flex justify-center"><Spin /></div>}
                {!loading && list.length === 0 && <Empty />}
                {list.length > 0 &&  TableElement}
            </div>
            <div className="flex justify-center mt-5">
                <ListPage total={total} />
            </div>
        </>
    )
}

export default Trash