import { FC, useState, useEffect, useRef } from 'react'
import { Card, Progress, Space, Typography, Button } from 'antd'
import { ClockCircleOutlined, PlayCircleOutlined, PauseCircleOutlined, RedoOutlined } from '@ant-design/icons'
import {
  IQuestionTimerProps,
  QuestionTimerDefaultProps,
} from './interface.ts'

const { Title, Text } = Typography

const QuestionTimer: FC<IQuestionTimerProps> = (
  props: IQuestionTimerProps
) => {
  const {
    mode = 'countdown',
    duration = 300,
    format = 'MM:SS',
    showProgress = true,
    autoStart = false,
    title = '答题倒计时',
    warningTime = 60,
  } = {
    ...QuestionTimerDefaultProps,
    ...props,
  }

  const [timeLeft, setTimeLeft] = useState(mode === 'countdown' ? duration : 0)
  const [isRunning, setIsRunning] = useState(autoStart)
  const timerRef = useRef<any | null>(null)

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (mode === 'countdown') {
            if (prev <= 1) {
              setIsRunning(false)
              return 0
            }
            return prev - 1
          } else {
            return prev + 1
          }
        })
      }, 1000)
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [isRunning, mode])

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    const pad = (num: number) => String(num).padStart(2, '0')

    if (format === 'HH:MM:SS') {
      return `${pad(hours)}:${pad(minutes)}:${pad(secs)}`
    } else if (format === 'MM:SS') {
      return `${pad(hours * 60 + minutes)}:${pad(secs)}`
    } else {
      return String(seconds)
    }
  }

  const getProgressPercent = (): number => {
    if (mode === 'countdown') {
      return ((duration - timeLeft) / duration) * 100
    }
    return 0
  }

  const getProgressStatus = (): 'success' | 'normal' | 'exception' => {
    if (mode === 'countdown') {
      if (timeLeft === 0) return 'exception'
      if (timeLeft <= warningTime) return 'exception'
    }
    return 'normal'
  }

  const handlePlayPause = () => {
    setIsRunning(!isRunning)
  }

  const handleReset = () => {
    setIsRunning(false)
    setTimeLeft(mode === 'countdown' ? duration : 0)
  }

  const timeColor = mode === 'countdown' && timeLeft <= warningTime && timeLeft > 0
    ? '#ff4d4f'
    : '#000'

  return (
    <div style={{ width: '100%', maxWidth: 400 }}>
      <Card
        size="small"
        style={{
          textAlign: 'center',
          background: '#fafafa',
          width: '100%',
        }}
      >
        <Space direction="vertical" size={12} style={{ width: '100%' }}>
          <Space>
            <ClockCircleOutlined style={{ fontSize: '16px' }} />
            <Text strong>{title}</Text>
          </Space>

          <Title
            level={2}
            style={{
              margin: 0,
              color: timeColor,
              fontFamily: 'monospace',
              fontSize: '32px',
            }}
          >
            {formatTime(timeLeft)}
          </Title>

          {showProgress && mode === 'countdown' && (
            <Progress
              percent={getProgressPercent()}
              status={getProgressStatus()}
              showInfo={false}
              strokeWidth={8}
            />
          )}

          <Space>
            <Button
              type="primary"
              icon={isRunning ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
              onClick={handlePlayPause}
              size="small"
            >
              {isRunning ? '暂停' : '开始'}
            </Button>
            <Button icon={<RedoOutlined />} onClick={handleReset} size="small">
              重置
            </Button>
          </Space>
        </Space>
      </Card>
    </div>
  )
}

export default QuestionTimer

