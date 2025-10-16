export interface IStepItem {
  title: string
  description?: string
}

export interface IQuestionStepsProps {
  steps?: IStepItem[]
  current?: number
  direction?: 'horizontal' | 'vertical'
  size?: 'default' | 'small'
  onChange?: (newProps: IQuestionStepsProps) => void
  disabled?: boolean
}

export const QuestionStepsDefaultProps: IQuestionStepsProps = {
  steps: [
    { title: '步骤一', description: '这是步骤一的说明' },
    { title: '步骤二', description: '这是步骤二的说明' },
    { title: '步骤三', description: '这是步骤三的说明' },
  ],
  current: 0,
  direction: 'vertical',
  size: 'default',
}

