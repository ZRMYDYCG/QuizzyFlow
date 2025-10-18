import React from 'react'

const TemplateLib: React.FC = () => {
  return (
    <div className="h-full overflow-y-auto px-3 py-4 custom-scrollbar">
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="text-6xl mb-4 opacity-30">🎨</div>
        <p className="text-lg font-medium text-slate-400">模板库</p>
        <p className="text-sm text-slate-500 mt-2 text-center">
          快速导入预设的组件模板
          <br />
          <span className="text-xs text-slate-600">功能开发中...</span>
        </p>
      </div>
    </div>
  )
}

export default TemplateLib
