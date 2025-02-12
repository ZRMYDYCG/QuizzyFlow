import React from "react"
import { Spin } from "antd"
import useGetComponentInfo from "../../../hooks/useGetComponentInfo.ts"
import { QuestionComponentType } from "../../../store/modules/question-component.ts"
import { getComponentConfigByType } from "./index.ts"

interface IPopsEditCanvas {
    loading: boolean
}

function genComponent(componentInfo: QuestionComponentType) {
    const { type, props } = componentInfo
    const componentConfig  = getComponentConfigByType(type)
    if(componentConfig === null) return null

    const { component: Component } = componentConfig

    return <>
        <Component {...props} />
    </>
}

const EditCanvas: React.FC<IPopsEditCanvas> = ({ loading }) => {
    if (loading) {
        return <Spin style={{textAlign: "center", width: "100%", marginTop: "20px"}}/>
    }

    const { componentList } = useGetComponentInfo()


    return (
        <div>
            {componentList.map((item: QuestionComponentType) => {
                const { fe_id } = item 
                return <div key={fe_id} className="m-[12px] border p-[12px] rounded-[8px] bg-white border-white hover:border-blue-500 cursor-pointer">
                    <div className="pointer-events-none">
                        {genComponent(item)}
                    </div>
                </div>
            })}
        </div>
    )
}

export default EditCanvas