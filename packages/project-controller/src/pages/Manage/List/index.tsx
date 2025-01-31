import QuestionsCard from "./components/QuestionsCard.tsx"
import { useTitle, useDebounceFn } from "ahooks"
import {Spin, Typography} from "antd";
import ListSearch from "../../../components/list-search.tsx"
import {useEffect, useState} from "react"
import { useSearchParams } from "react-router-dom"

const { Title } = Typography

const List = () => {
    useTitle("一刻 • 问卷 | 问卷列表")
    const [searchParams] = useSearchParams()

    const [list, setList] = useState([]) // 全部的列表数据
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState(1)
    const [total, setTotal] = useState(0)
    const haveMoreData = total > list.length

    const {run: tryLoadMore} = useDebounceFn(() => {
        console.log("tryLoadMore")
    }, { wait: 500 })

    // 页面加载或searchParams变化时, 获取问卷列表数据
    useEffect(() => {
        tryLoadMore()
    }, []);

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
                <div style={{height: '2000px'}}></div>
                {loading && <div className="flex justify-center">
                    <Spin />
                </div>}
                {(!loading && list.length > 0) &&
                    list.map((question: any) => {
                        const { _id } = question
                        return (
                            <QuestionsCard key={_id} {...question} />
                        )
                    })}
            </div>
            {/*问卷列表底部*/}
            <div className="text-center">
            </div>
        </>
    )
}

export default List
