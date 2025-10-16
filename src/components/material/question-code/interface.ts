export interface IQuestionCodeProps {
  code?: string
  language?: string
  showLineNumbers?: boolean
  theme?: 'light' | 'dark'
  title?: string
  showCopyButton?: boolean
  onChange?: (newProps: IQuestionCodeProps) => void
  disabled?: boolean
}

export const QuestionCodeDefaultProps: IQuestionCodeProps = {
  code: '// 在此输入代码\nfunction hello() {\n  console.log("Hello World!");\n}',
  language: 'javascript',
  showLineNumbers: true,
  theme: 'light',
  title: '',
  showCopyButton: true,
}

