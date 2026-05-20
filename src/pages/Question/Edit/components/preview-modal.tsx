import React from 'react'
import { Modal } from 'antd'
import { QuestionComponentType } from '@/store/modules/question-component'
import { IPageInfo } from '@/store/modules/pageinfo-reducer'
import {
  MaterialLinkageProvider,
  LinkedComponentRenderer,
} from '@/features/material-linkage'
import type { MaterialLinkageRule } from '@/features/material-linkage'

interface IPreviewModalProps {
  isOpen: boolean
  onOk: () => void
  onCancel: () => void
  componentList: QuestionComponentType[]
  pageInfo: IPageInfo
}

const PreviewModal: React.FC<IPreviewModalProps> = ({
  isOpen,
  onOk,
  onCancel,
  componentList,
  pageInfo,
}) => {
  const linkages = (pageInfo.linkages ?? []) as MaterialLinkageRule[]

  const getLayoutMargin = () => {
    switch (pageInfo.layout) {
      case 'left':
        return '0 auto 0 0'
      case 'right':
        return '0 0 0 auto'
      case 'center':
      default:
        return '0 auto'
    }
  }

  const parallaxStyle = pageInfo.parallaxEffect
    ? {
        backgroundAttachment: 'fixed',
        backgroundPosition: `${pageInfo.bgPosition || 'center'} center`,
      }
    : {}

  return (
    <Modal
      title="预览组卷"
      open={isOpen}
      onOk={onOk}
      onCancel={onCancel}
      width="90%"
      height="90vh"
      bodyStyle={{
        height: 'calc(90vh - 110px)',
        overflow: 'auto',
        padding: 0,
      }}
      centered
    >
      <div
        style={{
          padding: pageInfo.padding,
          backgroundImage: pageInfo.bgImage
            ? `url(${pageInfo.bgImage})`
            : 'none',
          backgroundSize: 'cover',
          backgroundRepeat: pageInfo.bgRepeat || 'no-repeat',
          backgroundPosition: pageInfo.bgPosition || 'center',
          ...parallaxStyle,
          minHeight: '100%',
        }}
      >
        <div
          style={{
            maxWidth: pageInfo.maxWidth || '100%',
            margin: getLayoutMargin(),
            transition: 'all 0.3s ease',
          }}
        >
          <MaterialLinkageProvider
            componentList={componentList}
            linkages={linkages}
            isAnswerMode
          >
            {componentList.map((item: QuestionComponentType) => (
              <div key={item.fe_id} className="m-[12px]">
                <LinkedComponentRenderer component={item} isAnswerMode />
              </div>
            ))}
          </MaterialLinkageProvider>
        </div>
      </div>
    </Modal>
  )
}

export default PreviewModal
