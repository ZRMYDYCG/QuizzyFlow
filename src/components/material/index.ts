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
import { IQuestionMatrixProps } from './question-matrix'
import { IQuestionNPSProps } from './question-nps'
import { IQuestionRankingProps } from './question-ranking'
import { IQuestionEmojiPickerProps } from './question-emoji-picker'
import { IQuestionImageChoiceProps } from './question-image-choice'
import { IQuestionMultipageProgressProps } from './question-multipage-progress'
import { IQuestionSignatureProps } from './question-signature'
import { IQuestionStarRatingProps } from './question-star-rating'
import { IQuestionIconSelectProps } from './question-icon-select'
import { IQuestionConsentProps } from './question-consent'
import { IQuestionComparisonProps } from './question-comparison'
import { IQuestionColorPickerProps } from './question-color-picker'
import { IQuestionPainScaleProps } from './question-pain-scale'
import { IQuestionWordCloudProps } from './question-word-cloud'
import { IQuestionSwitchProps } from './question-switch'
import { IQuestionTimePickerProps } from './question-time-picker'
import { IQuestionNumberInputProps } from './question-number-input'
import { IQuestionPasswordInputProps } from './question-password-input'
import { IQuestionEmailInputProps } from './question-email-input'
import { IQuestionPhoneInputProps } from './question-phone-input'
import { IQuestionUrlInputProps } from './question-url-input'
import { IQuestionTagsInputProps } from './question-tags-input'
import { IQuestionRangePickerProps } from './question-range-picker'
import { IQuestionTimeRangePickerProps } from './question-time-range-picker'
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
import QuestionMatrixConfig from './question-matrix'
import QuestionNPSConfig from './question-nps'
import QuestionRankingConfig from './question-ranking'
import QuestionEmojiPickerConfig from './question-emoji-picker'
import QuestionImageChoiceConfig from './question-image-choice'
import QuestionMultipageProgressConfig from './question-multipage-progress'
import QuestionSignatureConfig from './question-signature'
import QuestionStarRatingConfig from './question-star-rating'
import QuestionIconSelectConfig from './question-icon-select'
import QuestionConsentConfig from './question-consent'
import QuestionComparisonConfig from './question-comparison'
import QuestionColorPickerConfig from './question-color-picker'
import QuestionPainScaleConfig from './question-pain-scale'
import QuestionWordCloudConfig from './question-word-cloud'
import QuestionSwitchConfig from './question-switch'
import QuestionTimePickerConfig from './question-time-picker'
import QuestionNumberInputConfig from './question-number-input'
import QuestionPasswordInputConfig from './question-password-input'
import QuestionEmailInputConfig from './question-email-input'
import QuestionPhoneInputConfig from './question-phone-input'
import QuestionUrlInputConfig from './question-url-input'
import QuestionTagsInputConfig from './question-tags-input'
import QuestionRangePickerConfig from './question-range-picker'
import QuestionTimeRangePickerConfig from './question-time-range-picker'

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
  IQuestionQRCodeProps &
  IQuestionMatrixProps &
  IQuestionNPSProps &
  IQuestionRankingProps &
  IQuestionEmojiPickerProps &
  IQuestionImageChoiceProps &
  IQuestionMultipageProgressProps &
  IQuestionSignatureProps &
  IQuestionStarRatingProps &
  IQuestionIconSelectProps &
  IQuestionConsentProps &
  IQuestionComparisonProps &
  IQuestionColorPickerProps &
  IQuestionPainScaleProps &
  IQuestionWordCloudProps &
  IQuestionSwitchProps &
  IQuestionTimePickerProps &
  IQuestionNumberInputProps &
  IQuestionPasswordInputProps &
  IQuestionEmailInputProps &
  IQuestionPhoneInputProps &
  IQuestionUrlInputProps &
  IQuestionTagsInputProps &
  IQuestionRangePickerProps &
  IQuestionTimeRangePickerProps

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
  QuestionMatrixConfig,
  QuestionNPSConfig,
  QuestionRankingConfig,
  QuestionEmojiPickerConfig,
  QuestionImageChoiceConfig,
  QuestionMultipageProgressConfig,
  QuestionSignatureConfig,
  QuestionStarRatingConfig,
  QuestionIconSelectConfig,
  QuestionConsentConfig,
  QuestionComparisonConfig,
  QuestionColorPickerConfig,
  QuestionPainScaleConfig,
  QuestionWordCloudConfig,
  QuestionSwitchConfig,
  QuestionTimePickerConfig,
  QuestionNumberInputConfig,
  QuestionPasswordInputConfig,
  QuestionEmailInputConfig,
  QuestionPhoneInputConfig,
  QuestionUrlInputConfig,
  QuestionTagsInputConfig,
  QuestionRangePickerConfig,
  QuestionTimeRangePickerConfig,
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
      QuestionNumberInputConfig,
      QuestionPasswordInputConfig,
      QuestionEmailInputConfig,
      QuestionPhoneInputConfig,
      QuestionUrlInputConfig,
      QuestionTagsInputConfig,
      QuestionRateConfig,
      QuestionSliderConfig,
      QuestionDateConfig,
      QuestionTimePickerConfig,
      QuestionRangePickerConfig,
      QuestionTimeRangePickerConfig,
      QuestionUploadConfig,
      QuestionButtonConfig,
      QuestionSwitchConfig,
      QuestionSignatureConfig,
      QuestionStarRatingConfig,
      QuestionColorPickerConfig,
      QuestionPainScaleConfig,
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
      QuestionMatrixConfig,
      QuestionNPSConfig,
      QuestionRankingConfig,
      QuestionEmojiPickerConfig,
      QuestionImageChoiceConfig,
      QuestionIconSelectConfig,
      QuestionComparisonConfig,
      QuestionWordCloudConfig,
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
      QuestionMultipageProgressConfig,
      QuestionConsentConfig,
    ],
  },
]

export function getComponentConfigByType(type: string) {
  return componentConfigList.find(
    (config) => config.type === type
  ) as ComponentConfigType
}
