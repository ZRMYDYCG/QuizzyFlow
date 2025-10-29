import StartNode from './start-node'
import EndNode from './end-node'
import ActionNode from './action-node'
import ConditionNode from './condition-node'
import InputNode from './input-node'
import OutputNode from './output-node'
import CustomNode from './custom-node'

export const nodeTypes = {
  start: StartNode,
  end: EndNode,
  action: ActionNode,
  condition: ConditionNode,
  input: InputNode,
  output: OutputNode,
  custom: CustomNode,
}

export {
  StartNode,
  EndNode,
  ActionNode,
  ConditionNode,
  InputNode,
  OutputNode,
  CustomNode,
}

export * from './types'

