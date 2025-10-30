import { FC, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Input, Empty, Spin, message, Dropdown, Modal, Tooltip } from 'antd'
import {
  PlusOutlined,
  SearchOutlined,
  StarOutlined,
  StarFilled,
  DeleteOutlined,
  CopyOutlined,
  MoreOutlined,
  ClockCircleOutlined,
  EditOutlined,
} from '@ant-design/icons'
import { Workflow, GitBranch, Link2 } from 'lucide-react'
import { stateType } from '@/store'
import { setFlowList, setLoading, toggleStar } from '@/store/modules/flowList'
import {
  getFlowList,
  createFlow,
  duplicateFlow,
  batchDeleteFlow,
  updateFlow,
} from '@/api/flow'
import type { FlowData } from '@/api/flow'

const { Search } = Input

const FlowList: FC = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { list, total, loading } = useSelector(
    (state: stateType) => state.flowList,
  )

  const [keyword, setKeyword] = useState('')
  const [page, setPage] = useState(1)
  const [pageSize] = useState(12)

  const loadFlowList = async () => {
    try {
      dispatch(setLoading(true))
      const data = await getFlowList({
        page,
        pageSize,
        keyword: keyword || undefined,
        isDeleted: false,
      })
      dispatch(setFlowList({ list: data.list, total: data.total }))
    } catch (error) {
      message.error('加载工作流列表失败')
    } finally {
      dispatch(setLoading(false))
    }
  }

  useEffect(() => {
    loadFlowList()
  }, [page, keyword])

  const handleCreateFlow = async () => {
    try {
      const flow = await createFlow({
        title: '未命名工作流',
        description: '',
      })
      message.success('创建成功')
      navigate(`/flow/edit/${flow._id}`)
    } catch (error) {
      message.error('创建失败')
    }
  }

  const handleToggleStar = async (id: string, isStar: boolean) => {
    try {
      await updateFlow(id, { isStar: !isStar })
      dispatch(toggleStar(id))
      message.success(isStar ? '已取消星标' : '已加星标')
    } catch (error) {
      message.error('操作失败')
    }
  }

  const handleDuplicate = async (id: string) => {
    try {
      const newFlow = await duplicateFlow(id)
      message.success('复制成功')
      loadFlowList()
    } catch (error) {
      message.error('复制失败')
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await batchDeleteFlow([id])
      message.success('删除成功')
      loadFlowList()
    } catch (error) {
      message.error('删除失败')
    }
  }

  const FlowCard = ({ flow }: { flow: FlowData }) => {
    const [isHovered, setIsHovered] = useState(false)

    const menuItems = [
      {
        key: 'edit',
        icon: <EditOutlined />,
        label: '编辑',
        onClick: () => navigate(`/flow/edit/${flow._id}`),
      },
      {
        key: 'duplicate',
        icon: <CopyOutlined />,
        label: '复制',
        onClick: () => handleDuplicate(flow._id),
      },
      {
        type: 'divider' as const,
      },
      {
        key: 'delete',
        icon: <DeleteOutlined />,
        label: '删除',
        danger: true,
        onClick: () => {
          Modal.confirm({
            title: '确认删除',
            content: `确定要删除工作流"${flow.title}"吗？`,
            okText: '删除',
            okType: 'danger',
            cancelText: '取消',
            onOk: () => handleDelete(flow._id),
          })
        },
      },
    ]

    return (
      <div
        className="group relative bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-xl transition-all duration-300 overflow-hidden"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* 预览区域 */}
        <div
          className="relative h-48 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 cursor-pointer overflow-hidden"
          onClick={() => navigate(`/flow/edit/${flow._id}`)}
        >
          {flow.thumbnail ? (
            <img
              src={flow.thumbnail}
              alt={flow.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <Workflow 
                  className="w-16 h-16 mx-auto mb-3 text-gray-300 dark:text-gray-600" 
                  strokeWidth={1.5}
                />
                <p className="text-sm text-gray-400 dark:text-gray-500">空白工作流</p>
              </div>
            </div>
          )}
          
          {/* 悬浮遮罩 */}
          <div className={`absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
            <Button 
              type="primary" 
              size="large"
              icon={<EditOutlined />}
              onClick={(e) => {
                e.stopPropagation()
                navigate(`/flow/edit/${flow._id}`)
              }}
            >
              打开编辑
            </Button>
          </div>

          {/* 星标标记 */}
          {flow.isStar && (
            <div className="absolute top-3 right-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full p-2 shadow-lg">
              <StarFilled className="text-yellow-500 text-base" />
            </div>
          )}
        </div>

        {/* 内容区域 */}
        <div className="p-4">
          {/* 标题行 */}
          <div className="flex items-start justify-between mb-2">
            <h3 
              className="text-base font-semibold text-gray-900 dark:text-white truncate flex-1 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              onClick={() => navigate(`/flow/edit/${flow._id}`)}
            >
              {flow.title}
            </h3>
            
            <div className="flex items-center gap-1 ml-2">
              {/* 星标按钮 */}
              <Tooltip title={flow.isStar ? '取消星标' : '添加星标'}>
                <button
                  className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleToggleStar(flow._id, flow.isStar)
                  }}
                >
                  {flow.isStar ? (
                    <StarFilled className="text-yellow-500 text-base" />
                  ) : (
                    <StarOutlined className="text-gray-400 hover:text-yellow-500 text-base" />
                  )}
                </button>
              </Tooltip>

              {/* 更多操作 */}
              <Dropdown menu={{ items: menuItems }} trigger={['click']} placement="bottomRight">
                <button
                  className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreOutlined className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-base" />
                </button>
              </Dropdown>
            </div>
          </div>

          {/* 描述 */}
          <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-3 min-h-[40px]">
            {flow.description || '暂无描述'}
          </p>

          {/* 底部信息 */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
            {/* 统计信息 */}
            <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
              <Tooltip title="节点数量">
                <div className="flex items-center gap-1">
                  <GitBranch className="w-3.5 h-3.5" />
                  <span>{flow.nodeCount}</span>
                </div>
              </Tooltip>
              <Tooltip title="连线数量">
                <div className="flex items-center gap-1">
                  <Link2 className="w-3.5 h-3.5" />
                  <span>{flow.edgeCount}</span>
                </div>
              </Tooltip>
            </div>

            {/* 更新时间 */}
            <Tooltip title={new Date(flow.updatedAt).toLocaleString()}>
              <div className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500">
                <ClockCircleOutlined />
                <span>{formatRelativeTime(flow.updatedAt)}</span>
              </div>
            </Tooltip>
          </div>
        </div>
      </div>
    )
  }

  // 格式化相对时间
  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)
    
    if (minutes < 1) return '刚刚'
    if (minutes < 60) return `${minutes}分钟前`
    if (hours < 24) return `${hours}小时前`
    if (days < 7) return `${days}天前`
    if (days < 30) return `${Math.floor(days / 7)}周前`
    if (days < 365) return `${Math.floor(days / 30)}个月前`
    return `${Math.floor(days / 365)}年前`
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-800">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-3">
                <Workflow className="w-8 h-8 text-blue-600 dark:text-blue-500" strokeWidth={2} />
                我的工作流
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                共 <span className="font-semibold text-gray-700 dark:text-gray-300">{total}</span> 个工作流
              </p>
            </div>
            <Button
              type="primary"
              size="large"
              icon={<PlusOutlined />}
              onClick={handleCreateFlow}
              className="shadow-lg hover:shadow-xl transition-shadow"
            >
              创建工作流
            </Button>
          </div>

          {/* 搜索和筛选 */}
          <div className="flex items-center gap-3">
            <Search
              placeholder="搜索工作流..."
              allowClear
              size="large"
              className="flex-1 max-w-md"
              onSearch={setKeyword}
              prefix={<SearchOutlined />}
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        <div className="px-8 py-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-96">
              <Spin size="large" />
              <p className="mt-4 text-gray-500 dark:text-gray-400">加载中...</p>
            </div>
          ) : list.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-96 bg-white dark:bg-gray-800 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-700">
              <Workflow className="w-24 h-24 text-gray-300 dark:text-gray-600 mb-4" strokeWidth={1.5} />
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                {keyword ? '未找到匹配的工作流' : '还没有工作流'}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 text-center max-w-md">
                {keyword 
                  ? '尝试使用其他关键词搜索' 
                  : '创建您的第一个工作流，开始构建自动化流程'
                }
              </p>
              {!keyword && (
                <Button
                  type="primary"
                  size="large"
                  icon={<PlusOutlined />}
                  onClick={handleCreateFlow}
                >
                  创建第一个工作流
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
              {list.map((flow) => (
                <FlowCard key={flow._id} flow={flow} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default FlowList

