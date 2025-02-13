import { useSelector } from 'react-redux'
import { stateType } from '../store'

function useGetComponentInfo() {
  const components = useSelector<stateType>(
    (state) => state.questionComponent
  ) as any

  const { componentList = [], selectedId } = components

  return {
    componentList,
    selectedId,
  }
}

export default useGetComponentInfo
