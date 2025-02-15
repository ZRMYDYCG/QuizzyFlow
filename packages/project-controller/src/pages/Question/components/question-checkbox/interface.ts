export interface OptionType {
  value: string
  text: string
  checked: boolean
}

export interface IQuestionCheckboxProps {
  title?: string
  isVertical?: boolean
  list: OptionType[]

  disabled?: boolean
  onChange?: (newProps: IQuestionCheckboxProps) => void
}

export const QuestionCheckboxDefaultProps: IQuestionCheckboxProps = {
  title: '多选标题',
  isVertical: false,
  list: [
    {
      value: 'option1',
      text: '选项1',
      checked: false,
    },
    {
      value: 'option2',
      text: '选项2',
      checked: false,
    },
    {
      value: 'option3',
      text: '选项3',
      checked: false,
    },
  ],
  disabled: false,
}
