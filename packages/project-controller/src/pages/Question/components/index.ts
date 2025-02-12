import type { FC } from "react"
import { IQuestionInputProps } from "./question-input"
import QuestionInputConfig from "./question-input"
import { IQuestionTitleProps } from "./question-title"
import QuestionTitleConfig from "./question-title"

// 各组件的 prop 类型
export type ComponentPropsType = IQuestionInputProps & IQuestionTitleProps

// 组件配置
export interface ComponentConfigType {
    title: string
    type: string
    component: FC<ComponentPropsType>
    defaultProps: ComponentPropsType
}

// 全部组件配置列表
const componentConfigList: ComponentConfigType[] = [
    QuestionInputConfig,
    QuestionTitleConfig,
]

export function getComponentConfigByType(type: string) {
    return componentConfigList.find(config => config.type === type)
}