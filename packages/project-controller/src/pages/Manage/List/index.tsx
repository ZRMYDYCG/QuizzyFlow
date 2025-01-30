import QuestionsCard from "./components/QuestionsCard.tsx"
import { useTitle } from "ahooks"
import {Spin, Typography} from "antd";
import ListSearch from "../../../components/list-search.tsx"
import useLoadQuestionListData from "../../../hooks/useLoadQuestionListData"


const { Title } = Typography

const List = () => {
    useTitle("一刻 • 问卷 | 问卷列表")

    const { data = {}, loading } = useLoadQuestionListData()
    const { list = [] } = data

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
