import QuestionsCard from "../../components/QuestionsCard"
import { useState } from "react";

const List = () => {
    const [questionList, setQuestionList] = useState([
        {}
    ])
    return (
        <>
            <div>
                <QuestionsCard/>
            </div>
        </>
    )
}

export default List