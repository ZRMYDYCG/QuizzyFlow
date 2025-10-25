import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface IPageInfo {
  title: string
  desc?: string
  type?: string // 问卷类型: survey, exam, vote, form 等
  css?: string
  js?: string
  isPublished?: boolean
  author?: string // 问卷作者
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
  type: 'form', // 默认为通用表单
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
    setType: (state, action: PayloadAction<string>) => {
      state.type = action.payload
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
  setType,
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
