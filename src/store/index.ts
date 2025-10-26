import { configureStore } from '@reduxjs/toolkit'
import userReducer from './modules/user.ts'
import { IUserState } from './modules/user.ts'
import questionReducer from './modules/question-component.ts'
import { QuestionComponentStateType } from './modules/question-component.ts'
import pageInfoReducer from './modules/pageinfo-reducer.ts'
import { IPageInfo } from './modules/pageinfo-reducer.ts'
import editorLayoutReducer from './modules/editor-layout.ts'
import { EditorLayoutState } from './modules/editor-layout.ts'
import canvasConfigReducer from './modules/canvas-config.ts'
import { CanvasConfigState } from './modules/canvas-config.ts'
import adminReducer from './modules/admin.ts'
import { IAdminState } from './modules/admin.ts'
import undoable, { excludeAction, StateWithHistory } from 'redux-undo'

export interface stateType {
  user: IUserState
  questionComponent: StateWithHistory<QuestionComponentStateType>
  pageInfo: IPageInfo
  editorLayout: EditorLayoutState
  canvasConfig: CanvasConfigState
  admin: IAdminState
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
    // 编辑器布局模块
    editorLayout: editorLayoutReducer,
    // 画布配置模块
    canvasConfig: canvasConfigReducer,
    // 管理员模块
    admin: adminReducer,
  },
})
