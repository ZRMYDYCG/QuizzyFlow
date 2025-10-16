import { FC, ChangeEvent } from 'react'
import { message, Input, Button } from 'antd'
import { useDispatch } from 'react-redux'
import { swapComponent } from '@/store/modules/question-component'
import { EyeInvisibleOutlined, LockOutlined } from '@ant-design/icons'
import { useState } from 'react'
import useGetComponentInfo from '@/hooks/useGetComponentInfo'
import { changeSelectedId } from '@/store/modules/question-component'
import {
  changeComponentTitle,
  changeComponentsLock,
  changeComponentsVisible,
} from '@/store/modules/question-component'
import SortableContainer from '@/components/drag-sort/sort-container'
import SortableItem from '@/components/drag-sort/sort-item'
import { cn } from '@/utils'

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

  // 切换隐藏与显示状态
  function handleToggleHidden(fe_id: string, isHidden: boolean) {
    dispatch(changeComponentsVisible({ fe_id, isHidden }))
  }

  // 切换锁定与解锁状态
  function handleToggleLocked(fe_id: string) {
    dispatch(changeComponentsLock({ fe_id }))
  }

  // 注：SortableContainer组件的item属性必须是数组, 其中的每一个item都需要一个id属性
  const componentListWithId = componentList.map((component: any) => {
    return { ...component, id: component.fe_id }
  })

  // 拖拽排序结束
  function handleDragEnd(sourceIndex: number, targetIndex: number) {
    dispatch(swapComponent({ sourceIndex, targetIndex }))
  }

  return (
    <SortableContainer items={componentListWithId} onDragEnd={handleDragEnd}>
      {componentList.map((component: any) => {
        const { fe_id, title, isHidden, isLocked } = component

        return (
          <SortableItem key={fe_id} id={fe_id}>
            <div
              className={cn(
                'flex justify-between items-center w-full py-2 px-4 rounded-md cursor-pointer hover:bg-gray-100 hover:text-blue-600'
              )}
            >
              <div onClick={() => handleTitleClick(fe_id)}>
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
              <div className="flex items-center gap-1">
                <Button
                  size="small"
                  shape="circle"
                  icon={<EyeInvisibleOutlined />}
                  type={isHidden ? 'primary' : 'default'}
                  onClick={() => handleToggleHidden(fe_id, !isHidden)}
                ></Button>
                <Button
                  size="small"
                  shape="circle"
                  icon={<LockOutlined />}
                  type={isLocked ? 'primary' : 'default'}
                  onClick={() => handleToggleLocked(fe_id)}
                ></Button>
              </div>
            </div>
          </SortableItem>
        )
      })}
    </SortableContainer>
  )
}

export default Layers
