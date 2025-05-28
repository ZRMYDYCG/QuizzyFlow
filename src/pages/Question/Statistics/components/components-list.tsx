import React, { ComponentType, useState } from 'react'
import { getComponentConfigByType } from '../../../../components/lib'
import useGetComponentInfo from '../../../../hooks/useGetComponentInfo.ts'
import { cn } from '../../../../utils'

interface PropsType {
  selectedComponentId: string
  setSelectedComponentId: (id: string) => void
  setSelectedComponentType: (type: string) => void
}

const ComponentsList: React.FC<PropsType> = (props: PropsType) => {
  const {
    selectedComponentId,
    setSelectedComponentId,
    setSelectedComponentType,
  } = props
  const { componentList } = useGetComponentInfo()

  return (
    <div className="min-h-full overflow-y-auto bg-white p-[12px]">
      {componentList
        .filter((component: any) => !component.isHidden)
        .map((component: any) => {
          const { fe_id, props, type } = component

          const componentConfig = getComponentConfigByType(type)
          if (componentConfig === null) return null

          const { component: Component } = componentConfig

          return (
            <div
              key={fe_id}
              onClick={() => {
                setSelectedComponentId(fe_id)
                setSelectedComponentType(type)
              }}
              className={cn(
                'w-full p-[12px] cursor-pointer border border-white rounded-md',
                {
                  'border-blue-300': fe_id === selectedComponentId,
                }
              )}
            >
              <div className="pointer-events-none">
                <Component {...props} />
              </div>
            </div>
          )
        })}
    </div>
  )
}

export default ComponentsList
