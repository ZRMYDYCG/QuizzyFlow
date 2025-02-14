import { useSelector } from 'react-redux'
import { stateType } from '../store'

function useGetComponentInfo() {
  const components = useSelector<stateType>(
    (state) => state.questionComponent
  ) as any

  const { componentList = [], selectedId } = components

  const selectedComponent: any = componentList.find((c: any) => c.fe_id === selectedId)

  return {
    componentList,
    selectedId,
    selectedComponent
  }
}

export default useGetComponentInfo
