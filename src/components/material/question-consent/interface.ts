export interface IQuestionConsentProps {
  title?: string
  content?: string // 协议内容
  linkText?: string // 链接文字
  linkUrl?: string // 链接地址
  required?: boolean // 是否必须同意
  checked?: boolean // 是否已同意

  disabled?: boolean
  onChange?: (newProps: IQuestionConsentProps) => void
}

export const QuestionConsentDefaultProps: IQuestionConsentProps = {
  title: '隐私政策与用户协议',
  content: '我已阅读并同意',
  linkText: '《隐私政策》和《用户协议》',
  linkUrl: 'https://example.com/privacy',
  required: true,
  checked: false,
}

