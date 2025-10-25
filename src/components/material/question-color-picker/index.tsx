import { FC, useState } from 'react'
import { Typography, ColorPicker } from 'antd'
import type { Color } from 'antd/es/color-picker'
import { IQuestionColorPickerProps, QuestionColorPickerDefaultProps } from './interface'

const QuestionColorPicker: FC<IQuestionColorPickerProps> = (
  props: IQuestionColorPickerProps
) => {
  const { title, value: initialValue, showText, allowClear, presets, onChange } = {
    ...QuestionColorPickerDefaultProps,
    ...props,
  }

  // 获取外部传入的 value（答题模式）
  const externalValue = (props as any).value
  const currentValue = externalValue !== undefined ? externalValue : (initialValue || '#1890ff')

  const handleChange = (color: Color) => {
    const hexValue = color.toHexString()
    if (onChange) {
      ;(onChange as any)(hexValue)
    }
  }

  const handlePresetClick = (color: string) => {
    if (onChange) {
      ;(onChange as any)(color)
    }
  }

  const presetsColors = presets?.map((color) => ({
    label: color,
    colors: [color],
  }))

  return (
    <div className="w-full">
      <Typography.Paragraph strong className="mb-4">
        {title}
      </Typography.Paragraph>

      <div className="flex flex-col items-center gap-6 p-8 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl">
        {/* 颜色选择器 */}
        <ColorPicker
          value={currentValue}
          onChange={handleChange}
          showText={showText}
          size="large"
          presets={presetsColors}
          allowClear={allowClear}
          className="shadow-lg"
        />

        {/* 选中的颜色展示 */}
        <div className="flex flex-col items-center gap-3">
          <div
            className="w-32 h-32 rounded-2xl shadow-2xl border-4 border-white"
            style={{ backgroundColor: currentValue }}
          />
          <Typography.Text className="text-lg font-mono font-semibold">
            {currentValue.toUpperCase()}
          </Typography.Text>
        </div>

        {/* 预设颜色快速选择 */}
        {presets && presets.length > 0 && (
          <div className="w-full">
            <Typography.Text className="block text-center mb-3 text-gray-600">
              快速选择：
            </Typography.Text>
            <div className="grid grid-cols-6 md:grid-cols-12 gap-2">
              {presets.map((color) => (
                <button
                  key={color}
                  onClick={() => handlePresetClick(color)}
                  className={`
                    w-10 h-10 rounded-lg shadow-md cursor-pointer
                    transition-all duration-200 hover:scale-110
                    border-2 ${
                      currentValue === color ? 'border-blue-500 ring-2 ring-blue-300' : 'border-white'
                    }
                  `}
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default QuestionColorPicker

