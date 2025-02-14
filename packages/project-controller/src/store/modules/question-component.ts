import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ComponentPropsType } from '../../pages/Question/components'

export interface QuestionComponentType {
  fe_id: string // fe_id 是前端在新增一个控件的时候自动进行生成的, 与数据库的 _id 格式不同, 因此自定义该 id
  type: string
  title: string
  props: ComponentPropsType
}

export interface QuestionComponentStateType {
  componentList: Array<QuestionComponentType>
  selectedId: string
}

export const initialState: QuestionComponentStateType = {
  componentList: [],
  selectedId: '',
}

export const questionComponentSlice = createSlice({
  name: 'questionComponent',
  initialState,
  reducers: {
    // 更新组件列表数据
    resetComponents(
      state: QuestionComponentStateType,
      action: PayloadAction<QuestionComponentStateType>
    ) {
      console.log('resetComponents reducer called', action.payload)
      return action.payload
    },
    // 修改当前选中的控件
    changeSelectedId(
      state: QuestionComponentStateType,
      action: PayloadAction<string>
    ) {
      return {
        ...state,
        selectedId: action.payload,
      }
    },
    // 组件列表新增控件
    addComponent(
      state: QuestionComponentStateType,
      action: PayloadAction<QuestionComponentType>
    ) {
      const { selectedId, componentList } = state
      const index = componentList.findIndex((item) => item.fe_id === selectedId)
      // 如果没有选中控件，则新增到末尾
      if (index < 0) {
        state.componentList = [...state.componentList, action.payload]
      } else {
        // 如果选中控件，则插入到选中控件之后
        state.componentList = [
          ...state.componentList.slice(0, index + 1),
          action.payload,
          ...state.componentList.slice(index + 1),
        ]
      }
    },
    // 修改组件属性
    changeComponentProps(
      state: QuestionComponentStateType,
      action: PayloadAction<{ fe_id: string; props: ComponentPropsType }>
    ) {
      const { fe_id, props } = action.payload

      const curentComponent = state.componentList.find(
        (item) => item.fe_id === fe_id
      )
      if (curentComponent) {
        curentComponent.props = {
          ...curentComponent.props,
          ...props,
        }
      }
    },
    // 删除控件
    extraComponents(state: QuestionComponentStateType) {
      const { componentList, selectedId } = state
      const index = componentList.findIndex((item) => item.fe_id === selectedId)

      // 如果没有选中的控件，直接返回
      if (index < 0) return

      // 创建新的组件列表，不包含要删除的控件
      state.componentList = [
        ...componentList.slice(0, index),
        ...componentList.slice(index + 1),
      ]

      // 重新计算选中的 ID
      if (state.componentList.length > 0) {
        // 如果删除的不是最后一个组件，选中下一个，否则选中前一个
        if (index < state.componentList.length) {
          state.selectedId = state.componentList[index].fe_id
        } else {
          state.selectedId =
            state.componentList[state.componentList.length - 1].fe_id
        }
      } else {
        // 如果组件列表为空，selectedId 置为空字符串
        state.selectedId = ''
      }
    },
  },
})

export const {
  resetComponents,
  changeSelectedId,
  addComponent,
  changeComponentProps,
  extraComponents,
} = questionComponentSlice.actions

export default questionComponentSlice.reducer
