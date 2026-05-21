/** 已登录用户可选的填写身份方式 */
export type RespondentIdentityMode = 'account' | 'anonymous' | 'custom'

export const ANONYMOUS_DISPLAY_NAME = '匿名用户'

export interface RespondentIdentityState {
  mode: RespondentIdentityMode
  customName: string
}

export interface ResolvedRespondent {
  respondentName: string
  isAnonymous: boolean
  respondentUsername?: string
}
