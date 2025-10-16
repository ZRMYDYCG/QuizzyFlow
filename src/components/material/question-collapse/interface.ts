export interface IQuestionCollapseProps {
  title?: string
  content?: string
  defaultExpanded?: boolean
  expandText?: string
  collapseText?: string
  showIcon?: boolean
  bordered?: boolean
  onChange?: (newProps: IQuestionCollapseProps) => void
  disabled?: boolean
}

export const QuestionCollapseDefaultProps: IQuestionCollapseProps = {
  title: '点击展开查看详情',
  content: '这里是折叠的内容，可以放置较长的文本说明或详细信息。',
  defaultExpanded: false,
  expandText: '展开',
  collapseText: '收起',
  showIcon: true,
  bordered: true,
}

