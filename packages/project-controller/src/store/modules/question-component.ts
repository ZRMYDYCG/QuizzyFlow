import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { ComponentPropsType } from "../../pages/Question/components"

export interface QuestionComponentType {
    fe_id: string,
    type: string,
    title: string,
    props: ComponentPropsType
}

export interface QuestionComponentStateType {
    componentList: Array<QuestionComponentType>
    selectedId: string
}

export const initialState: QuestionComponentStateType = {
    componentList: [],
    selectedId: ""
}

export const questionComponentSlice = createSlice({
    name: "questionComponent",
    initialState,
    reducers: {
        // 更新组件列表数据
        resetComponents(state: QuestionComponentStateType, action: PayloadAction<QuestionComponentStateType>) {
            console.log("resetComponents reducer called", action.payload)
            return action.payload
        },
        // 修改当前选中的控件
        changeSelectedId(state: QuestionComponentStateType, action: PayloadAction<string>) {
            return {
                ...state,
                selectedId: action.payload
            }
        }
    }
})

export const { resetComponents, changeSelectedId } = questionComponentSlice.actions

export default questionComponentSlice.reducer
