/**
 * 文本 AI：调用接口并写回 Redux / 表单
 */

import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { message } from '@/utils/app-message'
import {
  changeComponentProps,
  changeComponentTitle,
} from '@/store/modules/question-component'
import { resetPageInfo } from '@/store/modules/pageinfo-reducer'
import useGetComponentInfo from '@/hooks/useGetComponentInfo'
import type { stateType } from '@/store'
import {
  processTextWithAI,
  TextAIAction,
  type TextAIApplyOptions,
} from '../services/textAI'
import {
  resolveFormField,
  applyTextToValue,
  type ResolvedField,
} from '../utils/detect-form-field'

export const useTextAI = () => {
  const dispatch = useDispatch()
  const { selectedComponent } = useGetComponentInfo()
  const pageInfo = useSelector((state: stateType) => state.pageInfo)

  const applyToPageField = useCallback(
    (field: string, fullValue: string) => {
      dispatch(resetPageInfo({ ...pageInfo, [field]: fullValue }))
    },
    [dispatch, pageInfo],
  )

  const applyToComponentField = useCallback(
    (field: ResolvedField, fullValue: string) => {
      if (!selectedComponent) return

      const { fe_id } = selectedComponent
      const props = { ...(selectedComponent.props as Record<string, unknown>) }

      if (field.field === 'options' && field.optionIndex != null && field.optionKey) {
        const options = [...((props.options as unknown[]) || [])] as Array<
          Record<string, unknown>
        >
        if (options[field.optionIndex]) {
          options[field.optionIndex] = {
            ...options[field.optionIndex],
            [field.optionKey]: fullValue,
          }
          props.options = options
        }
      } else if (field.field === 'list' && field.optionIndex != null) {
        const list = [...((props.list as unknown[]) || [])] as Array<Record<string, unknown>>
        if (list[field.optionIndex]) {
          list[field.optionIndex] = { ...list[field.optionIndex], text: fullValue }
          props.list = list
        }
      } else if (field.field === 'title') {
        props.title = fullValue
        dispatch(changeComponentTitle({ fe_id, title: fullValue }))
      } else {
        props[field.field] = fullValue
      }

      dispatch(changeComponentProps({ fe_id, props: props as never }))
    },
    [dispatch, selectedComponent],
  )

  const processAndUpdate = useCallback(
    async (
      action: TextAIAction,
      selectedText: string,
      inputElement: HTMLInputElement | HTMLTextAreaElement,
      options?: { isPartialSelection?: boolean } & TextAIApplyOptions,
    ): Promise<string | null> => {
      if (action === 'translate' && !options?.targetLanguage) {
        message.warning('请选择翻译目标语言')
        return null
      }
      const currentValue = inputElement.value
      if (!currentValue.trim() && !selectedText.trim()) {
        message.warning('请先输入内容')
        return null
      }

      const selStart = inputElement.selectionStart ?? 0
      const selEnd = inputElement.selectionEnd ?? 0
      const hasPartial =
        options?.isPartialSelection ??
        (selStart !== selEnd)

      let start: number
      let end: number
      let textForAI: string

      if (hasPartial) {
        start = selStart
        end = selEnd
        textForAI = currentValue.substring(start, end).trim()
        if (!textForAI) {
          message.warning('请先选中文字')
          return null
        }
      } else if (action === 'continue') {
        start = currentValue.length
        end = currentValue.length
        textForAI = currentValue.trim()
        if (!textForAI) {
          message.warning('请先输入内容')
          return null
        }
      } else {
        start = 0
        end = currentValue.length
        textForAI = currentValue.trim()
        if (!textForAI) {
          message.warning('请先输入内容')
          return null
        }
      }

      const resolved = resolveFormField(inputElement, {
        selectedComponent: selectedComponent ?? null,
        pageInfo,
      })

      if (!resolved) {
        message.warning('无法识别当前输入框对应的字段')
        return null
      }

      const contextParts: string[] = []
      if (resolved.scope === 'page') {
        contextParts.push('问卷页面设置')
      } else if (selectedComponent) {
        contextParts.push(`问卷组件类型：${selectedComponent.type}`)
      }

      try {
        const aiResult = await processTextWithAI(
          action,
          textForAI,
          contextParts.join('，'),
          options?.targetLanguage,
        )

        const fullNewValue = applyTextToValue(
          currentValue,
          start,
          end,
          aiResult,
          action,
        )

        if (resolved.scope === 'page') {
          applyToPageField(resolved.field, fullNewValue)
        } else {
          applyToComponentField(resolved, fullNewValue)
        }

        const newCursor = start + aiResult.length
        requestAnimationFrame(() => {
          inputElement.setSelectionRange(newCursor, newCursor)
          inputElement.focus()
        })

        return aiResult
      } catch (error) {
        console.error('AI 文本处理失败:', error)
        message.error(
          error instanceof Error ? error.message : 'AI 处理失败，请检查网络或 API 配置',
        )
        return null
      }
    },
    [
      selectedComponent,
      pageInfo,
      applyToPageField,
      applyToComponentField,
    ],
  )

  return {
    processAndUpdate,
    selectedComponent,
  }
}
