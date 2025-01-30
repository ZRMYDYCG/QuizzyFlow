import React from'react'
import { useEffect } from "react"
import { getQuestion } from "../../../api/modules/question.ts"

const EditQuestionPage: React.FC = () => {
  useEffect(() => {
    async function getQuestionData() {
      const question = await getQuestion('1')
      console.log(question)
    }
    getQuestionData()
  }, [])

  return <div>Edit Question Page</div>
}

export default EditQuestionPage
