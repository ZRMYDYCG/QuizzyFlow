import React from 'react'
import type { IQuestionQRCodeProps } from './interface.ts'
import { QuestionQRCodeDefaultData } from './interface.ts'
import { QRCodeCanvas } from 'qrcode.react'

const QuestionQRCode: React.FC<IQuestionQRCodeProps> = (
  props: IQuestionQRCodeProps
) => {
  const {
    value,
    size,
    level,
    bgColor,
    fgColor,
    includeMargin,
    logo,
    logoSize,
    align,
    description,
  } = {
    ...QuestionQRCodeDefaultData,
    ...props,
  }

  const alignStyle = {
    left: 'flex-start',
    center: 'center',
    right: 'flex-end',
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: alignStyle[align || 'center'],
        gap: '12px',
      }}
    >
      <div
        style={{
          display: 'inline-block',
          padding: includeMargin ? '16px' : '0',
          backgroundColor: bgColor,
          borderRadius: '8px',
        }}
      >
        <QRCodeCanvas
          value={value || ''}
          size={size}
          level={level}
          bgColor={bgColor}
          fgColor={fgColor}
          includeMargin={false}
          imageSettings={
            logo
              ? {
                  src: logo,
                  height: logoSize || 40,
                  width: logoSize || 40,
                  excavate: true,
                }
              : undefined
          }
        />
      </div>
      {description && (
        <div
          style={{
            fontSize: '14px',
            color: '#666',
            textAlign: 'center',
          }}
        >
          {description}
        </div>
      )}
    </div>
  )
}

export default QuestionQRCode

