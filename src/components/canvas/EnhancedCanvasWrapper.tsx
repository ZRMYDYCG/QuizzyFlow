import React, { useRef, useEffect, useState } from 'react'
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch'
import type { ReactZoomPanPinchRef } from 'react-zoom-pan-pinch'
import { useDispatch, useSelector } from 'react-redux'
import { setScale, setOffset } from '@/store/modules/canvas-config'
import { stateType } from '@/store'
import CanvasRulers from './CanvasRulers'
import GridBackground from './GridBackground'
import ZoomControls from './ZoomControls'
import EditCanvas from '@/components/material/edit-canvas'
import { useTheme } from '@/contexts/ThemeContext'

interface EnhancedCanvasWrapperProps {
  loading: boolean
}

const EnhancedCanvasWrapper: React.FC<EnhancedCanvasWrapperProps> = ({
  loading,
}) => {
  const dispatch = useDispatch()
  const { theme } = useTheme()
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasContentRef = useRef<HTMLDivElement>(null)
  const transformRef = useRef<ReactZoomPanPinchRef>(null)
  const { scale, showRuler } = useSelector(
    (state: stateType) => state.canvasConfig
  )
  
  const prevScaleRef = useRef<number>(scale)

  const isDark = theme === 'dark'
  
  // 空格键按下状态
  const [isSpacePressed, setIsSpacePressed] = useState(false)
  // 鼠标是否在画布内容区域
  const [isOverCanvas, setIsOverCanvas] = useState(false)

  useEffect(() => {
    if (transformRef.current && Math.abs(scale - prevScaleRef.current) > 0.001) {
      const currentState = transformRef.current.instance.transformState
      
      if (Math.abs(currentState.scale - scale) > 0.001) {
        transformRef.current.setTransform(
          currentState.positionX,
          currentState.positionY,
          scale,
          200,
          'easeOut'
        )
      }
      
      prevScaleRef.current = scale
    }
  }, [scale])

  // 快捷键支持 + 空格键检测
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 空格键按下 - 启用画布拖拽模式
      if (e.code === 'Space' && !isSpacePressed) {
        e.preventDefault()
        setIsSpacePressed(true)
        document.body.style.cursor = 'grab'
      }
      
      // Ctrl/Cmd + 0 重置缩放
      if (e.ctrlKey || e.metaKey) {
        if (e.key === '0') {
          e.preventDefault()
          dispatch(setScale(1))
        }
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      // 空格键抬起 - 退出画布拖拽模式
      if (e.code === 'Space') {
        setIsSpacePressed(false)
        document.body.style.cursor = ''
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
      document.body.style.cursor = ''
    }
  }, [dispatch, isSpacePressed])

  return (
    <div
      className={`relative w-full h-full overflow-hidden ${
        isDark ? 'bg-[#1a1a1f]' : 'bg-gray-100'
      }`}
    >
      {/* 标尺 */}
      {showRuler && <CanvasRulers containerRef={containerRef} />}

      {/* 画布容器 - 带网格背景 */}
      <GridBackground>
        <div
          ref={containerRef}
          className="absolute inset-0"
          style={{
            top: showRuler ? '30px' : 0,
            left: showRuler ? '30px' : 0,
          }}
        >
        <TransformWrapper
          ref={transformRef}
          initialScale={scale}
          minScale={0.25}
          maxScale={2}
          centerOnInit
          limitToBounds={false}
          // 禁用默认拖拽，由我们控制
          panning={{
            disabled: !isSpacePressed && isOverCanvas,
            velocityDisabled: true,
          }}
          wheel={{
            step: 0.05,
          }}
          doubleClick={{
            disabled: false,
            mode: 'reset',
          }}
          onTransformed={(ref) => {
            dispatch(setScale(ref.state.scale))
            dispatch(
              setOffset({
                x: ref.state.positionX,
                y: ref.state.positionY,
              })
            )
          }}
        >
            {({ zoomIn, zoomOut, resetTransform }) => (
              <>
                <TransformComponent
                  wrapperClass="!w-full !h-full"
                  contentClass="!w-full !h-full flex items-center justify-center p-12"
                >
                  {/* 画布内容 - 固定宽度400px，高度自适应 */}
                  <div
                    ref={canvasContentRef}
                    className={`relative shadow-2xl rounded-xl overflow-hidden ${
                      isDark ? 'border border-white/10' : 'border border-gray-200'
                    }`}
                    style={{
                      width: '400px',
                      minHeight: '712px',
                      backgroundColor: '#ffffff',
                      cursor: isSpacePressed ? 'grab' : 'default',
                    }}
                    onMouseEnter={() => setIsOverCanvas(true)}
                    onMouseLeave={() => setIsOverCanvas(false)}
                  >
                    <EditCanvas loading={loading} />
                  </div>
                </TransformComponent>
              </>
            )}
          </TransformWrapper>
        </div>
      </GridBackground>

      {/* 缩放控制 */}
      <ZoomControls />

      {/* 快捷键提示 */}
      <div
        className={`fixed bottom-6 left-6 text-xs rounded px-3 py-2 transition-all ${
          isDark
            ? 'bg-[#2a2a2f]/90 text-gray-400 border border-white/10'
            : 'bg-white/90 text-gray-600 border border-gray-200'
        } ${isSpacePressed ? 'ring-2 ring-blue-500' : ''}`}
      >
        <div className="flex items-center gap-2">
          {isSpacePressed ? (
            <>
              <span className="inline-block w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
              <span className="font-medium text-blue-500">画布拖拽模式</span>
            </>
          ) : (
            <>
              <span>💡</span>
              <span>Ctrl+滚轮缩放 | <strong className="text-blue-500">空格+拖拽</strong>平移画布 | Ctrl+0重置</span>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default EnhancedCanvasWrapper

