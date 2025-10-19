export interface ImageOptionType {
  value: string
  imageUrl: string
  label?: string
}

export interface IQuestionImageChoiceProps {
  title?: string
  options?: ImageOptionType[]
  isMultiple?: boolean // 是否多选
  value?: string // 单选值
  values?: string[] // 多选值
  columns?: number // 每行显示几列
  showLabel?: boolean // 是否显示标签

  disabled?: boolean
  onChange?: (newProps: IQuestionImageChoiceProps) => void
}

export const QuestionImageChoiceDefaultProps: IQuestionImageChoiceProps = {
  title: '请选择您喜欢的选项',
  isMultiple: false,
  columns: 3,
  showLabel: true,
  value: '',
  values: [],
  options: [
    {
      value: 'opt1',
      imageUrl: 'https://via.placeholder.com/300x200?text=Option+1',
      label: '选项1',
    },
    {
      value: 'opt2',
      imageUrl: 'https://via.placeholder.com/300x200?text=Option+2',
      label: '选项2',
    },
    {
      value: 'opt3',
      imageUrl: 'https://via.placeholder.com/300x200?text=Option+3',
      label: '选项3',
    },
  ],
}

export interface IImageChoiceStatisticsProps {
  stat: Array<{ name: string; count: number; imageUrl: string }>
}

