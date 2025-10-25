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
import { useTheme } from '@/contexts/ThemeContext'

const Layers: FC = () => {
  const { componentList, selectedId } = useGetComponentInfo()
  const { theme, primaryColor, themeColors } = useTheme()

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
    <div className="h-full overflow-y-auto px-3 py-4 custom-scrollbar">
      <SortableContainer items={componentListWithId} onDragEnd={handleDragEnd}>
        {componentList.map((component: any) => {
          const { fe_id, title, isHidden, isLocked } = component
          const isSelected = fe_id === selectedId

          return (
            <SortableItem key={fe_id} id={fe_id}>
              <div
                className={cn(
                  'flex justify-between items-center w-full py-2.5 px-3 mb-2 rounded-lg cursor-pointer transition-all border',
                  isSelected 
                    ? '' 
                    : theme === 'dark'
                      ? 'bg-[#2a2a2f] border-white/5 text-slate-300 hover:bg-[#35353a] hover:border-white/10'
                      : 'bg-white border-gray-200 text-gray-900 hover:bg-gray-50 hover:border-gray-300',
                  isHidden && 'opacity-50'
                )}
                style={isSelected ? {
                  backgroundColor: primaryColor + '15',
                  borderColor: primaryColor + '50',
                  color: primaryColor
                } : {}}
              >
                <div 
                  onClick={() => handleTitleClick(fe_id)}
                  className="flex-1 min-w-0"
                >
                  {fe_id === changingTitleId ? (
                    <Input
                      value={title}
                      onChange={handleTitleChange}
                      onPressEnter={() => setChangingTitleId('')}
                      onBlur={() => setChangingTitleId('')}
                      size="small"
                      autoFocus
                    />
                  ) : (
                    <span className="text-sm truncate">{title}</span>
                  )}
                </div>
                <div className="flex items-center gap-1 ml-2">
                  <button
                    onClick={() => handleToggleHidden(fe_id, !isHidden)}
                    className={cn(
                      'w-7 h-7 flex items-center justify-center rounded-md transition-all',
                      isHidden 
                        ? 'text-white' 
                        : theme === 'dark'
                          ? 'bg-[#35353a] text-slate-400 hover:text-white hover:bg-[#404045]'
                          : 'bg-gray-100 text-gray-600 hover:text-gray-900 hover:bg-gray-200'
                    )}
                    style={isHidden ? {
                      background: `linear-gradient(135deg, ${primaryColor}, ${themeColors.primaryActive})`
                    } : {}}
                  >
                    <EyeInvisibleOutlined className="text-xs" />
                  </button>
                  <button
                    onClick={() => handleToggleLocked(fe_id)}
                    className={cn(
                      'w-7 h-7 flex items-center justify-center rounded-md transition-all',
                      isLocked 
                        ? 'bg-amber-500 text-white hover:bg-amber-600' 
                        : theme === 'dark'
                          ? 'bg-[#35353a] text-slate-400 hover:text-white hover:bg-[#404045]'
                          : 'bg-gray-100 text-gray-600 hover:text-gray-900 hover:bg-gray-200'
                    )}
                  >
                    <LockOutlined className="text-xs" />
                  </button>
                </div>
              </div>
            </SortableItem>
          )
        })}
      </SortableContainer>
    </div>
  )
}

export default Layers
