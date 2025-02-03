/**
 * @description 输入框组件
 * */
export interface IQuestionInputProps {
    // 输入框标题
    title?: string
    // 输入框提示信息
    placeholder?: string
}

export const QuestionInputDefaultData: IQuestionInputProps = {
    // 输入框标题
    title: '输入框标题',
    // 输入框提示信息
    placeholder: '请输入内容...',
}