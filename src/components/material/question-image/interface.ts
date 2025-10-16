export interface IQuestionImageProps {
  src?: string
  alt?: string
  width?: number
  height?: number
  borderRadius?: number
  bordered?: boolean
  borderColor?: string
  fit?: 'fill' | 'contain' | 'cover' | 'none' | 'scale-down'
  preview?: boolean
  onChange?: (newProps: IQuestionImageProps) => void
  disabled?: boolean
}

export const QuestionImageDefaultProps: IQuestionImageProps = {
  src: 'https://cdn-docs-new.pingcode.com/baike/wp-content/uploads/2024/10/7e7408434abfe70d5c58159c3014e5c3.webp',
  alt: '图片',
  width: 400,
  height: 300,
  borderRadius: 8,
  bordered: false,
  borderColor: '#d9d9d9',
  fit: 'cover',
  preview: true,
}

