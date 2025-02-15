import { FC, ChangeEvent } from 'react'
import { message, Input } from 'antd'
import { useDispatch } from 'react-redux'
import { useState } from 'react'
import useGetComponentInfo from '../../../../hooks/useGetComponentInfo.ts'
import { changeSelectedId } from '../../../../store/modules/question-component.ts'
import { changeComponentTitle } from '../../../../store/modules/question-component.ts'
import { cn } from '../../../../utils/index'

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
      setChangingTitleId('')
      return
    }
    setChangingTitleId(fe_id)
  }

  // 标题修改
  function handleTitleChange(e: ChangeEvent<HTMLInputElement>) {
    const newTitle = e.target.value.trim()
    if (!newTitle) return
    if (!selectedId) return

    dispatch(changeComponentTitle({ fe_id: selectedId, title: newTitle }))
  }

  return (
    <>
      {componentList.map((component: any) => {
        const { fe_id, title, isHidden, isLocked } = component

        return (
          <div
            key={fe_id}
            onClick={() => handleTitleClick(fe_id)}
            className={cn(
              'flex justify-between items-center w-full py-2 px-4 rounded-md cursor-pointer hover:bg-gray-100 hover:text-blue-600'
            )}
          >
            <div className="">
              {fe_id === changingTitleId && (
                <Input
                  value={title}
                  onChange={handleTitleChange}
                  onPressEnter={() => setChangingTitleId('')}
                  onBlur={() => setChangingTitleId('')}
                />
              )}
              {fe_id !== changingTitleId && title}
            </div>
            <div>按钮</div>
          </div>
        )
      })}
    </>
  )
}

export default Layers
