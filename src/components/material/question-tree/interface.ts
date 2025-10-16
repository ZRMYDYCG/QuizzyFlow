import { FC } from 'react'

export interface ITreeNode {
  title: string
  key: string
  children?: ITreeNode[]
}

export interface IQuestionTreeProps {
  treeData: ITreeNode[] // 树形数据
  showLine?: boolean // 显示连接线
  showIcon?: boolean // 显示图标
  defaultExpandAll?: boolean // 默认展开所有
  checkable?: boolean // 可选择
  selectable?: boolean // 可选中
  fe_id: string
  isLocked?: boolean
}

export const QuestionTreeDefaultProps: IQuestionTreeProps = {
  treeData: [
    {
      title: '前端开发',
      key: '0-0',
      children: [
        {
          title: 'React',
          key: '0-0-0',
          children: [
            { title: 'Hooks', key: '0-0-0-0' },
            { title: 'Redux', key: '0-0-0-1' },
          ],
        },
        {
          title: 'Vue',
          key: '0-0-1',
          children: [
            { title: 'Vue3', key: '0-0-1-0' },
            { title: 'Pinia', key: '0-0-1-1' },
          ],
        },
      ],
    },
    {
      title: '后端开发',
      key: '0-1',
      children: [
        { title: 'Node.js', key: '0-1-0' },
        { title: 'Python', key: '0-1-1' },
      ],
    },
  ],
  showLine: true,
  showIcon: false,
  defaultExpandAll: true,
  checkable: false,
  selectable: true,
  fe_id: '',
  isLocked: false,
}

export type PropsType = FC<IQuestionTreeProps>

