import type { FC } from 'react'
import { IQuestionInputProps } from './question-input/index.ts'
import { IQuestionTitleProps } from './question-title/index.ts'
import { IQuestionParagraphProps } from './question-paragraph/index.ts'
import { IQuestionInfoProps } from './question-info/index.ts'
import { IQuestionTextareaProps } from './question-textarea/index.ts'
import {
  IQuestionRadioProps,
  IComponentsStatisticsProps,
} from './question-radio/index.ts'
import {
  IQuestionCheckboxProps,
  ICheckboxStatisticsProps,
} from './question-checkbox/index.ts'
import QuestionInputConfig from './question-input/index.ts'
import QuestionTitleConfig from './question-title/index.ts'
import QuestionParagraphConfig from './question-paragraph/index.ts'
import QuestionInfoConfig from './question-info/index.ts'
import QuestionTextareaConfig from './question-textarea/index.ts'
import QuestionRadioConfig from './question-radio/index.ts'
import QuestionCheckboxConfig from './question-checkbox/index.ts'

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
  statisticsComponent?: FC<ComponentsStatisticsType>
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
