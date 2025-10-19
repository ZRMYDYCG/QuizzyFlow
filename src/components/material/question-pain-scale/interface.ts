export interface PainLevelType {
  value: number
  label: string
  color: string
  face: string // emoji 表情
}

export interface IQuestionPainScaleProps {
  title?: string
  value?: number // 0-10
  showFaces?: boolean // 是否显示表情
  showDescription?: boolean // 是否显示描述

  disabled?: boolean
  onChange?: (newProps: IQuestionPainScaleProps) => void
}

export const QuestionPainScaleDefaultProps: IQuestionPainScaleProps = {
  title: '请评估您当前的疼痛程度',
  value: 0,
  showFaces: true,
  showDescription: true,
}

// 标准疼痛等级
export const PAIN_LEVELS: PainLevelType[] = [
  { value: 0, label: '无痛', color: '#52c41a', face: '😊' },
  { value: 1, label: '轻微不适', color: '#73d13d', face: '🙂' },
  { value: 2, label: '轻度疼痛', color: '#95de64', face: '😐' },
  { value: 3, label: '不适', color: '#bae637', face: '😕' },
  { value: 4, label: '中度疼痛', color: '#fadb14', face: '😣' },
  { value: 5, label: '明显疼痛', color: '#ffc53d', face: '😖' },
  { value: 6, label: '较重疼痛', color: '#ffec3d', face: '😫' },
  { value: 7, label: '严重疼痛', color: '#ffa940', face: '😩' },
  { value: 8, label: '非常严重', color: '#ff7a45', face: '😭' },
  { value: 9, label: '极度疼痛', color: '#ff4d4f', face: '😰' },
  { value: 10, label: '难以忍受', color: '#cf1322', face: '😱' },
]

export interface IPainScaleStatisticsProps {
  stat: {
    average: number
    distribution: Record<number, number>
  }
}

