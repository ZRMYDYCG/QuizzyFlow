export interface OptionType {
  value: string
  text: string
}

export interface IQuestionRadioProps {
  title?: string
  isVertical?: boolean
  options?: OptionType[]
  value?: string

  disabled?: boolean
  onChange?: (newProps: IQuestionRadioProps) => void
}

export const QuestionRadioDefaultProps = {
  title: '单选标题',
  isVertical: false,
  options: [
    {
      value: 1,
      text: '选项1',
    },
    {
      value: 2,
      text: '选项2',
    },
  ],
  value: '',
}

export interface IComponentsStatisticsProps {
  stat: Array<{ name: string; count: number }>
}
