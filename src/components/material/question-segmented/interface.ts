/**
 * @description 分段控制器组件
 * */
export interface SegmentedOption {
  label: string
  value: string
  icon?: string
}

export interface IQuestionSegmentedProps {
  // 分段控制器标题
  title?: string
  // 选项列表
  options?: SegmentedOption[]
  // 是否禁用
  disabled?: boolean
  // 是否块级显示
  block?: boolean
  // 尺寸
  size?: 'large' | 'middle' | 'small'
  onChange?: (value: IQuestionSegmentedProps) => void
}

export const QuestionSegmentedDefaultData: IQuestionSegmentedProps = {
  title: '分段选择',
  options: [
    { label: '选项一', value: '1' },
    { label: '选项二', value: '2' },
    { label: '选项三', value: '3' },
  ],
  disabled: false,
  block: false,
  size: 'middle',
}

