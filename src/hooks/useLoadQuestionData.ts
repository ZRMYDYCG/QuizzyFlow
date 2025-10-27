import { useParams } from 'react-router-dom'
import { getQuestion } from '../api/modules/question.ts'
import { useRequest } from 'ahooks'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { resetComponents } from '../store/modules/question-component.ts'
import { resetPageInfo } from '../store/modules/pageinfo-reducer.ts'

export const useLoadQuestionData = () => {
  const { id = '' } = useParams()
  const dispatch = useDispatch()

  const { data, loading, error, run } = useRequest(
    async (id: string) => {
      if (!id) throw new Error(`Invalid question id ${error}`)
      return await getQuestion(id)
    },
    {
      manual: true,
    }
  )

  // 根据获取的 data 设置 store
  useEffect(() => {
    if (!data) return
    const {
      title = '',
      componentList = [],
      desc = '',
      css = '',
      js = '',
      isPublished = false,
      author = '',
    } = data

    // 获取默认的 selectedId
    let selectedId = ''
    if (componentList.length > 0) {
      selectedId = componentList[0].fe_id
    }

    // 组件列表存储
    dispatch(
      resetComponents({
        componentList,
        selectedId: selectedId,
        copiedComponent: null,
      })
    )
    // pageInfo存储，包含作者信息
    dispatch(resetPageInfo({ title, desc, css, js, isPublished, author }))
  }, [data])

  // 判断 id 变化
  useEffect(() => {
    run(id)
  }, [id])

  return {
    loading,
    error,
  }
}

export default useLoadQuestionData
