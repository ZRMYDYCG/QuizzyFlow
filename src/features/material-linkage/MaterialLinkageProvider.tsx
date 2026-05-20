import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'
import type { QuestionComponentType } from '@/store/modules/question-component'
import { computeLinkageRuntimeState } from './engine'
import type { LinkageRuntimeState, MaterialLinkageRule } from './types'

interface MaterialLinkageContextValue {
  runtime: LinkageRuntimeState
  values: Record<string, unknown>
  isAnswerMode: boolean
  emitChange: (componentId: string, value: unknown) => void
  isComponentVisible: (feId: string, baseHidden?: boolean) => boolean
  isComponentDisabled: (feId: string, baseDisabled?: boolean) => boolean
  shouldClearValue: (feId: string) => boolean
}

const MaterialLinkageContext = createContext<MaterialLinkageContextValue | null>(
  null
)

interface MaterialLinkageProviderProps {
  componentList: QuestionComponentType[]
  linkages: MaterialLinkageRule[]
  isAnswerMode?: boolean
  /** 受控模式：与问卷答题 state 同步 */
  values?: Record<string, unknown>
  onValuesChange?: (values: Record<string, unknown>) => void
  children: React.ReactNode
}

export const MaterialLinkageProvider: React.FC<MaterialLinkageProviderProps> = ({
  componentList,
  linkages,
  isAnswerMode = true,
  values: controlledValues,
  onValuesChange,
  children,
}) => {
  const [internalValues, setInternalValues] = useState<Record<string, unknown>>({})
  const values = controlledValues ?? internalValues

  const runtime = useMemo(
    () => computeLinkageRuntimeState(componentList, linkages, values),
    [componentList, linkages, values]
  )

  const emitChange = useCallback(
    (componentId: string, value: unknown) => {
      const next = { ...values, [componentId]: value }
      if (onValuesChange) {
        onValuesChange(next)
      } else {
        setInternalValues(next)
      }
    },
    [values, onValuesChange]
  )

  // 联动「清空值」动作：同步写入答题 state
  React.useEffect(() => {
    if (runtime.clearValueIds.size === 0) return
    let changed = false
    const next = { ...values }
    runtime.clearValueIds.forEach((id) => {
      const comp = componentList.find((c) => c.fe_id === id)
      const empty = comp?.type === 'question-checkbox' ? [] : undefined
      const current = next[id]
      const isSame =
        comp?.type === 'question-checkbox'
          ? Array.isArray(current) && current.length === 0
          : current === undefined || current === null || current === ''
      if (!isSame) {
        next[id] = empty
        changed = true
      }
    })
    if (changed) {
      if (onValuesChange) onValuesChange(next)
      else setInternalValues(next)
    }
  }, [
    Array.from(runtime.clearValueIds).sort().join('|'),
    componentList,
    values,
    onValuesChange,
  ])

  const isComponentVisible = useCallback(
    (feId: string, baseHidden?: boolean) => {
      if (feId in runtime.hiddenById) return !runtime.hiddenById[feId]
      return !baseHidden
    },
    [runtime.hiddenById]
  )

  const isComponentDisabled = useCallback(
    (feId: string, baseDisabled?: boolean) => {
      if (feId in runtime.disabledById) return runtime.disabledById[feId]
      return !!baseDisabled
    },
    [runtime.disabledById]
  )

  const shouldClearValue = useCallback(
    (feId: string) => runtime.clearValueIds.has(feId),
    [runtime.clearValueIds]
  )

  const contextValue = useMemo(
    () => ({
      runtime,
      values,
      isAnswerMode,
      emitChange,
      isComponentVisible,
      isComponentDisabled,
      shouldClearValue,
    }),
    [
      runtime,
      values,
      isAnswerMode,
      emitChange,
      isComponentVisible,
      isComponentDisabled,
      shouldClearValue,
    ]
  )

  return (
    <MaterialLinkageContext.Provider value={contextValue}>
      {children}
    </MaterialLinkageContext.Provider>
  )
}

export function useMaterialLinkage(): MaterialLinkageContextValue | null {
  return useContext(MaterialLinkageContext)
}
