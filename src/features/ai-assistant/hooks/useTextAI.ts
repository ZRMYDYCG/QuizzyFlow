/**
 * useTextAI Hook
 * 文本 AI 处理，并更新 Redux store
 */

import { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { message } from 'antd'
import { changeComponentProps, changeComponentTitle } from '@/store/modules/question-component'
import useGetComponentInfo from '@/hooks/useGetComponentInfo'
import { processTextWithAI, TextAIAction } from '../services/textAI'

export const useTextAI = () => {
  const dispatch = useDispatch()
  const { selectedComponent } = useGetComponentInfo()

  /**
   * 智能识别输入框对应的属性名
   */
  const detectPropName = useCallback(
    (inputElement: HTMLInputElement | HTMLTextAreaElement): string | null => {
      // 方法 1：从 data-prop-name 或 name 属性获取
      const explicitPropName =
        inputElement.getAttribute('data-prop-name') ||
        inputElement.getAttribute('name') ||
        inputElement.id

      if (explicitPropName) {
        return explicitPropName
      }

      // 方法 2：通过输入框的当前值推断
      const currentValue = inputElement.value

      // 检查 title
      if (
        selectedComponent?.title === currentValue ||
        selectedComponent?.text === currentValue
      ) {
        return 'title'
      }

      // 检查 props 中的各个属性
      if (selectedComponent?.props) {
        for (const [key, value] of Object.entries(selectedComponent.props)) {
          if (value === currentValue) {
            return key
          }
        }
      }

      // 方法 3：通过 label 推断
      const label = inputElement.closest('.ant-form-item')?.querySelector('label')?.textContent

      const labelMap: Record<string, string> = {
        标题: 'title',
        占位符: 'placeholder',
        Placeholder: 'placeholder',
        描述: 'desc',
        说明: 'desc',
      }

      if (label && labelMap[label]) {
        return labelMap[label]
      }

      console.warn('⚠️ 无法识别属性名，将使用通用更新')
      return null
    },
    [selectedComponent]
  )

  /**
   * 处理文本 AI 并更新组件属性
   */
  const processAndUpdate = useCallback(
    async (
      action: TextAIAction,
      selectedText: string,
      inputElement: HTMLInputElement | HTMLTextAreaElement
    ): Promise<string | null> => {
      if (!selectedComponent) {
        message.warning('请先选中一个组件')
        return null
      }

      try {
        console.log('📡 准备调用 AI API:', {
          action,
          selectedText,
        })

        // 调用 AI 处理文本
        const result = await processTextWithAI(action, selectedText)

        console.log('📡 AI API 返回:', result)

        if (!result || !result.trim()) {
          message.error('AI 返回为空')
          return null
        }

        const newText = result.trim()
        const currentValue = inputElement.value

        // 智能识别属性名
        const propName = detectPropName(inputElement)

        console.log('🔧 更新组件属性:', {
          componentId: selectedComponent.fe_id,
          componentType: selectedComponent.type,
          propName,
          oldValue: selectedText,
          newValue: newText,
          fullNewValue: currentValue.substring(0, inputElement.selectionStart || 0) + newText + currentValue.substring(inputElement.selectionEnd || 0),
        })

        // 计算完整的新值（替换选中部分）
        const start = inputElement.selectionStart || 0
        const end = inputElement.selectionEnd || 0
        const fullNewValue = currentValue.substring(0, start) + newText + currentValue.substring(end)

        // 更新 Redux store
        if (propName === 'title') {
          // title 字段（顶层属性）
          dispatch(
            changeComponentTitle({
              fe_id: selectedComponent.fe_id,
              title: fullNewValue,
            })
          )
        } else if (propName === 'text') {
          // text 字段（如 question-title, question-paragraph）
          dispatch(
            changeComponentProps({
              fe_id: selectedComponent.fe_id,
              props: {
                ...selectedComponent.props,
                text: fullNewValue,
              } as any,
            })
          )
        } else if (propName) {
          // props 中的属性
          dispatch(
            changeComponentProps({
              fe_id: selectedComponent.fe_id,
              props: {
                ...selectedComponent.props,
                [propName]: fullNewValue,
              } as any,
            })
          )
        }

        return newText
      } catch (error) {
        console.error('AI 处理失败:', error)
        message.error('AI 处理失败，请重试')
        return null
      }
    },
    [selectedComponent, dispatch, detectPropName]
  )

  return {
    processAndUpdate,
    selectedComponent,
  }
}

