import { configureStore } from '@reduxjs/toolkit'
import userReducer from './modules/user.ts'
import {IUserState} from './modules/user.ts'


export interface stateType {
    user: IUserState
}

export default  configureStore({
    reducer: {
        user: userReducer,
    }
})