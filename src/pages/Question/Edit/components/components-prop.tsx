import React from 'react'
import { useDispatch } from 'react-redux'
import { changeComponentProps } from '@/store/modules/question-component'
import useGetComponentInfo from '@/hooks/useGetComponentInfo'
import { Empty } from 'antd'
import {
  getComponentConfigByType,
  ComponentPropsType,
} from '@/components/material'

const NoSelectedComponent: React.FC = () => {
  return <Empty description="还没有选中组件" />
}

const ComponentProp: React.FC = () => {
  const dispatch = useDispatch()
  const { selectedComponent, selectedId } = useGetComponentInfo()

  if (selectedId === '') return <NoSelectedComponent />

  try {
    const { props, type, isLocked } = selectedComponent || ({} as any)
    const ComponentConfig = getComponentConfigByType(type)

    if (ComponentConfig === null) return <NoSelectedComponent />

    function changeProps(newProps: ComponentPropsType) {
      if (selectedComponent === null) return
      const { fe_id } = selectedComponent
      dispatch(changeComponentProps({ fe_id, props: newProps }))
    }

    const { PropComponent } = ComponentConfig

    return (
      <PropComponent {...props} onChange={changeProps} disabled={isLocked} />
    )
  } catch (error) {
    console.error(error)
  }
}

export default ComponentProp
