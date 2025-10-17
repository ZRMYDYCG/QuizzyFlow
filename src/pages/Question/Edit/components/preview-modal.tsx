import React from 'react'
import { Modal } from 'antd'
import { getComponentConfigByType } from '@/components/material'
import { QuestionComponentType } from '@/store/modules/question-component'
import { IPageInfo } from '@/store/modules/pageinfo-reducer'

interface IPreviewModalProps {
  isOpen: boolean
  onOk: () => void
  onCancel: () => void
  componentList: QuestionComponentType[]
  pageInfo: IPageInfo
}

function genComponent(componentInfo: QuestionComponentType) {
  const { type, props } = componentInfo
  const componentConfig = getComponentConfigByType(type)

  if (componentConfig === null) return null

  const { component: Component } = componentConfig

  return (
    <div key={componentInfo.fe_id}>
      <Component {...props} />
    </div>
  )
}

const PreviewModal: React.FC<IPreviewModalProps> = ({
  isOpen,
  onOk,
  onCancel,
  componentList,
  pageInfo,
}) => {
  // 计算布局方向对应的margin
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

  // 视差滚动效果
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
          {componentList
            .filter((item: any) => !item.isHidden)
            .map((item: QuestionComponentType) => {
              return (
                <div key={item.fe_id} className="m-[12px]">
                  {genComponent(item)}
                </div>
              )
            })}
        </div>
      </div>
    </Modal>
  )
}

export default PreviewModal
