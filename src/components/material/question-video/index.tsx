import { FC } from 'react'
import { Card, Empty } from 'antd'
import { VideoCameraOutlined } from '@ant-design/icons'
import {
  IQuestionVideoProps,
  QuestionVideoDefaultProps,
} from './interface.ts'

const QuestionVideo: FC<IQuestionVideoProps> = (
  props: IQuestionVideoProps
) => {
  const {
    src = '',
    width = 640,
    height = 360,
    autoplay = false,
    loop = false,
    controls = true,
    muted = false,
    poster = '',
  } = {
    ...QuestionVideoDefaultProps,
    ...props,
  }

  if (!src) {
    return (
      <Card style={{ maxWidth: width, textAlign: 'center' }}>
        <Empty
          image={<VideoCameraOutlined style={{ fontSize: 64, color: '#bfbfbf' }} />}
          description="请设置视频URL"
        />
      </Card>
    )
  }

  return (
    <div style={{ width: '100%', maxWidth: width }}>
      <video
        src={src}
        width="100%"
        height={height}
        autoPlay={autoplay}
        loop={loop}
        controls={controls}
        muted={muted}
        poster={poster}
        style={{
          borderRadius: '8px',
          backgroundColor: '#000',
          display: 'block',
        }}
      >
        您的浏览器不支持视频播放
      </video>
    </div>
  )
}

export default QuestionVideo

