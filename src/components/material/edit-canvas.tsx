import React from 'react'
import { Spin } from 'antd'
import { getComponentConfigByType } from './index.ts'
import { useDispatch, useSelector } from 'react-redux'
import { swapComponent } from '../../store/modules/question-component.ts'
import SortableContainer from '../drag-sort/sort-container.tsx'
import SortableItem from '../drag-sort/sort-item.tsx'
import useGetComponentInfo from '../../hooks/useGetComponentInfo.ts'
import { QuestionComponentType } from '../../store/modules/question-component.ts'
import { changeSelectedId } from '../../store/modules/question-component.ts'
import { cn } from '../../utils/index.ts'
import useCanvasKeyPress from '../../hooks/useCanvasKeyPress.ts'
import { IPageInfo } from '../../store/modules/pageinfo-reducer.ts'
import { useTheme } from '../../contexts/ThemeContext'

interface IPopsEditCanvas {
  loading: boolean
}

function genComponent(componentInfo: QuestionComponentType) {
  const { type, props } = componentInfo
  const componentConfig = getComponentConfigByType(type)

  if (componentConfig === null) return null

  const { component: Component } = componentConfig

  return (
    <>
      <Component {...props} />
    </>
  )
}

const EditCanvas: React.FC<IPopsEditCanvas> = ({ loading }) => {
  const dispatch = useDispatch()
  const { componentList = [], selectedId } = useGetComponentInfo()
  const { theme } = useTheme()
  const pageInfo = useSelector(
    (state: { pageInfo: IPageInfo }) => state.pageInfo
  )

  useCanvasKeyPress()

  function handleClick(event: React.MouseEvent, id: string) {
    event.stopPropagation()
    dispatch(changeSelectedId(id))
  }

  const componentListWithId = componentList.map((component: any) => {
    return { ...component, id: component.fe_id }
  })

  function handleDragEnd(sourceIndex: number, targetIndex: number) {
    dispatch(swapComponent({ sourceIndex, targetIndex }))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <Spin size="large" />
          <p className={`mt-4 text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}`}>加载中...</p>
        </div>
      </div>
    )
  }

  // 计算布局方向对应的margin
  const getLayoutMargin = () => {
    switch (pageInfo.layout) {
      case 'left':
        return '0 auto 0 0'
      case 'right':
        return '0 0 0 auto'
      case 'center':
      default:
        return '0 auto'
    }
  }

  // 视差滚动效果
  const parallaxStyle = pageInfo.parallaxEffect
    ? {
        backgroundAttachment: 'fixed',
        backgroundPosition: `${pageInfo.bgPosition || 'center'} center`,
      }
    : {}

  const visibleComponents = componentList.filter((item: any) => !item.isHidden)
  const isEmpty = visibleComponents.length === 0

  return (
    <div
      style={{
        padding: pageInfo.padding,
        backgroundImage: pageInfo.bgImage ? `url(${pageInfo.bgImage})` : 'none',
        backgroundColor: pageInfo.bgImage ? 'transparent' : (theme === 'dark' ? '#1a1a1f' : '#f9fafb'),
        backgroundSize: 'cover',
        backgroundRepeat: pageInfo.bgRepeat || 'no-repeat',
        backgroundPosition: pageInfo.bgPosition || 'center',
        ...parallaxStyle,
        minHeight: '100vh',
      }}
      className="relative"
    >
      <div
        style={{
          maxWidth: pageInfo.maxWidth || '100%',
          margin: getLayoutMargin(),
          transition: 'all 0.3s ease',
        }}
      >
        {isEmpty ? (
          <div className="flex flex-col items-center justify-center min-h-[400px]">
            <div className="text-6xl mb-4 opacity-30">📋</div>
            <p className={`text-lg font-medium ${theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}`}>画布为空</p>
            <p className={`text-sm mt-2 ${theme === 'dark' ? 'text-slate-500' : 'text-gray-500'}`}>从左侧拖拽组件到这里开始编辑</p>
          </div>
        ) : (
          <SortableContainer
            items={componentListWithId}
            onDragEnd={handleDragEnd}
          >
            <div>
              {visibleComponents.map((item: QuestionComponentType) => {
                const { fe_id, isLocked } = item
                const isActive = fe_id === selectedId
                return (
                  <SortableItem key={fe_id} id={fe_id}>
                    <div
                      onClick={(e) => handleClick(e, fe_id)}
                      style={{ borderRadius: pageInfo.borderRadius }}
                      className={cn(
                        'm-3 p-3 transition-all duration-200 relative',
                        theme === 'dark' ? 'bg-[#2a2a2f]' : 'bg-white',
                        isActive
                          ? 'border-2 border-blue-500 shadow-lg shadow-blue-500/30 ring-2 ring-blue-500/20'
                          : theme === 'dark'
                            ? 'border border-white/10 hover:border-blue-400 hover:shadow-lg hover:bg-[#35353a] hover:border-white/20'
                            : 'border border-gray-200 hover:border-blue-400 hover:shadow-lg hover:bg-gray-50',
                        isLocked 
                          ? 'opacity-50 cursor-not-allowed' 
                          : 'cursor-pointer',
                        'group'
                      )}
                    >
                      {/* 选中指示器 */}
                      {isActive && (
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center shadow-md animate-in zoom-in duration-200">
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                      
                      {/* 锁定指示器 */}
                      {isLocked && (
                        <div className="absolute top-2 right-2 bg-amber-500 text-white text-xs px-2 py-0.5 rounded-full shadow-sm flex items-center gap-1">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                          </svg>
                          已锁定
                        </div>
                      )}
                      
                      <div className="pointer-events-none">
                        {genComponent(item)}
                      </div>
                    </div>
                  </SortableItem>
                )
              })}
            </div>
          </SortableContainer>
        )}
      </div>
    </div>
  )
}

export default EditCanvas
