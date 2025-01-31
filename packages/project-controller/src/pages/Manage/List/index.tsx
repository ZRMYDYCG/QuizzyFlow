import QuestionsCard from "./components/QuestionsCard.tsx"
import {useDebounceFn, useRequest, useTitle} from "ahooks"
import {getQuestionList} from "../../../api/modules/question.ts"
import {Empty, Spin, Typography} from "antd";
import ListSearch from "../../../components/list-search.tsx"
import {useEffect, useRef, useState} from "react"
import {useSearchParams} from "react-router-dom"

const { Title } = Typography

const List = () => {
    useTitle("一刻 • 问卷 | 问卷列表")
    const [searchParams] = useSearchParams()

    const [list, setList] = useState([]) // 全部的列表数据
    const [page, setPage] = useState(1)
    const [total, setTotal] = useState(0)
    const haveMoreData = total > list.length

    const containerRef = useRef<HTMLDivElement>(null)

    // 真正加载
    const {run: load, loading } = useRequest(async () => {
        return await getQuestionList({page, pageSize: 10, keyword: searchParams.get('keyword') || ''})
    }, {
        manual: true,
        onSuccess(result) {
            const { list: newList = [], total = 0 } = result
            setList(list.concat(newList))
            setTotal(total)
            setPage(page + 1)
        }
    })

    // 尝试加载
    const {run: tryLoadMore} = useDebounceFn(() => {
        const container = containerRef.current
        if(container === null) return
        const domRect = container.getBoundingClientRect()
        if(domRect === null) return
        const { bottom } = domRect
        if(bottom <= document.documentElement.clientHeight) {
            load()
        }
    }, { wait: 500 })

    // 页面加载或searchParams变化时, 获取问卷列表数据
    useEffect(() => {
        tryLoadMore()
    }, [])

    // 页面滚动时, 尝试加载更多数据
    useEffect(() => {
        if(!haveMoreData) {
            window.addEventListener("scroll", tryLoadMore)
        }

        // 组件销毁及searchParams变化之前解绑事件
        return () => {
            window.removeEventListener("scroll", tryLoadMore)
        }
    }, [searchParams])

    const LoadingMoreContentElement = () => {
        if(loading) return <Spin />
        if(total === 0) return <Empty description="暂无数据" />
        if(!haveMoreData) return <>没有更多了</>
        return <>加载中...</>
    }

    return (
        <>
            {/*问卷列表头部*/}
            <div className="flex justify-between items-center">
                <div className="">
                    <Title level={3}>问卷列表</Title>
                </div>
                <div className="mb-5">
                    {/*搜索框*/}
                    <ListSearch />
                </div>
            </div>
            {/*问卷列表主体*/}
            <div>
                { list.length > 0 &&
                    list.map((question: any) => {
                        const { _id } = question
                        return (
                            <QuestionsCard key={_id} {...question} />
                        )
                    })}
            </div>
            {/*问卷列表底部*/}
            <div className="text-center">
                <div ref={containerRef}>
                    {LoadingMoreContentElement()}S
                </div>
            </div>
        </>
    )
}

export default List
