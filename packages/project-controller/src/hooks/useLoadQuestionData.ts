import {useParams} from "react-router-dom"
import {getQuestion} from "../api/modules/question.ts"
import { useRequest } from "ahooks"
import {useEffect} from "react"
import { useDispatch } from "react-redux"
import { resetComponents } from "../store/modules/question-component.ts"

const useLoadQuestionData = () => {
    const { id = '' } = useParams()
    const dispatch = useDispatch()

    const { data, loading, error, run } = useRequest(async (id: string) => {
        if(!id) throw new Error(`Invalid question id ${error}`)
        return await getQuestion(id)
    }, {
        manual: true,
    })

    // 根据获取的 data 设置 store
    useEffect(() => {
        if(!data) return
        const { title = '', componentList = [] } = data

        console.log(title, componentList)

        dispatch(resetComponents({ componentList, selectedId: "" }))
    }, [data])

    // 判断 id 变化
    useEffect(() => {
        run(id)
    }, [id])

    return {
        loading,
        error,
    }
}

export default useLoadQuestionData
