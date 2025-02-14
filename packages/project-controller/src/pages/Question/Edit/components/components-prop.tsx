import React from 'react'
import { useDispatch } from "react-redux"
import { changeComponentProps } from "../../../../store/modules/question-component"
import useGetComponentInfo from "../../../../hooks/useGetComponentInfo"
import { Empty } from 'antd'
import { getComponentConfigByType, ComponentPropsType } from "../../../Question/components/index"

const NoSelectedComponent: React.FC = () => {
  return (
    <Empty description="请选择组件" />
  )
}

const ComponentProp: React.FC = () => {
  const dispatch = useDispatch()
  const { selectedComponent } = useGetComponentInfo()

  console.log(selectedComponent)

  if(selectedComponent === null) return <NoSelectedComponent />

  try {
    const { props, type } = selectedComponent as any
    const ComponentConfig = getComponentConfigByType(type)

    if(ComponentConfig === null) return <NoSelectedComponent />
  
    function changeProps(newProps: ComponentPropsType) {
      if(selectedComponent === null) return
      const { fe_id } = selectedComponent
      dispatch(changeComponentProps({ fe_id, props: newProps }))
    }
  
    const { PropComponent } = ComponentConfig
   
    return (
      <PropComponent {...props} onChange={changeProps} />
    )
  } catch(error) {
    console.error(error)
  }
}

export default ComponentProp
