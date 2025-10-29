import { FC, useState } from 'react'
import { Modal, Radio, Checkbox, Slider, Button, message } from 'antd'
import { DownloadOutlined } from '@ant-design/icons'
import { toPng, toSvg } from 'html-to-image'
import type { Node, Edge } from 'reactflow'

interface ExportDialogProps {
  visible: boolean
  onClose: () => void
  reactFlowWrapper: HTMLElement | null
  nodes: Node[]
  edges: Edge[]
  flowTitle: string
}

type ExportFormat = 'png' | 'svg' | 'json'

const ExportDialog: FC<ExportDialogProps> = ({
  visible,
  onClose,
  reactFlowWrapper,
  nodes,
  edges,
  flowTitle,
}) => {
  const [format, setFormat] = useState<ExportFormat>('png')
  const [includeBackground, setIncludeBackground] = useState(true)
  const [transparentBg, setTransparentBg] = useState(false)
  const [quality, setQuality] = useState(0.95)
  const [exporting, setExporting] = useState(false)

  const handleExport = async () => {
    setExporting(true)
    try {
      switch (format) {
        case 'png':
          await exportAsPng()
          break
        case 'svg':
          await exportAsSvg()
          break
        case 'json':
          exportAsJson()
          break
      }
      message.success('导出成功')
      onClose()
    } catch (error) {
      message.error('导出失败')
    } finally {
      setExporting(false)
    }
  }

  const exportAsPng = async () => {
    if (!reactFlowWrapper) return

    const dataUrl = await toPng(reactFlowWrapper, {
      backgroundColor: transparentBg ? 'transparent' : '#ffffff',
      quality,
      pixelRatio: 2, // 2x for better quality
    })

    const link = document.createElement('a')
    link.download = `${flowTitle || 'flow'}.png`
    link.href = dataUrl
    link.click()
  }

  const exportAsSvg = async () => {
    if (!reactFlowWrapper) return

    const dataUrl = await toSvg(reactFlowWrapper, {
      backgroundColor: transparentBg ? 'transparent' : '#ffffff',
    })

    const link = document.createElement('a')
    link.download = `${flowTitle || 'flow'}.svg`
    link.href = dataUrl
    link.click()
  }

  const exportAsJson = () => {
    const flowData = {
      title: flowTitle,
      nodes,
      edges,
      exportedAt: new Date().toISOString(),
    }

    const dataStr = JSON.stringify(flowData, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)

    const link = document.createElement('a')
    link.download = `${flowTitle || 'flow'}.json`
    link.href = url
    link.click()

    URL.revokeObjectURL(url)
  }

  return (
    <Modal
      title="导出工作流"
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          取消
        </Button>,
        <Button
          key="export"
          type="primary"
          icon={<DownloadOutlined />}
          loading={exporting}
          onClick={handleExport}
        >
          导出
        </Button>,
      ]}
      width={480}
    >
      <div className="space-y-6 py-4">
        {/* 导出格式 */}
        <section>
          <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            选择导出格式
          </div>
          <Radio.Group value={format} onChange={(e) => setFormat(e.target.value)}>
            <div className="space-y-2">
              <Radio value="png">
                <div>
                  <div className="font-medium">PNG 图片</div>
                  <div className="text-xs text-gray-500">
                    适合展示和分享，推荐使用
                  </div>
                </div>
              </Radio>
              <Radio value="svg">
                <div>
                  <div className="font-medium">SVG 矢量图</div>
                  <div className="text-xs text-gray-500">
                    可缩放，适合打印和编辑
                  </div>
                </div>
              </Radio>
              <Radio value="json">
                <div>
                  <div className="font-medium">JSON 数据</div>
                  <div className="text-xs text-gray-500">
                    保存完整数据，可重新导入
                  </div>
                </div>
              </Radio>
            </div>
          </Radio.Group>
        </section>

        {/* 图片选项 */}
        {(format === 'png' || format === 'svg') && (
          <>
            <section>
              <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                导出选项
              </div>
              <div className="space-y-2">
                <Checkbox
                  checked={includeBackground}
                  onChange={(e) => setIncludeBackground(e.target.checked)}
                >
                  包含背景网格
                </Checkbox>
                <Checkbox
                  checked={transparentBg}
                  onChange={(e) => setTransparentBg(e.target.checked)}
                >
                  透明背景
                </Checkbox>
              </div>
            </section>

            {format === 'png' && (
              <section>
                <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  图片质量: {Math.round(quality * 100)}%
                </div>
                <Slider
                  min={0.5}
                  max={1}
                  step={0.05}
                  value={quality}
                  onChange={setQuality}
                />
              </section>
            )}
          </>
        )}

        {/* JSON 提示 */}
        {format === 'json' && (
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="text-sm text-blue-700 dark:text-blue-300">
              💡 JSON 格式将导出完整的节点和边数据，可以在其他系统中使用或重新导入。
            </div>
          </div>
        )}
      </div>
    </Modal>
  )
}

export default ExportDialog

