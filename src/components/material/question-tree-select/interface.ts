/**
 * @description 树形选择组件
 * */
export interface TreeNode {
  value: string
  title: string
  children?: TreeNode[]
}

export interface IQuestionTreeSelectProps {
  // 树形选择标题
  title?: string
  // 提示信息
  placeholder?: string
  // 树形数据
  treeData?: TreeNode[]
  // 是否多选
  multiple?: boolean
  // 是否显示搜索
  showSearch?: boolean
  // 是否禁用
  disabled?: boolean
  onChange?: (value: IQuestionTreeSelectProps) => void
}

export const QuestionTreeSelectDefaultData: IQuestionTreeSelectProps = {
  title: '树形选择',
  placeholder: '请选择',
  treeData: [
    {
      value: 'parent1',
      title: '父节点1',
      children: [
        { value: 'child1', title: '子节点1-1' },
        { value: 'child2', title: '子节点1-2' },
      ],
    },
    {
      value: 'parent2',
      title: '父节点2',
      children: [
        { value: 'child3', title: '子节点2-1' },
        { value: 'child4', title: '子节点2-2' },
      ],
    },
  ],
  multiple: false,
  showSearch: true,
  disabled: false,
}

