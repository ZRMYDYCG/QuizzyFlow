import type { FC } from 'react'
import { IQuestionInputProps } from './question-input'
import { IQuestionTitleProps } from './question-title'
import { IQuestionParagraphProps } from './question-paragraph'
import { IQuestionQuoteProps } from './question-quote'
import { IQuestionCodeProps } from './question-code'
import { IQuestionAlertProps } from './question-alert'
import { IQuestionListProps } from './question-list'
import { IQuestionDividerProps } from './question-divider'
import { IQuestionBadgeProps } from './question-badge'
import { IQuestionTimerProps } from './question-timer'
import { IQuestionMarqueeProps } from './question-marquee'
import { IQuestionCollapseProps } from './question-collapse'
import { IQuestionHighlightProps } from './question-highlight'
import { IQuestionImageProps } from './question-image'
import { IQuestionVideoProps } from './question-video'
import { IQuestionAudioProps } from './question-audio'
import { IQuestionRateProps } from './question-rate'
import { IQuestionSliderProps } from './question-slider'
import { IQuestionDateProps } from './question-date'
import { IQuestionUploadProps } from './question-upload'
import { IQuestionTableProps } from './question-table'
import { IQuestionProgressProps } from './question-progress'
import { IQuestionStepsProps } from './question-steps'
import { IQuestionInfoProps } from './question-info'
import { IQuestionTextareaProps } from './question-textarea'
import { IQuestionStatCardProps } from './question-statcard'
import { IQuestionTimelineProps } from './question-timeline'
import { IQuestionTreeProps } from './question-tree'
import { IQuestionTabsProps } from './question-tabs'
import { IQuestionCardGridProps } from './question-cardgrid'
import { IQuestionDescriptionsProps } from './question-descriptions'
import { IQuestionEmptyProps } from './question-empty'
import { IQuestionSkeletonProps } from './question-skeleton'
import { IQuestionResultProps } from './question-result'
import { IQuestionStatisticProps } from './question-statistic'
import { IQuestionButtonProps } from './question-button'
import { IQuestionLinkProps } from './question-link'
import { IQuestionDropdownProps } from './question-dropdown'
import { IQuestionMenuProps } from './question-menu'
import { IQuestionSelectProps } from './question-select'
import { IQuestionCascaderProps } from './question-cascader'
import { IQuestionAutocompleteProps } from './question-autocomplete'
import { IQuestionTransferProps } from './question-transfer'
import { IQuestionTooltipProps } from './question-tooltip'
import { IQuestionPopoverProps } from './question-popover'
import { IQuestionSpinProps } from './question-spin'
import {
  IQuestionRadioProps,
  IComponentsStatisticsProps,
} from './question-radio'
import {
  IQuestionCheckboxProps,
  ICheckboxStatisticsProps,
} from './question-checkbox'
import { IQuestionAnchorProps } from './question-anchor'
import { IQuestionQRCodeProps } from './question-qrcode'
import QuestionInputConfig from './question-input'
import QuestionTitleConfig from './question-title'
import QuestionParagraphConfig from './question-paragraph'
import QuestionQuoteConfig from './question-quote'
import QuestionCodeConfig from './question-code'
import QuestionAlertConfig from './question-alert'
import QuestionListConfig from './question-list'
import QuestionDividerConfig from './question-divider'
import QuestionBadgeConfig from './question-badge'
import QuestionTimerConfig from './question-timer'
import QuestionMarqueeConfig from './question-marquee'
import QuestionCollapseConfig from './question-collapse'
import QuestionHighlightConfig from './question-highlight'
import QuestionImageConfig from './question-image'
import QuestionVideoConfig from './question-video'
import QuestionAudioConfig from './question-audio'
import QuestionRateConfig from './question-rate'
import QuestionSliderConfig from './question-slider'
import QuestionDateConfig from './question-date'
import QuestionUploadConfig from './question-upload'
import QuestionTableConfig from './question-table'
import QuestionProgressConfig from './question-progress'
import QuestionStepsConfig from './question-steps'
import QuestionInfoConfig from './question-info'
import QuestionTextareaConfig from './question-textarea'
import QuestionRadioConfig from './question-radio'
import QuestionCheckboxConfig from './question-checkbox'
import QuestionStatCardConfig from './question-statcard'
import QuestionTimelineConfig from './question-timeline'
import QuestionTreeConfig from './question-tree'
import QuestionTabsConfig from './question-tabs'
import QuestionCardGridConfig from './question-cardgrid'
import QuestionDescriptionsConfig from './question-descriptions'
import QuestionEmptyConfig from './question-empty'
import QuestionSkeletonConfig from './question-skeleton'
import QuestionResultConfig from './question-result'
import QuestionStatisticConfig from './question-statistic'
import QuestionButtonConfig from './question-button'
import QuestionLinkConfig from './question-link'
import QuestionAnchorConfig from './question-anchor'
import QuestionDropdownConfig from './question-dropdown'
import QuestionMenuConfig from './question-menu'
import QuestionSelectConfig from './question-select'
import QuestionCascaderConfig from './question-cascader'
import QuestionAutocompleteConfig from './question-autocomplete'
import QuestionTransferConfig from './question-transfer'
import QuestionTooltipConfig from './question-tooltip'
import QuestionPopoverConfig from './question-popover'
import QuestionSpinConfig from './question-spin'
import QuestionModalConfig from './question-modal'
import QuestionDrawerConfig from './question-drawer'
import QuestionQRCodeConfig from './question-qrcode'

// 各组件的 prop 类型
export type ComponentPropsType = IQuestionInputProps &
  IQuestionTitleProps &
  IQuestionParagraphProps &
  IQuestionQuoteProps &
  IQuestionCodeProps &
  IQuestionAlertProps &
  IQuestionListProps &
  IQuestionDividerProps &
  IQuestionBadgeProps &
  IQuestionTimerProps &
  IQuestionMarqueeProps &
  IQuestionCollapseProps &
  IQuestionHighlightProps &
  IQuestionImageProps &
  IQuestionVideoProps &
  IQuestionAudioProps &
  IQuestionRateProps &
  IQuestionSliderProps &
  IQuestionDateProps &
  IQuestionUploadProps &
  IQuestionTableProps &
  IQuestionProgressProps &
  IQuestionStepsProps &
  IQuestionInfoProps &
  IQuestionTextareaProps &
  IQuestionRadioProps &
  IQuestionCheckboxProps &
  IQuestionStatCardProps &
  IQuestionTimelineProps &
  IQuestionTreeProps &
  IQuestionTabsProps &
  IQuestionCardGridProps &
  IQuestionDescriptionsProps &
  IQuestionEmptyProps &
  IQuestionSkeletonProps &
  IQuestionResultProps &
  IQuestionStatisticProps &
  IQuestionButtonProps &
  IQuestionLinkProps &
  IQuestionAnchorProps &
  IQuestionDropdownProps &
  IQuestionMenuProps &
  IQuestionSelectProps &
  IQuestionCascaderProps &
  IQuestionAutocompleteProps &
  IQuestionTransferProps &
  IQuestionTooltipProps &
  IQuestionPopoverProps &
  IQuestionSpinProps &
  IQuestionQRCodeProps

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
  QuestionQuoteConfig,
  QuestionCodeConfig,
  QuestionAlertConfig,
  QuestionListConfig,
  QuestionDividerConfig,
  QuestionBadgeConfig,
  QuestionTimerConfig,
  QuestionMarqueeConfig,
  QuestionCollapseConfig,
  QuestionHighlightConfig,
  QuestionImageConfig,
  QuestionVideoConfig,
  QuestionAudioConfig,
  QuestionRateConfig,
  QuestionSliderConfig,
  QuestionDateConfig,
  QuestionUploadConfig,
  QuestionTableConfig,
  QuestionProgressConfig,
  QuestionStepsConfig,
  QuestionInfoConfig,
  QuestionTextareaConfig,
  QuestionRadioConfig as any,
  QuestionCheckboxConfig,
  QuestionStatCardConfig,
  QuestionTimelineConfig,
  QuestionTreeConfig,
  QuestionTabsConfig,
  QuestionCardGridConfig,
  QuestionDescriptionsConfig,
  QuestionEmptyConfig,
  QuestionSkeletonConfig,
  QuestionResultConfig,
  QuestionStatisticConfig,
  QuestionButtonConfig,
  QuestionLinkConfig,
  QuestionAnchorConfig,
  QuestionDropdownConfig,
  QuestionMenuConfig,
  QuestionSelectConfig,
  QuestionCascaderConfig,
  QuestionAutocompleteConfig,
  QuestionTransferConfig,
  QuestionTooltipConfig,
  QuestionPopoverConfig,
  QuestionSpinConfig,
  QuestionModalConfig,
  QuestionDrawerConfig,
  QuestionQRCodeConfig,
]

// 组件进行分组
export const componentConfigGroup = [
  {
    groupName: '文本显示',
    components: [
      QuestionTitleConfig,
      QuestionParagraphConfig,
      QuestionQuoteConfig,
      QuestionCodeConfig,
      QuestionAlertConfig,
      QuestionListConfig,
      QuestionDividerConfig,
      QuestionBadgeConfig,
      QuestionTimerConfig,
      QuestionMarqueeConfig,
      QuestionCollapseConfig,
      QuestionHighlightConfig,
      QuestionInfoConfig,
      QuestionLinkConfig,
    ],
  },
  {
    groupName: '数据展示',
    components: [
      QuestionStatCardConfig,
      QuestionStatisticConfig,
      QuestionTimelineConfig,
      QuestionTreeConfig,
      QuestionDescriptionsConfig,
      QuestionCardGridConfig,
      QuestionTabsConfig,
      QuestionTableConfig,
      QuestionProgressConfig,
      QuestionStepsConfig,
      QuestionQRCodeConfig,
    ],
  },
  {
    groupName: '媒体展示',
    components: [
      QuestionImageConfig,
      QuestionVideoConfig,
      QuestionAudioConfig,
    ],
  },
  {
    groupName: '用户输入',
    components: [
      QuestionInputConfig,
      QuestionTextareaConfig,
      QuestionRateConfig,
      QuestionSliderConfig,
      QuestionDateConfig,
      QuestionUploadConfig,
      QuestionButtonConfig,
    ],
  },
  {
    groupName: '导航组件',
    components: [QuestionAnchorConfig, QuestionDropdownConfig, QuestionMenuConfig],
  },
  {
    groupName: '用户选择',
    components: [
      QuestionRadioConfig,
      QuestionCheckboxConfig,
      QuestionSelectConfig,
      QuestionCascaderConfig,
      QuestionAutocompleteConfig,
      QuestionTransferConfig,
    ],
  },
  {
    groupName: '反馈提示',
    components: [
      QuestionEmptyConfig,
      QuestionSkeletonConfig,
      QuestionResultConfig,
      QuestionTooltipConfig,
      QuestionPopoverConfig,
      QuestionSpinConfig,
      QuestionModalConfig,
      QuestionDrawerConfig,
    ],
  },
]

export function getComponentConfigByType(type: string) {
  return componentConfigList.find(
    (config) => config.type === type
  ) as ComponentConfigType
}
