/**
 * @description 二维码组件
 * */
export interface IQuestionQRCodeProps {
  // 基础属性
  value?: string // 二维码内容
  size?: number // 尺寸
  level?: 'L' | 'M' | 'Q' | 'H' // 容错级别
  bgColor?: string // 背景色
  fgColor?: string // 前景色
  includeMargin?: boolean // 是否包含边距
  logo?: string // 中心logo
  logoSize?: number // logo尺寸
  align?: 'left' | 'center' | 'right' // 对齐方式
  description?: string // 描述文字
  onChange?: (newProps: IQuestionQRCodeProps) => void
}

export const QuestionQRCodeDefaultData: IQuestionQRCodeProps = {
  value: 'https://example.com',
  size: 200,
  level: 'M',
  bgColor: '#FFFFFF',
  fgColor: '#000000',
  includeMargin: true,
  logo: '',
  logoSize: 40,
  align: 'center',
  description: '扫描二维码',
}

