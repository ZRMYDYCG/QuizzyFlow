import React, { useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { X, Check } from 'lucide-react'
import { useTheme } from '../../contexts/ThemeContext'
import { colorCategories, recommendedThemes, type ChineseColor } from '../../constants/chinese-colors'

interface ThemeSelectorDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const ThemeSelectorDialog: React.FC<ThemeSelectorDialogProps> = ({ open, onOpenChange }) => {
  const { primaryColor, setPrimaryColor } = useTheme()
  const [selectedColor, setSelectedColor] = useState(primaryColor)

  const handleColorSelect = (color: string) => {
    setSelectedColor(color)
  }

  const handleApply = () => {
    setPrimaryColor(selectedColor)
    onOpenChange(false)
  }

  const handleCancel = () => {
    setSelectedColor(primaryColor)
    onOpenChange(false)
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 animate-in fade-in-0" />
        <Dialog.Content 
          className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[95vw] max-w-[1400px] max-h-[90vh] bg-black border border-white/10 rounded-none shadow-2xl z-50 overflow-hidden animate-in fade-in-0 zoom-in-95"
        >
          {/* 顶部标题栏 - 类似参考网站 */}
          <div className="relative bg-black border-b border-white/10">
            <div className="flex items-center justify-between px-6 md:px-10 py-4 md:py-6">
              {/* 左侧标题 */}
              <div>
                <Dialog.Title className="text-lg md:text-2xl font-bold text-white mb-1">
                  主题颜色选择
                </Dialog.Title>
                <Dialog.Description className="text-xs md:text-sm text-slate-500">
                  中国色为来自古诗词的传统颜色 - 
                  <a 
                    href="https://zhongguose.com/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="ml-1 hover:underline"
                    style={{ color: selectedColor }}
                  >
                    http://zhongguose.com/
                  </a>
                </Dialog.Description>
              </div>

              {/* 右侧关闭按钮 */}
              <Dialog.Close asChild>
                <button 
                  className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-all flex items-center justify-center flex-shrink-0"
                  onClick={handleCancel}
                >
                  <X className="w-4 h-4 md:w-5 md:h-5 text-slate-400" />
                </button>
              </Dialog.Close>
            </div>
          </div>

          {/* 内容区域 - 仿照 zhongguose.com */}
          <div className="overflow-y-auto bg-black" style={{ maxHeight: 'calc(90vh - 180px)' }}>
            <div className="p-4 md:p-8">
              {/* 颜色网格 - 类似参考网站的布局 */}
              {colorCategories.map((category) => (
                <div key={category.name} className="mb-8">
                  {/* 分类名称 */}
                  <div className="mb-4 pb-2 border-b border-white/10">
                    <h3 className="text-base md:text-lg font-bold text-white">
                      {category.name}
                    </h3>
                  </div>
                  
                  {/* 颜色卡片网格 */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-2 md:gap-3">
                    {category.colors.map((color: ChineseColor) => (
                      <button
                        key={color.hex}
                        onClick={() => handleColorSelect(color.hex)}
                        className={`group relative p-3 md:p-4 rounded-lg border transition-all ${
                          selectedColor === color.hex
                            ? 'border-white/40 bg-white/5 scale-105'
                            : 'border-white/10 bg-white/[0.02] hover:border-white/30 hover:bg-white/5 hover:scale-105'
                        }`}
                      >
                        {/* 色块 */}
                        <div 
                          className="w-full aspect-square rounded-md mb-2 md:mb-3 shadow-lg transition-transform group-hover:scale-105"
                          style={{ backgroundColor: color.hex }}
                        />
                        
                        {/* 颜色信息 */}
                        <div className="text-center space-y-0.5 md:space-y-1">
                          {/* 中文名 */}
                          <div className="text-sm md:text-base font-bold text-white">
                            {color.name}
                          </div>
                          
                          {/* 拼音 */}
                          <div className="text-xs text-slate-400 uppercase tracking-wider">
                            {color.pinyin}
                          </div>
                          
                          {/* Hex 值 */}
                          <div className="text-xs font-mono text-slate-500">
                            {color.hex}
                          </div>
                          
                          {/* RGB 值 */}
                          <div className="text-xs font-mono text-slate-600">
                            rgb({color.rgb.r}, {color.rgb.g}, {color.rgb.b})
                          </div>
                        </div>
                        
                        {/* 选中标记 */}
                        {selectedColor === color.hex && (
                          <div className="absolute top-1 right-1 md:top-2 md:right-2 w-5 h-5 md:w-6 md:h-6 bg-white rounded-full flex items-center justify-center shadow-lg">
                            <Check className="w-3 h-3 md:w-4 md:h-4 text-black" strokeWidth={3} />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 底部操作栏 */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 md:gap-0 px-4 md:px-8 py-4 md:py-5 border-t border-white/10 bg-black">
            {/* 当前选择预览 */}
            <div className="flex items-center gap-3 md:gap-4">
              <span className="text-xs md:text-sm text-slate-400">当前选择:</span>
              <div className="flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2 rounded-lg bg-white/5 border border-white/10">
                <div 
                  className="w-6 h-6 md:w-8 md:h-8 rounded-md shadow-md"
                  style={{ backgroundColor: selectedColor }}
                />
                <div className="text-left">
                  <div className="text-xs md:text-sm font-mono text-white">{selectedColor.toUpperCase()}</div>
                </div>
              </div>
            </div>
            
            {/* 操作按钮 */}
            <div className="flex items-center gap-2 md:gap-3">
              <button
                onClick={handleCancel}
                className="flex-1 md:flex-none px-4 md:px-6 py-2 md:py-2.5 rounded-lg border border-white/10 text-slate-300 hover:bg-white/5 transition-all font-medium text-sm md:text-base"
              >
                取消
              </button>
              <button
                onClick={handleApply}
                className="flex-1 md:flex-none px-4 md:px-6 py-2 md:py-2.5 rounded-lg text-white transition-all font-medium shadow-lg text-sm md:text-base"
                style={{
                  background: `linear-gradient(135deg, ${selectedColor}, ${selectedColor}dd)`
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = `linear-gradient(135deg, ${selectedColor}dd, ${selectedColor})`
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = `linear-gradient(135deg, ${selectedColor}, ${selectedColor}dd)`
                }}
              >
                应用主题
              </button>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

export default ThemeSelectorDialog

