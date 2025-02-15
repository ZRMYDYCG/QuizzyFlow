import { FC } from 'react'
import { message } from 'antd'
import { useDispatch } from 'react-redux'
import { useState } from 'react'
import useGetComponentInfo from '../../../../hooks/useGetComponentInfo.ts'
import { changeSelectedId } from '../../../../store/modules/question-component.ts'

const Layers: FC = () => {
  const { componentList, selectedId } = useGetComponentInfo()

  console.log(componentList)
  const dispatch = useDispatch()

  // 记录当前正在修改标题的组件
  const [changingTitleId, setChangingTitleId] = useState('')

  // 点击选中某个组件
  function handleTitleClick(fe_id: string) {
    const currentComponent = componentList.find(
      (component: any) => component.fe_id === fe_id
    )
    if (currentComponent && currentComponent.isHidden) {
      message.info('该组件已隐藏，无法选中')
      return
    }
    if (fe_id !== selectedId) {
      dispatch(changeSelectedId(fe_id))
    }
  }

  return (
    <>
      {componentList.map((component: any) => {
        const { fe_id, title, isHidden, isLocked } = component

        return (
          <div key={fe_id} onClick={() => handleTitleClick(fe_id)}>
            <div className="">{title}</div>
            <div>按钮</div>
          </div>
        )
      })}
    </>
  )
}

export default Layers
