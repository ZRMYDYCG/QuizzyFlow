import React from "react"
import QuestionTitle from "./question-title/index.tsx"
import QuestionInput from "./question-input/index.tsx"

const EditCanvas: React.FC = () => {
    return (
        <div>
            <div className="m-[12px] border p-[12px] rounded-[8px] bg-white border-white hover:border-blue-500 cursor-pointer">
                <div className="pointer-events-none">
                    <QuestionTitle />
                </div>
            </div>
            <div className="m-[12px] border p-[12px] rounded-[8px] bg-white border-white hover:border-blue-500 cursor-pointer">
                <div className="pointer-events-none">
                    <QuestionInput />
                </div>
            </div>
        </div>
    )
}

export default EditCanvas