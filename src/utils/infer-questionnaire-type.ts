import { QuestionnaireType } from '@/constants/questionnaire-types'

/** 根据创建描述粗略推断问卷类型 */
export function inferQuestionnaireType(text: string): QuestionnaireType {
  if (/考试|测验|测评|考核/.test(text)) return QuestionnaireType.EXAM
  if (/投票|选举|评选/.test(text)) return QuestionnaireType.VOTE
  if (/报名|注册|登记|签到/.test(text)) return QuestionnaireType.REGISTRATION
  if (/反馈|意见|投诉|建议/.test(text)) return QuestionnaireType.FEEDBACK
  if (/调查|调研|满意度|问卷/.test(text)) return QuestionnaireType.SURVEY
  return QuestionnaireType.FORM
}
