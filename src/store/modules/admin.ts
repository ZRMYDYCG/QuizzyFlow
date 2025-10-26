import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { UserRole } from '@/constants/roles'
import type { Permission } from '@/constants/permissions'

/**
 * 管理员状态
 */
export interface IAdminState {
  // 用户权限信息
  role: UserRole
  permissions: Permission[]
  customPermissions: string[]
  
  // 用户列表
  users: {
    list: any[]
    total: number
    loading: boolean
    currentPage: number
    pageSize: number
  }
  
  // 角色列表
  roles: {
    list: any[]
    loading: boolean
  }
  
  // 权限列表
  permissionsList: {
    list: any[]
    grouped: Record<string, any[]>
    loading: boolean
  }
  
  // 操作日志
  logs: {
    list: any[]
    total: number
    loading: boolean
    currentPage: number
    pageSize: number
  }
  
  // 系统统计
  statistics: {
    users: {
      total: number
      todayNew: number
      byRole: Array<{ _id: string; count: number }>
    }
    questions: {
      total: number
      todayNew: number
    }
    answers: {
      total: number
      todayNew: number
    }
    growth: {
      users: Array<{ _id: string; count: number }>
    }
  } | null
}

const initialState: IAdminState = {
  role: 'user' as UserRole,
  permissions: [],
  customPermissions: [],
  
  users: {
    list: [],
    total: 0,
    loading: false,
    currentPage: 1,
    pageSize: 20,
  },
  
  roles: {
    list: [],
    loading: false,
  },
  
  permissionsList: {
    list: [],
    grouped: {},
    loading: false,
  },
  
  logs: {
    list: [],
    total: 0,
    loading: false,
    currentPage: 1,
    pageSize: 20,
  },
  
  statistics: null,
}

export const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    // 设置用户权限
    setUserPermissions: (
      state,
      action: PayloadAction<{
        role: UserRole
        permissions: Permission[]
        customPermissions: string[]
      }>
    ) => {
      state.role = action.payload.role
      state.permissions = action.payload.permissions
      state.customPermissions = action.payload.customPermissions
    },
    
    // 用户列表相关
    setUsers: (
      state,
      action: PayloadAction<{
        list: any[]
        total: number
        page?: number
        pageSize?: number
      }>
    ) => {
      state.users.list = action.payload.list
      state.users.total = action.payload.total
      if (action.payload.page) {
        state.users.currentPage = action.payload.page
      }
      if (action.payload.pageSize) {
        state.users.pageSize = action.payload.pageSize
      }
    },
    setUsersLoading: (state, action: PayloadAction<boolean>) => {
      state.users.loading = action.payload
    },
    
    // 角色列表相关
    setRoles: (state, action: PayloadAction<any[]>) => {
      state.roles.list = action.payload
    },
    setRolesLoading: (state, action: PayloadAction<boolean>) => {
      state.roles.loading = action.payload
    },
    
    // 权限列表相关
    setPermissions: (state, action: PayloadAction<any[]>) => {
      state.permissionsList.list = action.payload
    },
    setGroupedPermissions: (state, action: PayloadAction<Record<string, any[]>>) => {
      state.permissionsList.grouped = action.payload
    },
    setPermissionsLoading: (state, action: PayloadAction<boolean>) => {
      state.permissionsList.loading = action.payload
    },
    
    // 操作日志相关
    setLogs: (
      state,
      action: PayloadAction<{
        list: any[]
        total: number
        page?: number
        pageSize?: number
      }>
    ) => {
      state.logs.list = action.payload.list
      state.logs.total = action.payload.total
      if (action.payload.page) {
        state.logs.currentPage = action.payload.page
      }
      if (action.payload.pageSize) {
        state.logs.pageSize = action.payload.pageSize
      }
    },
    setLogsLoading: (state, action: PayloadAction<boolean>) => {
      state.logs.loading = action.payload
    },
    
    // 统计数据
    setStatistics: (state, action: PayloadAction<IAdminState['statistics']>) => {
      state.statistics = action.payload
    },
    
    // 重置状态
    resetAdminState: () => initialState,
  },
})

export const {
  setUserPermissions,
  setUsers,
  setUsersLoading,
  setRoles,
  setRolesLoading,
  setPermissions,
  setGroupedPermissions,
  setPermissionsLoading,
  setLogs,
  setLogsLoading,
  setStatistics,
  resetAdminState,
} = adminSlice.actions

export default adminSlice.reducer

