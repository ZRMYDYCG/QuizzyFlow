import QuestionQRCode from './index.tsx'
import QRCodeProps from './qrcode-props'
import { QuestionQRCodeDefaultData } from './interface.ts'

export * from './interface.ts'

export default {
  title: '二维码',
  type: 'question-qrcode',
  // 编辑器组件
  PropComponent: QRCodeProps,
  // 画布显示的组件
  component: QuestionQRCode,
  defaultProps: {
    ...QuestionQRCodeDefaultData,
  },
}

