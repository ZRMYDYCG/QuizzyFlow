import { SetMetadata } from '@nestjs/common'

/**
 * 操作日志装饰器
 * 用于标记需要记录操作日志的路由
 * 
 * @example
 * ```typescript
 * @LogOperation({
 *   module: 'user',
 *   action: 'create',
 *   resource: 'user',
 * })
 * @Post('users')
 * async createUser() { }
 * ```
 */
export interface LogOperationMetadata {
  module: string // 模块
  action: string // 操作
  resource: string // 资源类型
  description?: string // 操作描述
}

export const LOG_OPERATION_KEY = 'log_operation'
export const LogOperation = (metadata: LogOperationMetadata) =>
  SetMetadata(LOG_OPERATION_KEY, metadata)

