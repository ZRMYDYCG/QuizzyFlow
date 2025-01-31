import {useRequest} from 'ahooks'
import {getQuestionList} from "../api/modules/question.ts"
import {useSearchParams} from "react-router-dom"

interface Options {
    keyword: string
    isStar: boolean
    isDeleted: boolean
    page: number
    pageSize: number
}

function useLoadQuestionListData(options: Partial<Options> = {}) {
    const { isStar = false, isDeleted = false } = options
    const [searchParams] = useSearchParams()

    const {data, loading, error} = useRequest(
        async () => {
            console.log(searchParams)
        const  keyword = searchParams.get('keyword')  || ''
        const page = parseInt(searchParams.get('page')  || '')  || 1
        const pageSize = parseInt(searchParams.get('pageSize') || '') || 10

        console.log('page', page, 'pageSize', pageSize, 'keyword', keyword, 'isStar', isStar, 'isDeleted', isDeleted)

        return await getQuestionList({keyword, isStar, isDeleted, page, pageSize})
    }, {refreshDeps: [searchParams]})

    return {data, loading, error}
}

export default useLoadQuestionListData
