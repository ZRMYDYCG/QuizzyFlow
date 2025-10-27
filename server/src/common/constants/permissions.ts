/**
 * 权限常量定义
 * 定义系统中所有可用的权限
 */

export enum PermissionModule {
  USER = 'user',
  QUESTION = 'question',
  TEMPLATE = 'template',
  ANSWER = 'answer',
  STATISTICS = 'statistics',
  ADMIN = 'admin',
  ROLE = 'role',
  PERMISSION = 'permission',
  SYSTEM = 'system',
}

export enum PermissionAction {
  VIEW = 'view',
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  MANAGE = 'manage',
  EXPORT = 'export',
  IMPORT = 'import',
  AUDIT = 'audit',
}

/**
 * 系统权限列表
 */
export const PERMISSIONS = {
  // ==================== 用户管理 ====================
  USER_VIEW: 'user:view', // 查看用户
  USER_VIEW_ALL: 'user:view_all', // 查看所有用户
  USER_CREATE: 'user:create', // 创建用户
  USER_UPDATE: 'user:update', // 更新用户
  USER_UPDATE_SELF: 'user:update_self', // 更新自己的信息
  USER_DELETE: 'user:delete', // 删除用户
  USER_BAN: 'user:ban', // 封禁用户
  USER_MANAGE_ROLE: 'user:manage_role', // 管理用户角色
  USER_RESET_PASSWORD: 'user:reset_password', // 重置用户密码
  USER_EXPORT: 'user:export', // 导出用户数据

  // ==================== 问卷管理 ====================
  QUESTION_VIEW: 'question:view', // 查看自己的问卷
  QUESTION_VIEW_ALL: 'question:view_all', // 查看所有问卷
  QUESTION_CREATE: 'question:create', // 创建问卷
  QUESTION_UPDATE: 'question:update', // 更新自己的问卷
  QUESTION_UPDATE_ANY: 'question:update_any', // 更新任何问卷
  QUESTION_DELETE: 'question:delete', // 删除自己的问卷
  QUESTION_DELETE_ANY: 'question:delete_any', // 删除任何问卷
  QUESTION_PUBLISH: 'question:publish', // 发布问卷
  QUESTION_MANAGE: 'question:manage', // 管理问卷（发布、下架、推荐等）
  QUESTION_AUDIT: 'question:audit', // 审核问卷
  QUESTION_EXPORT: 'question:export', // 导出问卷

  // ==================== 模板管理 ====================
  TEMPLATE_VIEW: 'template:view', // 查看模板
  TEMPLATE_CREATE: 'template:create', // 创建模板
  TEMPLATE_UPDATE: 'template:update', // 更新模板
  TEMPLATE_DELETE: 'template:delete', // 删除模板
  TEMPLATE_AUDIT: 'template:audit', // 审核模板
  TEMPLATE_MANAGE: 'template:manage', // 管理模板（包括分类等）
  TEMPLATE_PUBLISH: 'template:publish', // 发布到模板市场

  // ==================== 答卷管理 ====================
  ANSWER_VIEW: 'answer:view', // 查看答卷
  ANSWER_VIEW_ALL: 'answer:view_all', // 查看所有答卷
  ANSWER_DELETE: 'answer:delete', // 删除答卷
  ANSWER_EXPORT: 'answer:export', // 导出答卷

  // ==================== 统计分析 ====================
  STATISTICS_VIEW: 'statistics:view', // 查看自己的统计
  STATISTICS_VIEW_ALL: 'statistics:view_all', // 查看所有统计
  STATISTICS_EXPORT: 'statistics:export', // 导出统计数据

  // ==================== 管理员操作 ====================
  ADMIN_VIEW: 'admin:view', // 查看管理员
  ADMIN_CREATE: 'admin:create', // 创建管理员
  ADMIN_UPDATE: 'admin:update', // 更新管理员
  ADMIN_DELETE: 'admin:delete', // 删除管理员

  // ==================== 角色管理 ====================
  ROLE_VIEW: 'role:view', // 查看角色
  ROLE_CREATE: 'role:create', // 创建角色
  ROLE_UPDATE: 'role:update', // 更新角色
  ROLE_DELETE: 'role:delete', // 删除角色
  ROLE_ASSIGN: 'role:assign', // 分配角色

  // ==================== 权限管理 ====================
  PERMISSION_VIEW: 'permission:view', // 查看权限
  PERMISSION_CREATE: 'permission:create', // 创建权限
  PERMISSION_UPDATE: 'permission:update', // 更新权限
  PERMISSION_DELETE: 'permission:delete', // 删除权限
  PERMISSION_ASSIGN: 'permission:assign', // 分配权限

  // ==================== 系统管理 ====================
  SYSTEM_CONFIG_VIEW: 'system:config_view', // 查看系统配置
  SYSTEM_CONFIG_UPDATE: 'system:config_update', // 更新系统配置
  SYSTEM_LOGS_VIEW: 'system:logs_view', // 查看系统日志
  SYSTEM_LOGS_DELETE: 'system:logs_delete', // 删除系统日志
  SYSTEM_BACKUP: 'system:backup', // 系统备份
  SYSTEM_MAINTENANCE: 'system:maintenance', // 系统维护
} as const

/**
 * 权限描述
 */
export const PERMISSION_DESCRIPTIONS: Record<string, { name: string; description: string }> = {
  [PERMISSIONS.USER_VIEW]: { name: '查看用户', description: '可以查看用户基本信息' },
  [PERMISSIONS.USER_VIEW_ALL]: { name: '查看所有用户', description: '可以查看系统中所有用户的信息' },
  [PERMISSIONS.USER_CREATE]: { name: '创建用户', description: '可以创建新用户账户' },
  [PERMISSIONS.USER_UPDATE]: { name: '更新用户', description: '可以更新用户信息' },
  [PERMISSIONS.USER_UPDATE_SELF]: { name: '更新自己信息', description: '只能更新自己的信息' },
  [PERMISSIONS.USER_DELETE]: { name: '删除用户', description: '可以删除用户账户' },
  [PERMISSIONS.USER_BAN]: { name: '封禁用户', description: '可以封禁/解封用户账户' },
  [PERMISSIONS.USER_MANAGE_ROLE]: { name: '管理用户角色', description: '可以分配和修改用户角色' },
  [PERMISSIONS.USER_RESET_PASSWORD]: { name: '重置密码', description: '可以重置用户密码' },
  [PERMISSIONS.USER_EXPORT]: { name: '导出用户数据', description: '可以导出用户数据' },

  [PERMISSIONS.QUESTION_VIEW]: { name: '查看问卷', description: '可以查看自己的问卷' },
  [PERMISSIONS.QUESTION_VIEW_ALL]: { name: '查看所有问卷', description: '可以查看所有用户的问卷' },
  [PERMISSIONS.QUESTION_CREATE]: { name: '创建问卷', description: '可以创建新问卷' },
  [PERMISSIONS.QUESTION_UPDATE]: { name: '更新问卷', description: '可以更新自己的问卷' },
  [PERMISSIONS.QUESTION_UPDATE_ANY]: { name: '更新任何问卷', description: '可以更新任何用户的问卷' },
  [PERMISSIONS.QUESTION_DELETE]: { name: '删除问卷', description: '可以删除自己的问卷' },
  [PERMISSIONS.QUESTION_DELETE_ANY]: { name: '删除任何问卷', description: '可以删除任何用户的问卷' },
  [PERMISSIONS.QUESTION_PUBLISH]: { name: '发布问卷', description: '可以发布问卷' },
  [PERMISSIONS.QUESTION_MANAGE]: { name: '管理问卷', description: '可以管理问卷状态（发布、下架、推荐等）' },
  [PERMISSIONS.QUESTION_AUDIT]: { name: '审核问卷', description: '可以审核问卷内容' },
  [PERMISSIONS.QUESTION_EXPORT]: { name: '导出问卷', description: '可以导出问卷数据' },

  [PERMISSIONS.TEMPLATE_VIEW]: { name: '查看模板', description: '可以查看模板' },
  [PERMISSIONS.TEMPLATE_CREATE]: { name: '创建模板', description: '可以创建模板' },
  [PERMISSIONS.TEMPLATE_UPDATE]: { name: '更新模板', description: '可以更新模板' },
  [PERMISSIONS.TEMPLATE_DELETE]: { name: '删除模板', description: '可以删除模板' },
  [PERMISSIONS.TEMPLATE_AUDIT]: { name: '审核模板', description: '可以审核模板内容' },
  [PERMISSIONS.TEMPLATE_MANAGE]: { name: '管理模板', description: '可以管理模板分类等' },
  [PERMISSIONS.TEMPLATE_PUBLISH]: { name: '发布模板', description: '可以发布模板到市场' },

  [PERMISSIONS.ANSWER_VIEW]: { name: '查看答卷', description: '可以查看答卷数据' },
  [PERMISSIONS.ANSWER_VIEW_ALL]: { name: '查看所有答卷', description: '可以查看所有答卷数据' },
  [PERMISSIONS.ANSWER_DELETE]: { name: '删除答卷', description: '可以删除答卷' },
  [PERMISSIONS.ANSWER_EXPORT]: { name: '导出答卷', description: '可以导出答卷数据' },

  [PERMISSIONS.STATISTICS_VIEW]: { name: '查看统计', description: '可以查看自己的统计数据' },
  [PERMISSIONS.STATISTICS_VIEW_ALL]: { name: '查看所有统计', description: '可以查看所有统计数据' },
  [PERMISSIONS.STATISTICS_EXPORT]: { name: '导出统计', description: '可以导出统计数据' },

  [PERMISSIONS.ADMIN_VIEW]: { name: '查看管理员', description: '可以查看管理员列表' },
  [PERMISSIONS.ADMIN_CREATE]: { name: '创建管理员', description: '可以创建管理员账户' },
  [PERMISSIONS.ADMIN_UPDATE]: { name: '更新管理员', description: '可以更新管理员信息' },
  [PERMISSIONS.ADMIN_DELETE]: { name: '删除管理员', description: '可以删除管理员账户' },

  [PERMISSIONS.ROLE_VIEW]: { name: '查看角色', description: '可以查看角色列表' },
  [PERMISSIONS.ROLE_CREATE]: { name: '创建角色', description: '可以创建新角色' },
  [PERMISSIONS.ROLE_UPDATE]: { name: '更新角色', description: '可以更新角色信息' },
  [PERMISSIONS.ROLE_DELETE]: { name: '删除角色', description: '可以删除角色' },
  [PERMISSIONS.ROLE_ASSIGN]: { name: '分配角色', description: '可以给用户分配角色' },

  [PERMISSIONS.PERMISSION_VIEW]: { name: '查看权限', description: '可以查看权限列表' },
  [PERMISSIONS.PERMISSION_CREATE]: { name: '创建权限', description: '可以创建新权限' },
  [PERMISSIONS.PERMISSION_UPDATE]: { name: '更新权限', description: '可以更新权限信息' },
  [PERMISSIONS.PERMISSION_DELETE]: { name: '删除权限', description: '可以删除权限' },
  [PERMISSIONS.PERMISSION_ASSIGN]: { name: '分配权限', description: '可以给角色分配权限' },

  [PERMISSIONS.SYSTEM_CONFIG_VIEW]: { name: '查看系统配置', description: '可以查看系统配置' },
  [PERMISSIONS.SYSTEM_CONFIG_UPDATE]: { name: '更新系统配置', description: '可以更新系统配置' },
  [PERMISSIONS.SYSTEM_LOGS_VIEW]: { name: '查看系统日志', description: '可以查看操作日志' },
  [PERMISSIONS.SYSTEM_LOGS_DELETE]: { name: '删除系统日志', description: '可以删除操作日志' },
  [PERMISSIONS.SYSTEM_BACKUP]: { name: '系统备份', description: '可以执行系统备份' },
  [PERMISSIONS.SYSTEM_MAINTENANCE]: { name: '系统维护', description: '可以执行系统维护操作' },
}

/**
 * 预定义角色及其权限
 */
export const DEFAULT_ROLES = {
  USER: {
    name: 'user',
    displayName: '普通用户',
    description: '系统普通用户，只能管理自己的内容',
    isSystem: true,
    priority: 1,
    permissions: [
      PERMISSIONS.USER_UPDATE_SELF,
      PERMISSIONS.QUESTION_VIEW,
      PERMISSIONS.QUESTION_CREATE,
      PERMISSIONS.QUESTION_UPDATE,
      PERMISSIONS.QUESTION_DELETE,
      PERMISSIONS.QUESTION_PUBLISH,
      PERMISSIONS.TEMPLATE_VIEW,
      PERMISSIONS.TEMPLATE_CREATE,
      PERMISSIONS.ANSWER_VIEW,
      PERMISSIONS.STATISTICS_VIEW,
    ],
  },

  ADMIN: {
    name: 'admin',
    displayName: '管理员',
    description: '系统管理员，可以管理用户和内容',
    isSystem: true,
    priority: 50,
    permissions: [
      // 用户管理
      PERMISSIONS.USER_VIEW,
      PERMISSIONS.USER_VIEW_ALL,
      PERMISSIONS.USER_UPDATE,
      PERMISSIONS.USER_BAN,
      PERMISSIONS.USER_EXPORT,
      // 问卷管理
      PERMISSIONS.QUESTION_VIEW_ALL,
      PERMISSIONS.QUESTION_UPDATE_ANY,
      PERMISSIONS.QUESTION_DELETE_ANY,
      PERMISSIONS.QUESTION_MANAGE,
      PERMISSIONS.QUESTION_AUDIT,
      PERMISSIONS.QUESTION_EXPORT,
      // 模板管理
      PERMISSIONS.TEMPLATE_VIEW,
      PERMISSIONS.TEMPLATE_MANAGE,
      PERMISSIONS.TEMPLATE_AUDIT,
      PERMISSIONS.TEMPLATE_PUBLISH,
      // 答卷和统计
      PERMISSIONS.ANSWER_VIEW_ALL,
      PERMISSIONS.ANSWER_EXPORT,
      PERMISSIONS.STATISTICS_VIEW_ALL,
      PERMISSIONS.STATISTICS_EXPORT,
      // 角色查看
      PERMISSIONS.ROLE_VIEW,
      // 日志查看
      PERMISSIONS.SYSTEM_LOGS_VIEW,
    ],
  },

  SUPER_ADMIN: {
    name: 'super_admin',
    displayName: '超级管理员',
    description: '系统超级管理员，拥有所有权限',
    isSystem: true,
    priority: 100,
    permissions: Object.values(PERMISSIONS), // 所有权限
  },
} as const

/**
 * 按模块分组的权限
 */
export const PERMISSIONS_BY_MODULE = {
  [PermissionModule.USER]: [
    PERMISSIONS.USER_VIEW,
    PERMISSIONS.USER_VIEW_ALL,
    PERMISSIONS.USER_CREATE,
    PERMISSIONS.USER_UPDATE,
    PERMISSIONS.USER_UPDATE_SELF,
    PERMISSIONS.USER_DELETE,
    PERMISSIONS.USER_BAN,
    PERMISSIONS.USER_MANAGE_ROLE,
    PERMISSIONS.USER_RESET_PASSWORD,
    PERMISSIONS.USER_EXPORT,
  ],
  [PermissionModule.QUESTION]: [
    PERMISSIONS.QUESTION_VIEW,
    PERMISSIONS.QUESTION_VIEW_ALL,
    PERMISSIONS.QUESTION_CREATE,
    PERMISSIONS.QUESTION_UPDATE,
    PERMISSIONS.QUESTION_UPDATE_ANY,
    PERMISSIONS.QUESTION_DELETE,
    PERMISSIONS.QUESTION_DELETE_ANY,
    PERMISSIONS.QUESTION_PUBLISH,
    PERMISSIONS.QUESTION_MANAGE,
    PERMISSIONS.QUESTION_AUDIT,
    PERMISSIONS.QUESTION_EXPORT,
  ],
  [PermissionModule.TEMPLATE]: [
    PERMISSIONS.TEMPLATE_VIEW,
    PERMISSIONS.TEMPLATE_CREATE,
    PERMISSIONS.TEMPLATE_UPDATE,
    PERMISSIONS.TEMPLATE_DELETE,
    PERMISSIONS.TEMPLATE_AUDIT,
    PERMISSIONS.TEMPLATE_MANAGE,
    PERMISSIONS.TEMPLATE_PUBLISH,
  ],
  [PermissionModule.ANSWER]: [
    PERMISSIONS.ANSWER_VIEW,
    PERMISSIONS.ANSWER_VIEW_ALL,
    PERMISSIONS.ANSWER_DELETE,
    PERMISSIONS.ANSWER_EXPORT,
  ],
  [PermissionModule.STATISTICS]: [
    PERMISSIONS.STATISTICS_VIEW,
    PERMISSIONS.STATISTICS_VIEW_ALL,
    PERMISSIONS.STATISTICS_EXPORT,
  ],
  [PermissionModule.ADMIN]: [
    PERMISSIONS.ADMIN_VIEW,
    PERMISSIONS.ADMIN_CREATE,
    PERMISSIONS.ADMIN_UPDATE,
    PERMISSIONS.ADMIN_DELETE,
  ],
  [PermissionModule.ROLE]: [
    PERMISSIONS.ROLE_VIEW,
    PERMISSIONS.ROLE_CREATE,
    PERMISSIONS.ROLE_UPDATE,
    PERMISSIONS.ROLE_DELETE,
    PERMISSIONS.ROLE_ASSIGN,
  ],
  [PermissionModule.PERMISSION]: [
    PERMISSIONS.PERMISSION_VIEW,
    PERMISSIONS.PERMISSION_CREATE,
    PERMISSIONS.PERMISSION_UPDATE,
    PERMISSIONS.PERMISSION_DELETE,
    PERMISSIONS.PERMISSION_ASSIGN,
  ],
  [PermissionModule.SYSTEM]: [
    PERMISSIONS.SYSTEM_CONFIG_VIEW,
    PERMISSIONS.SYSTEM_CONFIG_UPDATE,
    PERMISSIONS.SYSTEM_LOGS_VIEW,
    PERMISSIONS.SYSTEM_LOGS_DELETE,
    PERMISSIONS.SYSTEM_BACKUP,
    PERMISSIONS.SYSTEM_MAINTENANCE,
  ],
}

