import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface IUserState {
  _id: string
  username: string
  nickname: string
  token: string
  isActive: boolean
  lastLoginAt: string | null
  createdAt: string
  updatedAt: string
}

const initialState: IUserState = {
  _id: '',
  username: '',
  nickname: '',
  token: '',
  isActive: false,
  lastLoginAt: null,
  createdAt: '',
  updatedAt: '',
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    loginReducer: (state: IUserState, action: PayloadAction<IUserState>) => {
      return action.payload
    },
    logoutReducer: () => {
      return initialState
    },
    updateUserInfo: (
      state: IUserState,
      action: PayloadAction<Partial<IUserState>>
    ) => {
      return { ...state, ...action.payload }
    },
  },
})

export const { loginReducer, logoutReducer, updateUserInfo } =
  userSlice.actions

export default userSlice.reducer
