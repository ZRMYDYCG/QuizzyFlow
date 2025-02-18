import React from 'react'

interface PropsType {
  fe_id: string
  props: {
    title: string
    placeholder?: string
  }
}

const QuestionInput: React.FC<PropsType> = ({ fe_id, props }) => {
  const { title, placeholder = '' } = props
  return (
    <>
      <p>{title}</p>
      <div className="mb-[16px] px-[5px]">
        <input
          name={fe_id}
          placeholder={placeholder}
          className="w-full border border-gray-300 rounded-md px-3 py-2"
        />
      </div>
    </>
  )
}

export default QuestionInput
