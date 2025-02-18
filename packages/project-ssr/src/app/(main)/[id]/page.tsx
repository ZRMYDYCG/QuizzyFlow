'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import QuestionInput from '@/components/question-input'
import QuestionRadio from '@/components/question-radio'
import { getQuestionById } from '@/api/index'

const MainPage = (props: any) => {
  const router = useRouter()
  const { id } = useParams()
  const [formState, setFormState] = useState({
    questionId: id,
    name: '',
    favoriteColor: '',
  })

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const formData = new FormData(e.currentTarget)

    console.log('Form submitted successfully', formData)

    // 提交表单数据到后端
    await fetch('/api/answer', {
      method: 'POST',
      body: formData,
    })

    // 跳转到 /finale 页面
    router.push('/finale')
  }

  useEffect(() => {
    getQuestionById(props.id).then((res) => {})
  }, [])

  return (
    <form onSubmit={handleFormSubmit}>
      <input
        type="hidden"
        name="questionId"
        value={props.id}
        className="w-full border border-gray-300 rounded-md px-3 py-2"
      />
      <div className="border-b border-gray-300 py-1">
        <QuestionInput
          fe_id={'12345'}
          props={{ title: 'What is your name?' }}
        />
      </div>
      <div className="border-b border-gray-300 py-1">
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
        />
      </div>
      <div className="flex justify-center mt-4">
        <button className="bg-blue-500 text-white border border-transparent rounded-md px-5 py-1">
          提交
        </button>
      </div>
    </form>
  )
}

export default MainPage
