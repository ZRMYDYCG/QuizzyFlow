import type { FC } from 'react'
import { IQuestionInputProps } from './question-input'
import { IQuestionTitleProps } from './question-title'
import { IQuestionParagraphProps } from './question-paragraph'
import { IQuestionInfoProps } from './question-info'
import { IQuestionTextareaProps } from './question-textarea'
import {
  IQuestionRadioProps,
  IComponentsStatisticsProps,
} from './question-radio'
import {
  IQuestionCheckboxProps,
  ICheckboxStatisticsProps,
} from './question-checkbox'
import QuestionInputConfig from './question-input'
import QuestionTitleConfig from './question-title'
import QuestionParagraphConfig from './question-paragraph'
import QuestionInfoConfig from './question-info'
import QuestionTextareaConfig from './question-textarea'
import QuestionRadioConfig from './question-radio'
import QuestionCheckboxConfig from './question-checkbox'

// 各组件的 prop 类型
export type ComponentPropsType = IQuestionInputProps &
  IQuestionTitleProps &
  IQuestionParagraphProps &
  IQuestionInfoProps &
  IQuestionTextareaProps &
  IQuestionRadioProps &
  IQuestionCheckboxProps

// 各个组件的统计属性类型
export type ComponentsStatisticsType = IComponentsStatisticsProps &
  ICheckboxStatisticsProps

// 组件配置
export interface ComponentConfigType {
  title: string
  type: string
  component: FC<ComponentPropsType>
  PropComponent: FC<ComponentPropsType>
  defaultProps: ComponentPropsType
  StatisticsComponent?: FC<IComponentsStatisticsProps>
}

// 全部组件配置列表
const componentConfigList: ComponentConfigType[] = [
  QuestionInputConfig,
  QuestionTitleConfig,
  QuestionParagraphConfig,
  QuestionInfoConfig,
  QuestionTextareaConfig,
  QuestionRadioConfig as any,
  QuestionCheckboxConfig,
]

// 组件进行分组
export const componentConfigGroup = [
  {
    groupName: '文本显示',
    components: [
      QuestionTitleConfig,
      QuestionParagraphConfig,
      QuestionInfoConfig,
    ],
  },
  {
    groupName: '用户输入',
    components: [QuestionInputConfig, QuestionTextareaConfig],
  },
  {
    groupName: '用户选择',
    components: [QuestionRadioConfig, QuestionCheckboxConfig],
  },
]

export function getComponentConfigByType(type: string) {
  return componentConfigList.find(
    (config) => config.type === type
  ) as ComponentConfigType
}
