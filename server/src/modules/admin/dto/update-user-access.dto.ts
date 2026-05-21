import { IsArray, IsIn, IsOptional, IsString } from 'class-validator'

export class UpdateUserAccessDto {
  @IsOptional()
  @IsIn(['admin', 'user'])
  role?: 'admin' | 'user'

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  grantedRoutes?: string[]

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  grantedButtons?: string[]
}
