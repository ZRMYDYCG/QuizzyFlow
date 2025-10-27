import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface EditorSettings {
  autoSave: boolean
  autoSaveInterval: number
  defaultScale: number
  showGrid: boolean
  showRulers: boolean
}

export interface UserPreferences {
  theme: 'light' | 'dark'
  language: 'zh-CN' | 'en-US'
  editorSettings: EditorSettings
  listView: 'card' | 'table'
}

export interface IUserState {
  _id: string
  username: string
  nickname: string
  token: string
  isActive: boolean
  lastLoginAt: string | null
  createdAt: string
  updatedAt: string
  avatar: string
  bio: string
  phone: string
  preferences: UserPreferences
  role: string
  customPermissions: string[]
  isBanned: boolean
}

const defaultPreferences: UserPreferences = {
  theme: 'light',
  language: 'zh-CN',
  editorSettings: {
    autoSave: true,
    autoSaveInterval: 30,
    defaultScale: 1,
    showGrid: true,
    showRulers: true,
  },
  listView: 'card',
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
  avatar: '',
  bio: '',
  phone: '',
  preferences: defaultPreferences,
  role: 'user',
  customPermissions: [],
  isBanned: false,
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
