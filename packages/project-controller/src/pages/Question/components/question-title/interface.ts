/**
 * @description 标题组件
 * */
export interface IQuestionTitleProps {
  // 标题内容
  text?: string
  // 标题级别
  level?: 1 | 2 | 3 | 4 | 5
  // 是否居中
  isCenter?: boolean
  // 改变
  onChange?: (newProps: IQuestionTitleProps) => void
}

export const QuestionTitleDefaultData: IQuestionTitleProps = {
  text: '定义标题',
  level: 1,
  isCenter: false,
}
