import type { FC } from 'react'
import { IQuestionInputProps } from './question-input'
import { IQuestionTitleProps } from './question-title'
import { IQuestionParagraphProps } from './question-paragraph'
import QuestionInputConfig from './question-input'
import QuestionTitleConfig from './question-title'
import QuestionParagraphConfig from './question-paragraph'

// 各组件的 prop 类型
export type ComponentPropsType = IQuestionInputProps &
  IQuestionTitleProps &
  IQuestionParagraphProps

// 组件配置
export interface ComponentConfigType {
  title: string
  type: string
  component: FC<ComponentPropsType>
  PropComponent: FC<ComponentPropsType>
  defaultProps: ComponentPropsType
}

// 全部组件配置列表
const componentConfigList: ComponentConfigType[] = [
  QuestionInputConfig,
  QuestionTitleConfig,
  QuestionParagraphConfig,
]

// 组件进行分组
export const componentConfigGroup = [
  {
    groupName: '文本显示',
    components: [QuestionTitleConfig, QuestionParagraphConfig],
  },
  {
    groupName: '用户输入',
    components: [QuestionInputConfig],
  },
]

export function getComponentConfigByType(type: string) {
  return componentConfigList.find(
    (config) => config.type === type
  ) as ComponentConfigType
}
