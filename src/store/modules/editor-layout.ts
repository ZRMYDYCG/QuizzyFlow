import { createSlice, PayloadAction } from '@reduxjs/toolkit'

// 视图模式类型
export type ViewMode = 'standard' | 'focus' | 'preview'

// 移动端激活面板类型
export type MobileActivePanel = 'none' | 'left' | 'right' | 'toolbar'

// 布局配置状态类型
export interface EditorLayoutState {
  // 视图模式
  viewMode: ViewMode
  // 左侧面板显示状态
  showLeftPanel: boolean
  // 右侧面板显示状态
  showRightPanel: boolean
  // 左侧面板宽度
  leftPanelWidth: number
  // 右侧面板宽度
  rightPanelWidth: number
  // 画布缩放比例
  canvasScale: number
  // 工具栏是否显示
  showToolbar: boolean
  // 移动端激活的面板
  mobileActivePanel: MobileActivePanel
}

// 默认配置
const DEFAULT_LEFT_WIDTH = 355
const DEFAULT_RIGHT_WIDTH = 325
const DEFAULT_SCALE = 100

// 从localStorage读取配置
const loadLayoutConfig = (): EditorLayoutState => {
  try {
    const saved = localStorage.getItem('editor-layout-config')
    if (saved) {
      const config = JSON.parse(saved)
      return {
        ...initialState,
        ...config,
      }
    }
  } catch (error) {
    console.error('Failed to load layout config:', error)
  }
  return initialState
}

// 初始状态
export const initialState: EditorLayoutState = {
  viewMode: 'standard',
  showLeftPanel: true,
  showRightPanel: true,
  leftPanelWidth: DEFAULT_LEFT_WIDTH,
  rightPanelWidth: DEFAULT_RIGHT_WIDTH,
  canvasScale: DEFAULT_SCALE,
  showToolbar: false,
  mobileActivePanel: 'none',
}

// 创建slice
export const editorLayoutSlice = createSlice({
  name: 'editorLayout',
  initialState: loadLayoutConfig(),
  reducers: {
    // 切换视图模式
    setViewMode(state: EditorLayoutState, action: PayloadAction<ViewMode>) {
      state.viewMode = action.payload
      
      // 根据不同模式设置面板显示
      switch (action.payload) {
        case 'standard':
          state.showLeftPanel = true
          state.showRightPanel = true
          break
        case 'focus':
          state.showLeftPanel = false
          state.showRightPanel = false
          break
        case 'preview':
          state.showLeftPanel = true
          state.showRightPanel = false
          break
      }
      
      saveToLocalStorage(state)
    },
    
    // 切换左侧面板
    toggleLeftPanel(state: EditorLayoutState) {
      state.showLeftPanel = !state.showLeftPanel
      // 如果手动切换面板，则切换到自定义模式
      if (state.viewMode !== 'standard') {
        state.viewMode = 'standard'
      }
      saveToLocalStorage(state)
    },
    
    // 切换右侧面板
    toggleRightPanel(state: EditorLayoutState) {
      state.showRightPanel = !state.showRightPanel
      // 如果手动切换面板，则切换到自定义模式
      if (state.viewMode !== 'standard') {
        state.viewMode = 'standard'
      }
      saveToLocalStorage(state)
    },
    
    // 设置左侧面板宽度
    setLeftPanelWidth(state: EditorLayoutState, action: PayloadAction<number>) {
      state.leftPanelWidth = Math.max(200, Math.min(600, action.payload))
      saveToLocalStorage(state)
    },
    
    // 设置右侧面板宽度
    setRightPanelWidth(state: EditorLayoutState, action: PayloadAction<number>) {
      state.rightPanelWidth = Math.max(200, Math.min(600, action.payload))
      saveToLocalStorage(state)
    },
    
    // 设置画布缩放
    setCanvasScale(state: EditorLayoutState, action: PayloadAction<number>) {
      state.canvasScale = Math.max(25, Math.min(200, action.payload))
      saveToLocalStorage(state)
    },
    
    // 切换工具栏显示
    toggleToolbar(state: EditorLayoutState) {
      state.showToolbar = !state.showToolbar
    },
    
    // 重置布局
    resetLayout(state: EditorLayoutState) {
      state.viewMode = 'standard'
      state.showLeftPanel = true
      state.showRightPanel = true
      state.leftPanelWidth = DEFAULT_LEFT_WIDTH
      state.rightPanelWidth = DEFAULT_RIGHT_WIDTH
      state.canvasScale = DEFAULT_SCALE
      saveToLocalStorage(state)
    },
    
    // 移动端：设置激活的面板
    setMobileActivePanel(state: EditorLayoutState, action: PayloadAction<MobileActivePanel>) {
      state.mobileActivePanel = action.payload
    },
    
    // 移动端：切换面板（关闭当前或打开新的）
    toggleMobilePanel(state: EditorLayoutState, action: PayloadAction<MobileActivePanel>) {
      if (state.mobileActivePanel === action.payload) {
        state.mobileActivePanel = 'none'
      } else {
        state.mobileActivePanel = action.payload
      }
    },
  },
})

// 保存到localStorage
const saveToLocalStorage = (state: EditorLayoutState) => {
  try {
    const config = {
      viewMode: state.viewMode,
      showLeftPanel: state.showLeftPanel,
      showRightPanel: state.showRightPanel,
      leftPanelWidth: state.leftPanelWidth,
      rightPanelWidth: state.rightPanelWidth,
      canvasScale: state.canvasScale,
    }
    localStorage.setItem('editor-layout-config', JSON.stringify(config))
  } catch (error) {
    console.error('Failed to save layout config:', error)
  }
}

// 导出actions
export const {
  setViewMode,
  toggleLeftPanel,
  toggleRightPanel,
  setLeftPanelWidth,
  setRightPanelWidth,
  setCanvasScale,
  toggleToolbar,
  resetLayout,
  setMobileActivePanel,
  toggleMobilePanel,
} = editorLayoutSlice.actions

export default editorLayoutSlice.reducer

