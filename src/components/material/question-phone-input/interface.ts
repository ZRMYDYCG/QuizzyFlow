/**
 * @description 电话输入框组件
 * */
export interface IQuestionPhoneInputProps {
  // 电话输入框标题
  title?: string
  // 提示信息
  placeholder?: string
  // 国家/地区代码
  countryCode?: string
  // 是否显示国家代码选择器
  showCountryCode?: boolean
  // 是否禁用
  disabled?: boolean
  onChange?: (value: IQuestionPhoneInputProps) => void
}

export const QuestionPhoneInputDefaultData: IQuestionPhoneInputProps = {
  title: '手机号码',
  placeholder: '请输入手机号码',
  countryCode: '+86',
  showCountryCode: true,
  disabled: false,
}

