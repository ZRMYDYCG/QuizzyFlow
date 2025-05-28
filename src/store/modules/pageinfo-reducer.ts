import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface IPageInfo {
  title: string
  desc?: string
  css?: string
  js?: string
  isPublished?: boolean
  padding?: string
  layout?: 'left' | 'center' | 'right' // 页面方向
  maxWidth?: string // 页面最大宽度
  bgImage?: string // 背景图片URL
  bgRepeat?: 'repeat' | 'no-repeat' | 'repeat-x' | 'repeat-y' // 背景重复
  bgPosition?: 'top' | 'center' | 'bottom' | 'left' | 'right' // 背景位置
  parallaxEffect?: boolean // 视差滚动效果
  borderRadius?: string // 组件圆角
}

export const pageInfoDefaultData: IPageInfo = {
  title: '',
  desc: '',
  css: '',
  js: '',
  padding: '16px',
  layout: 'center', // 默认居中
  maxWidth: '100%', // 默认100%宽度
  bgImage: '', // 默认无背景图
  bgRepeat: 'no-repeat',
  bgPosition: 'center',
  parallaxEffect: false,
  borderRadius: '8px',
}

const pageInfoSlice = createSlice({
  name: 'pageInfo',
  initialState: pageInfoDefaultData,
  reducers: {
    resetPageInfo: (state, action: PayloadAction<IPageInfo>) => {
      return action.payload
    },
    setTitle: (state, action: PayloadAction<string>) => {
      state.title = action.payload
    },
    setPagePadding: (state, action: PayloadAction<string>) => {
      state.padding = action.payload
    },
    setPageLayout: (
      state,
      action: PayloadAction<'left' | 'center' | 'right'>
    ) => {
      state.layout = action.payload
    },
    setMaxWidth: (state, action: PayloadAction<string>) => {
      state.maxWidth = action.payload
    },
    setBgImage: (state, action: PayloadAction<string>) => {
      state.bgImage = action.payload
    },
    setBgRepeat: (
      state,
      action: PayloadAction<'repeat' | 'no-repeat' | 'repeat-x' | 'repeat-y'>
    ) => {
      state.bgRepeat = action.payload
    },
    setBgPosition: (
      state,
      action: PayloadAction<'top' | 'center' | 'bottom' | 'left' | 'right'>
    ) => {
      state.bgPosition = action.payload
    },
    setParallaxEffect: (state, action: PayloadAction<boolean>) => {
      state.parallaxEffect = action.payload
    },
    setBorderRadius: (state, action: PayloadAction<string>) => {
      state.borderRadius = action.payload
    },
  },
})

export const {
  resetPageInfo,
  setTitle,
  setPagePadding,
  setPageLayout,
  setMaxWidth,
  setBgImage,
  setBgRepeat,
  setBgPosition,
  setParallaxEffect,
  setBorderRadius,
} = pageInfoSlice.actions

export default pageInfoSlice.reducer
