/**
 * @description 穿梭框组件
 * */
export interface ITransferDataSource {
  key: string
  title: string
  disabled?: boolean
}

export interface IQuestionTransferProps {
  // 基础属性
  dataSource?: ITransferDataSource[]
  targetKeys?: string[]
  showSearch?: boolean
  titles?: [string, string]
  operations?: [string, string]
  disabled?: boolean
  onChange?: (newProps: IQuestionTransferProps) => void
}

export const QuestionTransferDefaultData: IQuestionTransferProps = {
  dataSource: [
    { key: '1', title: '选项 1', disabled: false },
    { key: '2', title: '选项 2', disabled: false },
    { key: '3', title: '选项 3', disabled: false },
    { key: '4', title: '选项 4', disabled: false },
    { key: '5', title: '选项 5', disabled: false },
  ],
  targetKeys: [],
  showSearch: false,
  titles: ['源列表', '目标列表'],
  operations: ['>', '<'],
  disabled: false,
}

