import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { FlowData } from '@/api/flow'

export interface FlowListState {
  list: FlowData[]
  total: number
  loading: boolean
  selectedIds: string[]
}

const initialState: FlowListState = {
  list: [],
  total: 0,
  loading: false,
  selectedIds: [],
}

const flowListSlice = createSlice({
  name: 'flowList',
  initialState,
  reducers: {
    setFlowList: (
      state,
      action: PayloadAction<{ list: FlowData[]; total: number }>,
    ) => {
      state.list = action.payload.list
      state.total = action.payload.total
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    toggleStar: (state, action: PayloadAction<string>) => {
      const flow = state.list.find((f) => f._id === action.payload)
      if (flow) {
        flow.isStar = !flow.isStar
      }
    },
    selectFlow: (state, action: PayloadAction<string>) => {
      if (!state.selectedIds.includes(action.payload)) {
        state.selectedIds.push(action.payload)
      }
    },
    deselectFlow: (state, action: PayloadAction<string>) => {
      state.selectedIds = state.selectedIds.filter(
        (id) => id !== action.payload,
      )
    },
    clearSelection: (state) => {
      state.selectedIds = []
    },
  },
})

export const {
  setFlowList,
  setLoading,
  toggleStar,
  selectFlow,
  deselectFlow,
  clearSelection,
} = flowListSlice.actions

export default flowListSlice.reducer

