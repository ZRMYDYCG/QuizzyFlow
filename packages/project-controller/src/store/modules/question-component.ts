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
        resetComponents(state: QuestionComponentStateType, action: PayloadAction<QuestionComponentStateType>) {
            console.log("resetComponents reducer called", action.payload)
            return action.payload
        }
    }
})

export const { resetComponents } = questionComponentSlice.actions

export default questionComponentSlice.reducer
