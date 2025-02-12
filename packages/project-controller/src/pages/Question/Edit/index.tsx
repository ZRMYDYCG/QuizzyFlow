import React from'react'
import EditCanvas from "../components/edit-canvas.tsx";
import useLoadQuestionData from "../../../hooks/useLoadQuestionData.ts"
import { useDispatch } from "react-redux"
import { changeSelectedId } from "../../../store/modules/question-component.ts"


const EditQuestionPage: React.FC = () => {
 const dispatch = useDispatch()
  const { loading } = useLoadQuestionData()

  const removeSelectedId = () => {
    dispatch(changeSelectedId(''))
  }

  return (
      <div className="flex flex-col h-screen bg-[#f0f2f5]">
          <div className="h-[50px] bg-white">Header</div>
          <div className="flex-auto py-5">
              <div className="flex mx-[24px] h-full">
                  <div className="w-[285px] bg-white px-[12px]">Left</div>
                  <div className="flex-1 flex justify-center items-center" onClick={removeSelectedId}>
                      <div className="w-[400px] h-[712px] bg-white overflow-auto shadow-md">
                          <div className="h-[800px]">
                              <EditCanvas loading={loading} />
                          </div>
                      </div>
                  </div>
                  <div className="w-[300px] bg-white px-[12px]">Right</div>
              </div>
          </div>
      </div>
  )
}

export default EditQuestionPage
