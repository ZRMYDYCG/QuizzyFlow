import { useCallback } from 'react'
import { toPng } from 'html-to-image'
import { updateFlowThumbnail } from '@/api/flow'

export const useFlowThumbnail = (flowId: string | undefined) => {
  const generateThumbnail = useCallback(
    async (element: HTMLElement | null): Promise<string | null> => {
      if (!element || !flowId) return null

      try {
        const dataUrl = await toPng(element, {
          backgroundColor: '#ffffff',
          quality: 0.8,
          pixelRatio: 1,
          width: 400,
          height: 300,
        })

        // 上传缩略图到服务器
        await updateFlowThumbnail(flowId, dataUrl)

        return dataUrl
      } catch (error) {
        console.error('Failed to generate thumbnail:', error)
        return null
      }
    },
    [flowId],
  )

  return { generateThumbnail }
}

