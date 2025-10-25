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
import { useTheme } from '@/contexts/ThemeContext'

const EditToolbar: React.FC = () => {
  const dispatch = useDispatch()
  const { theme, primaryColor, themeColors } = useTheme()
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

  // 按钮样式
  const buttonBaseClass = `w-8 h-8 flex items-center justify-center rounded-lg transition-all ${
    theme === 'dark'
      ? 'bg-[#2a2a2f] hover:bg-[#35353a] text-slate-400 hover:text-white'
      : 'bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-900'
  }`

  const disabledClass = theme === 'dark'
    ? 'disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-[#2a2a2f] disabled:hover:text-slate-400'
    : 'disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-gray-100 disabled:hover:text-gray-600'

  const dividerClass = theme === 'dark' ? 'w-px h-5 bg-white/10 mx-1' : 'w-px h-5 bg-gray-300 mx-1'

  return (
    <div className="flex items-center gap-1">
      <Tooltip title="删除">
        <button
          onClick={handleDelete}
          className={`w-8 h-8 flex items-center justify-center rounded-lg transition-all ${
            theme === 'dark'
              ? 'bg-[#2a2a2f] hover:bg-red-500/10 text-slate-400 hover:text-red-400'
              : 'bg-gray-100 hover:bg-red-50 text-gray-600 hover:text-red-500'
          }`}
        >
          <DeleteOutlined />
        </button>
      </Tooltip>
      
      <Tooltip title="隐藏">
        <button
          onClick={handleHide}
          className={buttonBaseClass}
        >
          <EyeInvisibleOutlined />
        </button>
      </Tooltip>
      
      <Tooltip title={isLocked ? "已锁定" : "锁定"}>
        <button
          onClick={handleLock}
          className={`w-8 h-8 flex items-center justify-center rounded-lg transition-all ${
            isLocked 
              ? 'text-white' 
              : buttonBaseClass.replace('w-8 h-8 flex items-center justify-center rounded-lg transition-all ', '')
          }`}
          style={isLocked ? {
            background: `linear-gradient(135deg, ${primaryColor}, ${themeColors.primaryActive})`,
          } : {}}
          onMouseEnter={(e) => {
            if (isLocked) {
              e.currentTarget.style.background = `linear-gradient(135deg, ${themeColors.primaryHover}, ${primaryColor})`
            }
          }}
          onMouseLeave={(e) => {
            if (isLocked) {
              e.currentTarget.style.background = `linear-gradient(135deg, ${primaryColor}, ${themeColors.primaryActive})`
            }
          }}
        >
          <LockOutlined />
        </button>
      </Tooltip>

      <div className={dividerClass} />

      <Tooltip title="复制">
        <button
          onClick={handleCopy}
          className={buttonBaseClass}
        >
          <CopyOutlined />
        </button>
      </Tooltip>
      
      <Tooltip title="粘贴">
        <button
          onClick={handlePasteComponent}
          disabled={copiedComponent === null}
          className={`${buttonBaseClass} ${disabledClass}`}
        >
          <BlockOutlined />
        </button>
      </Tooltip>

      <div className={dividerClass} />
      
      <Tooltip title="上一个">
        <button
          onClick={handlePrevious}
          disabled={isFirst}
          className={`${buttonBaseClass} ${disabledClass}`}
        >
          <ArrowUpOutlined />
        </button>
      </Tooltip>
      
      <Tooltip title="下一个">
        <button
          onClick={handleNext}
          disabled={isLast}
          className={`${buttonBaseClass} ${disabledClass}`}
        >
          <ArrowDownOutlined />
        </button>
      </Tooltip>

      <div className={dividerClass} />
      
      <Tooltip title="撤销">
        <button
          onClick={handleUndo}
          className={buttonBaseClass}
        >
          <UndoOutlined />
        </button>
      </Tooltip>
      
      <Tooltip title="重做">
        <button
          onClick={handleRedo}
          className={buttonBaseClass}
        >
          <RedoOutlined />
        </button>
      </Tooltip>

      <div className={dividerClass} />
      
      <Tooltip title="导出JSON">
        <button
          onClick={handleExport}
          className={buttonBaseClass}
        >
          <DownloadOutlined />
        </button>
      </Tooltip>
      
      <Tooltip title="导入JSON">
        <button
          onClick={() => fileInputRef.current?.click()}
          className={buttonBaseClass}
        >
          <UploadOutlined />
        </button>
      </Tooltip>
      
      {/* 隐藏的文件选择输入 */}
      <input
        type="file"
        ref={fileInputRef}
        accept="application/json"
        onChange={handleFileImport}
        style={{ display: 'none' }}
      />
    </div>
  )
}

export default EditToolbar
