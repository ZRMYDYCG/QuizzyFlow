import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface IPageInfo {
  title: string
  desc?: string
  css?: string
  js?: string
  isPublished?: boolean
}

export const pageInfoDefaultData: IPageInfo = {
  title: '',
  desc: '',
  css: '',
  js: '',
}

const pageInfoSlice = createSlice({
  name: 'pageInfo',
  initialState: pageInfoDefaultData,
  reducers: {
    resetPageInfo: (state, action: PayloadAction<IPageInfo>) => {
      return action.payload
    },
    // 修改标题
    setTitle: (state, action: PayloadAction<string>) => {
      state.title = action.payload
    },
  },
})

export const { resetPageInfo, setTitle } = pageInfoSlice.actions

export default pageInfoSlice.reducer
