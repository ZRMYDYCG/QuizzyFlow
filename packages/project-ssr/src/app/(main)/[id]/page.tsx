import React from 'react'
import QuestionInput from '@/components/question-input'
import QuestionRadio from '@/components/question-radio'

const MainPage = () => {
  return (
    <div>
      <QuestionInput
        fe_id={'12345'}
        props={{ title: 'What is your name?' }}
      ></QuestionInput>
      <QuestionRadio
        props={{
          title: 'What is your favorite color?',
          options: [
            { text: 'Red', value: 'red' },
            { text: 'Green', value: 'green' },
            { text: 'Blue', value: 'blue' },
          ],
          value: 'blue',
          isVertical: false,
        }}
        fe_id={'12345'}
      ></QuestionRadio>
    </div>
  )
}

export default MainPage
