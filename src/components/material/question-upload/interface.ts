export interface IQuestionUploadProps {
  label?: string
  accept?: string
  maxCount?: number
  maxSize?: number
  listType?: 'text' | 'picture' | 'picture-card'
  multiple?: boolean
  drag?: boolean
  onChange?: (newProps: IQuestionUploadProps) => void
  disabled?: boolean
}

export const QuestionUploadDefaultProps: IQuestionUploadProps = {
  label: '上传文件',
  accept: '*',
  maxCount: 5,
  maxSize: 10,
  listType: 'text',
  multiple: true,
  drag: false,
}

