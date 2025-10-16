import { FC } from 'react'
import { Card, Empty } from 'antd'
import { SoundOutlined } from '@ant-design/icons'
import {
  IQuestionAudioProps,
  QuestionAudioDefaultProps,
} from './interface.ts'

const QuestionAudio: FC<IQuestionAudioProps> = (
  props: IQuestionAudioProps
) => {
  const {
    src = '',
    autoplay = false,
    loop = false,
    controls = true,
    volume = 80,
  } = {
    ...QuestionAudioDefaultProps,
    ...props,
  }

  if (!src) {
    return (
      <Card style={{ maxWidth: 400, textAlign: 'center' }}>
        <Empty
          image={<SoundOutlined style={{ fontSize: 64, color: '#bfbfbf' }} />}
          description="请设置音频URL"
        />
      </Card>
    )
  }

  return (
    <div style={{ width: '100%', maxWidth: 500 }}>
      <audio
        src={src}
        autoPlay={autoplay}
        loop={loop}
        controls={controls}
        style={{
          width: '100%',
          outline: 'none',
        }}
      >
        您的浏览器不支持音频播放
      </audio>
    </div>
  )
}

export default QuestionAudio

