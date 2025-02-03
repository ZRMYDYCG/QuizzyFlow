import  { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { ComponentPropsType } from "../../pages/Question/components"

export interface QuestionComponentType {
    fe_id: string,
    type: string,
    title: string,
    props: ComponentPropsType
}

export interface QuestionComponentStateType {
    componentList: Array<QuestionComponentType>
}

export const initialState: QuestionComponentStateType = {
    componentList: [],
}

export const questionComponentSlice = createSlice({
    name: "questionComponent",
    initialState,
    reducers: {
        // 重置所有组件
        resetComponents(state: QuestionComponentStateType, action: PayloadAction<QuestionComponentStateType>) {
            console.log(state)
            return action.payload
        }
    }
})

export const { resetComponents } = questionComponentSlice.actions

export default questionComponentSlice.reducer