import React from 'react'
import { Spin, Result, Button } from 'antd'
import useLoadQuestionData from '../../../hooks/useLoadQuestionData.ts'
import useGetPageInfo from '../../../hooks/useGetPageInfo.ts'
import { useNavigate } from 'react-router-dom'
import { useTitle } from 'ahooks'

const Statistics: React.FC = () => {
  const { loading } = useLoadQuestionData()
  const { isPublished } = useGetPageInfo()
  const navigate = useNavigate()
  useTitle('一刻 • 问卷 | 问卷统计')

  if (isPublished) {
    return (
      <div className="h-full w-full flex justify-center items-center -mt-[100px]">
        <Result
          status="warning"
          title="该问卷尚未发布"
          subTitle="请等待管理员审核通过后再查看统计信息"
          extra={
            <Button type="primary" onClick={() => navigate(-1)}>
              返回上一页
            </Button>
          }
        ></Result>
      </div>
    )
  }
  return <div></div>
}

export default Statistics
