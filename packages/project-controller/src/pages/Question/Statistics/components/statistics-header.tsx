import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Space, Button } from 'antd'
import { LeftOutlined } from '@ant-design/icons'
import useGetPageInfo from '../../../../hooks/useGetPageInfo.ts'

const StatisticsHeader: React.FC = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const { title } = useGetPageInfo()

  return (
    <div className="bg-white border-b border-gray-200 py-[12px]">
      <div className="flex mx-[24px]">
        <div className="flex-1">
          <Space>
            <Button
              type="link"
              onClick={() => navigate(-1)}
              icon={<LeftOutlined />}
            >
              返回
            </Button>
            <h2 className="text-xl font-bold">标题都发到算法</h2>
          </Space>
        </div>
        <div className="flex-1 text-center">中间</div>
        <div className="flex-1 text-right">
          <Button
            type="primary"
            onClick={() => navigate(`/question/edit/${id}`)}
          >
            编辑
          </Button>
        </div>
      </div>
    </div>
  )
}

export default StatisticsHeader
