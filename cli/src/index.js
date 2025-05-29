import { Command } from 'commander'
import { generateTemplateCommand } from './commands/generate-template.js'

const program = new Command()

program
  .name('Quizzy 物料工具 🌥️')
  .version('1.0.0')
  .description('更加专注于业务的物料工具')

program.addCommand(generateTemplateCommand)

program.parse(process.argv)
