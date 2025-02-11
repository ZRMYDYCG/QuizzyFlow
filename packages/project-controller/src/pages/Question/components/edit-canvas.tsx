import React from "react"
import { Spin } from "antd"
import QuestionTitle from "./question-title/index.tsx"
import QuestionInput from "./question-input/index.tsx"

interface IPopsEditCanvas {
    loading: boolean
}

const EditCanvas: React.FC<IPopsEditCanvas> = ({ loading }) => {
    if (loading) {
        return <Spin size="large" style={{textAlign: "center", width: "100%", marginTop: "20px"}}/>
    }

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