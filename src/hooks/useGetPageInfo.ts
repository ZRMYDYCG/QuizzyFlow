import { useSelector } from 'react-redux'
import { stateType } from '../store'
import { IPageInfo } from '../store/modules/pageinfo-reducer.ts'

function useGetPageInfo() {
  const pageInfo = useSelector<stateType>(
    (state) => state.pageInfo
  ) as IPageInfo
  return pageInfo
}

export default useGetPageInfo
