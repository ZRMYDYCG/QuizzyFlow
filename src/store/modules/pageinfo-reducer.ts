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
    // 新增reducer
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
  },
})

export const {
  resetPageInfo,
  setTitle,
  setPagePadding,
  setPageLayout,
  setMaxWidth,
  setBgImage,
} = pageInfoSlice.actions

export default pageInfoSlice.reducer
