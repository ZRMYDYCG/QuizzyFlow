import React from 'react'
import { Spin } from 'antd'
import { getComponentConfigByType } from './index.ts'
import { useDispatch, useSelector } from 'react-redux'
import { swapComponent } from '../../../store/modules/question-component.ts'
import SortableContainer from '../../../components/DragSort/sort-container.tsx'
import SortableItem from '../../../components/DragSort/sort-item.tsx'
import useGetComponentInfo from '../../../hooks/useGetComponentInfo.ts'
import { QuestionComponentType } from '../../../store/modules/question-component.ts'
import { changeSelectedId } from '../../../store/modules/question-component.ts'
import { cn } from '../../../utils'
import useCanvasKeyPress from '../../../hooks/useCanvasKeyPress.ts'
import { IPageInfo } from '../../../store/modules/pageinfo-reducer.ts'

interface IPopsEditCanvas {
  loading: boolean
}

function genComponent(componentInfo: QuestionComponentType) {
  const { type, props } = componentInfo
  const componentConfig = getComponentConfigByType(type)

  if (componentConfig === null) return null

  const { component: Component } = componentConfig

  return (
    <>
      <Component {...props} />
    </>
  )
}

const EditCanvas: React.FC<IPopsEditCanvas> = ({ loading }) => {
  const dispatch = useDispatch()
  const { componentList = [], selectedId } = useGetComponentInfo()
  const pageInfo = useSelector(
    (state: { pageInfo: IPageInfo }) => state.pageInfo
  ) // 新增：获取全局配置

  useCanvasKeyPress()

  function handleClick(event: React.MouseEvent, id: string) {
    event.stopPropagation()
    dispatch(changeSelectedId(id))
  }

  const componentListWithId = componentList.map((component: any) => {
    return { ...component, id: component.fe_id }
  })

  function handleDragEnd(sourceIndex: number, targetIndex: number) {
    dispatch(swapComponent({ sourceIndex, targetIndex }))
  }

  if (loading) {
    return (
      <Spin style={{ textAlign: 'center', width: '100%', marginTop: '20px' }} />
    )
  }

  return (
    // 应用全局padding和主题色
    <div style={{ padding: pageInfo.padding }}>
      <SortableContainer items={componentListWithId} onDragEnd={handleDragEnd}>
        <div>
          {componentList
            .filter((item: any) => !item.isHidden)
            .map((item: QuestionComponentType) => {
              const { fe_id, isLocked } = item
              const isActive = fe_id === selectedId
              return (
                <SortableItem key={fe_id} id={fe_id}>
                  <div
                    onClick={(e) => handleClick(e, fe_id)}
                    className={cn(
                      'm-[12px] border p-[12px] rounded-[8px] bg-white',
                      isActive
                        ? `border border-[#ccc] border-2`
                        : 'border-white hover:border-blue-500',
                      'cursor-pointer',
                      isLocked ? 'opacity-50 cursor-not-allowed' : ''
                    )}
                  >
                    <div className="pointer-events-none">
                      {genComponent(item)}
                    </div>
                  </div>
                </SortableItem>
              )
            })}
        </div>
      </SortableContainer>
    </div>
  )
}

export default EditCanvas
