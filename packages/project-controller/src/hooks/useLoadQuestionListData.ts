import {useRequest} from 'ahooks'
import {getQuestionList} from "../api/modules/question.ts"
import {useSearchParams} from "react-router-dom"

function useLoadQuestionListData() {
    const [searchParams] = useSearchParams()

    const {data, loading, error} = useRequest(
        async () => {
        const  keyword = searchParams.get('keyword')  || ''
        return await getQuestionList({keyword})
    }, {refreshDeps: [searchParams]})

    return {data, loading, error}
}

export default useLoadQuestionListData
