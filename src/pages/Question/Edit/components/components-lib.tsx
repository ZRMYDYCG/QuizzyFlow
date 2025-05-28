import React from 'react'
import { Typography } from 'antd'
import { nanoid } from 'nanoid'
import { componentConfigGroup } from '../../components/index'
import { ComponentConfigType } from '../../components/index'
import { cn } from '../../../../utils/index'
import { addComponent } from '../../../../store/modules/question-component'
import { useDispatch } from 'react-redux'
import ClassifyTitle from './classify-title'

function generateComponent(c: ComponentConfigType) {
  const { title, type, component: Component, defaultProps } = c
  const dispatch = useDispatch()

  function handleClick() {
    dispatch(
      addComponent({
        fe_id: nanoid(),
        title: title,
        type: type,
        props: defaultProps,
      } as any)
    )
  }

  return (
    <div
      onClick={handleClick}
      className={cn(
        'mb-[12px] cursor-pointer bg-[#fff] border-[1px] border-[#e5e5e5] border-dotted hover:border-blue-500 rounded-[4px] p-[12px]'
      )}
    >
      <div className="pointer-events-none">
        <Component />
      </div>
    </div>
  )
}

const ComponentsLib: React.FC = () => {
  return (
    <div>
      {componentConfigGroup.map((group, index) => {
        const { groupName, components } = group
        return (
          <div key={index} className={cn(index > 0 && 'mt-[20px]')}>
            <ClassifyTitle groupName={groupName} />
            {/*TODO: 处理类型问题*/}
            {components.map(generateComponent as any)}
          </div>
        )
      })}
    </div>
  )
}

export default ComponentsLib
