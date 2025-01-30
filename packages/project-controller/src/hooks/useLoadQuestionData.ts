import {useParams} from "react-router-dom"
import {getQuestion} from "../api/modules/question.ts"
import { useRequest } from "ahooks"

const useLoadQuestionData = () => {
    const { id = '' } = useParams()

    const load = async () => {
        return await getQuestion(id)
    }
    const { loading, data, error } = useRequest(load)

    return { loading, data, error, id }
}

export default useLoadQuestionData