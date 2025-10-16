import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ComponentPropsType } from '@/components/lib'
import { getNextSelectedId } from '@/utils'
import { cloneDeep } from 'lodash-es'
import { nanoid } from 'nanoid'

export interface QuestionComponentType {
  fe_id: string // fe_id 是前端在新增一个控件的时候自动进行生成的, 与数据库的 _id 格式不同, 因此自定义该 id
  type: string
  title: string
  isHidden?: boolean
  isLocked: boolean
  props: ComponentPropsType
}

export interface QuestionComponentStateType {
  componentList: Array<QuestionComponentType>
  selectedId: string
  copiedComponent: QuestionComponentType | null
}

export const initialState: QuestionComponentStateType = {
  componentList: [],
  selectedId: '',
  copiedComponent: null,
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
      console.log('resetComponents reducer called', action.payload, state)
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
      if (index < 0) return // 没有选中控件，直接返回

      // 创建新的组件列表，不包含要删除的控件
      state.componentList = [
        ...componentList.slice(0, index),
        ...componentList.slice(index + 1),
      ]

      const filterCallback = () => true
      state.selectedId = getNextSelectedId(
        selectedId,
        state.componentList,
        filterCallback
      )
    },
    // 隐藏/显示控件
    changeComponentsVisible(
      state: QuestionComponentStateType,
      action: PayloadAction<{ fe_id: string; isHidden: boolean }>
    ) {
      const { fe_id, isHidden } = action.payload
      const currentComponent = state.componentList.find(
        (item) => item.fe_id === fe_id
      )
      if (currentComponent) {
        currentComponent.isHidden = isHidden

        if (isHidden) {
          // 如果要隐藏
          const filterCallback = (component: QuestionComponentType) =>
            !component.isHidden
          state.selectedId = getNextSelectedId(
            state.selectedId,
            state.componentList,
            filterCallback
          )
        } else {
          // 如果要显示
          state.selectedId = fe_id
        }
      }
    },
    // 锁定/解锁控件
    changeComponentsLock(
      state: QuestionComponentStateType,
      action: PayloadAction<{ fe_id: string }>
    ) {
      const { fe_id } = action.payload
      const currentComponent = state.componentList.find(
        (item) => item.fe_id === fe_id
      )
      if (currentComponent) {
        currentComponent.isLocked = !currentComponent.isLocked
      }
    },
    // 拷贝选中的控件
    copySelectedComponent(state: QuestionComponentStateType) {
      const { selectedId, componentList = [] } = state

      // 找到选中的控件
      const selectedComponent = componentList.find(
        (item) => item.fe_id === selectedId
      )
      if (!selectedComponent) return
      // 深拷贝选中的控件
      const copiedComponent = cloneDeep(selectedComponent)
      state.copiedComponent = copiedComponent
    },
    // 粘贴控件
    pasteComponent(state: QuestionComponentStateType) {
      const { copiedComponent, componentList = [] } = state
      if (!copiedComponent) return
      // 找到选中的控件
      const selectedComponent = componentList.find(
        (item) => item.fe_id === state.selectedId
      )
      if (!selectedComponent) return

      // 插入控件
      const index = componentList.findIndex(
        (item) => item.fe_id === state.selectedId
      )

      copiedComponent.fe_id = nanoid()
      state.componentList = [
        ...componentList.slice(0, index + 1),
        copiedComponent,
        ...componentList.slice(index + 1),
      ]
    },
    // 选中上一个
    selectPrevComponent(state: QuestionComponentStateType) {
      const { selectedId, componentList = [] } = state
      const index = componentList.findIndex((item) => item.fe_id === selectedId)
      if (index === 0) return // 第一个控件，不能选中上一个
      if (index < 0) return // 没有选中控件，直接返回
      state.selectedId = componentList[index - 1].fe_id
    },
    // 选中下一个
    selectNextComponent(state: QuestionComponentStateType) {
      const { selectedId, componentList = [] } = state
      const index = componentList.findIndex((item) => item.fe_id === selectedId)
      if (index < 0) return // 没有选中控件，直接返回
      if (index === componentList.length - 1) return // 最后一个控件，不能选中下一个
      state.selectedId = componentList[index + 1].fe_id
    },
    // 修改组件标题
    changeComponentTitle(
      state: QuestionComponentStateType,
      action: PayloadAction<{ fe_id: string; title: string }>
    ) {
      const { fe_id, title } = action.payload
      const currentComponent = state.componentList.find(
        (item) => item.fe_id === fe_id
      )
      if (currentComponent) {
        currentComponent.title = title
      }
    },
    // 组件拖动交换位置
    swapComponent(
      state: QuestionComponentStateType,
      action: PayloadAction<{ sourceIndex: number; targetIndex: number }>
    ) {
      const { sourceIndex, targetIndex } = action.payload
      const { componentList } = state

      if (sourceIndex === targetIndex) return

      // 创建新的数组副本
      const newComponentList = [...componentList]

      // 交换元素
      ;[newComponentList[sourceIndex], newComponentList[targetIndex]] = [
        newComponentList[targetIndex],
        newComponentList[sourceIndex],
      ]

      state.componentList = newComponentList
    },
  },
})

export const {
  resetComponents,
  changeSelectedId,
  addComponent,
  changeComponentProps,
  extraComponents,
  changeComponentsVisible,
  changeComponentsLock,
  copySelectedComponent,
  pasteComponent,
  selectPrevComponent,
  selectNextComponent,
  changeComponentTitle,
  swapComponent,
} = questionComponentSlice.actions

export default questionComponentSlice.reducer
