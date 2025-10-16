import QuestionUpload from './index.tsx'
import { QuestionUploadDefaultProps } from './interface.ts'
import uploadProps from './upload-props.tsx'

export * from './interface.ts'

export default {
  title: '文件上传',
  type: 'question-upload',
  PropComponent: uploadProps,
  component: QuestionUpload,
  defaultProps: QuestionUploadDefaultProps,
}

