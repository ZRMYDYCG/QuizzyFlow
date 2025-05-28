export interface IQuestionInfoProps {
  title?: string
  desc?: string

  onChange?: (newProps: IQuestionInfoProps) => void
  disabled?: boolean
}

export const QuestionDefaultProps: IQuestionInfoProps = {
  title: '文件标题',
  desc: '问卷描述',
}
