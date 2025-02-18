import React from 'react'
import QuestionInput from '@/components/question-input'

const MainPage = () => {
  return (
    <div>
      <QuestionInput
        fe_id={'12345'}
        props={{ title: 'What is your name?' }}
      ></QuestionInput>
    </div>
  )
}

export default MainPage
