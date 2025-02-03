import QuestionTitle from './index.tsx'
import { QuestionTitleDefaultData } from "./interface.ts"

export * from "./interface.ts"

export default {
    title: '标题',
    type: "question-title",
    component: QuestionTitle,
    defaultProps: QuestionTitleDefaultData
}
