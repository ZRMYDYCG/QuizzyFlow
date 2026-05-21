import { memo } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { useResponsive } from 'ahooks'
import { useManageTheme } from '@/hooks/useManageTheme'
import { cn } from '@/utils'

interface QRCodePopoverProps {
  url: string
  size?: number
}

const QRCodePopover = memo(({ url, size }: QRCodePopoverProps) => {
  const responsive = useResponsive()
  const isMobile = !responsive.md
  const t = useManageTheme()
  const qrSize = size || (isMobile ? 200 : 128)
  
  return (
    <div className="text-center p-2 md:p-4">
      <QRCodeSVG value={url} size={qrSize} />
      <p className={cn('text-xs md:text-sm mt-2 md:mt-4', t.text.secondary)}>
        扫描二维码填写问卷
      </p>
    </div>
  )
})

QRCodePopover.displayName = 'QRCodePopover'

export default QRCodePopover

