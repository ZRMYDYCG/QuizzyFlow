import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface IPageInfo {
  title: string
  desc?: string
  css?: string
  js?: string
  isPublished?: boolean
  padding?: string
}

export const pageInfoDefaultData: IPageInfo = {
  title: '',
  desc: '',
  css: '',
  js: '',
  padding: '16px', // 默认内边距
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
  },
})

export const { resetPageInfo, setTitle, setPagePadding } = pageInfoSlice.actions

export default pageInfoSlice.reducer
