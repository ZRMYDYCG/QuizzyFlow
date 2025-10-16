import { FC, useState } from 'react'
import { Alert } from 'antd'
import { SoundOutlined } from '@ant-design/icons'
import {
  IQuestionMarqueeProps,
  QuestionMarqueeDefaultProps,
} from './interface.ts'
import './marquee.css'

const QuestionMarquee: FC<IQuestionMarqueeProps> = (
  props: IQuestionMarqueeProps
) => {
  const {
    messages = [],
    direction = 'horizontal',
    speed = 5,
    pauseOnHover = true,
    loop = true,
    backgroundColor = '#e6f7ff',
    textColor = '#1890ff',
    showIcon = true,
  } = {
    ...QuestionMarqueeDefaultProps,
    ...props,
  }

  const [isPaused, setIsPaused] = useState(false)

  const allMessages = messages.map((msg) => msg.text).join(' • ')

  // 计算动画持续时间 (速度越大，时间越短)
  const duration = 20 - speed * 1.5

  const handleMouseEnter = () => {
    if (pauseOnHover) {
      setIsPaused(true)
    }
  }

  const handleMouseLeave = () => {
    if (pauseOnHover) {
      setIsPaused(false)
    }
  }

  return (
    <div
      className={`marquee-container marquee-${direction}`}
      style={{
        backgroundColor,
        color: textColor,
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {showIcon && (
        <SoundOutlined
          style={{
            fontSize: '16px',
            marginRight: direction === 'horizontal' ? '8px' : '0',
            marginBottom: direction === 'vertical' ? '8px' : '0',
          }}
        />
      )}
      <div
        className={`marquee-content ${isPaused ? 'paused' : ''}`}
        style={{
          animationDuration: `${duration}s`,
          animationIterationCount: loop ? 'infinite' : '1',
        }}
      >
        {direction === 'horizontal' ? (
          <>
            <span>{allMessages}</span>
            {loop && <span style={{ marginLeft: '100px' }}>{allMessages}</span>}
          </>
        ) : (
          <div>
            {messages.map((msg) => (
              <div key={msg.id} style={{ padding: '8px 0' }}>
                {msg.text}
              </div>
            ))}
            {loop && messages.map((msg) => (
              <div key={`${msg.id}-loop`} style={{ padding: '8px 0' }}>
                {msg.text}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default QuestionMarquee

