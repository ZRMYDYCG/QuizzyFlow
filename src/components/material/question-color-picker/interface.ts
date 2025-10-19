export interface IQuestionColorPickerProps {
  title?: string
  value?: string // 选中的颜色值 hex
  showText?: boolean // 是否显示颜色值文本
  allowClear?: boolean // 是否允许清除
  presets?: string[] // 预设颜色

  disabled?: boolean
  onChange?: (newProps: IQuestionColorPickerProps) => void
}

export const QuestionColorPickerDefaultProps: IQuestionColorPickerProps = {
  title: '请选择您喜欢的颜色',
  value: '#1890ff',
  showText: true,
  allowClear: true,
  presets: [
    '#ff0000', '#ff7f00', '#ffff00', '#00ff00',
    '#00ffff', '#0000ff', '#8b00ff', '#ff00ff',
    '#000000', '#808080', '#c0c0c0', '#ffffff',
  ],
}

export interface IColorPickerStatisticsProps {
  stat: Array<{ color: string; count: number }>
}

