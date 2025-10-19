import { createSlice, PayloadAction } from '@reduxjs/toolkit'

/**
 * 画布配置状态类型
 */
export interface CanvasConfigState {
  scale: number // 缩放比例 0.25-2.0
  offsetX: number // X轴偏移
  offsetY: number // Y轴偏移
  showGrid: boolean // 显示网格
  showRuler: boolean // 显示标尺
  gridSize: number // 网格大小（px）
  unit: 'px' | 'cm' | 'inch' // 单位
  canvasWidth: number // 画布宽度
  canvasHeight: number // 画布高度
}

// 从localStorage读取配置
const loadCanvasConfig = (): CanvasConfigState => {
  try {
    const saved = localStorage.getItem('canvas-config')
    if (saved) {
      const config = JSON.parse(saved)
      return {
        ...initialState,
        ...config,
      }
    }
  } catch (error) {
    console.error('Failed to load canvas config:', error)
  }
  return initialState
}

// 保存到localStorage
const saveToLocalStorage = (state: CanvasConfigState) => {
  try {
    const config = {
      scale: state.scale,
      showGrid: state.showGrid,
      showRuler: state.showRuler,
      gridSize: state.gridSize,
      unit: state.unit,
    }
    localStorage.setItem('canvas-config', JSON.stringify(config))
  } catch (error) {
    console.error('Failed to save canvas config:', error)
  }
}

// 初始状态
export const initialState: CanvasConfigState = {
  scale: 1.0,
  offsetX: 0,
  offsetY: 0,
  showGrid: true,
  showRuler: true,
  gridSize: 10,
  unit: 'px',
  canvasWidth: 400,
  canvasHeight: 800,
}

// 创建slice
export const canvasConfigSlice = createSlice({
  name: 'canvasConfig',
  initialState: loadCanvasConfig(),
  reducers: {
    // 设置缩放比例
    setScale(state: CanvasConfigState, action: PayloadAction<number>) {
      state.scale = Math.max(0.25, Math.min(2, action.payload))
      saveToLocalStorage(state)
    },
    
    // 设置偏移量
    setOffset(
      state: CanvasConfigState,
      action: PayloadAction<{ x: number; y: number }>
    ) {
      state.offsetX = action.payload.x
      state.offsetY = action.payload.y
    },
    
    // 切换网格显示
    toggleGrid(state: CanvasConfigState) {
      state.showGrid = !state.showGrid
      saveToLocalStorage(state)
    },
    
    // 切换标尺显示
    toggleRuler(state: CanvasConfigState) {
      state.showRuler = !state.showRuler
      saveToLocalStorage(state)
    },
    
    // 设置网格大小
    setGridSize(state: CanvasConfigState, action: PayloadAction<number>) {
      state.gridSize = Math.max(5, Math.min(50, action.payload))
      saveToLocalStorage(state)
    },
    
    // 设置单位
    setUnit(
      state: CanvasConfigState,
      action: PayloadAction<'px' | 'cm' | 'inch'>
    ) {
      state.unit = action.payload
      saveToLocalStorage(state)
    },
    
    // 重置画布
    resetCanvas(state: CanvasConfigState) {
      state.scale = 1.0
      state.offsetX = 0
      state.offsetY = 0
      saveToLocalStorage(state)
    },
    
    // 适应屏幕
    fitToScreen(state: CanvasConfigState) {
      state.scale = 1.0
      state.offsetX = 0
      state.offsetY = 0
      saveToLocalStorage(state)
    },
  },
})

// 导出actions
export const {
  setScale,
  setOffset,
  toggleGrid,
  toggleRuler,
  setGridSize,
  setUnit,
  resetCanvas,
  fitToScreen,
} = canvasConfigSlice.actions

export default canvasConfigSlice.reducer

