import React, { useRef } from 'react'
import { Button, Space, Tooltip } from 'antd'
import {
  CopyOutlined,
  DeleteOutlined,
  EyeInvisibleOutlined,
  LockOutlined,
  BlockOutlined,
  ArrowDownOutlined,
  ArrowUpOutlined,
  UnlockOutlined,
  UndoOutlined,
  RedoOutlined,
  DownloadOutlined,
  UploadOutlined,
} from '@ant-design/icons'
import { useDispatch } from 'react-redux'
import {
  extraComponents,
  changeComponentsVisible,
  changeComponentsLock,
  copySelectedComponent,
  pasteComponent,
  selectPrevComponent,
  selectNextComponent,
  resetComponents,
} from '@/store/modules/question-component'
import useGetComponentInfo from '@/hooks/useGetComponentInfo'
import { ActionCreators as UndoActionCreators } from 'redux-undo'

const EditToolbar: React.FC = () => {
  const dispatch = useDispatch()
  const { selectedId, selectedComponent, copiedComponent, componentList } =
    useGetComponentInfo()
  const { isLocked } = selectedComponent || {}
  const length = componentList.length
  const selectedIndex = componentList.findIndex(
    (component: any) => component.fe_id === selectedId
  )
  const isFirst = selectedIndex <= 0
  const isLast = selectedIndex + 1 >= length

  const fileInputRef = useRef<HTMLInputElement>(null)

  // 导出JSON
  const handleExport = () => {
    // 构造要导出的状态对象
    const exportData = {
      componentList,
      selectedId,
      copiedComponent,
    }
    // 生成JSON文件并下载
    const jsonStr = JSON.stringify(exportData, null, 2)
    const blob = new Blob([jsonStr], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = '问卷组件列表.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  // 处理文件导入
  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const importedData = JSON.parse(event.target?.result as string)
        // 验证数据格式
        if (
          !importedData?.componentList ||
          !Array.isArray(importedData.componentList)
        ) {
          throw new Error('无效的组件列表数据')
        }
        // 重置组件状态
        dispatch(resetComponents(importedData))
      } catch (error) {
        console.error(
          `导入失败：${error instanceof Error ? error.message : '未知错误'}`
        )
      }
      // 清空输入防止重复触发
      e.target.value = ''
    }
    reader.readAsText(file)
  }

  // 删除组件
  const handleDelete = () => {
    dispatch(extraComponents())
  }

  // 隐藏组件
  const handleHide = () => {
    dispatch(changeComponentsVisible({ fe_id: selectedId, isHidden: true }))
  }

  // 锁定组件
  const handleLock = () => {
    dispatch(changeComponentsLock({ fe_id: selectedId }))
  }

  // 拷贝当前选中的组件
  const handleCopy = () => {
    dispatch(copySelectedComponent())
  }

  // 粘贴组件
  const handlePasteComponent = () => {
    dispatch(pasteComponent())
  }

  // 上一个
  const handlePrevious = () => {
    dispatch(selectPrevComponent())
  }

  // 下一个
  const handleNext = () => {
    dispatch(selectNextComponent())
  }

  // 撤销
  const handleUndo = () => {
    dispatch(UndoActionCreators.undo())
  }

  // 重做
  const handleRedo = () => {
    dispatch(UndoActionCreators.redo())
  }
  return (
    <Space>
      <Tooltip title="删除">
        <Button
          shape="circle"
          icon={<DeleteOutlined />}
          onClick={handleDelete}
        ></Button>
      </Tooltip>
      <Tooltip title="隐藏">
        <Button
          shape="circle"
          icon={<EyeInvisibleOutlined />}
          onClick={handleHide}
        ></Button>
      </Tooltip>
      <Tooltip title="锁定">
        <Button
          shape="circle"
          icon={<LockOutlined />}
          onClick={handleLock}
          type={isLocked ? 'primary' : 'default'}
        ></Button>
      </Tooltip>

      <Tooltip title="复制">
        <Button
          shape="circle"
          icon={<CopyOutlined />}
          onClick={handleCopy}
        ></Button>
      </Tooltip>
      <Tooltip title="粘贴">
        <Button
          shape="circle"
          icon={<BlockOutlined />}
          onClick={handlePasteComponent}
          disabled={copiedComponent === null}
        ></Button>
      </Tooltip>
      <Tooltip title="上一个">
        <Button
          shape="circle"
          icon={<ArrowUpOutlined />}
          onClick={handlePrevious}
          disabled={isFirst}
        />
      </Tooltip>
      <Tooltip title="下一个">
        <Button
          shape="circle"
          icon={<ArrowDownOutlined />}
          onClick={handleNext}
          disabled={isLast}
        />
      </Tooltip>
      <Tooltip title="撤销">
        <Button shape="circle" icon={<UndoOutlined />} onClick={handleUndo} />
      </Tooltip>
      <Tooltip title="重做">
        <Button shape="circle" icon={<RedoOutlined />} onClick={handleRedo} />
      </Tooltip>
      <Tooltip title="导出JSON">
        <Button
          shape="circle"
          icon={<DownloadOutlined />}
          onClick={handleExport}
        ></Button>
      </Tooltip>
      <Tooltip title="导入JSON">
        <Button
          shape="circle"
          icon={<UploadOutlined />}
          onClick={() => fileInputRef.current?.click()}
        ></Button>
      </Tooltip>
      {/* 隐藏的文件选择输入 */}
      <input
        type="file"
        ref={fileInputRef}
        accept="application/json"
        onChange={handleFileImport}
        style={{ display: 'none' }}
      />
    </Space>
  )
}

export default EditToolbar
