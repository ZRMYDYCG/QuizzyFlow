import { useSelector } from 'react-redux'
import { stateType } from '../store'

export function useGetComponentInfo() {
  const components = useSelector<stateType>(
    (state) => state.questionComponent.present
  ) as any

  const { componentList = [], selectedId, copiedComponent } = components

  const selectedComponent: any = componentList.find(
    (c: any) => c.fe_id === selectedId
  )

  return {
    componentList,
    selectedId,
    selectedComponent,
    copiedComponent,
  }
}

export default useGetComponentInfo
