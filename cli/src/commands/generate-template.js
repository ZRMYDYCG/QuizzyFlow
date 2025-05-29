import { Command } from 'commander'
import { nanoid } from 'nanoid'
import fs from 'fs-extra'

// 随机生成组件props的工具
function generateComponentProps(type) {
  switch (type) {
    case 'question-input':
      return {
        title: `输入框_${Math.random().toString(36).slice(2, 5)}`,
        placeholder: `请输入${Math.random().toString(36).slice(2, 5)}...`,
      }

    case 'question-textarea':
      return {
        title: `文本域_${Math.random().toString(36).slice(2, 5)}`,
        placeholder: `请输入建议_${Math.random().toString(36).slice(2, 5)}...`,
      }

    case 'question-radio':
      return {
        type: '单选标题',
        isVertical: Math.random() > 0.5,
        options: [
          { text: '选项A', value: 'a' },
          { text: '选项B', value: 'b' },
          { text: '选项C', value: 'c' },
        ],
      }

    default:
      return {}
  }
}

// 随机生成单个组件
function generateComponent() {
  const types = [
    'question-input',
    'question-textarea',
    'question-radio',
    'question-paragraph',
  ]
  const type = types[Math.floor(Math.random() * types.length)]

  return {
    fe_id: nanoid(),
    type,
    title: `${type}_${Math.random().toString(36).slice(2, 5)}`,
    isHidden: false,
    isLocked: false,
    props: generateComponentProps(type),
  }
}

// 主命令实现
export const generateTemplateCommand = new Command('generate-template')
  .description('生成随机物料模板JSON文件')
  .option('-o, --output <path>', '输出文件路径', 'cli/generated-template.json')
  .option('-n, --number <count>', '生成组件数量', 5)
  .action((options) => {
    const componentList = Array.from({ length: options.number }, () =>
      generateComponent()
    )
    const template = {
      componentList,
      selectedId: componentList[0]?.fe_id || '',
      copiedComponent: null,
    }

    fs.outputJsonSync(options.output, template, { spaces: 2 })
    console.log(`成功生成模板文件：${options.output}`)
  })
