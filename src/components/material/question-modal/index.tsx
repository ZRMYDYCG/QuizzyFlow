import React, { useState } from 'react'
import type { IQuestionModalProps } from './interface.ts'
import { QuestionModalDefaultData } from './interface.ts'
import { Modal, Button } from 'antd'

const QuestionModal: React.FC<IQuestionModalProps> = (
  props: IQuestionModalProps
) => {
  const { title, content, footer, width, centered, okText, cancelText, closable } = {
    ...QuestionModalDefaultData,
    ...props,
  }

  const [open, setOpen] = useState(false)

  return (
    <>
      <Button type="primary" onClick={() => setOpen(true)}>
        打开对话框
      </Button>
      <Modal
        title={title}
        open={open}
        onOk={() => setOpen(false)}
        onCancel={() => setOpen(false)}
        width={width}
        centered={centered}
        okText={okText}
        cancelText={cancelText}
        closable={closable}
        footer={footer ? undefined : null}
      >
        <div>{content}</div>
      </Modal>
    </>
  )
}

export default QuestionModal


