import React from 'react'
import { Spin } from 'antd'
import { getComponentConfigByType } from './index.ts'
import { useDispatch } from 'react-redux'
import useGetComponentInfo from '../../../hooks/useGetComponentInfo.ts'
import { QuestionComponentType } from '../../../store/modules/question-component.ts'
import { changeSelectedId } from '../../../store/modules/question-component.ts'

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

  function handleClick(event: React.MouseEvent, id: string) {
    event.stopPropagation()
    dispatch(changeSelectedId(id))
  }

  if (loading) {
    return (
      <Spin style={{ textAlign: 'center', width: '100%', marginTop: '20px' }} />
    )
  }

  return (
    <div>
      {componentList.map((item: QuestionComponentType) => {
        const { fe_id, title } = item
        const isActive = fe_id === selectedId
        return (
          <div
            key={fe_id}
            onClick={(e) => handleClick(e, fe_id)}
            className={`m-[12px] border p-[12px] rounded-[8px] bg-white 
                    ${isActive ? 'border-blue-500' : 'border-white hover:border-blue-500'}
                    cursor-pointer`}
          >
            <div className="pointer-events-none">{genComponent(item)}</div>
          </div>
        )
      })}
    </div>
  )
}

export default EditCanvas
