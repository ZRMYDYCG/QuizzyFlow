import React from 'react'
import {
  Empty,
  Typography,
  Table,
  Tag,
  Button,
  Space,
  Modal,
  Spin,
  message,
} from 'antd'
import { useTitle } from 'ahooks'
import { useState } from 'react'
import ListSearch from '../../../components/list-search.tsx'
import useLoadQuestionListData from '../../../hooks/useLoadQuestionListData.ts'
import ListPage from '../../../components/list-page.tsx'
import { updateQuestion } from '../../../api/modules/question.ts'
import { useRequest } from 'ahooks'
import { deleteQuestion } from '../../../api/modules/question.ts'

const { Title } = Typography
const { confirm } = Modal

const Trash: React.FC = () => {
  useTitle('一刻 • 问卷 | 回收站')

  const {
    data = {},
    loading,
    refresh,
  } = useLoadQuestionListData({ isDeleted: true })
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
      },
    },
    {
      title: '答卷人数',
      dataIndex: 'answerCount',
      // key: "answerCount"
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      // key: 'createdAt',
    },
  ]
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  // 恢复删除
  const { run: restore } = useRequest(
    async () => {
      for await (const id of selectedIds) {
        await updateQuestion(id, { isDeleted: false })
      }
    },
    {
      manual: true,
      debounceWait: 500, // 防抖
      onSuccess: async () => {
        message.success('恢复成功')
        refresh() // 手动刷新列表
        setSelectedIds([])
      },
    }
  )

  const del = () => {
    confirm({
      title: '确认删除吗？',
      content: '删除后将无法恢复，请谨慎操作！',
      onOk: deleteQuestions,
      onCancel() {
        console.log('Cancel')
      },
    })
  }

  // 批量删除
  const { run: deleteQuestions } = useRequest(
    async () => {
      return await deleteQuestion(selectedIds)
    },
    {
      manual: true,
      onSuccess: async () => {
        message.success('删除成功')
        refresh()
        setSelectedIds([])
      },
    }
  )

  const TableElement = (
    <>
      <Space className="mb-5">
        <Button
          type="primary"
          onClick={restore}
          disabled={selectedIds.length === 0}
          className="!rounded-lg"
        >
          恢复选中
        </Button>
        <Button 
          disabled={selectedIds.length === 0} 
          danger 
          onClick={del}
          className="!rounded-lg"
        >
          彻底删除
        </Button>
        {selectedIds.length > 0 && (
          <span className="text-sm text-gray-500 ml-2">
            已选择 <span className="font-medium text-blue-600">{selectedIds.length}</span> 项
          </span>
        )}
      </Space>
      <Table
        dataSource={list}
        columns={tableColumns}
        pagination={false}
        rowKey={(q: any) => q._id}
        rowSelection={{
          type: 'checkbox',
          onChange: (selectedRowKeys) => {
            setSelectedIds(selectedRowKeys as string[])
          },
        }}
        className="rounded-lg overflow-hidden border border-gray-200"
      />
    </>
  )

  return (
    <div className="bg-white rounded-lg shadow-sm min-h-full">
      <div className="flex justify-between items-center p-6 border-b border-gray-200">
        <div>
          <Title level={3} className="!mb-0">回收站</Title>
          <p className="text-gray-500 text-sm mt-1">已删除的问卷，可恢复或彻底删除</p>
        </div>
        <div>
          {/*搜索框*/}
          <ListSearch />
        </div>
      </div>
      <div className="p-6 min-h-[400px]">
        {loading && (
          <div className="flex justify-center py-20">
            <Spin />
          </div>
        )}
        {!loading && list.length === 0 && (
          <div className="py-20">
            <Empty description="回收站为空" />
          </div>
        )}
        {list.length > 0 && TableElement}
      </div>
      <div className="flex justify-center pb-6">
        <ListPage total={total} />
      </div>
    </div>
  )
}

export default Trash
