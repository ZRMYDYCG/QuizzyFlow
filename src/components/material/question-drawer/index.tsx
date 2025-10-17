import React, { useState } from 'react'
import type { IQuestionDrawerProps } from './interface.ts'
import { QuestionDrawerDefaultData } from './interface.ts'
import { Drawer, Button } from 'antd'

const QuestionDrawer: React.FC<IQuestionDrawerProps> = (
  props: IQuestionDrawerProps
) => {
  const { title, content, placement, width, height, closable, mask, maskClosable } = {
    ...QuestionDrawerDefaultData,
    ...props,
  }

  const [open, setOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setOpen(true)}>打开抽屉</Button>
      <Drawer
        title={title}
        open={open}
        onClose={() => setOpen(false)}
        placement={placement}
        width={width}
        height={height as number}
        closable={closable}
        mask={mask}
        maskClosable={maskClosable}
      >
        <div>{content}</div>
      </Drawer>
    </>
  )
}

export default QuestionDrawer


