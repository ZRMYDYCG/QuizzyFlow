import { FC } from 'react'
import { Table } from 'antd'
import {
  IQuestionTableProps,
  QuestionTableDefaultProps,
} from './interface.ts'

const QuestionTable: FC<IQuestionTableProps> = (
  props: IQuestionTableProps
) => {
  const {
    columns = [],
    dataSource = [],
    bordered = true,
    striped = false,
    showHeader = true,
    size = 'middle',
  } = {
    ...QuestionTableDefaultProps,
    ...props,
  }

  // 将列配置转换为 Ant Design Table 格式
  const tableColumns = columns.map((col, index) => ({
    title: col.title,
    dataIndex: col.dataIndex || `col_${index}`,
    key: col.dataIndex || `col_${index}`,
  }))

  // 确保数据有 key
  const tableData = dataSource.map((item, index) => ({
    ...item,
    key: item.key || index,
  }))

  return (
    <div style={{ width: '100%', overflow: 'auto' }}>
      <Table
        columns={tableColumns}
        dataSource={tableData}
        bordered={bordered}
        showHeader={showHeader}
        size={size}
        pagination={false}
        rowClassName={(_, index) => (striped && index % 2 === 1 ? 'table-striped-row' : '')}
        style={{ minWidth: 300, maxWidth: '100%' }}
        scroll={{ x: 'max-content' }}
      />
    </div>
  )
}

export default QuestionTable

