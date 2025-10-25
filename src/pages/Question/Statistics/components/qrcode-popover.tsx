import { memo } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { useResponsive } from 'ahooks'

interface QRCodePopoverProps {
  url: string
  size?: number
}

const QRCodePopover = memo(({ url, size }: QRCodePopoverProps) => {
  const responsive = useResponsive()
  const isMobile = !responsive.md
  const qrSize = size || (isMobile ? 200 : 128)
  
  return (
    <div className="text-center p-2 md:p-4">
      <QRCodeSVG value={url} size={qrSize} />
      <p className="text-xs md:text-sm text-gray-500 mt-2 md:mt-4">
        扫描二维码填写问卷
      </p>
    </div>
  )
})

QRCodePopover.displayName = 'QRCodePopover'

export default QRCodePopover

