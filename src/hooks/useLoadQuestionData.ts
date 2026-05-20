import { useParams } from 'react-router-dom'
import { getQuestion } from '../api/modules/question.ts'
import { useRequest } from 'ahooks'
import { useEffect, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { message } from 'antd'
import { isComponentTypeSupported } from '@/components/material'
import { resetComponents } from '../store/modules/question-component.ts'
import { resetPageInfo } from '../store/modules/pageinfo-reducer.ts'

export const useLoadQuestionData = () => {
  const { id = '' } = useParams()
  const dispatch = useDispatch()
  const warnedRemovedRef = useRef(false)

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
      linkages = [],
      paginationEnabled = false,
      itemsPerPage = 5,
      type,
      padding,
      layout,
      maxWidth,
      bgImage,
      bgRepeat,
      bgPosition,
      parallaxEffect,
      borderRadius,
    } = data

    const validComponentList = componentList.filter((item) =>
      isComponentTypeSupported(item.type)
    )
    const removedCount = componentList.length - validComponentList.length

    if (removedCount > 0 && !warnedRemovedRef.current) {
      warnedRemovedRef.current = true
      message.warning(
        `已忽略 ${removedCount} 个已下线组件，请删除画布中的占位项后保存问卷`
      )
    }

    let selectedId = ''
    if (validComponentList.length > 0) {
      selectedId = validComponentList[0].fe_id
    }

    dispatch(
      resetComponents({
        componentList: validComponentList,
        selectedId,
        copiedComponent: null,
      })
    )
    // pageInfo存储，包含作者信息
    dispatch(
      resetPageInfo({
        title,
        desc,
        css,
        js,
        isPublished,
        author,
        linkages: Array.isArray(linkages) ? linkages : [],
        type,
        padding,
        layout,
        maxWidth,
        bgImage,
        bgRepeat,
        bgPosition,
        parallaxEffect,
        borderRadius,
        paginationEnabled: Boolean(paginationEnabled),
        itemsPerPage: Number(itemsPerPage) || 5,
      })
    )
  }, [data])

  useEffect(() => {
    warnedRemovedRef.current = false
    run(id)
  }, [id])

  return {
    loading,
    error,
    loaded: !!data && !loading,
  }
}

export default useLoadQuestionData
