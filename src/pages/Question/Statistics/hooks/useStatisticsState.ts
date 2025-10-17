import { useState, useCallback } from 'react'

interface UseStatisticsStateReturn {
  selectedComponentId: string
  selectedComponentType: string
  setSelectedComponent: (id: string, type: string) => void
  resetSelectedComponent: () => void
}

/**
 * managing statistics component selection state
 */
export const useStatisticsState = (): UseStatisticsStateReturn => {
  const [selectedComponentId, setSelectedComponentId] = useState('')
  const [selectedComponentType, setSelectedComponentType] = useState('')

  const setSelectedComponent = useCallback((id: string, type: string) => {
    setSelectedComponentId(id)
    setSelectedComponentType(type)
  }, [])

  const resetSelectedComponent = useCallback(() => {
    setSelectedComponentId('')
    setSelectedComponentType('')
  }, [])

  return {
    selectedComponentId,
    selectedComponentType,
    setSelectedComponent,
    resetSelectedComponent,
  }
}

