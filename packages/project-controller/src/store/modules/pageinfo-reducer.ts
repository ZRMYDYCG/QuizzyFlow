import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface IPageInfo {
  title: string
  desc?: string
  css?: string
  js?: string
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
  },
})

export const { resetPageInfo } = pageInfoSlice.actions

export default pageInfoSlice.reducer
