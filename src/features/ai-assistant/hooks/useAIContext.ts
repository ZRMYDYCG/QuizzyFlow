/**
 * useAIContext Hook
 * 获取和构建 AI 上下文信息
 */

import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import type { stateType } from '@/store'
import { AIContext } from '../types'
import { COMPONENT_LIBRARY } from '../utils/templateSchema'

interface UseAIContextOptions {
  questionId?: string
}

export const useAIContext = (options: UseAIContextOptions = {}): AIContext => {
  const { questionId } = options

  // 从 Redux 获取问卷数据
  const componentList = useSelector((state: stateType) => state.questionComponent.present.componentList)
  const selectedId = useSelector((state: stateType) => state.questionComponent.present.selectedId)
  const pageInfo = useSelector((state: stateType) => state.pageInfo)

  // 构建 AI 上下文
  const context = useMemo<AIContext>(() => {
    return {
      questionId: questionId,
      questionTitle: pageInfo.title,
      questionDesc: pageInfo.desc,
      currentComponents: componentList.map((comp: any) => ({
        fe_id: comp.fe_id,
        type: comp.type,
        title: comp.title || comp.text || '',
        props: comp.props || {},
      })),
      componentLibrary: COMPONENT_LIBRARY,
      selectedComponentId: selectedId,
    }
  }, [questionId, pageInfo, componentList, selectedId])

  return context
}

