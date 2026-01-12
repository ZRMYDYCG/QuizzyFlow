import React from 'react'
import { Input, Select, Button } from 'antd'
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons'

const { Search } = Input

export interface FilterValue {
  keyword?: string
  role?: string
  status?: boolean
}

interface UserFilterProps {
  roles: any[]
  onFilterChange: (values: FilterValue) => void
  onRefresh: () => void
  initialValues?: FilterValue
}

type FilterItemType = 'search' | 'select'

interface FilterConfigItem {
  type: FilterItemType
  key: keyof FilterValue
  props?: any
  options?: { label: string; value: any }[]
}

const UserFilter: React.FC<UserFilterProps> = ({
  roles,
  onFilterChange,
  onRefresh,
  initialValues = {},
}) => {
  const handleChange = (key: keyof FilterValue, value: any) => {
    onFilterChange({ ...initialValues, [key]: value })
  }

  const filterConfig: FilterConfigItem[] = [
    {
      type: 'search',
      key: 'keyword',
      props: {
        placeholder: '搜索用户名、昵称、手机号',
        allowClear: true,
        style: { width: 300 },
        onSearch: (value: string) => handleChange('keyword', value),
        enterButton: <SearchOutlined />,
      },
    },
    {
      type: 'select',
      key: 'role',
      props: {
        placeholder: '角色筛选',
        style: { width: 150 },
        allowClear: true,
        onChange: (value: string) => handleChange('role', value),
      },
      options: roles.map((role) => ({
        label: role.displayName,
        value: role.name,
      })),
    },
    {
      type: 'select',
      key: 'status',
      props: {
        placeholder: '状态筛选',
        style: { width: 150 },
        allowClear: true,
        onChange: (value: boolean) => handleChange('status', value),
      },
      options: [
        { label: '正常', value: true },
        { label: '已封禁', value: false },
      ],
    },
  ]

  return (
    <div className="flex gap-4 flex-wrap">
      {filterConfig.map((item) => {
        if (item.type === 'search') {
          return (
            <Search
              key={item.key}
              {...item.props}
              defaultValue={initialValues[item.key] as string}
            />
          )
        }
        if (item.type === 'select') {
          return (
            <Select
              key={item.key}
              {...item.props}
              value={initialValues[item.key]}
            >
              {item.options?.map((opt) => (
                <Select.Option key={String(opt.value)} value={opt.value}>
                  {opt.label}
                </Select.Option>
              ))}
            </Select>
          )
        }
        return null
      })}
      <Button icon={<ReloadOutlined />} onClick={onRefresh}>
        刷新
      </Button>
    </div>
  )
}

export default UserFilter
