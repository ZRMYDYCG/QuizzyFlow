import React from 'react'
import useLoadQuestionData from '../../../hooks/useLoadQuestionData.ts'

const Statistics: React.FC = () => {
  const { loading, data } = useLoadQuestionData()

  return (
    <div>
      {loading ? <div>Loading...</div> : <div>{JSON.stringify(data)}</div>}
    </div>
  )
}

export default Statistics
