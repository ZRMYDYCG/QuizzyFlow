import type { FC } from 'react'
import { IQuestionInputProps } from './question-input'
import { IQuestionTextareaProps } from './question-textarea'
import { IQuestionSearchInputProps } from './question-search-input'
import { IQuestionNumberInputProps } from './question-number-input'
import { IQuestionPasswordInputProps } from './question-password-input'
import { IQuestionEmailInputProps } from './question-email-input'
import { IQuestionPhoneInputProps } from './question-phone-input'
import { IQuestionUrlInputProps } from './question-url-input'
import { IQuestionMentionsProps } from './question-mentions'
import { IQuestionMentionTextareaProps } from './question-mention-textarea'
import { IQuestionOtpInputProps } from './question-otp-input'
import { IQuestionTagsInputProps } from './question-tags-input'
import { IQuestionRateProps } from './question-rate'
import { IQuestionSliderProps } from './question-slider'
import { IQuestionRangeSliderProps } from './question-range-slider'
import { IQuestionDateProps } from './question-date'
import { IQuestionTimePickerProps } from './question-time-picker'
import { IQuestionWeekPickerProps } from './question-week-picker'
import { IQuestionMonthPickerProps } from './question-month-picker'
import { IQuestionYearPickerProps } from './question-year-picker'
import { IQuestionRangePickerProps } from './question-range-picker'
import { IQuestionTimeRangePickerProps } from './question-time-range-picker'
import {
  IQuestionRadioProps,
  IComponentsStatisticsProps,
} from './question-radio'
import {
  IQuestionCheckboxProps,
  ICheckboxStatisticsProps,
} from './question-checkbox'
import { IQuestionSegmentedProps } from './question-segmented'
import { IQuestionSelectProps } from './question-select'
import { IQuestionCascaderProps } from './question-cascader'
import { IQuestionTreeSelectProps } from './question-tree-select'
import { IQuestionAutocompleteProps } from './question-autocomplete'

import QuestionInputConfig from './question-input'
import QuestionTextareaConfig from './question-textarea'
import QuestionSearchInputConfig from './question-search-input'
import QuestionNumberInputConfig from './question-number-input'
import QuestionPasswordInputConfig from './question-password-input'
import QuestionEmailInputConfig from './question-email-input'
import QuestionPhoneInputConfig from './question-phone-input'
import QuestionUrlInputConfig from './question-url-input'
import QuestionMentionsConfig from './question-mentions'
import QuestionMentionTextareaConfig from './question-mention-textarea'
import QuestionOtpInputConfig from './question-otp-input'
import QuestionTagsInputConfig from './question-tags-input'
import QuestionRateConfig from './question-rate'
import QuestionSliderConfig from './question-slider'
import QuestionRangeSliderConfig from './question-range-slider'
import QuestionDateConfig from './question-date'
import QuestionTimePickerConfig from './question-time-picker'
import QuestionWeekPickerConfig from './question-week-picker'
import QuestionMonthPickerConfig from './question-month-picker'
import QuestionYearPickerConfig from './question-year-picker'
import QuestionRangePickerConfig from './question-range-picker'
import QuestionTimeRangePickerConfig from './question-time-range-picker'
import QuestionRadioConfig from './question-radio'
import QuestionCheckboxConfig from './question-checkbox'
import QuestionSegmentedConfig from './question-segmented'
import QuestionSelectConfig from './question-select'
import QuestionCascaderConfig from './question-cascader'
import QuestionTreeSelectConfig from './question-tree-select'
import QuestionAutocompleteConfig from './question-autocomplete'

export type ComponentPropsType = IQuestionInputProps &
  IQuestionTextareaProps &
  IQuestionSearchInputProps &
  IQuestionNumberInputProps &
  IQuestionPasswordInputProps &
  IQuestionEmailInputProps &
  IQuestionPhoneInputProps &
  IQuestionUrlInputProps &
  IQuestionMentionsProps &
  IQuestionMentionTextareaProps &
  IQuestionOtpInputProps &
  IQuestionTagsInputProps &
  IQuestionRateProps &
  IQuestionSliderProps &
  IQuestionRangeSliderProps &
  IQuestionDateProps &
  IQuestionTimePickerProps &
  IQuestionWeekPickerProps &
  IQuestionMonthPickerProps &
  IQuestionYearPickerProps &
  IQuestionRangePickerProps &
  IQuestionTimeRangePickerProps &
  IQuestionRadioProps &
  IQuestionCheckboxProps &
  IQuestionSegmentedProps &
  IQuestionSelectProps &
  IQuestionCascaderProps &
  IQuestionTreeSelectProps &
  IQuestionAutocompleteProps

export type ComponentsStatisticsType = IComponentsStatisticsProps &
  ICheckboxStatisticsProps

export interface ComponentConfigType {
  title: string
  type: string
  component: FC<ComponentPropsType>
  PropComponent: FC<ComponentPropsType>
  defaultProps: ComponentPropsType
  statisticsComponent?: FC<ComponentsStatisticsType>
}

const componentConfigList: ComponentConfigType[] = [
  QuestionInputConfig,
  QuestionTextareaConfig,
  QuestionSearchInputConfig,
  QuestionNumberInputConfig,
  QuestionPasswordInputConfig,
  QuestionEmailInputConfig,
  QuestionPhoneInputConfig,
  QuestionUrlInputConfig,
  QuestionMentionsConfig,
  QuestionMentionTextareaConfig,
  QuestionOtpInputConfig,
  QuestionTagsInputConfig,
  QuestionRateConfig,
  QuestionSliderConfig,
  QuestionRangeSliderConfig,
  QuestionDateConfig,
  QuestionTimePickerConfig,
  QuestionWeekPickerConfig,
  QuestionMonthPickerConfig,
  QuestionYearPickerConfig,
  QuestionRangePickerConfig,
  QuestionTimeRangePickerConfig,
  QuestionRadioConfig as ComponentConfigType,
  QuestionCheckboxConfig,
  QuestionSegmentedConfig,
  QuestionSelectConfig,
  QuestionCascaderConfig,
  QuestionTreeSelectConfig,
  QuestionAutocompleteConfig,
]

export const componentConfigGroup = [
  {
    groupName: '基础输入',
    components: [
      QuestionInputConfig,
      QuestionTextareaConfig,
      QuestionSearchInputConfig,
      QuestionNumberInputConfig,
      QuestionPasswordInputConfig,
      QuestionEmailInputConfig,
      QuestionPhoneInputConfig,
      QuestionUrlInputConfig,
      QuestionMentionsConfig,
      QuestionMentionTextareaConfig,
      QuestionOtpInputConfig,
      QuestionTagsInputConfig,
    ],
  },
  {
    groupName: '数值与评分',
    components: [
      QuestionRateConfig,
      QuestionSliderConfig,
      QuestionRangeSliderConfig,
    ],
  },
  {
    groupName: '日期时间',
    components: [
      QuestionDateConfig,
      QuestionTimePickerConfig,
      QuestionWeekPickerConfig,
      QuestionMonthPickerConfig,
      QuestionYearPickerConfig,
      QuestionRangePickerConfig,
      QuestionTimeRangePickerConfig,
    ],
  },
  {
    groupName: '选择与下拉',
    components: [
      QuestionRadioConfig as ComponentConfigType,
      QuestionCheckboxConfig,
      QuestionSegmentedConfig,
      QuestionSelectConfig,
      QuestionCascaderConfig,
      QuestionTreeSelectConfig,
      QuestionAutocompleteConfig,
    ],
  },
]

export function getComponentConfigByType(
  type: string
): ComponentConfigType | undefined {
  return componentConfigList.find((config) => config.type === type)
}

export function isComponentTypeSupported(type: string): boolean {
  return componentConfigList.some((config) => config.type === type)
}
