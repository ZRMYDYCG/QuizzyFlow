import QuestionModal from './index.tsx'
import ModalProps from './modal-props'
import { QuestionModalDefaultData } from './interface.ts'

export * from './interface.ts'

export default {
  title: '对话框',
  type: 'question-modal',
  // 编辑器组件
  PropComponent: ModalProps,
  // 画布显示的组件
  component: QuestionModal,
  defaultProps: {
    ...QuestionModalDefaultData,
  },
}


