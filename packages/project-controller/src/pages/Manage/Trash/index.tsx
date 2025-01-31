import React from "react"
import {Empty, Typography, Table, Tag, Button, Space, Modal, Spin} from "antd"
import { useTitle } from "ahooks"
import { useState } from "react"
import ListSearch from "../../../components/list-search.tsx"
import useLoadQuestionListData from "../../../hooks/useLoadQuestionListData.ts";
import ListPage from "../../../components/list-page.tsx"

const { Title } = Typography
const { confirm } = Modal

const Trash: React.FC =() => {
    useTitle("一刻 • 问卷 | 回收站")

    const { data = {}, loading } = useLoadQuestionListData({ isDeleted: true })
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