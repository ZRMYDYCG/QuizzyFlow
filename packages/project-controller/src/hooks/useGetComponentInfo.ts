import { useSelector } from "react-redux"
import { stateType } from "../store" 

function useGetComponentInfo() {
    const components = useSelector<stateType>(state => state.questionComponent) as any

    console.log("useGetComponentInfoHooks测试",components)
    const { componentList = [] } = components

    return {
        componentList
    }
}

export default useGetComponentInfo