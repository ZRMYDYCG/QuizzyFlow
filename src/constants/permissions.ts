/**
 * 前端权限常量
 * 与后端保持一致
 */

export const PERMISSIONS = {
  // 用户管理
  USER_VIEW: 'user:view',
  USER_VIEW_ALL: 'user:view_all',
  USER_CREATE: 'user:create',
  USER_UPDATE: 'user:update',
  USER_UPDATE_SELF: 'user:update_self',
  USER_DELETE: 'user:delete',
  USER_BAN: 'user:ban',
  USER_MANAGE_ROLE: 'user:manage_role',
  USER_RESET_PASSWORD: 'user:reset_password',
  USER_EXPORT: 'user:export',

  // 问卷管理
  QUESTION_VIEW: 'question:view',
  QUESTION_VIEW_ALL: 'question:view_all',
  QUESTION_CREATE: 'question:create',
  QUESTION_UPDATE: 'question:update',
  QUESTION_UPDATE_ANY: 'question:update_any',
  QUESTION_DELETE: 'question:delete',
  QUESTION_DELETE_ANY: 'question:delete_any',
  QUESTION_PUBLISH: 'question:publish',
  QUESTION_AUDIT: 'question:audit',
  QUESTION_EXPORT: 'question:export',

  // 模板管理
  TEMPLATE_VIEW: 'template:view',
  TEMPLATE_CREATE: 'template:create',
  TEMPLATE_UPDATE: 'template:update',
  TEMPLATE_DELETE: 'template:delete',
  TEMPLATE_AUDIT: 'template:audit',
  TEMPLATE_MANAGE: 'template:manage',
  TEMPLATE_PUBLISH: 'template:publish',

  // 答卷管理
  ANSWER_VIEW: 'answer:view',
  ANSWER_VIEW_ALL: 'answer:view_all',
  ANSWER_DELETE: 'answer:delete',
  ANSWER_EXPORT: 'answer:export',

  // 统计分析
  STATISTICS_VIEW: 'statistics:view',
  STATISTICS_VIEW_ALL: 'statistics:view_all',
  STATISTICS_EXPORT: 'statistics:export',

  // 管理员操作
  ADMIN_VIEW: 'admin:view',
  ADMIN_CREATE: 'admin:create',
  ADMIN_UPDATE: 'admin:update',
  ADMIN_DELETE: 'admin:delete',

  // 角色管理
  ROLE_VIEW: 'role:view',
  ROLE_CREATE: 'role:create',
  ROLE_UPDATE: 'role:update',
  ROLE_DELETE: 'role:delete',
  ROLE_ASSIGN: 'role:assign',

  // 权限管理
  PERMISSION_VIEW: 'permission:view',
  PERMISSION_CREATE: 'permission:create',
  PERMISSION_UPDATE: 'permission:update',
  PERMISSION_DELETE: 'permission:delete',
  PERMISSION_ASSIGN: 'permission:assign',

  // 系统管理
  SYSTEM_CONFIG_VIEW: 'system:config_view',
  SYSTEM_CONFIG_UPDATE: 'system:config_update',
  SYSTEM_LOGS_VIEW: 'system:logs_view',
  SYSTEM_LOGS_DELETE: 'system:logs_delete',
  SYSTEM_BACKUP: 'system:backup',
  SYSTEM_MAINTENANCE: 'system:maintenance',
} as const

export type Permission = typeof PERMISSIONS[keyof typeof PERMISSIONS]

