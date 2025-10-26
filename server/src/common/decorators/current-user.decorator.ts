import { createParamDecorator, ExecutionContext } from '@nestjs/common'

/**
 * 当前用户装饰器
 * 从请求中提取当前用户信息
 * 
 * @example
 * ```typescript
 * @Get('profile')
 * async getProfile(@CurrentUser() user: any) {
 *   return user
 * }
 * 
 * // 获取特定字段
 * @Get('profile')
 * async getProfile(@CurrentUser('userId') userId: string) {
 *   return userId
 * }
 * ```
 */
export const CurrentUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest()
    const user = request.user

    return data ? user?.[data] : user
  },
)

