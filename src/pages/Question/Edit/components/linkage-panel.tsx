import React, { useMemo } from 'react'
import {
  Button,
  Card,
  Empty,
  Form,
  Input,
  Select,
  Space,
  Switch,
  Typography,
  Divider,
} from 'antd'
import { PlusOutlined, DeleteOutlined, LinkOutlined } from '@ant-design/icons'
import { nanoid } from 'nanoid'
import { useDispatch } from 'react-redux'
import useGetComponentInfo from '@/hooks/useGetComponentInfo'
import useGetPageInfo from '@/hooks/useGetPageInfo'
import { setLinkages } from '@/store/modules/pageinfo-reducer'
import { getComponentConfigByType } from '@/components/material'
import {
  canBeLinkageSource,
  LINKAGE_ACTION_OPTIONS,
  LINKAGE_CONDITION_OPTIONS,
  LINKAGE_EVENT_OPTIONS,
} from '@/features/material-linkage'
import type {
  LinkageConditionOperator,
  MaterialLinkageAction,
  MaterialLinkageRule,
} from '@/features/material-linkage'

const { Text } = Typography

function createEmptyRule(): MaterialLinkageRule {
  return {
    id: nanoid(),
    name: '',
    enabled: true,
    sourceComponentId: '',
    event: 'change',
    condition: { operator: 'always' },
    actions: [{ targetComponentId: '', action: 'show' }],
  }
}

const LinkagePanel: React.FC = () => {
  const dispatch = useDispatch()
  const { componentList } = useGetComponentInfo()
  const { linkages = [] } = useGetPageInfo()

  const sourceOptions = useMemo(
    () =>
      componentList
        .filter((c) => canBeLinkageSource(c.type))
        .map((c) => {
          const config = getComponentConfigByType(c.type)
          const label = c.props?.title || c.title || config?.title || c.type
          return {
            value: c.fe_id,
            label: `${label}（${config?.title ?? c.type}）`,
          }
        }),
    [componentList]
  )

  const targetOptions = useMemo(
    () =>
      componentList.map((c) => {
        const config = getComponentConfigByType(c.type)
        const label = c.props?.title || c.title || config?.title || c.type
        return {
          value: c.fe_id,
          label: `${label}（${config?.title ?? c.type}）`,
        }
      }),
    [componentList]
  )

  const updateRules = (next: MaterialLinkageRule[]) => {
    dispatch(setLinkages(next))
  }

  const updateRule = (id: string, patch: Partial<MaterialLinkageRule>) => {
    updateRules(
      linkages.map((r) => (r.id === id ? { ...r, ...patch } : r))
    )
  }

  const removeRule = (id: string) => {
    updateRules(linkages.filter((r) => r.id !== id))
  }

  const addRule = () => {
    const rule = createEmptyRule()
    if (sourceOptions[0]) rule.sourceComponentId = sourceOptions[0].value
    if (targetOptions[0]) {
      rule.actions = [{ targetComponentId: targetOptions[0].value, action: 'show' }]
    }
    updateRules([...linkages, rule])
  }

  if (componentList.length === 0) {
    return (
      <div className="flex items-center justify-center h-full p-8">
        <Empty description="请先添加物料后再配置联动" />
      </div>
    )
  }

  if (sourceOptions.length === 0) {
    return (
      <div className="flex items-center justify-center h-full p-8">
        <Empty description="当前画布中没有可作为联动源的输入类物料" />
      </div>
    )
  }

  return (
    <div className="h-full overflow-y-auto p-4 md:p-6">
      <div className="flex items-start justify-between gap-2 mb-4">
        <div>
          <Text strong className="flex items-center gap-2">
            <LinkOutlined />
            物料联动
          </Text>
          <div className="text-xs text-gray-500 mt-1">
            当源物料的值满足条件时，对目标物料执行显示、隐藏等动作。规则按顺序依次生效。
          </div>
        </div>
        <Button type="primary" size="small" icon={<PlusOutlined />} onClick={addRule}>
          添加规则
        </Button>
      </div>

      {linkages.length === 0 ? (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="暂无联动规则，点击「添加规则」开始配置"
        />
      ) : (
        <Space direction="vertical" size="middle" className="w-full">
          {linkages.map((rule, index) => (
            <Card
              key={rule.id}
              size="small"
              title={`规则 ${index + 1}${rule.name ? `：${rule.name}` : ''}`}
              extra={
                <Space>
                  <Switch
                    size="small"
                    checked={rule.enabled}
                    onChange={(enabled) => updateRule(rule.id, { enabled })}
                  />
                  <Button
                    type="text"
                    danger
                    size="small"
                    icon={<DeleteOutlined />}
                    onClick={() => removeRule(rule.id)}
                  />
                </Space>
              }
            >
              <Form layout="vertical" size="small">
                <Form.Item label="规则名称（可选）">
                  <Input
                    placeholder="例如：选「其他」时显示补充说明"
                    value={rule.name}
                    onChange={(e) => updateRule(rule.id, { name: e.target.value })}
                  />
                </Form.Item>

                <Divider className="my-2" orientation="left" plain>
                  触发条件
                </Divider>

                <Form.Item label="源物料（触发方）" required>
                  <Select
                    options={sourceOptions}
                    value={rule.sourceComponentId || undefined}
                    placeholder="选择源物料"
                    onChange={(sourceComponentId) =>
                      updateRule(rule.id, { sourceComponentId })
                    }
                  />
                </Form.Item>

                <Form.Item label="事件">
                  <Select
                    options={LINKAGE_EVENT_OPTIONS}
                    value={rule.event}
                    onChange={(event) => updateRule(rule.id, { event })}
                  />
                </Form.Item>

                <Form.Item label="值条件">
                  <Select
                    options={LINKAGE_CONDITION_OPTIONS.map((o) => ({
                      value: o.value,
                      label: o.label,
                    }))}
                    value={rule.condition.operator}
                    onChange={(operator: LinkageConditionOperator) =>
                      updateRule(rule.id, {
                        condition: {
                          operator,
                          value:
                            operator === 'eq' ||
                            operator === 'neq' ||
                            operator === 'in'
                              ? rule.condition.value ?? ''
                              : undefined,
                        },
                      })
                    }
                  />
                </Form.Item>

                {['eq', 'neq'].includes(rule.condition.operator) && (
                  <Form.Item label="比较值">
                    <Input
                      placeholder="与源物料当前值比较（单选/下拉请填选项 value）"
                      value={String(rule.condition.value ?? '')}
                      onChange={(e) =>
                        updateRule(rule.id, {
                          condition: {
                            ...rule.condition,
                            value: e.target.value,
                          },
                        })
                      }
                    />
                  </Form.Item>
                )}

                {rule.condition.operator === 'in' && (
                  <Form.Item label="值列表（逗号分隔）">
                    <Input
                      placeholder="例如：1,2,other"
                      value={
                        Array.isArray(rule.condition.value)
                          ? rule.condition.value.join(',')
                          : String(rule.condition.value ?? '')
                      }
                      onChange={(e) =>
                        updateRule(rule.id, {
                          condition: {
                            ...rule.condition,
                            value: e.target.value
                              .split(',')
                              .map((s) => s.trim())
                              .filter(Boolean),
                          },
                        })
                      }
                    />
                  </Form.Item>
                )}

                <Divider className="my-2" orientation="left" plain>
                  执行动作
                </Divider>

                {rule.actions.map((action, actionIndex) => (
                  <Space key={actionIndex} align="start" className="w-full mb-2">
                    <Select
                      className="flex-1 min-w-[120px]"
                      style={{ width: '45%' }}
                      options={targetOptions}
                      value={action.targetComponentId || undefined}
                      placeholder="目标物料"
                      onChange={(targetComponentId) => {
                        const actions = [...rule.actions]
                        actions[actionIndex] = {
                          ...actions[actionIndex],
                          targetComponentId,
                        }
                        updateRule(rule.id, { actions })
                      }}
                    />
                    <Select
                      className="flex-1 min-w-[120px]"
                      style={{ width: '45%' }}
                      options={LINKAGE_ACTION_OPTIONS}
                      value={action.action}
                      onChange={(act: MaterialLinkageAction['action']) => {
                        const actions = [...rule.actions]
                        actions[actionIndex] = { ...actions[actionIndex], action: act }
                        updateRule(rule.id, { actions })
                      }}
                    />
                    <Button
                      type="text"
                      danger
                      disabled={rule.actions.length <= 1}
                      icon={<DeleteOutlined />}
                      onClick={() => {
                        const actions = rule.actions.filter((_, i) => i !== actionIndex)
                        updateRule(rule.id, { actions })
                      }}
                    />
                  </Space>
                ))}

                <Button
                  type="dashed"
                  block
                  size="small"
                  icon={<PlusOutlined />}
                  onClick={() =>
                    updateRule(rule.id, {
                      actions: [
                        ...rule.actions,
                        {
                          targetComponentId: targetOptions[0]?.value ?? '',
                          action: 'show',
                        },
                      ],
                    })
                  }
                >
                  添加动作
                </Button>
              </Form>
            </Card>
          ))}
        </Space>
      )}
    </div>
  )
}

export default LinkagePanel
