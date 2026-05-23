import React from 'react'
import { useDispatch } from 'react-redux'
import { changeComponentProps } from '@/store/modules/question-component'
import useGetComponentInfo from '@/hooks/useGetComponentInfo'
import { Empty, Form, Typography } from 'antd'
import {
  getComponentConfigByType,
  ComponentPropsType,
} from '@/components/material'

const NoSelectedComponent: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-full p-8">
      <Empty description="还没有选中组件" />
    </div>
  )
}

const ComponentProp: React.FC = () => {
  const dispatch = useDispatch()
  const { selectedComponent, selectedId } = useGetComponentInfo()

  if (selectedId === '') return <NoSelectedComponent />

  try {
    const { props, type, isLocked } = selectedComponent || ({} as any)
    const ComponentConfig = getComponentConfigByType(type)

    if (!ComponentConfig) {
      return (
        <div className="flex items-center justify-center h-full p-8">
          <Empty description="该组件类型已下线，请删除后重新添加表单组件" />
        </div>
      )
    }

    function changeProps(newProps: ComponentPropsType) {
      if (selectedComponent === null) return
      const { fe_id } = selectedComponent
      dispatch(changeComponentProps({ fe_id, props: newProps }))
    }

    const { PropComponent } = ComponentConfig
    const { fe_id } = selectedComponent

    return (
      <div className="h-full overflow-y-auto p-4 md:p-6">
        <Form layout="vertical" className="mb-2">
          <Form.Item label="物料 ID" className="mb-4">
            <Typography.Text copyable={{ text: fe_id }} className="font-mono text-xs break-all">
              {fe_id}
            </Typography.Text>
          </Form.Item>
        </Form>
        <PropComponent {...props} onChange={changeProps} disabled={isLocked} />
      </div>
    )
  } catch (error) {
    console.error(error)
  }
}

export default ComponentProp
