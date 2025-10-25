import { FC, useRef, useState, useEffect } from 'react'
import { Typography, Button, Space } from 'antd'
import { ClearOutlined, CheckOutlined } from '@ant-design/icons'
import { IQuestionSignatureProps, QuestionSignatureDefaultProps } from './interface'

const QuestionSignature: FC<IQuestionSignatureProps> = (props: IQuestionSignatureProps) => {
  const {
    title,
    width,
    height,
    backgroundColor,
    penColor,
    penWidth,
    value: initialValue,
    onChange,
  } = {
    ...QuestionSignatureDefaultProps,
    ...props,
  }

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [isEmpty, setIsEmpty] = useState(true)
  
  // 获取外部传入的 value（答题模式）
  const externalValue = (props as any).value
  const currentSignature = externalValue !== undefined ? externalValue : (initialValue || '')

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // 设置画布背景
    ctx.fillStyle = backgroundColor || '#ffffff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // 如果有签名，加载它
    if (currentSignature) {
      const img = new Image()
      img.onload = () => {
        ctx.drawImage(img, 0, 0)
        setIsEmpty(false)
      }
      img.src = currentSignature
    }
  }, [backgroundColor, currentSignature])

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true)
    setIsEmpty(false)
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    ctx.beginPath()
    ctx.moveTo(x, y)
    ctx.strokeStyle = penColor || '#000000'
    ctx.lineWidth = penWidth || 2
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    ctx.lineTo(x, y)
    ctx.stroke()
  }

  const stopDrawing = () => {
    if (isDrawing) {
      const canvas = canvasRef.current
      if (canvas) {
        const dataUrl = canvas.toDataURL('image/png')
        if (onChange) {
          ;(onChange as any)(dataUrl)
        }
      }
    }
    setIsDrawing(false)
  }

  const clearSignature = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.fillStyle = backgroundColor || '#ffffff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    setIsEmpty(true)
    if (onChange) {
      ;(onChange as any)('')
    }
  }

  return (
    <div className="w-full">
      <Typography.Paragraph strong className="mb-4">
        {title}
      </Typography.Paragraph>

      <div className="flex flex-col gap-4">
        {/* 签名画布 */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg overflow-hidden bg-white">
          <canvas
            ref={canvasRef}
            width={width}
            height={height}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            className="cursor-crosshair max-w-full h-auto"
            style={{ touchAction: 'none' }}
          />
        </div>

        {/* 操作按钮 */}
        <Space>
          <Button
            icon={<ClearOutlined />}
            onClick={clearSignature}
            disabled={isEmpty}
          >
            清除签名
          </Button>
        </Space>

        {!isEmpty && (
          <Typography.Text type="secondary" className="text-sm">
            提示：签名会在松开鼠标时自动保存
          </Typography.Text>
        )}
      </div>
    </div>
  )
}

export default QuestionSignature

