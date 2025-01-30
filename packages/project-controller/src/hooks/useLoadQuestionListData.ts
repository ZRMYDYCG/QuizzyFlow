import {useRequest} from 'ahooks'
import {getQuestionList} from "../api/modules/question.ts"
import {useSearchParams} from "react-router-dom"

interface Options {
    keyword: string
    isStar: boolean
    isDeleted: boolean
}

function useLoadQuestionListData(options: Partial<Options> = {}) {
    const { isStar = false, isDeleted = false } = options
    const [searchParams] = useSearchParams()

    const {data, loading, error} = useRequest(
        async () => {
        const  keyword = searchParams.get('keyword')  || ''
        return await getQuestionList({keyword, isStar, isDeleted})
    }, {refreshDeps: [searchParams]})

    return {data, loading, error}
}

export default useLoadQuestionListData
