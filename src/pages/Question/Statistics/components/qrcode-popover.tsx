import { memo } from 'react'
import { QRCodeSVG } from 'qrcode.react'

interface QRCodePopoverProps {
  url: string
  size?: number
}

const QRCodePopover = memo(({ url, size = 128 }: QRCodePopoverProps) => {
  return (
    <div style={{ textAlign: 'center' }}>
      <QRCodeSVG value={url} size={size} />
    </div>
  )
})

QRCodePopover.displayName = 'QRCodePopover'

export default QRCodePopover

