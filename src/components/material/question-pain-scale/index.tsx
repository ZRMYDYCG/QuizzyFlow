import { FC, useState } from 'react'
import { Typography, Slider } from 'antd'
import { IQuestionPainScaleProps, QuestionPainScaleDefaultProps, PAIN_LEVELS } from './interface'

const QuestionPainScale: FC<IQuestionPainScaleProps> = (
  props: IQuestionPainScaleProps
) => {
  const { title, value: initialValue, showFaces, showDescription } = {
    ...QuestionPainScaleDefaultProps,
    ...props,
  }

  const [value, setValue] = useState<number>(initialValue || 0)

  const handleChange = (newValue: number) => {
    setValue(newValue)
  }

  const currentLevel = PAIN_LEVELS[value]

  return (
    <div className="w-full">
      <Typography.Paragraph strong className="mb-6">
        {title}
      </Typography.Paragraph>

      <div className="flex flex-col gap-6 p-8 bg-gradient-to-br from-green-50 to-red-50 rounded-xl">
        {/* 当前等级展示 */}
        <div className="flex flex-col items-center gap-3">
          {showFaces && (
            <div className="text-7xl">{currentLevel.face}</div>
          )}
          <div className="flex items-baseline gap-2">
            <Typography.Text className="text-5xl font-bold" style={{ color: currentLevel.color }}>
              {value}
            </Typography.Text>
            <Typography.Text className="text-xl text-gray-500">/ 10</Typography.Text>
          </div>
          <Typography.Text className="text-2xl font-semibold" style={{ color: currentLevel.color }}>
            {currentLevel.label}
          </Typography.Text>
        </div>

        {/* 滑动条 */}
        <div className="px-4">
          <Slider
            min={0}
            max={10}
            step={1}
            value={value}
            onChange={handleChange}
            marks={{
              0: '0',
              5: '5',
              10: '10',
            }}
            tooltip={{
              formatter: (val) => PAIN_LEVELS[val || 0].label,
            }}
            trackStyle={{ backgroundColor: currentLevel.color, height: 8 }}
            railStyle={{ height: 8 }}
            handleStyle={{
              width: 24,
              height: 24,
              marginTop: -8,
              borderColor: currentLevel.color,
              borderWidth: 3,
            }}
          />
        </div>

        {/* 点击快速选择 */}
        <div className="grid grid-cols-11 gap-1">
          {PAIN_LEVELS.map((level) => (
            <button
              key={level.value}
              onClick={() => handleChange(level.value)}
              className={`
                py-2 rounded font-bold text-sm transition-all duration-200
                ${
                  value === level.value
                    ? 'scale-110 shadow-lg text-white'
                    : 'hover:scale-105 text-gray-700'
                }
              `}
              style={{
                backgroundColor: value === level.value ? level.color : '#f0f0f0',
              }}
            >
              {level.value}
            </button>
          ))}
        </div>

        {/* 描述说明 */}
        {showDescription && (
          <div className="p-4 bg-white rounded-lg">
            <Typography.Text className="text-sm text-gray-600">
              <strong>疼痛等级说明：</strong>
              <br />
              • 0-2分：轻微或无痛，不影响日常活动
              <br />
              • 3-5分：中度疼痛，对日常活动有一定影响
              <br />
              • 6-8分：严重疼痛，明显影响日常活动
              <br />
              • 9-10分：极度疼痛，难以忍受
            </Typography.Text>
          </div>
        )}
      </div>
    </div>
  )
}

export default QuestionPainScale

