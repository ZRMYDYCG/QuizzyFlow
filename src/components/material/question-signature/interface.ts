export interface IQuestionSignatureProps {
  title?: string
  width?: number // 签名板宽度
  height?: number // 签名板高度
  backgroundColor?: string // 背景色
  penColor?: string // 笔迹颜色
  penWidth?: number // 笔迹粗细
  value?: string // base64格式的签名图片

  disabled?: boolean
  onChange?: (newProps: IQuestionSignatureProps) => void
}

export const QuestionSignatureDefaultProps: IQuestionSignatureProps = {
  title: '请在下方签名',
  width: 600,
  height: 300,
  backgroundColor: '#ffffff',
  penColor: '#000000',
  penWidth: 2,
  value: '',
}

