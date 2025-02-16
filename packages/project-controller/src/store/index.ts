import { configureStore } from '@reduxjs/toolkit'
import userReducer from './modules/user.ts'
import { IUserState } from './modules/user.ts'
import questionReducer from './modules/question-component.ts'
import { QuestionComponentStateType } from './modules/question-component.ts'
import pageInfoReducer from './modules/pageinfo-reducer.ts'
import { IPageInfo } from './modules/pageinfo-reducer.ts'
import undoable, { excludeAction, StateWithHistory } from 'redux-undo'

export interface stateType {
  user: IUserState
  questionComponent: StateWithHistory<QuestionComponentStateType>
  pageInfo: IPageInfo
}

export default configureStore({
  reducer: {
    // 用户模块
    user: userReducer,
    // 组件列表模块
    // questionComponent: questionReducer,
    questionComponent: undoable(questionReducer, {
      limit: 20,
      filter: excludeAction([
        'questionComponent/resetComponents',
        'questionComponent/changeSelectedId',
        'questionComponent/selectPrevComponent',
        'questionComponent/selectNextComponent',
      ]),
    }),
    // 问卷信息模块
    pageInfo: pageInfoReducer,
  },
})
