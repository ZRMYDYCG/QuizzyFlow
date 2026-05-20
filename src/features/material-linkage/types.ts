/** 物料可发出的事件 */
export type LinkageEventType = 'change'

/** 触发条件运算符 */
export type LinkageConditionOperator =
  | 'always'
  | 'eq'
  | 'neq'
  | 'in'
  | 'empty'
  | 'notEmpty'

/** 对目标物料执行的动作 */
export type LinkageActionType =
  | 'show'
  | 'hide'
  | 'setDisabled'
  | 'setEnabled'
  | 'clearValue'

export interface LinkageCondition {
  operator: LinkageConditionOperator
  /** eq / neq / in 时使用的比较值 */
  value?: unknown
}

export interface MaterialLinkageAction {
  targetComponentId: string
  action: LinkageActionType
}

/** 单条联动规则 */
export interface MaterialLinkageRule {
  id: string
  name?: string
  enabled: boolean
  sourceComponentId: string
  event: LinkageEventType
  condition: LinkageCondition
  actions: MaterialLinkageAction[]
}

/** 运行时对各物料计算后的状态 */
export interface LinkageRuntimeState {
  hiddenById: Record<string, boolean>
  disabledById: Record<string, boolean>
  clearValueIds: Set<string>
}
