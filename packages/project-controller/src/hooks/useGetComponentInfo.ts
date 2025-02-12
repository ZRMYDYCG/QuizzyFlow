import { useSelector } from "react-redux"
import { stateType } from "../store" 
import { QuestionComponentStateType } from "../store/modules/question-component"

function useGetComponentInfo() {
    const components = useSelector<stateType>(state => state.questionComponent) as QuestionComponentStateType

    const { componentList = [] } = components

    return componentList
}

export default useGetComponentInfo