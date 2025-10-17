import QuestionTransfer from './index.tsx'
import TransferProps from './transfer-props'
import { QuestionTransferDefaultData } from './interface.ts'

export * from './interface.ts'

export default {
  title: '穿梭框',
  type: 'question-transfer',
  // 编辑器组件
  PropComponent: TransferProps,
  // 画布显示的组件
  component: QuestionTransfer,
  defaultProps: {
    ...QuestionTransferDefaultData,
  },
}

