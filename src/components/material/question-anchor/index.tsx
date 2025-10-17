import React from 'react'
import type { IQuestionAnchorProps } from './interface.ts'
import { QuestionAnchorDefaultData } from './interface.ts'
import { Anchor } from 'antd'

const QuestionAnchor: React.FC<IQuestionAnchorProps> = (
  props: IQuestionAnchorProps
) => {
  const { items, direction, affix, offsetTop } = {
    ...QuestionAnchorDefaultData,
    ...props,
  }

  // 处理点击事件
  const handleClick = (
    e: React.MouseEvent<HTMLElement>,
    link: { title: React.ReactNode; href: string }
  ) => {
    e.preventDefault()
    const element = document.querySelector(link.href)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  // 转换为 Ant Design Anchor 需要的格式
  const anchorItems = items?.map((item) => ({
    key: item.key,
    href: item.href,
    title: item.title,
  }))

  return (
    <Anchor
      direction={direction}
      affix={affix}
      offsetTop={offsetTop}
      items={anchorItems}
      onClick={handleClick}
    />
  )
}

export default QuestionAnchor

