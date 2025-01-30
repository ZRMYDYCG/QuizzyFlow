import {useEffect, useState} from "react"
import { useParams } from "react-router-dom"
import { getQuestion } from "../api/modules/question.ts"

const useLoadQuestionData = () => {
    const { id = '' } = useParams()
    const [loading, setLoading] = useState(true)
    const [questionData, setQuestionData] = useState({})

    useEffect(() => {
        async function getQuestionData() {
            const question = await getQuestion(id)
            setQuestionData(question)
            setLoading(false)
        }
        getQuestionData()
    }, [id])

    return { loading, questionData, id }
}

export default useLoadQuestionData