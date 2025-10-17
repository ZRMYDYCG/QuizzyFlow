/**
 * @description 锚点组件
 * */
export interface IAnchorItem {
  key: string
  href: string // #id
  title: string
}

export interface IQuestionAnchorProps {
  // 基础属性
  items?: IAnchorItem[]
  direction?: 'vertical' | 'horizontal'
  affix?: boolean // 是否固定
  offsetTop?: number // 距离顶部偏移量
  disabled?: boolean
  onChange?: (newProps: IQuestionAnchorProps) => void
}

export const QuestionAnchorDefaultData: IQuestionAnchorProps = {
  items: [
    { key: '1', href: '#section1', title: '第一部分' },
    { key: '2', href: '#section2', title: '第二部分' },
    { key: '3', href: '#section3', title: '第三部分' },
  ],
  direction: 'vertical',
  affix: true,
  offsetTop: 100,
  disabled: false,
}

