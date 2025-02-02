import { createSlice, PayloadAction } from "@reduxjs/toolkit"

export interface IUserState {
    username: string
    nickname: string
}

const initialState: IUserState = {
    username: "",
    nickname: ""
}

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        loginReducer: (state: IUserState, action: PayloadAction<IUserState>) => {
            console.log(state)
            return action.payload
        },
        logoutReducer: () => {
            return initialState
        }
    }
})

export const { loginReducer, logoutReducer } = userSlice.actions

export default userSlice.reducer
