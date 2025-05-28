import React from 'react'

const ClassifyTitle: React.FC<{ groupName: string }> = ({ groupName }) => {
  return (
    <div className="flex items-center mb-2">
      <span className="w-1 h-5 bg-blue-500 mr-2" />
      {groupName}
    </div>
  )
}

export default ClassifyTitle
