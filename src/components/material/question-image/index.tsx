import { FC } from 'react'
import { Image } from 'antd'
import {
  IQuestionImageProps,
  QuestionImageDefaultProps,
} from './interface.ts'

const QuestionImage: FC<IQuestionImageProps> = (
  props: IQuestionImageProps
) => {
  const {
    src = 'https://cdn-docs-new.pingcode.com/baike/wp-content/uploads/2024/10/7e7408434abfe70d5c58159c3014e5c3.webp',
    alt = '图片',
    width = 400,
    height = 300,
    borderRadius = 8,
    bordered = false,
    borderColor = '#d9d9d9',
    fit = 'cover',
    preview = true,
  } = {
    ...QuestionImageDefaultProps,
    ...props,
  }

  return (
    <div style={{ width: '100%', maxWidth: width }}>
      <Image
        src={src}
        alt={alt}
        width="100%"
        height={height}
        preview={preview}
        style={{
          borderRadius: `${borderRadius}px`,
          border: bordered ? `2px solid ${borderColor}` : 'none',
          objectFit: fit,
          display: 'block',
        }}
      />
    </div>
  )
}

export default QuestionImage

