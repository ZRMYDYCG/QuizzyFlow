import QuestionInput from './index.tsx'
import { QuestionInputDefaultData } from "./interface.ts"

export * from "./interface.ts"


export default {
    title: '输入框',
    type: "question-input",
    component: QuestionInput,
    defaultProps: QuestionInputDefaultData
}