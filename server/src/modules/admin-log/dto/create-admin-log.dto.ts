import { IsString, IsNotEmpty, IsOptional, IsObject } from 'class-validator'

export class CreateAdminLogDto {
  @IsString()
  @IsNotEmpty()
  operatorId: string

  @IsString()
  @IsNotEmpty()
  operatorName: string

  @IsString()
  @IsNotEmpty()
  operatorRole: string

  @IsString()
  @IsNotEmpty()
  module: string

  @IsString()
  @IsNotEmpty()
  action: string

  @IsString()
  @IsNotEmpty()
  resource: string

  @IsString()
  @IsOptional()
  resourceId?: string

  @IsString()
  @IsOptional()
  resourceName?: string

  @IsObject()
  @IsOptional()
  details?: Record<string, any>

  @IsObject()
  @IsOptional()
  changes?: {
    before?: any
    after?: any
  }

  @IsString()
  @IsNotEmpty()
  status: 'success' | 'failed'

  @IsString()
  @IsOptional()
  errorMessage?: string

  @IsString()
  @IsNotEmpty()
  ip: string

  @IsString()
  @IsOptional()
  userAgent?: string

  @IsString()
  @IsOptional()
  location?: string
}

