import React from 'react'
import useGetComponentInfo from "../../../../hooks/useGetComponentInfo"
import { Empty } from 'antd'
import { getComponentConfigByType } from "../../../Question/components/index"

const NoSelectedComponent: React.FC = () => {
  return (
    <Empty description="请选择组件" />
  )
}

const ComponentProp: React.FC = () => {
  const { selectdComponent } = useGetComponentInfo()
  if(selectdComponent === null) return <NoSelectedComponent />

  const { type, props } = selectdComponent
  const ComponentConfig = getComponentConfigByType(type)

  if(ComponentConfig === null) return <NoSelectedComponent />

  const { PropComponent } = ComponentConfig
 
  return (
    <PropComponent {...props} />
  )
}

export default ComponentProp
